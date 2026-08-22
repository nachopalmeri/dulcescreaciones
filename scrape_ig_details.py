import json
import time
from playwright.sync_api import sync_playwright

posts_data = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport={'width': 1280, 'height': 900}
    )
    page = context.new_page()
    
    url = 'https://www.instagram.com/dulcescreaciones_dc/'
    page.goto(url, wait_until='networkidle', timeout=20000)
    time.sleep(3)
    
    # Get all post links
    links = page.locator('article a, main a').all()
    post_urls = []
    for l in links:
        href = l.get_attribute('href')
        if href and ('/p/' in href or '/reel/' in href):
            full_url = f'https://www.instagram.com{href}' if href.startswith('/') else href
            if full_url not in post_urls:
                post_urls.append(full_url)
    
    print(f'Found {len(post_urls)} posts/reels: {post_urls}')
    
    # Extract details for the latest 6 posts
    for pu in post_urls[:6]:
        try:
            p_page = context.new_page()
            p_page.goto(pu, wait_until='networkidle', timeout=15000)
            time.sleep(2)
            
            # Extract caption / title / img
            title = p_page.title()
            
            # Try to find og:image and og:description or article text
            og_img = p_page.locator('meta[property="og:image"]').get_attribute('content') if p_page.locator('meta[property="og:image"]').count() > 0 else ''
            og_desc = p_page.locator('meta[property="og:description"]').get_attribute('content') if p_page.locator('meta[property="og:description"]').count() > 0 else ''
            
            # Post text
            caption_el = p_page.locator('h1, article span._ap3a').first
            caption = caption_el.inner_text() if caption_el.count() > 0 else ''
            
            # Image or video src
            media_img = p_page.locator('article img').first.get_attribute('src') if p_page.locator('article img').count() > 0 else og_img
            
            posts_data.append({
                'url': pu,
                'title': title,
                'og_desc': og_desc,
                'caption': caption,
                'media_url': media_img or og_img
            })
            print(f'Post: {pu}\n  Desc: {og_desc[:100]}\n  Media: {media_img[:80] if media_img else "None"}\n')
            p_page.close()
        except Exception as e:
            print(f'Error extracting {pu}: {e}')
            
    browser.close()

with open('instagram_posts.json', 'w', encoding='utf-8') as f:
    json.dump(posts_data, f, ensure_ascii=False, indent=2)
print("Saved to instagram_posts.json")
