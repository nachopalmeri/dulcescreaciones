# Reglas SEO — Dulces Creaciones

## PSEO
- Cada localidad = una página HTML independiente
- Cada temática/evento = una página HTML independiente
- Cada pregunta FAQ = una página HTML independiente
- Patrón local: seguir tortas-adrogue.html (97 líneas)
- Patrón temático: seguir tortas-infantiles.html (495 líneas)
- Patrón blog: seguir blog/como-conservar-torta-artesanal.html (88 líneas)

## Internal linking
- Todas las páginas nuevas deben tener hidden links desde index.html
- Los blog posts deben tener links desde blog.html (invisible)
- Usar div con clip:rect(0,0,0,0) para links invisibles

## Sitemap
- Actualizar sitemap.xml cada vez que se agregan páginas
- Prioridad 1.0: index | 0.9: principales | 0.8: categorías | 0.7: PSEO local | 0.6: blog

## GEO
- Mantener ai/*.json actualizado
- Mantener llms.txt actualizado
- Mantener .well-known/ai.txt actualizado
