#!/usr/bin/env python3
"""SEO validation for Dulces Creaciones"""

from playwright.sync_api import sync_playwright
import json

def validate_seo():
    results = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        page.goto('http://127.0.0.1:8000/')
        page.wait_for_load_state('networkidle')
        
        print("=" * 60)
        print("SEO VALIDATION")
        print("=" * 60)
        
        # 1. Canonical URL
        print("\n1. Canonical URL Check")
        canonical = page.locator('link[rel="canonical"]').get_attribute('href')
        if canonical and 'dulcescreaciones.com.ar' in canonical:
            print(f"  ✓ Canonical correct: {canonical}")
            results.append("Canonical: PASS")
        else:
            print(f"  ✗ Canonical incorrect: {canonical}")
            results.append("Canonical: FAIL")
        
        # 2. Hreflang
        print("\n2. Hreflang Check")
        hreflang_es = page.locator('link[rel="alternate"][hreflang="es-AR"]').count()
        hreflang_default = page.locator('link[rel="alternate"][hreflang="x-default"]').count()
        if hreflang_es > 0 and hreflang_default > 0:
            print(f"  ✓ hreflang es-AR: {hreflang_es} tag(s)")
            print(f"  ✓ hreflang x-default: {hreflang_default} tag(s)")
            results.append("Hreflang: PASS")
        else:
            print(f"  ✗ hreflang missing - es-AR: {hreflang_es}, x-default: {hreflang_default}")
            results.append("Hreflang: FAIL")
        
        # 3. Meta Description
        print("\n3. Meta Description Check")
        desc = page.locator('meta[name="description"]').get_attribute('content')
        if desc:
            print(f"  ✓ Description: {len(desc)} chars")
            if '🎂' in desc:
                print("  ✓ Contains emoji (good for CTR)")
            results.append("Meta Description: PASS")
        else:
            print("  ✗ Description missing")
            results.append("Meta Description: FAIL")
        
        # 4. Open Graph
        print("\n4. Open Graph Check")
        og_checks = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type']
        og_pass = 0
        for og in og_checks:
            val = page.locator(f'meta[property="{og}"]').get_attribute('content')
            if val:
                og_pass += 1
                print(f"  ✓ {og}: {val[:50]}...")
            else:
                print(f"  ✗ {og}: MISSING")
        if og_pass == len(og_checks):
            results.append("Open Graph: PASS")
        else:
            results.append("Open Graph: PARTIAL")
        
        # 5. Twitter Card
        print("\n5. Twitter Card Check")
        twitter_checks = ['twitter:title', 'twitter:description', 'twitter:image']
        tw_pass = 0
        for tw in twitter_checks:
            val = page.locator(f'meta[name="{tw}"]').get_attribute('content')
            if val:
                tw_pass += 1
                print(f"  ✓ {tw}: present")
            else:
                print(f"  ✗ {tw}: MISSING")
        if tw_pass == len(twitter_checks):
            results.append("Twitter Card: PASS")
        else:
            results.append("Twitter Card: PARTIAL")
        
        # 6. Geo Tags
        print("\n6. Geo Tags Check")
        geo_checks = ['geo.region', 'geo.placename', 'geo.position']
        geo_pass = 0
        for geo in geo_checks:
            val = page.locator(f'meta[name="{geo}"]').get_attribute('content')
            if val:
                geo_pass += 1
                print(f"  ✓ {geo}: {val}")
        if geo_pass == len(geo_checks):
            results.append("Geo Tags: PASS")
        else:
            results.append("Geo Tags: PARTIAL")
        
        # 7. Structured Data (JSON-LD)
        print("\n7. Structured Data Check")
        schemas = page.locator('script[type="application/ld+json"]').all()
        schema_types = []
        for schema in schemas:
            try:
                data = json.loads(schema.text_content())
                if isinstance(data, list):
                    for item in data:
                        schema_types.append(item.get('@type', 'Unknown'))
                else:
                    schema_types.append(data.get('@type', 'Unknown'))
            except:
                pass
        
        print(f"  Found schemas: {', '.join(set(schema_types))}")
        
        expected_schemas = ['Bakery', 'AggregateRating', 'BreadcrumbList', 'HowTo', 'FAQPage']
        for es in expected_schemas:
            if es in schema_types:
                print(f"  ✓ {es} schema present")
            else:
                print(f"  ⚠ {es} schema NOT found (optional)")
        
        if 'Bakery' in schema_types:
            results.append("Schema: PASS")
        else:
            results.append("Schema: FAIL")
        
        # 8. Theme Toggle (UX feature)
        print("\n8. Theme Toggle Check")
        toggle = page.locator('.theme-toggle')
        if toggle.count() > 0:
            print("  ✓ Theme toggle button found")
            results.append("Theme Toggle: PASS")
        else:
            print("  ✗ Theme toggle button NOT found")
            results.append("Theme Toggle: FAIL")
        
        # 9. Exit Popup (Conversion feature)
        print("\n9. Exit Intent Popup Check")
        popup = page.locator('#exit-popup')
        if popup.count() > 0:
            print("  ✓ Exit popup markup found")
            results.append("Exit Popup: PASS")
        else:
            print("  ✗ Exit popup markup NOT found")
            results.append("Exit Popup: FAIL")
        
        # 10. Instagram Feed (Aesthetic feature)
        print("\n10. Instagram Feed Section Check")
        ig = page.locator('#instagram-feed')
        if ig.count() > 0:
            ig_items = page.locator('.ig-feed-item').count()
            print(f"  ✓ Instagram section found ({ig_items} items)")
            results.append("Instagram Feed: PASS")
        else:
            print("  ✗ Instagram section NOT found")
            results.append("Instagram Feed: FAIL")
        
        browser.close()
    
    # Summary
    print("\n" + "=" * 60)
    print("SEO VALIDATION SUMMARY")
    print("=" * 60)
    for r in results:
        status = "✓" if "PASS" in r else "✗" if "FAIL" in r else "⚠"
        print(f"  {status} {r}")
    print("=" * 60)
    
    passed = len([r for r in results if "PASS" in r])
    failed = len([r for r in results if "FAIL" in r])
    print(f"\nTotal: {passed} passed, {failed} failed, {len(results) - passed - failed} partial")
    
    return failed == 0

if __name__ == "__main__":
    import sys
    success = validate_seo()
    sys.exit(0 if success else 1)
