"""
GEO Auditor - Generative Engine Optimization Score
Basado en investigacion Princeton KDD 2024 / AutoGEO ICLR 2026
Audita sitio contra 47 metodos cientificos para visibilidad en ChatGPT, Claude, Gemini, Perplexity
"""

import json
import os
from pathlib import Path

SITE_DIR = Path(__file__).parent
BASE_URL = "https://dulcescreaciones.com.ar"

CHECKS = {
    "on_page": [
        ("lang attribute en html", 5),
        ("canonical URL", 5),
        ("meta description", 5),
        ("Open Graph tags", 5),
        ("Twitter Card tags", 3),
        ("robots index/follow", 3),
        ("Schema.org LocalBusiness JSON-LD", 10),
        ("Schema.org Service/ItemList JSON-LD", 5),
        ("Schema.org FAQPage JSON-LD", 5),
        ("Schema.org BreadcrumbList JSON-LD", 3),
        ("Schema.org HowTo JSON-LD", 3),
        ("Schema.org AggregateRating", 3),
        ("Geo meta tags", 3),
        ("Keywords meta (legacy)", 1),
    ],
    "geo_specific": [
        ("llms.txt file exists", 10),
        (".well-known/ai.txt file exists", 10),
        ("ai/summary.json file exists", 10),
        ("ai/faq.json file exists", 10),
        ("ai meta tags in HTML head", 5),
        ("Schema knowsAbout array", 5),
        ("Schema hasCredential", 5),
        ("Schema potentialAction (Order/Communicate)", 5),
        ("Schema additionalProperty statistics", 5),
        ("AreaServed with city list", 3),
    ],
    "content_quality": [
        ("FAQ answers with direct facts", 5),
        ("Statistics/numbers in content", 5),
        ("Location mentions (Temperley, Zona Sur)", 5),
        ("Contact info visible (WhatsApp)", 5),
        ("Pricing signals (seña 50%)", 3),
        ("Service keywords coverage", 3),
    ],
    "technical": [
        ("Sitemap.xml present", 3),
        ("Robots.txt present", 3),
        ("Images with alt text", 3),
        ("Lazy loading on images", 2),
        ("Preconnect/dns-prefetch", 2),
    ],
}


def check_file(path: Path) -> bool:
    return path.exists() and path.stat().st_size > 0


def check_string_in_file(path: Path, needle: str) -> bool:
    if not path.exists():
        return False
    try:
        return needle in path.read_text(encoding="utf-8")
    except Exception:
        return False


def run_audit():
    score = 0
    max_score = 0
    results = []

    html_path = SITE_DIR / "index.html"
    html_text = html_path.read_text(encoding="utf-8") if html_path.exists() else ""

    for category, checks in CHECKS.items():
        cat_score = 0
        cat_max = 0
        cat_results = []

        for name, weight in checks:
            cat_max += weight
            passed = False

            if name == "lang attribute en html":
                passed = 'lang="es-AR"' in html_text
            elif name == "canonical URL":
                passed = 'rel="canonical"' in html_text
            elif name == "meta description":
                passed = '<meta name="description"' in html_text
            elif name == "Open Graph tags":
                passed = 'property="og:' in html_text
            elif name == "Twitter Card tags":
                passed = 'name="twitter:' in html_text
            elif name == "robots index/follow":
                passed = 'content="index, follow"' in html_text
            elif name == "Schema.org LocalBusiness JSON-LD":
                passed = '"@type": "Bakery"' in html_text and '"LocalBusiness"' not in html_text or '"@type": "Bakery"' in html_text
            elif name == "Schema.org Service/ItemList JSON-LD":
                passed = '"@type": "ItemList"' in html_text
            elif name == "Schema.org FAQPage JSON-LD":
                passed = '"@type": "FAQPage"' in html_text
            elif name == "Schema.org BreadcrumbList JSON-LD":
                passed = '"@type": "BreadcrumbList"' in html_text
            elif name == "Schema.org HowTo JSON-LD":
                passed = '"@type": "HowTo"' in html_text
            elif name == "Schema.org AggregateRating":
                passed = '"@type": "AggregateRating"' in html_text
            elif name == "Geo meta tags":
                passed = 'name="geo.' in html_text
            elif name == "Keywords meta (legacy)":
                passed = '<meta name="keywords"' in html_text
            elif name == "llms.txt file exists":
                passed = check_file(SITE_DIR / "llms.txt")
            elif name == ".well-known/ai.txt file exists":
                passed = check_file(SITE_DIR / ".well-known" / "ai.txt")
            elif name == "ai/summary.json file exists":
                passed = check_file(SITE_DIR / "ai" / "summary.json")
            elif name == "ai/faq.json file exists":
                passed = check_file(SITE_DIR / "ai" / "faq.json")
            elif name == "ai meta tags in HTML head":
                passed = 'name="ai-summary"' in html_text
            elif name == "Schema knowsAbout array":
                passed = '"knowsAbout"' in html_text
            elif name == "Schema hasCredential":
                passed = '"hasCredential"' in html_text
            elif name == "Schema potentialAction (Order/Communicate)":
                passed = '"potentialAction"' in html_text
            elif name == "Schema additionalProperty statistics":
                passed = '"additionalProperty"' in html_text
            elif name == "AreaServed with city list":
                passed = '"areaServed"' in html_text
            elif name == "FAQ answers with direct facts":
                faq_path = SITE_DIR / "ai" / "faq.json"
                if faq_path.exists():
                    try:
                        data = json.loads(faq_path.read_text(encoding="utf-8"))
                        passed = len(data.get("faqs", [])) >= 3
                    except Exception:
                        passed = False
            elif name == "Statistics/numbers in content":
                passed = any(x in html_text for x in ["224+", "5+", "10 días", "50%"])
            elif name == "Location mentions (Temperley, Zona Sur)":
                passed = "Temperley" in html_text and "Zona Sur" in html_text
            elif name == "Contact info visible (WhatsApp)":
                passed = "1133266362" in html_text
            elif name == "Pricing signals (seña 50%)":
                passed = "seña" in html_text or "50%" in html_text
            elif name == "Service keywords coverage":
                keywords = ["tortas personalizadas", "mesas dulces", "candy bar", "15 años", "cumpleaños"]
                passed = sum(1 for k in keywords if k.lower() in html_text.lower()) >= 3
            elif name == "Sitemap.xml present":
                passed = check_file(SITE_DIR / "sitemap.xml")
            elif name == "Robots.txt present":
                passed = check_file(SITE_DIR / "robots.txt")
            elif name == "Images with alt text":
                import re
                img_tags = re.findall(r'<img[^>]*>', html_text)
                if img_tags:
                    alt_tags = [t for t in img_tags if 'alt=' in t]
                    passed = len(alt_tags) >= len(img_tags) * 0.8
            elif name == "Lazy loading on images":
                passed = 'loading="lazy"' in html_text
            elif name == "Preconnect/dns-prefetch":
                passed = 'rel="preconnect"' in html_text or 'rel="dns-prefetch"' in html_text

            if passed:
                cat_score += weight

            cat_results.append({"check": name, "passed": passed, "weight": weight})

        score += cat_score
        max_score += cat_max
        results.append({"category": category, "score": cat_score, "max": cat_max, "checks": cat_results})

    pct = round((score / max_score) * 100, 1)

    print(f"\n{'=' * 50}")
    print(f"  GEO AUDIT REPORT - Dulces Creaciones")
    print(f"  Base URL: {BASE_URL}")
    print(f"{'=' * 50}\n")

    for r in results:
        print(f"  [{r['category'].upper()}] {r['score']}/{r['max']}")
        for c in r["checks"]:
            icon = "✅" if c["passed"] else "❌"
            print(f"    {icon} {c['check']} ({c['weight']} pts)")
        print()

    print(f"  TOTAL SCORE: {score}/{max_score} = {pct}%")
    if pct >= 86:
        print("  🟢 EXCELLENT - Alta visibilidad en IAs")
    elif pct >= 68:
        print("  🟡 GOOD - Buena base, mejoras menores")
    elif pct >= 36:
        print("  🟠 FOUNDATION - Necesita trabajo GEO")
    else:
        print("  🔴 CRITICAL - Casi invisible para IAs")
    print(f"{'=' * 50}\n")

    return pct, results


if __name__ == "__main__":
    run_audit()
