import http.server
import socketserver
import threading
import time
import os
from playwright.sync_api import sync_playwright

PORT = 8990

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Content-Type', self.guess_type(self.path) + '; charset=utf-8')
        super().end_headers()

server = socketserver.TCPServer(('', PORT), Handler)
t = threading.Thread(target=server.serve_forever, daemon=True)
t.start()
time.sleep(1)

base_url = f'http://127.0.0.1:{PORT}'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    # 1. Audit Desktop (1440x900)
    print("=== DESKTOP AUDIT (1440x900) ===")
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto(f'{base_url}/index.html')
    page.wait_for_load_state('networkidle')
    page.screenshot(path='audit_desktop_home.png', full_page=True)
    page.screenshot(path='audit_desktop_hero.png', full_page=False)
    
    hero_h1 = page.locator('h1').first.inner_text()
    print(f"Desktop Hero H1: {hero_h1}")
    
    # 2. Audit Mobile (390x844 - iPhone 14/15/16)
    print("\n=== MOBILE AUDIT (390x844) ===")
    mobile = browser.new_page(viewport={'width': 390, 'height': 844})
    mobile.goto(f'{base_url}/index.html')
    mobile.wait_for_load_state('networkidle')
    mobile.screenshot(path='audit_mobile_home.png', full_page=True)
    mobile.screenshot(path='audit_mobile_hero.png', full_page=False)
    
    scroll_w = mobile.evaluate("() => document.documentElement.scrollWidth")
    inner_w = mobile.evaluate("() => window.innerWidth")
    print(f"Mobile Horizontal Scroll: scrollWidth={scroll_w}, innerWidth={inner_w} (Overflow: {scroll_w > inner_w})")
    
    # Check sticky CTA / elements
    sticky_els = mobile.evaluate("""() => {
        const els = Array.from(document.querySelectorAll('*'));
        return els.filter(el => {
            const pos = window.getComputedStyle(el).position;
            return (pos === 'fixed' || pos === 'sticky') && el.getBoundingClientRect().height > 0;
        }).map(el => ({ tag: el.tagName, class: el.className, id: el.id, pos: window.getComputedStyle(el).position, h: el.getBoundingClientRect().height, bottom: el.getBoundingClientRect().bottom }));
    }""")
    print(f"Mobile Sticky/Fixed elements: {sticky_els}")
    
    # 3. Audit Small Mobile (320x568 - iPhone SE)
    print("\n=== SMALL MOBILE AUDIT (320x568) ===")
    small_mobile = browser.new_page(viewport={'width': 320, 'height': 568})
    small_mobile.goto(f'{base_url}/index.html')
    small_mobile.wait_for_load_state('networkidle')
    small_mobile.screenshot(path='audit_small_mobile_home.png', full_page=True)
    small_scroll_w = small_mobile.evaluate("() => document.documentElement.scrollWidth")
    small_inner_w = small_mobile.evaluate("() => window.innerWidth")
    print(f"Small Mobile Overflow: {small_scroll_w > small_inner_w} ({small_scroll_w} vs {small_inner_w})")
    
    # 4. Audit Menu & Landing Pages
    print("\n=== SUBPAGES AUDIT ===")
    for subpage in ['menu.html', 'tortas-infantiles.html', 'mesas-dulces.html', 'tortas-15-anos.html', 'blog.html']:
        page.goto(f'{base_url}/{subpage}')
        page.wait_for_load_state('networkidle')
        page.screenshot(path=f'audit_{subpage.replace(".html","")}_desktop.png', full_page=True)
        mobile.goto(f'{base_url}/{subpage}')
        mobile.wait_for_load_state('networkidle')
        mobile.screenshot(path=f'audit_{subpage.replace(".html","")}_mobile.png', full_page=True)
        print(f"Saved screenshots for {subpage}")
        
    browser.close()

server.shutdown()
print("\nAuditing complete!")
