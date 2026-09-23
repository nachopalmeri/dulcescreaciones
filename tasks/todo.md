# Tareas — Dulces Creaciones

## Completado
- [x] Reparación estructural de encoding UTF-8 en todos los archivos HTML (cero mojibake)
- [x] GA4 (G-7M2V2QC4ME) implementado en todas las 57 páginas del sitio
- [x] Eventos de negocio implementados (whatsapp_click con parámetros ricos, instagram_click, maps_click, cta_click)
- [x] Menú mobile responsive (botón hamburger accesible y funcional en todas las páginas)
- [x] blog.html rediseñado y enlazando activamente a los 15 artículos individuales
- [x] Sitemap.xml generado con 55 URLs canónicas válidas e imágenes
- [x] Robots.txt optimizado para Googlebot y Bingbot
- [x] Vercel.json configurado con headers de seguridad, caché inmutable de assets y UTF-8
- [x] Schema JSON-LD corregido (error de sintaxis en mesas-dulces.html eliminado)
- [x] Placeholder inválido de Meta Pixel eliminado
- [x] Manifest.json actualizado con rutas reales de screenshots WebP
- [x] .gitignore actualizado
- [x] Enlace roto index.html -> gbp-content.html eliminado (página no existía)
- [x] qa_e2e_test.py actualizado: selector FAQ obsoleto (.faq-question) reemplazado por el actual (.faq-item con <details>/<summary>)
- [x] GEO audit 80.6% -> 92.8% (EXCELLENT): agregado ItemList de especialidades, HowTo "Cómo Pedir", knowsAbout, areaServed con containsPlace (Zona Sur GBA + 9 localidades), potentialAction WhatsApp y meta keywords al schema de index.html
- [x] Rediseño visual home (2026-09-23): collage en hero, galería bento con 13 fotos únicas y etiquetas correctas, categorías deslizables en mobile, pasos con medallones, rellenos con acentos, foto de autora con marco, CTA final con textura, dark mode corregido
- [x] Galería: eliminadas fotos duplicadas (mismas tortas con distinto nombre) y etiquetas falsas ("Selva & Safari" era Moana); sumadas fotos reales de IG sin usar (Selección Argentina, aniversario 50, graduación, estrella 19, rosa blanca, fondo de mar, black & silver)
- [x] SEO/GEO invisible: schema Bakery con founder, hasOfferCatalog, menu, hasMap, currenciesAccepted, image[] y Lanús en areaServed; FAQPage con la pregunta de porciones; sitemap con 17 imágenes de la home; llms.txt con portfolio real
- [x] Fix SEO crítico (2026-09-23): cleanUrls redirigía con 308 todas las URLs .html del sitemap/canonicals; ahora .html sirve 200 y las URLs sin extensión redirigen 301 a .html
- [x] .vercelignore: tasks/, rules/, workflows/, docs/, *.md, *.py ya no se publican
- [x] Home: sin emojis como íconos, títulos en mayúscula normal en español, foto primero en mobile, FAB oculto mientras se ve el CTA principal, favicon = logo, CSS/JS versionados (?v=)
- [x] Publicado en producción (main) y verificado: 55/55 URLs del sitemap en 200

## Pendiente (Acciones Externas)
- [ ] Subir (o re-enviar) sitemap.xml en Google Search Console y pedir reindexación: antes todas las URLs daban redirección (`https://dulcescreaciones.vercel.app/sitemap.xml`)
- [x] Perfil de Google Business Profile creado (confirmado por el dueño 2026-09-23)
- [ ] Conseguir el link público del perfil de Google (Maps → Compartir) para sumarlo a sameAs/hasMap del schema y al mapa de la home
- [ ] Pedir reseñas a clientas reales (guion en GBP-MASTER-KIT.md, sección 3); con reseñas reales recién ahí agregar AggregateRating
- [ ] Ojo homónimos: existen otras "Dulces Creaciones" (Laferrere, Villa Bosch). No agregar "Temperley" al nombre del perfil de Google (va contra sus reglas); diferenciar con dirección, teléfono, categoría y link a la web idénticos en GBP, IG y FB
