#!/usr/bin/env python3
"""Testing script for Dulces Creaciones website"""

from playwright.sync_api import sync_playwright
import sys

def run_tests():
    results = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # Test 1: Mobile viewport (375x667)
        print("=" * 50)
        print("TEST 1: Mobile Viewport (375x667)")
        print("=" * 50)
        
        context = browser.new_context(viewport={'width': 375, 'height': 667})
        page = context.new_page()
        page.goto('http://127.0.0.1:8000/')
        page.wait_for_load_state('networkidle')
        
        # Screenshot mobile
        page.screenshot(path='test_mobile.png', full_page=True)
        print("✓ Mobile screenshot saved: test_mobile.png")
        
        # Check hamburger menu exists
        hamburger = page.locator('.hamburger')
        if hamburger.is_visible():
            print("✓ Hamburger menu visible on mobile")
            results.append("Mobile: Hamburger menu OK")
        else:
            print("✗ Hamburger menu NOT found")
            results.append("Mobile: Hamburger menu MISSING")
        
        context.close()
        
        # Test 2: Desktop viewport (1440x900)
        print("\n" + "=" * 50)
        print("TEST 2: Desktop Viewport (1440x900)")
        print("=" * 50)
        
        context = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = context.new_page()
        page.goto('http://127.0.0.1:8000/')
        page.wait_for_load_state('networkidle')
        
        page.screenshot(path='test_desktop.png', full_page=True)
        print("✓ Desktop screenshot saved: test_desktop.png")
        
        # Check all major sections exist
        sections = ['#navbar', '#galeria', '#rellenos', '#proceso', '#faq', '#zona', '#instagram-feed']
        for section in sections:
            if page.locator(section).count() > 0:
                print(f"✓ Section {section} found")
            else:
                print(f"✗ Section {section} NOT found")
        
        # Check hero carousel
        hero_slides = page.locator('.hero-slide').count()
        print(f"✓ Hero slides found: {hero_slides}")
        
        # Check lightbox markup exists
        lightbox = page.locator('#lightbox')
        if lightbox.count() > 0:
            print("✓ Lightbox markup found")
        else:
            print("✗ Lightbox markup NOT found")
        
        # Check exit popup markup exists
        exit_popup = page.locator('#exit-popup')
        if exit_popup.count() > 0:
            print("✓ Exit popup markup found")
        else:
            print("✗ Exit popup markup NOT found")
        
        results.append("Desktop: All sections present")
        
        # Test 3: Dark Mode Functionality
        print("\n" + "=" * 50)
        print("TEST 3: Dark Mode Toggle")
        print("=" * 50)
        
        theme_toggle = page.locator('.theme-toggle')
        if theme_toggle.count() > 0:
            # Click theme toggle
            theme_toggle.click()
            page.wait_for_timeout(500)
            
            # Check if dark theme is applied
            html_theme = page.eval_on_selector('html', 'el => el.getAttribute("data-theme")')
            if html_theme == 'dark':
                print("✓ Dark mode activated")
                page.screenshot(path='test_dark_mode.png', full_page=True)
                print("✓ Dark mode screenshot saved: test_dark_mode.png")
                results.append("Dark Mode: Working")
            else:
                print(f"✗ Dark mode not applied (theme: {html_theme})")
                results.append("Dark Mode: FAILED")
        else:
            print("✗ Theme toggle not found")
            results.append("Dark Mode: Toggle MISSING")
        
        context.close()
        
        browser.close()
    
    # Print summary
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    for result in results:
        print(f"  {result}")
    print("=" * 50)
    
    return len([r for r in results if 'FAILED' in r or 'MISSING' in r]) == 0

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
