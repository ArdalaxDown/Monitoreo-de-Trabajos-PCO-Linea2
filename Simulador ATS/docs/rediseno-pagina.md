# Propuesta de Rediseño UI/UX: Sala de Control HMI y Descubrimiento Arcade

**Proyecto:** Simulador ATS — Metro de Lima Línea 2 (OCIR / PCO)  
**Rol:** Diseñador UI/UX Principal (Sistemas HMI & Game-Feel)  
**Alcance:** `index.html`, `styles.css` y capa de interacción visual en `simulator.js` (`#track-svg`, `#modal-easter-eggs`).

---

## 1. Diagnóstico Visual Actual (Qué resta profesionalismo hoy)

1. **Doble hoja de estilos en conflicto (`!important` masivos):** `index.html` inyecta `<style id="awesome-design-system-theme">` con más de 90 declaraciones `!important` que pisan `styles.css`, generando bordes gruesos (`1.5px–2px`), gradientes saturados y resplandores neón impropios de una consola SCADA/HMI real.
2. **Identidad de marca Línea 2 incorrecta:** La insignia `.brand-badge` ("L2") usa un gradiente azul (`#0284c7`) con texto blanco, ignorando la identidad oficial de la Línea 2 del Metro de Lima (**fondo amarillo y letras rojas**).
3. **Abuso de `backdrop-filter: blur(18px–20px)` y sombras pesadas:** Cabecera, barra de fichas, dock inferior, quickcard y menú contextual aplican desenfoques de radio alto y `box-shadow` múltiples que penalizan el compositing GPU durante el paneo/zoom del SVG.
4. **Ruido cromático en barra de herramientas y modales:** Botones con degradados chillones (verde esmeralda inline en `#btn-open-ptsa-tab`, marrón en `.btn-import-spco`, fucsia/violeta en `#modal-easter-eggs`) compiten con las alertas operativas de la vía.
5. **Controles por debajo del umbral táctil/accesible:** `.btn-table-action` (`22px` de alto), `.vp-control-btn` (`34×34px`) y `.sector-toggle-btn` incumplen el mínimo ergonómico de `36px` y carecen de `:focus-visible` nítido para teclado.
6. **Huevos de pascua invasivos o indescubribles:** Hoy `.platform-box` y `.pozo-group` disparan audios al clic directo sobre la infraestructura (compitiendo con el arrastre de fichas), mientras el botón `#btn-open-easter-eggs` está oculto (`display: none !important`) sin pista visual de progreso.

---

## 2. Sistema Visual Propuesto (Tokens CSS en `:root`)

Inspirado en consolas ferroviarias Hitachi Rail STS y HUDs tácticos de estrategia (*Advance Wars* / *Into the Breach*): superficies pizarra mate, bordes de `1px`, acentos semánticos estrictos y cero desenfoques costosos.

```css
:root {
  /* Superficies HMI (Pizarra Profundo Mate — Sin Blur Pesado) */
  --bg-app: #070b12;             /* Lienzo del plano esquemático */
  --bg-panel: #0c1320;           /* Cabecera, toolbar, dock y modales */
  --bg-card: #121c2e;            /* Tarjetas de telemetría, celdas e inputs */
  --bg-elevated: #18263e;        /* Hover de filas, botones y menús */
  --border-subtle: #1e2f4a;      /* Divisor estructural de 1px */
  --border-focus: #38bdf8;       /* Anillo de foco accesible (2px) */

  /* Marca Oficial Línea 2 y Acentos Operativos */
  --brand-l2-bg: #facc15;        /* Amarillo oficial Línea 2 (Fondo Logo) */
  --brand-l2-text: #dc2626;      /* Rojo oficial Línea 2 (Letras Logo) */
  --accent-cyan: #38bdf8;        /* Operación nominal / Vehículos / Foco */
  --accent-amber: #f59e0b;       /* Personal en vía / Precaución */
  --accent-green: #10b981;       /* Zona segura / Catenaria conforme */
  --accent-red: #ef4444;         /* Alerta crítica / Prohibición / Corte 0V */

  /* Tipografía y Jerarquía (Contraste WCAG AA >= 4.5:1) */
  --text-main: #f1f5f9;          /* Texto primario (13.8:1 sobre --bg-panel) */
  --text-secondary: #cbd5e1;     /* Datos de tabla y formularios (10.2:1) */
  --text-muted: #94a3b8;         /* Etiquetas técnicas y cabeceras (5.6:1) */
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;

  /* Escala de Espaciado, Radios y Sombras Ligeras */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;  --space-4: 16px;  --space-5: 24px;
  --radius-sm: 4px;              /* Badges, inputs y botones de tabla */
  --radius-md: 6px;              /* Botones de barra, chips y tarjetas */
  --radius-lg: 8px;              /* Modales y quickcard */
  --shadow-sm: 0 2px 6px rgba(0, 0, 0, 0.45);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.65);
}
```

- **Escala tipográfica:** H1 de sistema `13px` (`700`, `letter-spacing: 0.8px`); subtítulos y pestañas `11px` (`600`, mayúsculas); celdas de tabla e inputs `12px` (`400/600`); telemetría, permisos `SPV-…`, reloj y tramos en `--font-mono` con `font-variant-numeric: tabular-nums`.

---

## 3. Cabecera (`#sys-header`) y Logo Oficial Línea 2

1. **Insignia `.brand-badge` ("L2"):** Adopta **fondo amarillo (`--brand-l2-bg: #facc15`)** y **letras rojas (`--brand-l2-text: #dc2626`)**, `font-weight: 900`, `font-size: 14px`, `padding: 4px 10px`, `border-radius: var(--radius-sm)`, con borde interior rojo sutil (`1px solid rgba(220, 38, 38, 0.35)`) para máxima nitidez.
2. **Título sobrio:** Se elimina el texto con gradiente transparente y `text-shadow` neón en `.brand-title h1`; pasa a blanco sólido `--text-main` (`13px`) y subtítulo en `--text-muted` (`10.5px`).
3. **Telemetría compacta y Contador de Secretos:** Las tarjetas `.telemetry-card` reducen su altura a `36px` con fondo `--bg-card` y borde `1px solid var(--border-subtle)`. El botón `#btn-open-easter-eggs` permanece visible de forma discreta como pastilla técnica (`🕵️ Secretos: 0/8`) en tono pizarra/ámbar, integrándose al HUD sin colores fucsias.
4. **Watchdog y Reloj:** `.rgb-triangle-beacon` reemplaza el ciclo arcoíris gamer por un pulso verde/cian técnico; `#clock-display` usa `--font-mono` sobre `--bg-app`.

---

## 4. Paneles, Tabla y Modales: Qué Cambia en Cada Uno

- **Eliminación de `<style id="awesome-design-system-theme">`:** Todas las reglas se consolidan en `styles.css` sin `!important`, reduciendo la altura combinada de `#sys-header` (`48px`) + `#monopoly-toolbar` (`56px`) de `128px` a **`104px`** (+24 px verticales para el plano `#track-svg`).
- **Barra de fichas (`#monopoly-toolbar`):**
  - `.pegman-chip` (`height: 42px`): superficie `--bg-card`, borde fino `1px solid var(--border-subtle)` e indicador lateral izquierdo de `4px` (`--accent-amber` para Personal a Pie, `--accent-cyan` para Vehículo Auxiliar).
  - `.action-btn` (`min-height: 36px`): estilo industrial unificado (`background: var(--bg-card)`, `border: 1px solid var(--border-subtle)`, texto `--text-main`). El color de acento se reserva al ícono o borde izquierdo (`3px`): cian en Catenaria, ámbar en Importar/Reporte SPCO, verde en PTSA (eliminando su `style` inline) y rojo suave al hover en Despejar Vía.
- **Tabla de trabajos (`#bottom-dock` y `.work-table`):**
  - Cabecera sticky en `--bg-app` con bordes inferiores de `1px`. Filas compactas (`height: 40px`) con códigos de permiso (`SPV-…`), radio TETRA y horas en `--font-mono`.
  - Botones de fila `.btn-table-action` suben a `min-height: 36px` (`padding: 6px 10px`), agrupados con `gap: 6px` y foco `:focus-visible`.
- **Modales (`.modal-overlay` y `.modal-window`):**
  - Overlay en `rgba(5, 9, 16, 0.82)` **sin `backdrop-filter`** para proteger los 60 FPS del lienzo SVG.
  - `#modal-group-scope` y `#modal-ramal-conexion`: botones de selección de vía (`Solo V1`, `Solo V2`, `D1`, `D2`) rediseñados como tarjetas de comando de `40px` de alto con insignia cromática de vía (`V1` verde, `V2` cian, `D1/D2` ámbar).
  - `#modal-import-spco`: `.spco-input` con borde `--border-subtle` y foco `--border-focus`; chips `.spco-chip` y tabla `.spco-table` alineados a la paleta semántica (`--accent-green`, `--accent-amber`, `--accent-red`).
  - `#modal-daily-sheet`: mantiene la hoja A4 blanca (`.printable-sheet-paper`), pero actualiza `.official-logo-badge` al **fondo amarillo `#facc15` y texto rojo `#dc2626`** institucional.
  - `#token-quickcard`: ancho fijo `420px`, sin `backdrop-filter`, borde `1px solid var(--border-subtle)` con cabecera superior acentuada según el tipo de ficha y botones inferiores de `36px`.

---

## 5. Huevos de Pascua: Capa de Hotspots, Audio 8-Bit Legal y Descubrimiento

### Arquitectura No Invasiva en `#track-svg`
- Se añade `<g id="easter-hotspots-layer">` **debajo de `#dynamic-entities-layer`** y fuera de los carriles de vía (`Y=220` y `Y=330`).
- Cada hotspot es un micro-nodo SVG (`18×18px`, `opacity: 0.32` en reposo) con anillo `.hotspot-ring` que emite un pulso suave (`transform: scale(1.18)`, `opacity: 0.95`) solo en `:hover` o `:focus-visible`.
- Durante el arrastre de fichas (`body.is-dragging-token`), `#easter-hotspots-layer` aplica `pointer-events: none`, garantizando **cero interferencia** con el drop, clic derecho (`.token-hitbox`) o cartelas. Se eliminan los listeners de pascua sobre `.platform-box` y `.pozo-group` completos.

### Mapa de los 8 Hotspots en `#track-svg` (`viewBox="0 -65 3550 585"`)

| # | Tema | Ubicación en Plano (Coords SVG aprox.) | Melodía 8-Bit Original (Web Audio) + Enlace Oficial | Reacción Visual de Personajes y Vía |
| :- | :--- | :--- | :--- | :--- |
| **1** | **Pokémon** | **Pozo PV20** (`x=895, y=32`, junto a torre superior) — Ícono Pokéball pixel. | *Arpegio Monster Encounter* (onda cuadrada inspirada en batalla GBC) + link externo a YouTube/Spotify oficial. | Pokéball rebota 3 veces; cuadrillas cercanas saltan con emote `⚡` y chispas amarillas (`.pikachu-storm`). |
| **2** | **Dragon Ball Z** | **Bretelle E21 Oeste** (`x=1040, y=170`, sobre cruce en X) — Esfera de 4 estrellas. | *Riff Heroico Shonen 8-bit* (homenaje rítmico original a *Cha-La*) + link externo oficial. | Al activarlo o clic en operario con modo activo: aura dorada (`.saiyan-aura` con `opacity/transform`) y esfera Ki. |
| **3** | **Navidad L2** | **Estación E21 Óvalo Sta. Anita** (`x=1260, y=86`, sobre badge) — Pino LED. | *Villancico Chiptune Campanillas* (dominio público en onda triangular). | Guirnaldas temporales en andenes E20–E24 (`6s`) y gorro navideño (`.santa-pompon`) en cuadrillas activas. |
| **4** | **Super Mario** | **Paragolpes Oeste PV19** (`x=44, y=172`, sobre topera) — Bloque `[?]`. | *Fanfarria Star Power 8-bit* (síncopa original estilo NES) + link externo oficial. | Moneda salta del bloque (`coin`); dresinas y cuadrillas alternan tinte arcoíris y salto corto (`.starman-rainbow`). |
| **5** | **The Legend of Zelda** | **Paragolpes Este PV24** (`x=3514, y=172`, sobre topera final) — Cofre / Trifuerza. | *Arpegio Misterio del Bosque* (vals 3/4 en onda triangular estilo ocarina) + link externo oficial. | Se abre el cofre con destello esmeralda; las cuadrillas alzan su herramienta como ítem legendario (`2.5s`). |
| **6** | **Pac-Man** | **Estación E22 Colectora Ind.** (`x=1900, y=402`, bajo andén V1) — Cereza arcade. | *Interludio Arcade Maze* (bajo synth + `waka-waka` alternante) + link externo oficial. | Burbuja `.pacman-mouth` sobre vehículos auxiliares mientras recorren su tramo asignado. |
| **7** | **Sonic the Hedgehog** | **Cambiavías CV-02** (`x=2120, y=170`, sobre aguja) — Anillo dorado giratorio. | *Chime de Anillos + Riff Speed Zone 16-bit* (FM/square original) + link externo oficial. | 3 anillos giran y suben; las dresinas muestran estela azul supersónica durante `4s`. |
| **8** | **Tetris / Evangelion** | **Torre Control PTSA** (`x=3304, y=-42`, antena del taller) — Tetrominó `T` / Hexágono AT. | *Danza Rusa Korobeiniki 8-bit* (arreglo tradicional de dominio público) + link externo a versión oficial. | Bloques holográficos se encajan sobre el techo de PTSA y las cuadrillas celebran en sincronía. |

### Pista de Descubrimiento y Modal `#modal-easter-eggs`
- **Cabecera:** El botón `#btn-open-easter-eggs` muestra `👾 Secretos: X/8` (persistido en `localStorage`). Al descubrir un hotspot nuevo, el contador destella en ámbar y desbloquea su tarjeta en la Sala Arcade.
- **Rediseño de `#modal-easter-eggs`:** Sustituye el fondo púrpura chillón por estética **Dark Arcade Cabinet** (`--bg-panel`, bordes `--border-subtle`, acentos ámbar/cian). Cada tarjeta muestra: estado (`🔒 Pista de ubicación` vs. `✓ Descubierto`), botón `▶ Chiptune 8-bit` (Web Audio local libre de derechos) y enlace externo `↗ Escuchar tema oficial (YouTube / Spotify)` con `target="_blank" rel="noopener noreferrer"`.

---

## 6. Lista Priorizada de Cambios para el Frontend (Máximo 12)

1. **[P1] Unificar CSS y eliminar `<style id="awesome-design-system-theme">`:** Migrar reglas limpias a `styles.css`. *Criterio:* `index.html` no contiene etiquetas `<style>` internas y `styles.css` define los tokens `:root` de la Sección 2.
2. **[P1] Aplicar identidad oficial al logo `.brand-badge` ("L2") y hoja SPCO:** *Criterio:* `.brand-badge` y `.official-logo-badge` tienen `background-color: var(--brand-l2-bg)` (`#facc15`) y `color: var(--brand-l2-text)` (`#dc2626`).
3. **[P1] Eliminar `backdrop-filter` pesados y animaciones de layout:** *Criterio:* Ningún selector en `styles.css` usa `backdrop-filter: blur()` mayor a `0` sobre el lienzo ni anima `height`/`width`/`top`/`left` en bucle.
4. **[P1] Compactar `#sys-header` (`48px`) y `#monopoly-toolbar` (`56px`):** *Criterio:* La suma de alturas de `header + nav` es `<= 104px` en desktop.
5. **[P2] Estandarizar tamaños táctiles (`>= 36px`) y `:focus-visible`:** *Criterio:* `.action-btn`, `.btn-table-action`, `.vp-control-btn`, `.sound-toggle-btn` y `.nav-pill` cumplen `min-height: 36px` y muestran `outline: 2px solid var(--border-focus)` al navegar con `Tab`.
6. **[P2] Normalizar paleta de botones en `#monopoly-toolbar`:** Eliminar estilo inline de `#btn-open-ptsa-tab` y gradientes saturados. *Criterio:* Todos los `.action-btn` usan `--bg-card` con indicador cromático lateral o de ícono.
7. **[P2] Rediseñar tabla `#work-table` con tipografía tabular:** *Criterio:* Columnas `Permiso`, `Radio TETRA`, `Hora Ingreso` y `Hora Salida` aplican `font-family: var(--font-mono)` y `font-variant-numeric: tabular-nums`.
8. **[P2] Homogeneizar modales operativos (`#modal-group-scope`, `#modal-ramal-conexion`, `#modal-import-spco`):** *Criterio:* `.modal-window` usa `--bg-panel`, borde `1px solid var(--border-subtle)` y botones de alcance de `min-height: 38px`.
9. **[P3] Crear capa `<g id="easter-hotspots-layer">` en `#track-svg`:** Insertar los 8 hotspots en las coordenadas de la Sección 5 antes de `#dynamic-entities-layer`. *Criterio:* Existen 8 nodos `.easter-hotspot` con `tabindex="0"` y regla `body.is-dragging-token #easter-hotspots-layer { pointer-events: none; }`.
10. **[P3] Desacoplar clics de pascua de andenes y pozos:** *Criterio:* `initEasterEggs()` ya no registra listeners `click` sobre `.platform-box`, `.station-pill-badge` ni `.pozo-group` completos, sino únicamente en `.easter-hotspot`.
11. **[P3] Mostrar contador `Secretos: X/8` en `#btn-open-easter-eggs`:** *Criterio:* `#btn-open-easter-eggs` es visible por defecto (`display: inline-flex`) y actualiza su texto `Secretos: X/8` al activar cada hotspot.
12. **[P3] Rediseñar `#modal-easter-eggs` con enlaces oficiales externos:** *Criterio:* Las 8 tarjetas muestran pista de ubicación, botón `[data-song]` Web Audio original y enlace `<a target="_blank" rel="noopener noreferrer">` a YouTube/Spotify sin archivos `.mp3`/`.ogg` incrustados.

---

## 7. Matriz de Riesgos y Mitigación

- **Rendimiento (GPU / 60 FPS):** Los filtros `drop-shadow` animados en `.saiyan-aura` o `.pikachu-storm` y los `backdrop-filter: blur(20px)` degradan el frame rate al mover el SVG. *Mitigación:* Prohibir `backdrop-filter` en paneles; implementar auras de personajes con nodos SVG superpuestos animados solo con `transform: scale()` y `opacity`, respetando `@media (prefers-reduced-motion: reduce)`.
- **Interferencia con clic derecho, cartelas y arrastre:** Un hotspot sobre `Y=220` o `Y=330` bloquearía `.token-hitbox` o el drop de tramos. *Mitigación:* Ubicar los 8 hotspots en cotas exteriores (`Y <= 175` o `Y >= 400`), colocar `#easter-hotspots-layer` debajo de `#dynamic-entities-layer` y desactivar su `pointer-events` durante cualquier drag.
- **Accesibilidad (WCAG AA y teclado):** Textos pequeños o botones de `22px` dificultan la operación en sala de control. *Mitigación:* Garantizar contraste `>= 4.5:1` (`--text-muted: #94a3b8` sobre `#0c1320` da `5.6:1`), botones `>= 36px` y hotspots navegables con `Tab` + `Enter`.
- **Derechos de autor de la música:** Incrustar grabaciones o transcripciones literales con copyright expone el proyecto a reclamos legales. *Mitigación:* Sintetizar únicamente arreglos chiptune originales breves ("sound-alikes" evocadores o melodías de dominio público como *Korobeiniki* y villancicos) mediante `AudioContext`, ofreciendo enlaces externos a YouTube/Spotify para escuchar las obras oficiales.
