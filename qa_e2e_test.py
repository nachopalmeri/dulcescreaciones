import http.server
import socketserver
import threading
import time
import sys
from playwright.sync_api import sync_playwright

PORT = 8899

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Content-Type', self.guess_type(self.path) + '; charset=utf-8')
        super().end_headers()

def run_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()

server_thread = threading.Thread(target=run_server, daemon=True)
server_thread.start()
time.sleep(1)

base_url = f"http://127.0.0.1:{PORT}"

print(f"Server started at {base_url}")

passed = 0
failed = 0

def check(condition, desc):
    global passed, failed
    if condition:
        print(f"  ✅ PASS: {desc}")
        passed += 1
    else:
        print(f"  ❌ FAIL: {desc}")
        failed += 1

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    # 1. Desktop Test: index.html
    print("\n--- 1. Testing Desktop index.html ---")
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    page_errors = []
    page.on("pageerror", lambda err: page_errors.append(str(err)))
    page.on("console", lambda msg: print(f"    [console {msg.type}]: {msg.text}") if msg.type in ['error'] else None)
    
    page.goto(f"{base_url}/index.html")
    page.wait_for_load_state("networkidle")
    
    check(len(page_errors) == 0, f"No JS uncaught errors (errors: {page_errors})")
    
    # Check title and meta
    title = page.title()
    check("Dulces Creaciones" in title and "Temperley" in title, f"Document title accurate: '{title}'")
    
    # Check dark mode
    theme_toggle = page.locator(".theme-toggle")
    check(theme_toggle.count() > 0, "Theme toggle button exists")
    theme_toggle.click()
    page.wait_for_timeout(300)
    data_theme = page.eval_on_selector("html", "el => el.getAttribute('data-theme')")
    check(data_theme == "dark", f"Dark theme activated: '{data_theme}'")
    theme_toggle.click()
    page.wait_for_timeout(300)
    data_theme2 = page.eval_on_selector("html", "el => el.getAttribute('data-theme')")
    check(data_theme2 == "light", f"Light theme restored: '{data_theme2}'")
    
    # Check FAQ accordion
    faqs = page.locator(".faq-question")
    check(faqs.count() > 0, f"Found {faqs.count()} FAQ questions")
    if faqs.count() > 0:
        first_faq = faqs.first
        first_faq.click()
        page.wait_for_timeout(300)
        is_active = first_faq.evaluate("el => el.classList.contains('active')")
        check(is_active, "FAQ item expands on click")
    
    # Check WhatsApp click tracking event
    wa_links = page.locator('a[href*="wa.me"]')
    check(wa_links.count() > 0, f"Found {wa_links.count()} WhatsApp links")
    
    # Check dataLayer
    has_dl = page.evaluate("() => Array.isArray(window.dataLayer)")
    check(has_dl, "window.dataLayer initialized")
    
    # Trigger a click on WhatsApp and check dataLayer push
    if wa_links.count() > 0:
        # Prevent actual navigation for test
        page.evaluate("() => { document.querySelectorAll('a[href*=\"wa.me\"]').forEach(a => a.addEventListener('click', e => e.preventDefault())); }")
        wa_links.first.click()
        page.wait_for_timeout(300)
        events = page.evaluate("() => window.dataLayer.map(e => e.event)")
        check("whatsapp_click" in events, f"whatsapp_click event recorded in dataLayer: {events}")
        
        # Verify event parameters
        wa_event = page.evaluate("() => window.dataLayer.find(e => e.event === 'whatsapp_click')")
        check(wa_event.get('destination_phone') == '+5491133266362', "WhatsApp phone parameter correct")
        check(bool(wa_event.get('cta_text')), f"CTA text captured: '{wa_event.get('cta_text')}'")
    
    page.close()
    
    # 2. Mobile Viewport Test: index.html
    print("\n--- 2. Testing Mobile index.html (375x667) ---")
    mobile_page = browser.new_page(viewport={"width": 375, "height": 667})
    mobile_page.goto(f"{base_url}/index.html")
    mobile_page.wait_for_load_state("networkidle")
    
    hamburger = mobile_page.locator(".hamburger")
    check(hamburger.is_visible(), "Hamburger button visible on mobile")
    
    nav_links = mobile_page.locator(".nav-links")
    hamburger.click()
    mobile_page.wait_for_timeout(300)
    is_open = nav_links.evaluate("el => el.classList.contains('open')")
    check(is_open, "Mobile navigation opens on hamburger click")
    
    hamburger.click()
    mobile_page.wait_for_timeout(300)
    is_closed = not nav_links.evaluate("el => el.classList.contains('open')")
    check(is_closed, "Mobile navigation closes on hamburger click")
    
    mobile_page.close()
    
    # 3. Testing Subpages & Blog
    print("\n--- 3. Testing Blog & Subpages ---")
    blog_page = browser.new_page()
    blog_page.goto(f"{base_url}/blog.html")
    blog_page.wait_for_load_state("networkidle")
    
    articles = blog_page.locator(".detail-card")
    check(articles.count() == 15, f"All 15 blog articles rendered in blog.html (found {articles.count()})")
    
    # Test internal links from blog to individual posts
    first_post_link = blog_page.locator("a[href*='blog/']").first
    post_href = first_post_link.get_attribute("href")
    check(bool(post_href), f"Post link found: {post_href}")
    
    # Navigate to blog post
    post_page = browser.new_page()
    post_page.goto(f"{base_url}/{post_href}")
    post_page.wait_for_load_state("networkidle")
    post_h1 = post_page.locator("h1").first.inner_text()
    check(bool(post_h1), f"Blog post loaded with H1: '{post_h1}'")
    
    has_post_ga = post_page.evaluate("() => typeof gtag !== 'undefined' || Array.isArray(window.dataLayer)")
    check(has_post_ga, "Blog post has GA4 / dataLayer")
    
    post_page.close()
    blog_page.close()
    
    # 4. Testing Menu Page
    print("\n--- 4. Testing Menu.html ---")
    menu_page = browser.new_page()
    menu_page.goto(f"{base_url}/menu.html")
    menu_page.wait_for_load_state("networkidle")
    menu_h1 = menu_page.locator("h1").first.inner_text()
    check("Menú" in menu_h1 or "Menu" in menu_h1 or "Tortas" in menu_h1 or "Dulces" in menu_h1, f"Menu H1 present: '{menu_h1}'")
    menu_page.close()
    
    browser.close()

print(f"\n==========================================")
print(f"QA TEST RESULTS: {passed} PASSED, {failed} FAILED")
print(f"==========================================")

if failed > 0:
    sys.exit(1)
