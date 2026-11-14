# Propuesta de Diseño UI/UX: Personajes en Vía y Dresinas (`#track-svg`)

**Proyecto:** Simulador ATS — Metro de Lima Línea 2  
**Rol:** Diseñador UI/UX (Interfaces HMI y Estética Arcade Retro)  
**Alcance:** `renderCrewVisualModel`, `renderVehicleVisualModel` y contenedores de fichas (`.crew-token`, `.vehicle-token`) en SVG inline (`40×40 px` ref. para cuadrillas, pies en `y ≈ 15`).

---

## 1. Diagnóstico Visual Actual

1. **Siluetas de cuadrilla saturadas y poco diferenciables a escala extrema (`0.65x` a `2.2x`):**
   - Cinco de los diez modelos (`0, 1, 5, 6, 8`) incluyen un segundo operario diminuto en `.crew-companion-group` (`x ≈ -16`). Al alejar el zoom, el compañero se funde con el operario principal y con el cono izquierdo (`x = -24`), formando una mancha visual confusa.
   - Los trazos finos (`stroke-width: 0.6–0.9`) desaparecen a `0.65x` y ensucian la lectura en vista general.
2. **Desconexión entre estado dinámico y herramientas (`.crew-tamper-tool`, `.crew-patrol-tool`, `.crew-safe-thumbsup`):**
   - Solo el Modelo 0 asigna la clase `.crew-tamper-tool` a su herramienta de trabajo. Los Modelos 1–9 usan `style="display:${isWorking ? 'block' : 'none'}"` estático al renderizar el DOM, por lo que sus herramientas no aparecen/desaparecen en el bucle de 60 FPS cuando cambia `crew.isWorking`, y ningún modelo renderiza `.crew-patrol-tool` (marcha) ni `.crew-safe-thumbsup` (andén seguro).
   - Los Modelos 5 y 7 tienen piernas flexionadas/sentadas (`y = 2..11`), lo que deforma el giro procedimental `rotate(±22deg, ±3, 4)` al caminar.
3. **Baja diferenciación cromática entre Cuadrillas y Dresinas:**
   - Varias cuadrillas visten azul (`#0284c7`, `#1e3a8a` en modelos 3, 4, 5, 7) y varias dresinas usan naranja/amarillo (`#ea580c`, `#f59e0b` en modelos 0, 1, 9), rompiendo la regla rápida de lectura HMI: **Naranja/Ámbar = Personal a pie** vs. **Cian/Azul Acero = Vehículo auxiliar**.
4. **Colisión visual entre el halo de permiso (`colorGrupoPermiso`) y el estado en base:**
   - En `.crew-token` se apilan tres elipses concéntricas en `cy="15"` (halo de grupo, sombra negra y brillo ámbar/verde). Las paletas de grupo (`#fb923c`, `#facc15`) se confunden con el resplandor de vía ocupada/trabajo.

---

## 2. Paleta Propuesta y Tokens Visuales (CSS Custom Properties)

Se definen tokens en `:root` dentro de `styles.css` para asegurar contraste WCAG AA sobre el fondo HMI (`#0a121e`) y separar semánticamente personas, vehículos y grupos de permiso:

```css
:root {
  /* Superficie y Cartelas HMI */
  --token-bg-plate: #070d17;
  --token-plate-border-work: #f59e0b;
  --token-plate-border-safe: #10b981;
  --token-plate-border-veh: #38bdf8;
  --token-shadow-contact: rgba(2, 6, 23, 0.78);

  /* Cuadrillas a Pie (Dominante Cálida Alta Visibilidad) */
  --crew-vest-hi-vis: #ff6b1a;      /* Naranja flúor principal */
  --crew-vest-stroke: #9a3412;      /* Contorno oscuro para separar del fondo y riel */
  --crew-reflective-band: #f8fafc;  /* Banda reflectante blanca/plata */
  --crew-pants-dark: #1e293b;       /* Pantalón azul noche uniforme (pivote limpio) */
  --crew-boots-steel: #451a03;      /* Botas de seguridad */

  /* Variantes por Rol (Solo en Casco y Acento Secundario, manteniendo chaleco cálido) */
  --helmet-track-yellow: #facc15;   /* Vía y obras (M0, M2, M6, M8) */
  --helmet-super-white: #f8fafc;    /* Supervisión / ATS / Telecom (M1, M7) */
  --helmet-elec-cyan: #38bdf8;      /* Catenaria y Ultrasonido (M3, M4) */
  --helmet-safety-red: #ef4444;     /* Mecánica de agujas y Guardavías (M5, M9) */

  /* Dresinas / Vehículos Auxiliares (Dominante Fría Industrial) */
  --veh-chassis-dark: #0f172a;
  --veh-body-primary: #0284c7;      /* Azul ferroviario técnico */
  --veh-body-secondary: #1e293b;    /* Grafito blindado */
  --veh-accent-cyan: #38bdf8;       /* Perfilería y balizas de lectura rápida */
  --veh-hazard-amber: #f59e0b;      /* Franjas de gálibo y parachoques */
}
```

### Convivencia con `colorGrupoPermiso`:
- **Separación espacial y geométrica:** El halo de grupo en la base pasa de ser una elipse rellena difusa a un **anillo segmentado nítido** (`fill="none" stroke="${colorGrupoPermiso}" stroke-width="2.2" stroke-dasharray="6 3" rx="22" ry="5.5"`). Así no se mezcla con la sombra de contacto (`rx="13"`) ni con el color del chaleco.
- **Indicador en cartela:** La cartela mantiene el borde del estado operativo (`#f59e0b` en vía, `#10b981` en andén) y añade a la izquierda una **pastilla lateral sólida de `6×17 px`** con el `colorGrupoPermiso`, garantizando accesibilidad por posición y forma además del color.

---

## 3. Propuesta de Siluetas para los 10 Modelos de Cuadrilla (`40×40 px`, pies en `y = 15`)

**Reglas comunes de arquitectura SVG para los 10 modelos:**
- Todos mantienen piernas verticales estándar en `.crew-leg-left` (`x: -5..-1, y: 4..15`) y `.crew-leg-right` (`x: 1..5, y: 4..15`) para que la rotación en `(±3, 4)` nunca se rompa.
- `.crew-companion-group` deja de ser una segunda persona humana y pasa a ser un **hito/equipo estático de apoyo en suelo** (`x: -16`), limpiando la silueta principal.
- Todos incluyen los 3 nodos dinámicos: `.crew-tamper-tool` (visible al trabajar), `.crew-patrol-tool` (visible al caminar) y `.crew-safe-thumbsup` (visible en zona segura).

| Modelo | Rol Ferroviario | Casco / Distintivo Corporal | `.crew-companion-group` (Hito en `-16`) | `.crew-tamper-tool` (Trabajo) / `.crew-patrol-tool` (Marcha) |
| :--- | :--- | :--- | :--- | :--- |
| **M0** | **Bateador de Vía** | Casco amarillo con orejeras negras anchas; arnés en X blanco. | Baliza triangular y bidón de combustible. | **Trabajo:** Bateadora vertical bicilíndrica con `.crew-work-sparks`. **Marcha:** Llave de tirafondos al hombro. |
| **M1** | **Inspector ATS** | Casco blanco con visor cian; antena de radio alta en hombro izquierdo. | Maletín rígido de diagnóstico amarillo en suelo. | **Trabajo:** Tablet rugerizada con haz `.surveyor-laser-beam`. **Marcha:** Linterna de inspección. |
| **M2** | **Soldador Aluminotérmico** | Careta cuadrada negra con visor ámbar brillante; mandil marrón sobre chaleco naranja. | Carrito vertical de 2 botellas (O₂ azul / gas rojo). | **Trabajo:** Crisol sobre riel + soplete y cascada `.crew-work-sparks`. **Marcha:** Piqueta escoriadora. |
| **M3** | **Técnico Ultrasónico** | Casco cian con arco de auriculares amarillos grandes. | Caja registradora ultrasónica con antena corta. | **Trabajo:** Carrito palpador Sperry empujado al frente con haz verde. **Marcha:** Calibre de perfil de riel. |
| **M4** | **Liniero Catenaria 1500V** | Casco cian; guantes dieléctricos amarillos sobredimensionados. | Terno de puesta a tierra con cartel `⚡`. | **Trabajo:** Pértiga amarilla diagonal hacia arriba (`y = -24`) con destello azul. **Marcha:** Pértiga plegada horizontal. |
| **M5** | **Mecánico de Agujas** | Casco rojo; cinturón portaherramientas grueso en cintura. | Caja metálica roja desplegable en traviesa. | **Trabajo:** Llave dinamométrica larga acoplada al riel. **Marcha:** Aceitera de caño largo. |
| **M6** | **Topógrafo Geodésico** | Casco amarillo con banda blanca; chaleco naranja con cuello alto. | Prisma reflector circular sobre bastón bicolor. | **Trabajo:** Trípode alto con Estación Total verde y láser rojo. **Marcha:** Trípode plegado al brazo. |
| **M7** | **Ing. Fibra Óptica** | Casco blanco con lupa monocular cian; mochila técnica cuadrada a la espalda. | Bobina circular amarilla de cable de fibra. | **Trabajo:** Mesa plegable con fusionadora y arco blanco `.crew-work-sparks`. **Marcha:** Detector óptico OTDR. |
| **M8** | **Operador Tronzadora** | Casco amarillo con pantalla facial transparente cian y peto protector. | Extintor rojo vertical con manómetro. | **Trabajo:** Cortadora de disco `r=6` sobre riel + abanico `.crew-work-sparks`. **Marcha:** Disco abrasivo en mano. |
| **M9** | **Guardavías / Vigía** | Casco rojo con baliza superior blanca; chaquetón con doble franja reflectante. | Par de linternas de balizamiento rojas en base. | **Trabajo:** Disco octogonal `STOP` elevado (`y = -16`) y farol rojo. **Marcha:** Banderín rojo enrollado. |

---

## 4. Propuesta para Dresinas y Vehículos Auxiliares (`renderVehicleVisualModel`)

- **Identidad cromática unificada (Familia Cian/Azul Acero + Acentos Ámbar):**
  - Se reserva el naranja puro para las cuadrillas a pie. Todas las dresinas adoptan chasis `#0f172a` con faldón de seguridad `url(#hazard-stripes)`, carrocería principal en gama fría técnica (`#0284c7`, `#0369a1`, `#1e293b` o `#f1f5f9` con franja `#0284c7`) y contornos exteriores `#38bdf8` de `1.5px` para resaltar sobre el fondo oscuro `#0a121e`.
- **Silueta asimétrica direccional clara (Cabina a la derecha `x > +10`, Equipo de faena a la izquierda `x < 0`):**
  - **Cabina (`x: +8 a +50`):** Perfil trapezoidal inclinado con parabrisas polarizado `url(#veh-glass-polar)`, faro frontal doble en `x = 48..52` conectado visualmente al cono `.headlight-beam`, y baliza superior estroboscópica ámbar/cian.
  - **Ruedas y bogies (`y = 13`):** Dos juegos de bogies bien separados (`x = -34` y `x = +34`) con pestaña brillante `#cbd5e1` y cruceta interior `.veh-wheel-spoke` de `stroke-width: 1.5` para que el giro se perciba incluso a zoom alejado.
  - **Eliminación de `filter="drop-shadow(...)"` inline:** En los Modelos 3 y 7 se sustituyen los filtros CSS por un círculo concéntrico semitransparente (`r="4" fill="#facc15" opacity="0.3"`), manteniendo el efecto de brillo a coste cero de GPU.

---

## 5. Mejoras de Iluminación, Sombra de Contacto y Cartela

1. **Sombra de contacto (`Grounded Shadow`):**
   - Cuadrillas: Elipse única sólida `cx="0" cy="15.5" rx="13" ry="3"` en `rgba(2, 6, 23, 0.82)` justo debajo de las botas. Elimina el efecto de "personaje flotando" sobre el riel.
   - Dresinas: Elipse alargada `cx="0" cy="16" rx="50" ry="4"` en `rgba(2, 6, 23, 0.85)`.
2. **Haz de linterna frontal (`.crew-flashlight-beam`) y reflejo en vía:**
   - Rediseñar el polígono actual (`points="4,-10 34,-18 34,2"`) usando un `<linearGradient id="crew-beam-grad">` compartido en `<defs>` (de `rgba(254, 240, 138, 0.38)` en `0%` a `rgba(254, 240, 138, 0)` en `100%`), más una pequeña elipse de impacto lumínico sobre el riel (`cx="26" cy="14" rx="8" ry="2" fill="rgba(254, 240, 138, 0.25)"`).
3. **Cartela de alta legibilidad (`y = -38`):**
   - Dimensiones: `x="-72" y="-38" width="144" height="18" rx="4"`, fondo `#070d17` (opacidad `0.94`), borde `1.4px`.
   - Si tiene `colorGrupoPermiso`, se dibuja un bloque lateral izquierdo `<rect x="-72" y="-38" width="6" height="18" rx="2" fill="${colorGrupoPermiso}" />` y el anillo discontinuo en la base, dejando el borde principal de la cartela para el estado (`#f59e0b` en vía / `#10b981` en andén).
   - El globo `.crew-retro-bubble` sube ligeramente a `transform="translate(0, -60)"` para no pisar nunca el borde superior de la cartela.

---

## 6. Lista Priorizada de Cambios (con Criterios de Aceptación)

1. **Unificar clases de estado de herramientas en los 10 modelos de cuadrilla (`.crew-tamper-tool`, `.crew-patrol-tool`, `.crew-safe-thumbsup`):**
   - *Criterio de aceptación:* En los 10 modelos (`mIdx 0..9`), el grupo de herramienta de trabajo tiene la clase `.crew-tamper-tool`, existe un elemento `.crew-patrol-tool` para la marcha y un icono `.crew-safe-thumbsup` para zona segura; al alternar `crew.isWorking` e `inSafeZone` en tiempo real, los 3 elementos conmutan su visibilidad sin recargar el DOM.
2. **Estandarizar geometría de piernas (`.crew-leg-left`, `.crew-leg-right`) en Modelos 3, 5, 6 y 7:**
   - *Criterio de aceptación:* Los 10 modelos tienen el cuerpo centrado en `x = 0` y piernas verticales con pies en `y = 15`; al caminar (`!crew.isWorking`), la rotación en `(±3, 4)` no separa las piernas del torso en ningún modelo.
3. **Convertir `.crew-companion-group` en equipamiento/hito de apoyo (no humano):**
   - *Criterio de aceptación:* Ningún modelo renderiza una segunda cabeza/torso humano en `.crew-companion-group`; a zoom alejado (`scale 2.2x`), cada ficha muestra una única silueta humana clara acompañada de su equipo en `x ≈ -16`.
4. **Aplicar paleta cálida (Naranja/Ámbar) a cuadrillas y fría (Cian/Azul) a dresinas:**
   - *Criterio de aceptación:* Los 10 modelos de cuadrilla usan chaleco `#ff6b1a`/`#ea580c` (diferenciándose por color de casco y herramienta), y ningún modelo de dresina usa carrocería principal naranja.
5. **Rediseñar el indicador `colorGrupoPermiso` (anillo segmentado en base + pastilla lateral en cartela):**
   - *Criterio de aceptación:* Cuando `colorGrupoPermiso(crew)` devuelve color, se renderiza una elipse con `fill="none"` y `stroke-dasharray="6 3"` en `cy="15"` más una franja de `6px` a la izquierda de la cartela, manteniendo visible el estado de zona segura (`#10b981`) o vía activa (`#f59e0b`).
6. **Eliminar filtros `drop-shadow` inline en modelos SVG de cuadrillas y dresinas:**
   - *Criterio de aceptación:* `grep "drop-shadow" simulator.js` dentro de `renderCrewVisualModel` y `renderVehicleVisualModel` devuelve `0` coincidencias; los brillos se resuelven con geometría concéntrica y opacidad.
7. **Aumentar grosor mínimo de trazo (`stroke-width >= 1.2`) en siluetas exteriores:**
   - *Criterio de aceptación:* Todo contorno principal de casco, torso, herramienta y cabina tiene `stroke-width >= 1.2`, verificando legibilidad nítida tanto en zoom cercano (`0.65x`) como en vista general (`2.2x`).
8. **Ajustar gradiente de `.crew-flashlight-beam` y posición de `.crew-retro-bubble` (`y = -60`):**
   - *Criterio de aceptación:* El haz de linterna usa un `<linearGradient>` compartido y el globo de emote activo no se superpone con la cartela en `y = -38`.

---

## 7. Riesgos Técnicos (Animación y Rendimiento)

- **Riesgo de ruptura de selectores en el motor a 60 FPS (`initAnimationEngine`):**
  - El bucle en `simulator.js` consulta `.crew-visual`, `.crew-leg-left`, `.crew-leg-right`, `.crew-tamper-tool`, `.crew-patrol-tool`, `.crew-work-sparks`, `.crew-safe-thumbsup`, `.crew-safety-cones`, `.crew-flashlight-beam`, `.companion-flag`, `.veh-visual`, `.veh-chug-vibe`, `.headlight-beam` y `.token-hitbox`. **Mitigación:** No renombrar ni eliminar ninguna de estas clases; mantener `.token-hitbox` como primer hijo del `<g>`.
- **Riesgo de desalineación en el pivote de marcha (`rotate(angle, -3, 4)` y `(3, 4)`):**
  - Si un modelo desplaza `.crew-char-body` con `transform="translate(-10, 0)"` (como ocurre hoy en los modelos 3, 6 y 7), la rotación de piernas y el squash & stretch de `.crew-visual` descentran al personaje respecto a su sombra y cartela. **Mitigación:** Mantener siempre `.crew-char-body` centrado en `(0,0)`.
- **Riesgo de caída de FPS por filtros SVG y exceso de nodos:**
  - Usar `filter="drop-shadow(...)"` o `<feGaussianBlur>` por cada ficha multiplica las capas de rasterizado en GPU cuando el bucle actualiza `transform` cada frame. **Mitigación:** Cero filtros SVG por instancia; máximo 25–30 nodos SVG simples por modelo.
