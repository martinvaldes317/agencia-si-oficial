# Migración de páginas SEO a publicidadtalca.cl

**Decisión (2026-09-27):** AgenciaSi pasa a ser 100% productos digitales. Todo lo gráfico y físico (letreros volumétricos, publicidad corporativa, merchandising) vive en **publicidadtalca.cl**. Estas páginas se sacaron de agenciasi.cl; este paquete tiene todo lo necesario para recrearlas allá.

## Qué hay aquí
| Archivo | Contenido |
|---|---|
| `urls-a-migrar.csv` | Las **100 URLs** que existían: URL, tipo, comuna, title y meta description exactos, keyword sugerida y URL nueva propuesta. Se abre en Excel/Sheets. |
| `contenido-extraido.md` | Todos los textos de las 3 plantillas (títulos, productos, sectores, proceso, beneficios) listos para reescribir. |
| `fuente/*.jsx` | Código completo de las 3 páginas (React). Sirven de referencia de estructura y diseño. |
| `fuente/seoLocalPages.js` | Listas de comunas y las plantillas de title/description por tipo de página. |

## Qué eran las 100 páginas
| Tipo | URLs | Alcance | Plantilla de title |
|---|---|---|---|
| Letreros volumétricos | 31 | Comunas de la Región del Maule | `Letreros Volumétricos en {comuna} \| … Región del Maule` |
| Publicidad corporativa | 37 | Maule + Rancagua, Santiago, Viña del Mar, Pucón, Temuco, Las Condes | `Publicidad Corporativa en {comuna} \| Imprenta y Merchandising` |
| Marketing digital | 32 | Maule + Rancagua | `Agencia de Marketing Digital en {comuna}` |

**Sobre las 32 de marketing digital:** no encajan con merchandising/letreros. Te sugiero **no migrarlas** a publicidadtalca.cl (hoy redirigen a la home de agenciasi.cl). Decídelo en la columna `decision_marketing` del CSV.

## Estructura sugerida en publicidadtalca.cl
- `/letreros-volumetricos/{comuna}/` (31 comunas)
- `/publicidad-corporativa/{comuna}/` (37 ciudades)
- Cada página: title y description únicos por comuna (usa las plantillas del CSV), H1 con la keyword + comuna, cobertura local, productos, proceso, CTA a WhatsApp, y datos estructurados `LocalBusiness`/`Service`.
- Evita contenido duplicado entre comunas: cambia al menos 30–40% del texto (sectores típicos de cada comuna, referencias locales, ejemplos).

## Cosas que NO se pueden copiar tal cual
- **Fotos de la galería de letreros:** la página usaba `/galeria/letreros/<producto>.jpg` y esas imágenes **nunca existieron** en el repositorio (mostraba placeholders). Necesitas fotos reales de trabajos.
- **Contacto:** las páginas usan el WhatsApp de AgenciaSi (+56 9 3293 0812). Cámbialo por el de Publicidad Talca si es distinto.
- **Clientes/logos y sello "Proveedor del Estado":** confirma que quieres mostrarlos en Publicidad Talca.
- **Diseño:** el look de estas páginas es el de AgenciaSi; adáptalo a la marca Publicidad Talca.

## Redirecciones (ya aplicadas en agenciasi.cl)
Las URLs de `/letreros/*` y `/publicidad-corporativa/*` responden **301** a `https://publicidadtalca.cl/`. Las de `/marketing/*` responden 301 a la home de agenciasi.cl. Cuando existan las páginas equivalentes, reemplaza esas reglas por un mapeo exacto (URL vieja → URL nueva de la columna `url_nueva_sugerida`) en `web-express-app/client/public/.htaccess`, para conservar el posicionamiento. Un 301 masivo a la portada es aceptable como paso inicial, pero Google puede tratarlo como "soft 404".

## Checklist Google
1. Publica en publicidadtalca.cl las páginas prioritarias primero (Talca, Curicó, Linares, Cauquenes).
2. Envía el sitemap de publicidadtalca.cl en Search Console.
3. En la propiedad de agenciasi.cl, revisa "Páginas" → las URLs viejas irán apareciendo como "Página con redirección" (es lo esperado).
4. Actualiza la ficha de Google Business Profile de Publicidad Talca con la URL nueva.
