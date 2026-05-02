# Dulces Creaciones - Resumen Técnico

## Fixes Aplicados (2026-04-29)

### 1. Contraste WCAG ✅
- **Archivo**: `styles.css`
- **Cambio**: `--muted: #8B7067` → `--muted: #6B534A`
- **Razón**: El color anterior tenía ratio ~3.5:1 (por debajo del mínimo 4.5:1 para texto normal)
- **Impacto**: Accessibility WCAG compliance

### 2. Typo PWA ✅
- **Archivos**: 5 páginas HTML
  - `mesas-dulces.html`
  - `tortas-15-anos.html`
  - `tortas-futbol.html`
  - `tortas-gaming.html`
  - `tortas-infantiles.html`
- **Cambio**: `pwaDismissA.addEventListener` → `pwaDismiss.addEventListener`
- **Razón**: Error de JS que impedía funcionamiento del botón dismiss
- **Impacto**: Fix JS errors en consola

### 3. UTM Parameters ✅
- **Archivo**: `index.html`
- **Cambio**: Agregados UTM params a todos los enlaces WhatsApp
- **Listado**:
  - Nav: `utm_source=nav&utm_medium=whatsapp&utm_campaign=index`
  - Hero: `utm_source=hero&utm_medium=whatsapp&utm_campaign=index`
  - Proceso: `utm_source=proceso&utm_medium=whatsapp&utm_campaign=index`
  - FAQ: `utm_source=faq&utm_medium=whatsapp&utm_campaign=index`
  - CTA Final: `utm_source=cta_final&utm_medium=whatsapp&utm_campaign=index`
  - FAB: `utm_source=fab&utm_medium=whatsapp&utm_campaign=index`
  - Zona: `utm_source=zona&utm_medium=whatsapp&utm_campaign=index`
- **Impacto**: Tracking completo en GA4

### 4. Service Schema ✅
- **Archivo**: `index.html`
- **Agregado**: Schema de tipo Service para:
  - Tortas Personalizadas
  - Mesas Dulces y Candy Bar
  - Tortas Infantiles
  - Tortas 15 Años
- **Impacto**: SEO local, aparecer en búsquedas de servicios

---

## Pendiente de Vos

### Pixel Facebook
- **Ubicación**: `index.html` línea 78
- **Cambio**: Reemplazar `TU_PIXEL_ID_AQUI` con tu ID real
- **Cómo obtener**: business.facebook.com → Event Manager → Pixel

### Google My Business
- **Acciones**:
  - Claimear perfil si no está hecho
  - Agregar fotos regularmente
  - Responder TODAS las reseñas
  - Publicar posts semanales

---

## Métricas a Seguir

### Web Analytics (GA4)
| Métrica | Ahora | Meta (3 meses) |
|---------|-------|----------------|
| Visitas/mes | ? | 1,000+ |
| WhatsApp clicks/día | ? | 20+ |
| Conversión WA | ? | 3%+ |

### Google My Business
| Métrica | Meta |
|---------|------|
| Reseñas | 10+ (4.5★) |
| Fotos | 5+/mes |
| Respuesta reseñas | < 24hs |

### WhatsApp Business
| Métrica | Meta |
|---------|------|
| Tiempo primera respuesta | < 30 min |
| Tiempo resolución | < 24 hs |
| Tasa conversión | 30-50% |
| Clientes recurrentes | > 30% |

---

## Archivos Generados

```
docs/dulces-creaciones/
├── estrategia-instagram.md   # Calendario, hashtags, captions
├── plan-ads.md              # Campañas, audiencias, presupuesto
├── guia-whatsapp-business.md # Catálogo, quick replies, etiquetas
└── resumen-tecnico.md        # Este archivo
```

---

## Próximos Steps

1. **Inmediato**: Configurar Pixel Facebook (ID real)
2. **Esta semana**: Optimizar Google My Business
3. **Esta semana**: Descargar WhatsApp Business
4. **Ongoing**: Publicar en Instagram según calendario

---

*Documento generado: 2026-04-29*