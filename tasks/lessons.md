# Lecciones Aprendidas — Dulces Creaciones

## 2026-05-18: PSEO masivo requiere sitemap + interlinking
- Problema: 29 páginas nuevas creadas pero sin links desde el sitemap ni desde otras páginas
- Lección: cada página PSEO nueva debe tener hidden link en index.html + entrada en sitemap.xml
- Regla: nunca crear página sin agregar al sitemap y al interlinking

## 2026-05-18: Blog posts sin discoverability
- Problema: 15 blog posts creados pero blog.html no los enlaza
- Lección: blog.html debe tener hidden links a todos los posts individuales
- Regla: todo post nuevo debe linkearse desde blog.html (invisible)

## 2026-08-29: Tests E2E quedan obsoletos tras un revert de diseño
- Problema: el commit `revert(style)` volvió el FAQ a `<details class="faq-item">` nativo, pero qa_e2e_test.py seguía buscando `.faq-question` (diseño JS anterior) y reportaba fallo falso
- Lección: tras cualquier revert/cambio de diseño visible, correr toda la suite de tests (test_seo.py, test_site.py, qa_e2e_test.py, test_comprehensive_seo_geo.py, geo_audit.py) para detectar selectores desactualizados, no solo mirar el diff de HTML
- Regla: al testear el primer FAQ con `open` por defecto, usar el segundo item para validar el toggle (el primero ya está abierto y un click lo cerraría, dando falso negativo)

## 2026-08-29: No fabricar AggregateRating/hasCredential/additionalProperty sin datos reales
- Problema: geo_audit.py penaliza la ausencia de estos 3 schemas (11 pts), pero agregarlos requeriría inventar rating, cantidad de reviews o credenciales que no existen
- Lección: un score de auditoría más alto no vale una posible penalización manual de Google por "fake reviews/structured data" ni viola la regla de "cero datos no verificados"
- Regla: dejar estos 3 checks en rojo hasta tener datos reales (reviews de Google Business Profile, credencial verificable); no fabricar para subir el puntaje
