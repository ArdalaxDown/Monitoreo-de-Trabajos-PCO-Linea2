# Simulador ATS — Guía de arquitectura

## Árbol de `Simulador ATS/`
```text
Simulador ATS/
├── index.html
├── ptsa.html
├── css/
│   ├── base.css
│   ├── track-svg.css
│   ├── sprites-animations.css
│   ├── modals-dock.css
│   └── ptsa.css
├── js/
│   ├── ptsa/ptsa.js
│   └── vp/
│       ├── config-topology.js
│       ├── safety-interlocking.js
│       ├── audio-arcade.js
│       ├── sprites-catalog.js
│       ├── render-map.js
│       ├── drag-interactions.js
│       ├── animation-engine.js
│       ├── dock-reports.js
│       └── importador-spco.js
├── docs/
│   ├── diseno-personajes.md
│   └── rediseno-pagina.md
└── _archive_bak/
    ├── index.html.bak
    ├── index.html.bak-20261112
    ├── simulator.js
    ├── simulator.js.bak
    ├── styles.css
    ├── styles.css.bak
    └── styles.css.bak-20261112
```

## Reglas
- Mantener VP y PTSA separadas; no mezclar su estado, almacenamiento ni inicializadores.
- Los scripts VP son clásicos (sin `type="module"` ni IIFE) y comparten ámbito global.
- Orden VP obligatorio en `index.html`: configuración → enclavamientos → audio → sprites → mapa → interacción → animación → dock/reportes → importador SPCO.
- Orden CSS: base → SVG/vías → sprites/animaciones → modales/dock. PTSA carga además `css/ptsa.css`.
- Conservar enclavamientos, separación segura, D1/D2, catenaria 1500 V DC, persistencia, reportes, importador SPCO y audio Web Audio.
- Animaciones ligeras con `requestAnimationFrame`; respetar `prefers-reduced-motion`.
- No agregar dependencias sin aprobación. Archivar originales en `_archive_bak/`; no borrar respaldos.
- Validar cambios JS con `node --check` y confirmar que todas las rutas enlazadas existen.
