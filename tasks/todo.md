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
- [x] GEO para asistentes (2026-09-23): llms.txt con respuestas directas por ocasión, ai/faq.json con preguntas tipo "¿dónde comprar torta de casamiento en zona sur?", robots.txt con bots de ChatGPT/Claude/Perplexity, "casamiento" en páginas de bodas, IndexNow enviado
- [x] Contradicciones de envío eliminadas (el negocio es solo retiro)
- [x] 36 páginas secundarias rediseñadas (hero con foto real + CTA, cards, pasos, FAQ, botones), menú mobile arreglado, galerías honestas sin repetidos, JS roto/visible eliminado, UTM unificados, links de reseña/mapa verificados, páginas huérfanas enlazadas

## Search Console (datos del 20/9/26, vistos 23/9)
- 11 indexadas / 11 no indexadas. Motivos: 4 canónica alternativa, 3 redirección (cleanUrls, ya corregido), 2 noindex, 2 rastreada sin indexar
- Sitemap leído por última vez el 8/5/26 con 15 URLs (hoy 52): hay que re-enviarlo
- [x] tortas-bodas-egresados.html tenía noindex + canonical a otra página: ahora indexable y principal; -temperley redirige 301 a ella
- [x] hay-tortas-sin-tacc-zona-sur y tortas-para-celiacos-zona-sur (noindex, duplicadas) redirigen 301 a tortas-sin-gluten.html

## Pruebas de búsqueda (2026-09-23)
- Buscador web usado por asistentes de IA: la web NO aparece en ninguna búsqueda (ni por el dominio exacto). Solo aparece el repo de GitHub
- Lo que sí aparece para "pastelería Temperley", "tortas personalizadas zona sur", "torta de casamiento zona sur", "mesa dulce Temperley", "tortas Adrogué", "torta 15 años zona sur": Instagram/Facebook de competidores, MercadoLibre, directorios (casamientos.com.ar, portalcasamientos.com.ar, argentino.com.ar, webyeventos.com.ar, ineventos, catering.com.ar, todoadrogue.com.ar) y competidores con dominio propio (tortaspersonalizadascp.com, namnamtortas.com.ar)
- No hay conector de Google Search Console disponible en Claude; hay que hacerlo manualmente

## Pendiente (Acciones Externas)
- [ ] Bing Webmaster Tools: importar desde Search Console (alimenta ChatGPT y Copilot)
- [ ] Publicar ficha gratuita en directorios que sí aparecen: casamientos.com.ar, portalcasamientos.com.ar, argentino.com.ar, webyeventos.com.ar, todoadrogue.com.ar (mismo nombre, teléfono, dirección y link a la web)
- [ ] Repo de GitHub: poner https://dulcescreaciones.vercel.app en el campo "Website" del repo
- [x] Afirmaciones de "certificadas sin TACC", "protocolos contra contaminación cruzada" y "aptas para celíacos" eliminadas (el dueño confirmó que no aplican). Texto estándar: opciones sin gluten a pedido, sin certificación sin TACC, consultar antes si es para celíacos
- [ ] Search Console: re-enviar sitemap.xml, "Validar corrección" en Redirección / noindex / canónica, e Inspeccionar URL → Solicitar indexación de la home, tortas-bodas-egresados.html, tortas-infantiles.html, tortas-15-anos.html, mesas-dulces.html, tortas-cumpleanos-temperley.html (`https://dulcescreaciones.vercel.app/sitemap.xml`)
- [x] Perfil de Google Business Profile creado (confirmado por el dueño 2026-09-23)
- [x] Perfil de Google conectado: sameAs/hasMap = https://maps.google.com/?cid=8399718831301719330, mapa de la home con el pin real, coordenadas de todo el sitio = pin de Google (-34.7616, -58.4031), "5.0 en Google" enlazado al perfil
- [x] Horarios unificados con Google en todo el sitio: lun-sáb 9:00-17:00, dom cerrado (schema, footers, llms.txt, ai/summary.json)
- [x] Coordenadas unificadas en las 55 páginas al pin de Google
- Link directo para pedir reseñas: https://search.google.com/local/writereview?placeid=ChIJS-6XoBtgKmoRIvXlAMbLkXQ
- [ ] Pedir reseñas a clientas reales (guion en GBP-MASTER-KIT.md, sección 3); con reseñas reales recién ahí agregar AggregateRating
- [ ] Ojo homónimos: existen otras "Dulces Creaciones" (Laferrere, Villa Bosch). No agregar "Temperley" al nombre del perfil de Google (va contra sus reglas); diferenciar con dirección, teléfono, categoría y link a la web idénticos en GBP, IG y FB
