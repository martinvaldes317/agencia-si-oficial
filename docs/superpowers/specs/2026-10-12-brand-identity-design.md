# Rebrand: nueva línea gráfica AgenciaSI

## Contexto

El usuario compartió una guía maestra de marca (PDF, 26 páginas, "agenciasi-guia-maestra-v06.pdf", v06, octubre 2026) y pidió implementar la nueva línea gráfica en el sitio público (`web-express-app`). La guía completa cubre estrategia de negocio de punta a punta; este trabajo cubre solo la porción de identidad visual: símbolo, paleta, tipografía y el logo entregado por la diseñadora — no la estrategia de contenido comercial ni los casos de estudio (NowPOS/MOVERSER/Consonancia), que el usuario ya dijo que armará en una pasada separada junto a la estrategia de contenido.

Alcance: el sitio público (Home, `/web`, `/web/:ciudad` ×29, `/agencia/:ciudad` ×29, `/servicios/*` ×3, `/sitio-web` funnel, `/links`, `/legal/*`, el widget de accesibilidad). Fuera de alcance: paneles internos (`/admin/*`, `/portal/*`), que usan un sistema de marca aparte (`styles/brand-dark.css`, prefijo `bd-`) y no fueron mencionados por el usuario.

## Decisiones ya tomadas (confirmadas por el usuario)

1. El archivo del isotipo ya existe: `isotipo.svg` en la raíz del repo (grid de 9 módulos curvos + "destello", fill único `#3e5aa5`).
2. El gradiente azul→violeta (`#3d5afe → #8b5cf6`) se reemplaza por azul plano en todo el sitio — sin gradientes, fiel a la guía.
3. Los fondos del toggle día/noche pasan de negro/blanco puro a Carbón (`#171B20`, oscuro) y Blanco cálido (`#F6F5F0`, claro). La lógica del toggle (hora de Chile por defecto, override manual persistido) no cambia.
4. El fill del isotipo se ajusta a `#3459ED` exacto (Azul conexión oficial de la guía), en vez del `#3e5aa5` que trae el archivo.
5. La tipografía se reemplaza por completo: Rubik (títulos y texto) + Source Code Pro (solo etiquetas/diagramas, sin uso obligatorio inmediato), reemplazando Poppins + Playfair Display + Oswald.
6. El logo final es un lockup ícono + texto: el isotipo junto al nombre "AgenciaSi" escrito en Rubik Bold — no ícono solo, no texto solo.

## Paleta

| Token | Valor | Rol |
|---|---|---|
| Carbón | `#171B20` | Fondo modo oscuro (reemplaza `#000000`) |
| Blanco cálido | `#F6F5F0` | Fondo modo claro (reemplaza `#ffffff`) |
| Azul conexión | `#3459ED` | Acento único — reemplaza tanto `--blue` como `--violet`/`--grad` en todos los sistemas de color del sitio. No hay segundo color de acento. |
| Azul niebla | `#E0E7FF` | Superficies suaves (chips, tags, fondos de bloque sutil) en modo claro, y acentos de texto suaves donde hoy se usa `--accent-tx`. |

Estos 4 valores crudos viven en un archivo nuevo, `client/src/theme/brand.js`, como única fuente de verdad:

```js
export const CARBON = '#171B20'
export const BLANCO_CALIDO = '#F6F5F0'
export const AZUL_CONEXION = '#3459ED'
export const AZUL_NIEBLA = '#E0E7FF'
```

### Mapeo de tokens derivados

El sitio hoy no solo tiene 4 colores — cada sistema de tokens deriva paneles, bordes, texto mudo, tints, etc. a partir del fondo y el acento. La regla general: **mantener la misma lógica de derivación que existe hoy (opacidades, mezclas), pero aplicada sobre Carbón/Blanco-cálido/Azul-conexión en vez de negro/blanco/azul-violeta**. Ejemplos concretos sobre `home-dark.css` (el sistema más completo, sirve de plantilla para el resto):

- `--bg`: `CARBON` (dark) / `BLANCO_CALIDO` (light) — antes `#000000` / `#ffffff`.
- `--panel`, `--panel-2`: mismas mezclas de opacidad que hoy, recalculadas sobre Carbón/Blanco-cálido en vez de negro/blanco puro.
- `--line`, `--line-strong`: mismas rgba actuales (`rgba(255,255,255,.09/.16)` dark, `rgba(15,23,42,.10/.16)` light) — no dependen del matiz exacto del fondo, se mantienen.
- `--text`: texto principal — valor claro sobre Carbón, valor oscuro (casi Carbón) sobre Blanco cálido, igual que hoy.
- `--mut`: texto secundario, mismo criterio de opacidad/mezcla que hoy.
- `--blue` y `--violet`: ambos colapsan a `AZUL_CONEXION`.
- `--grad`: deja de ser gradiente — pasa a ser el mismo `AZUL_CONEXION` plano (variables que hoy se usan como `background: var(--grad)` siguen funcionando con un color sólido en vez de un `linear-gradient`).
- `--tint`, `--tint-strong`: igual criterio, sobre el blanco/negro de contraste como hoy.
- `--accent-tx`: pasa a derivarse de `AZUL_NIEBLA` en vez del actual azul-violeta mezclado.
- `--ok-tx`, `--err-tx`: no definidos en la guía de marca (son semánticos, no de marca) — se mantienen sin cambio.

Los 10 archivos con objetos `DARK_T`/`LIGHT_T` propios (`SitioWebLanding.jsx`, `LandingWebSistemas.jsx`, `HomeSEOLocal.jsx`, `ServicioSEOLocal.jsx`, `LandingSEOLocal.jsx`, `Links.jsx`, y el `palette.js`/`DARK_FP`/`LIGHT_FP`) mantienen su misma forma (mismas llaves, mismos consumidores — notablemente `ReceiptAnimation.jsx`, `SitioWebConfirmacion.jsx`, `SitioWebWizard.jsx` importan `DARK_T`/`LIGHT_T` desde `SitioWebLanding.jsx` y no deben romperse). Solo cambian los *valores* de las llaves relacionadas a azul/violeta/fondo, apuntando a las constantes de `theme/brand.js` en vez de hex propios.

Los 2 casos sin soporte de tema (`LegalPage.jsx` dark-only, `AccessibilityWidget.jsx` light-only) solo actualizan su único valor de azul a `AZUL_CONEXION` — no se les agrega soporte de tema nuevo, fuera de alcance.

## Tipografía

- `client/index.html`: reemplazar el `<link>` de Google Fonts actual (Playfair Display + Poppins + Oswald) por `Rubik:wght@400;500;600;700;800` + `Source+Code+Pro:wght@400;500;600`.
- `client/src/index.css`: agregar
  ```css
  :root {
    --font-heading: 'Rubik', sans-serif;
    --font-mono: 'Source Code Pro', monospace;
  }
  ```
  (bloque único, no varía por tema).
- Reemplazar mecánicamente las ~27 referencias literales a `'Poppins'`, `'Playfair Display'`, `'Oswald'` (en CSS vía `font-family:` y en JSX vía `style={{fontFamily: "..."}}`) por `var(--font-heading)`. No hay ningún uso hoy que calce naturalmente con rol de "etiqueta/diagrama", así que `--font-mono` queda definida pero sin aplicar todavía — se usa si aparece un caso natural durante la implementación (ej. algún badge de código).
- Archivos con literales de fuente a tocar: `home-dark.css` (15× Playfair Display + 2× Poppins), `SitioWebLanding.jsx` (12× Oswald + 1× Poppins), `ReceiptAnimation.jsx`, `SitioWebConfirmacion.jsx`, `SitioWebWizard.jsx` (1× Poppins c/u), `LandingWebSistemas.jsx`, `HomeSEOLocal.jsx`, `ServicioSEOLocal.jsx`, `LandingSEOLocal.jsx`, `Links.jsx` (2×), `LegalPage.jsx`, `CookieConsent.jsx`, `a11y/accessibility.css` (1× Poppins c/u).

## Logo y favicon

- Ajustar el fill interno del `isotipo.svg` de `#3e5aa5` a `#3459ED`.
- Generar `favicon.png` (y el tamaño usado por `apple-touch-icon`) a partir del isotipo, fondo transparente.
- Construir el lockup ícono + texto "AgenciaSi" (texto en Rubik Bold) en dos variantes, reemplazando `logo-dark.png` (texto Blanco cálido, para fondo oscuro) y `logo-light.png` (texto Carbón, para fondo claro). El ícono mantiene su azul `#3459ED` en ambas variantes.
- `theme/ThemeLogo.jsx` no cambia de lógica — solo los archivos PNG que referencia.
- Actualizar el JSON-LD `"logo"` en `index.html` si cambia el nombre de archivo del favicon.

## Orden de implementación

Un solo pase sobre todo el sitio público — no por fases visibles en producción (un sitio parcialmente rebrandeado se vería como un bug, no como un rollout gradual):

1. **Fundación**: `theme/brand.js`, fuentes (`index.html` + `index.css`), isotipo ajustado + favicon + logo lockup nuevo.
2. **Home** (`Home.jsx` + `home-dark.css`) — valida el sistema de tokens nuevo en la página más visible antes de replicar el patrón.
3. **Bloque SEO**: `/web` (`LandingWebSistemas.jsx`), `/web/:ciudad` ×29 y `/agencia/:ciudad` ×29 (`LandingSEOLocal.jsx`, `HomeSEOLocal.jsx` — comparten plantilla, no son 58 ediciones individuales), `/servicios/*` ×3 (`ServicioSEOLocal.jsx`).
4. **Funnel `/sitio-web`**: `SitioWebLanding.jsx`, `ReceiptAnimation.jsx`, `SitioWebConfirmacion.jsx`, `SitioWebWizard.jsx`, `landing/palette.js`, `landing/sitio-web-dark.css`.
5. **Sueltos**: `Links.jsx`, `legal/LegalPage.jsx`, `legal/CookieConsent.jsx`, `a11y/AccessibilityWidget.jsx` + `a11y/accessibility.css`.
6. **Build y despliegue**: `npm run build`, limpiar archivos ` 2` de iCloud en `dist/`, commit de fuente, commit de `dist/` rebuildeado, push, verificación en vivo con Playwright.

## Testing

Visual, con capturas Playwright en modo claro y modo oscuro para cada grupo de páginas del orden de arriba. Atención específica a la clase de bug que ya mordió esta sesión dos veces: elementos "siempre oscuros" por diseño (`.hd-win`, `.hd-chip`, `.hd-glow-in`, `.hd-wa-tip`) que usan colores literales en vez de `var(--text)`/`var(--mut)` — revisar que esos literales sigan siendo legibles contra la paleta nueva (texto claro fijo sobre Carbón fijo, no sobre blanco-cálido). Verificación final en producción: Home, una página `/web/:ciudad`, `/sitio-web`, `/legal/*`, en ambos modos.

## Fuera de alcance (explícito)

- Paneles internos (`/admin/*`, `/portal/*`) y su sistema `styles/brand-dark.css` (`bd-*`).
- Casos de estudio reales (NowPOS/MOVERSER/Consonancia) y demo de automatización — el usuario los hará junto a la estrategia de contenido comercial, en una pasada separada.
- Agregar soporte de tema (claro/oscuro) a `LegalPage.jsx` o `AccessibilityWidget.jsx` — se actualiza su único valor de azul, no se les agrega el toggle.
- Aplicación de `--font-mono` (Source Code Pro) a algún elemento específico — queda definida pero sin un caso de uso forzado en esta pasada.
