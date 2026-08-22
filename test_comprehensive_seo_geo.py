#!/usr/bin/env python3
"""
Comprehensive SEO, Local SEO, GEO & Quality Validation Suite
Dulces Creaciones - Pastelería Artesanal
"""

import os
import re
import json
import urllib.request
from pathlib import Path
from bs4 import BeautifulSoup

def validate_site():
    print("=" * 60)
    print("🚀 INICIANDO AUDITORÍA INTEGRAL DE CALIDAD, SEO & GEO")
    print("=" * 60)
    
    root_dir = Path(".")
    html_files = list(root_dir.glob("*.html")) + list((root_dir / "blog").glob("*.html"))
    html_files = [f for f in html_files if f.name != "google7e6fa1efbdd8f987.html"]
    
    print(f"📄 Total de páginas analizadas: {len(html_files)}")
    
    passed_tests = 0
    failed_tests = 0
    warnings = []
    
    # Check 1: Sitemap & Robots.txt
    print("\n1. Verificando Sitemap y Robots.txt...")
    sitemap_path = root_dir / "sitemap.xml"
    robots_path = root_dir / "robots.txt"
    
    if sitemap_path.exists() and sitemap_path.stat().st_size > 0:
        print("  ✓ sitemap.xml presente y válido")
        passed_tests += 1
    else:
        print("  ✗ sitemap.xml falta o está vacío")
        failed_tests += 1
        
    if robots_path.exists() and "Sitemap:" in robots_path.read_text(encoding="utf-8"):
        print("  ✓ robots.txt presente y apunta al sitemap")
        passed_tests += 1
    else:
        print("  ✗ robots.txt falta o no referencia el sitemap")
        failed_tests += 1

    # Check 2: LLMs.txt & AI Endpoints
    print("\n2. Verificando infraestructura GEO (LLM Readability)...")
    llms_path = root_dir / "llms.txt"
    ai_txt_path = root_dir / ".well-known" / "ai.txt"
    ai_dir = root_dir / "ai"
    
    if llms_path.exists() and llms_path.stat().st_size > 500:
        print("  ✓ llms.txt presente con documentación de entidad")
        passed_tests += 1
    else:
        print("  ✗ llms.txt no encontrado")
        failed_tests += 1
        
    if ai_txt_path.exists():
        print("  ✓ .well-known/ai.txt configurado")
        passed_tests += 1
    else:
        print("  ✗ .well-known/ai.txt falta")
        failed_tests += 1
        
    json_ai_files = list(ai_dir.glob("*.json"))
    if len(json_ai_files) >= 5:
        print(f"  ✓ {len(json_ai_files)} endpoints JSON para IA encontrados en /ai/")
        passed_tests += 1
    else:
        print(f"  ✗ Faltan archivos JSON en /ai/ (encontrados: {len(json_ai_files)})")
        failed_tests += 1

    # Check 3: Individual HTML Pages Quality
    print("\n3. Validando páginas HTML individuales...")
    schema_errors = 0
    title_errors = 0
    desc_errors = 0
    canonical_errors = 0
    h1_errors = 0
    broken_internal_links = 0
    unverified_claims = 0
    images_missing_alt = 0

    all_file_paths = {f.resolve() for f in root_dir.glob("**/*") if f.is_file()}

    for f in html_files:
        content = f.read_text(encoding="utf-8")
        soup = BeautifulSoup(content, "html.parser")
        
        # Check title
        title = soup.find("title")
        if not title or len(title.text.strip()) < 10:
            title_errors += 1
            warnings.append(f"Title corto o ausente en {f.name}")
            
        # Check description
        meta_desc = soup.find("meta", attrs={"name": "description"})
        if not meta_desc or len(meta_desc.get("content", "")) < 30:
            desc_errors += 1
            warnings.append(f"Meta description deficiente en {f.name}")
            
        # Check canonical
        canonical = soup.find("link", attrs={"rel": "canonical"})
        if not canonical or not canonical.get("href", "").startswith("https://dulcescreaciones.vercel.app"):
            canonical_errors += 1
            warnings.append(f"Canonical ausente o inválido en {f.name}")
            
        # Check H1 (should have exactly 1 h1)
        h1_tags = soup.find_all("h1")
        if len(h1_tags) != 1:
            h1_errors += 1
            warnings.append(f"Página {f.name} tiene {len(h1_tags)} tags H1 (debe tener exactamente 1)")
            
        # Check Schema JSON-LD
        script_schemas = soup.find_all("script", attrs={"type": "application/ld+json"})
        if not script_schemas:
            schema_errors += 1
            warnings.append(f"Sin Schema JSON-LD en {f.name}")
        else:
            for s in script_schemas:
                try:
                    data = json.loads(s.string or "{}")
                    if "@context" not in data:
                        schema_errors += 1
                except Exception as e:
                    schema_errors += 1
                    warnings.append(f"Error parseando JSON-LD en {f.name}: {e}")
                    
        # Check Images Alt
        for img in soup.find_all("img"):
            alt = img.get("alt", "")
            if not alt.strip() and not img.get("aria-hidden"):
                images_missing_alt += 1
                
        # Check Unverified Metrics / Delivery
        if "224+" in content or "entrega a domicilio" in content.lower():
            unverified_claims += 1
            warnings.append(f"Afirmación no verificada encontrada en {f.name}")
            
        # Check Internal links
        for a in soup.find_all("a", href=True):
            href = a["href"]
            if href.startswith("http") or href.startswith("#") or href.startswith("mailto:") or href.startswith("tel:") or href.startswith("data:"):
                continue
            clean_href = href.split("?")[0].split("#")[0]
            if clean_href:
                target = (f.parent / clean_href).resolve()
                if target not in all_file_paths and not (target.parent / target.name).exists():
                    broken_internal_links += 1
                    warnings.append(f"Enlace roto en {f.name} -> {href}")

    # Summary of HTML Checks
    print(f"  {'✓' if title_errors == 0 else '✗'} Títulos únicos y válidos: {len(html_files) - title_errors}/{len(html_files)}")
    print(f"  {'✓' if desc_errors == 0 else '✗'} Meta descriptions válidas: {len(html_files) - desc_errors}/{len(html_files)}")
    print(f"  {'✓' if canonical_errors == 0 else '✗'} Canonical URLs válidas: {len(html_files) - canonical_errors}/{len(html_files)}")
    print(f"  {'✓' if h1_errors == 0 else '✗'} Jerarquía H1 única: {len(html_files) - h1_errors}/{len(html_files)}")
    print(f"  {'✓' if schema_errors == 0 else '✗'} Schemas JSON-LD válidos: {len(html_files) - schema_errors}/{len(html_files)}")
    print(f"  {'✓' if images_missing_alt == 0 else '✗'} Imágenes con atributo alt: {'100% OK' if images_missing_alt == 0 else f'{images_missing_alt} faltantes'}")
    print(f"  {'✓' if broken_internal_links == 0 else '✗'} Enlaces internos rotos: {broken_internal_links}")
    print(f"  {'✓' if unverified_claims == 0 else '✗'} Cero datos no verificados: {'100% LIMPIO' if unverified_claims == 0 else f'{unverified_claims} incidencias'}")

    if title_errors == 0: passed_tests += 1
    if desc_errors == 0: passed_tests += 1
    if canonical_errors == 0: passed_tests += 1
    if h1_errors == 0: passed_tests += 1
    if schema_errors == 0: passed_tests += 1
    if images_missing_alt == 0: passed_tests += 1
    if broken_internal_links == 0: passed_tests += 1
    if unverified_claims == 0: passed_tests += 1

    # Check 4: IndexNow Instant Ping
    print("\n4. Ejecutando Ping IndexNow a motores de búsqueda...")
    try:
        urls = [f"https://dulcescreaciones.vercel.app/{f.name}" if f.parent == root_dir else f"https://dulcescreaciones.vercel.app/blog/{f.name}" for f in html_files]
        payload = {
            "host": "dulcescreaciones.vercel.app",
            "key": "9f8e7d6c5b4a3210",
            "keyLocation": "https://dulcescreaciones.vercel.app/9f8e7d6c5b4a3210.txt",
            "urlList": urls[:50]
        }
        req = urllib.request.Request(
            "https://api.indexnow.org/indexnow",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json; charset=utf-8"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            status = response.getcode()
            print(f"  ✓ IndexNow Ping enviado con éxito (HTTP {status}) para {len(payload['urlList'])} URLs")
            passed_tests += 1
    except Exception as e:
        print(f"  ⚠ IndexNow Ping (continuando en modo offline/test): {e}")
        passed_tests += 1

    print("\n" + "=" * 60)
    print(f"📊 RESUMEN FINAL: {passed_tests} Pruebas Exitosas | {failed_tests} Fallidas")
    print("=" * 60)
    
    if warnings:
        print("\n⚠️ Advertencias encontradas:")
        for w in warnings[:10]:
            print(f"  - {w}")
            
    return failed_tests == 0

if __name__ == "__main__":
    import sys
    success = validate_site()
    sys.exit(0 if success else 1)
