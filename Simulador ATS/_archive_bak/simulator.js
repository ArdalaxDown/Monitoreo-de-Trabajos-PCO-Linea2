// BLOQUEO ABSOLUTO DEL MENÚ CONTEXTUAL DEL NAVEGADOR
window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
}, { capture: true });
/**
 * ==============================================================================
 * SIMULADOR ATS — MONITOREO DE TRABAJOS EN VÍA PRINCIPAL (OCIR LÍNEA 2)
 * Motor Interactivo con Separación Obligatoria entre Vehículos (Cantón Buffer),
 * Animaciones Ricas de Videojuego (Game-Feel & Game-Assets), Modo Zona Segura,
 * Enclavamiento Estricto, D1/D2 Simétricos y Parte Diario Oficial para Firma SPCO
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// 1. TOPOLOGÍA DE VÍA PRINCIPAL (ETAPA 1A) - GEOMETRÍA OFICIAL HITACHI RAIL
// ------------------------------------------------------------------------------
const ZONAS_VIA = [
  { id: 'Z-PV19-E20', name: 'PV19 a E20 Evitamiento', xStart: 50, xEnd: 380, v2Y: 220, v1Y: 330 },
  { id: 'Z-E20', name: 'Estación E20 Evitamiento', xStart: 380, xEnd: 580, v2Y: 220, v1Y: 330, isStation: true },
  { id: 'Z-E20-PV20', name: 'E20 Evitamiento a PV20 (CV-01)', xStart: 580, xEnd: 860, v2Y: 220, v1Y: 330 },
  { id: 'Z-PV20-E21', name: 'PV20 a E21 Óvalo Santa Anita (Bretelle O)', xStart: 860, xEnd: 1160, v2Y: 220, v1Y: 330, hasBretelle: true },
  { id: 'Z-E21', name: 'Estación E21 Óvalo Santa Anita', xStart: 1160, xEnd: 1360, v2Y: 220, v1Y: 330, isStation: true },
  { id: 'Z-E21-PV21', name: 'E21 Óvalo a PV21 (Bretelle E)', xStart: 1360, xEnd: 1640, v2Y: 220, v1Y: 330, hasBretelle: true },
  { id: 'Z-PV21-E22', name: 'PV21 a E22 Colectora Industrial', xStart: 1640, xEnd: 1800, v2Y: 220, v1Y: 330 },
  { id: 'Z-E22', name: 'Estación E22 Colectora Industrial', xStart: 1800, xEnd: 2000, v2Y: 220, v1Y: 330, isStation: true },
  { id: 'Z-E22-PV22', name: 'E22 Colectora a PV22 (CV-02)', xStart: 2000, xEnd: 2260, v2Y: 220, v1Y: 330 },
  { id: 'Z-PV22-E23', name: 'PV22 a E23 Hermilio Valdizán', xStart: 2260, xEnd: 2420, v2Y: 220, v1Y: 330 },
  { id: 'Z-E23', name: 'Estación E23 Hermilio Valdizán', xStart: 2420, xEnd: 2620, v2Y: 220, v1Y: 330, isStation: true },
  { id: 'Z-E23-PV23', name: 'E23 Hermilio Valdizán a PV23', xStart: 2620, xEnd: 2720, v2Y: 220, v1Y: 330 },
  { id: 'Z-PV23-E24', name: 'PV23 a E24 Mercado Santa Anita (MSA)', xStart: 2720, xEnd: 3060, v2Y: 220, v1Y: 330 },
  { id: 'Z-E24', name: 'Estación E24 Mercado Santa Anita', xStart: 3060, xEnd: 3260, v2Y: 220, v1Y: 330, isStation: true },
  { id: 'Z-E24-PV24', name: 'E24 a PV24 (Topera Este)', xStart: 3260, xEnd: 3510, v2Y: 220, v1Y: 330 },
  { id: 'Z-RAMAL-D1', name: 'Ramal D1 (Vía 2 ⇄ Patio Taller Santa Anita)', xStart: 2920, xEnd: 3010, isRamal: true, ramalId: 'D1', pathD: 'M 2920,220 L 3010,22' },
  { id: 'Z-RAMAL-D2', name: 'Ramal D2 (Vía 2 ⇄ Patio Taller Santa Anita)', xStart: 3340, xEnd: 3440, isRamal: true, ramalId: 'D2', pathD: 'M 3440,220 L 3340,22' }
];

// ------------------------------------------------------------------------------
// ZONAS OFICIALES DE CATENARIA Y ENERGIZACIÓN (1500V DC) - METRO DE LIMA LÍNEA 2
// ------------------------------------------------------------------------------
const ZONAS_CATENARIA = [
  {
    id: 'Z-35',
    num: 35,
    name: 'Zona 35: PV19 hacia EVT andén vía 1',
    via: 'V1',
    y: 326,
    xStart: 50,
    xEnd: 580,
    defaultCut: false
  },
  {
    id: 'Z-36',
    num: 36,
    name: 'Zona 36: PV19 hacia EVT callao vía 2',
    subtitle: 'Sin llegar al andén (desenergizada por defecto)',
    via: 'V2',
    y: 216,
    xStart: 50,
    xEnd: 380,
    defaultCut: true // "Sin llegar al anden, esta zona para desenergizada"
  },
  {
    id: 'Z-37',
    num: 37,
    name: 'Zona 37: EVT ATE hacia OVA ANDEN vía 1',
    via: 'V1',
    y: 326,
    xStart: 580,
    xEnd: 1360,
    defaultCut: false
  },
  {
    id: 'Z-38',
    num: 38,
    name: 'Zona 38: EVT ANDEN hacia OVA Callao vía 2',
    via: 'V2',
    y: 216,
    xStart: 380,
    xEnd: 1160,
    defaultCut: false
  },
  {
    id: 'Z-39',
    num: 39,
    name: 'Zona 39: OVA Ate hacia COL Anden vía 1',
    via: 'V1',
    y: 326,
    xStart: 1360,
    xEnd: 2000,
    defaultCut: false
  },
  {
    id: 'Z-40',
    num: 40,
    name: 'Zona 40: OVA ANDEN hacia COL Callao vía 2',
    via: 'V2',
    y: 216,
    xStart: 1160,
    xEnd: 1800,
    defaultCut: false
  },
  {
    id: 'Z-41',
    num: 41,
    name: 'Zona 41: COL Ate hacia MSA anden pasando por HVA vía 1',
    via: 'V1',
    y: 326,
    xStart: 2000,
    xEnd: 3260,
    defaultCut: false
  },
  {
    id: 'Z-42',
    num: 42,
    name: 'Zona 42: COL Anden hacia MSA ate pasando por HVA y la D1',
    via: 'V2',
    y: 216,
    xStart: 1800,
    xEnd: 3060,
    hasD1: true,
    defaultCut: false
  },
  {
    id: 'Z-43',
    num: 43,
    name: 'Zona 43: MSA ate hacia PV24 vía 1',
    via: 'V1',
    y: 326,
    xStart: 3260,
    xEnd: 3510,
    defaultCut: false
  },
  {
    id: 'Z-44',
    num: 44,
    name: 'Zona 44: MSA Anden hacia PV24 y la D2',
    via: 'V2',
    y: 216,
    xStart: 3060,
    xEnd: 3510,
    hasD2: true,
    defaultCut: false
  }
];

// ------------------------------------------------------------------------------
// 2. ESTADO GLOBAL
// ------------------------------------------------------------------------------
const appState = {
  crews: [],
  vehicles: [],
  completedJobs: [], // Trabajos concluidos archivados para el relevo y SPCO
  historyLog: [],
  activeTab: 'all',  // 'all' | 'crews' | 'vehicles' | 'completed'
  searchQuery: '',
  selectedTokenForQuickEdit: null,
  
  // Control de Catenaria y Tensión (1500V DC)
  catenary: {
    deenergizedZones: ['Z-36'], // Zona 36 para desenergizada por defecto
    interactiveMode: false // Modo de clic directo en vía
  },
  
  // Pegman Drag State
  isDraggingPegman: false,
  draggedType: null, // 'crew' | 'vehicle'
  dragStartZoneIndex: null,
  reassigningEntity: null, // Entidad preexistente que se está reubicando o ampliando
  hoveredVia: 'V2',  // 'V1' | 'V2'
  draggedZonesSet: new Set(),
  hasPaintedMultiZones: false,
  isPaintingWithRightClick: false,
  isCurrentHoverForbidden: false,
  forbiddenReason: '',
  
  // Aparatos de Vía
  switchesState: {
    'CV-01': 'direct',
    'BT-01': 'direct',
    'BT-02': 'direct',
    'CV-02': 'direct',
    'CV-03': 'direct',
    'D1': 'direct',
    'D2': 'direct'
  },
  
  // Audio Web Audio API
  audioEnabled: true,
  audioCtx: null,
  
  // ViewBox (3550 px ancho, 585 px alto, elevado en Y=-65 para PTSA y pozos grandes)
  viewBox: { x: 0, y: -65, width: 3550, height: 585 },
  isPanning: false,
  startPan: { x: 0, y: 0 },
  
  STORAGE_KEY: 'ATS_REPLICA_VP_V7_ULTIMATE'
};

// ------------------------------------------------------------------------------
// 3. SINTETIZADOR DE AUDIO RETRO DE VIDEOJUEGOS (WEB AUDIO API)
// ------------------------------------------------------------------------------
function getAudioContext() {
  if (!appState.audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      appState.audioCtx = new AudioContext();
    }
  }
  if (appState.audioCtx && appState.audioCtx.state === 'suspended') {
    appState.audioCtx.resume();
  }
  return appState.audioCtx;
}

// ------------------------------------------------------------------------------
// 3. SINTETIZADOR DE AUDIO RETRO DE VIDEOJUEGOS FAMOSOS (WEB AUDIO API)
// Variado, dinámico y no monótono: Zelda, Pokémon, Dragon Ball Z, Pac-Man, Mario
// ------------------------------------------------------------------------------
let soundCycleCounter = 0;

function playSound(type) {
  if (!appState.audioEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    soundCycleCounter++;
    
    // ========================================================================
    // A. COLOCACIÓN / ASIGNACIÓN EXITOSA (ROTACIÓN ENTRE POKÉBALL, DRAGON BALL Y MARIO)
    // ========================================================================
    if (type === 'coin' || type === 'drop' || type === 'place') {
      const variant = soundCycleCounter % 3;
      
      if (variant === 0) {
        // POKÉMON: Captura con Pokéball (3 rebotes rápidos + ¡Campana Ding!)
        [0.0, 0.08, 0.16].forEach(t => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1150, now + t);
          gain.gain.setValueAtTime(0.08, now + t);
          gain.gain.linearRampToValueAtTime(0.001, now + t + 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + t);
          osc.stop(now + t + 0.04);
        });
        const oscDing = ctx.createOscillator();
        const gainDing = ctx.createGain();
        oscDing.type = 'triangle';
        oscDing.frequency.setValueAtTime(1760, now + 0.23); // A6
        gainDing.gain.setValueAtTime(0.12, now + 0.23);
        gainDing.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        oscDing.connect(gainDing);
        gainDing.connect(ctx.destination);
        oscDing.start(now + 0.23);
        oscDing.stop(now + 0.65);
      }
      else if (variant === 1) {
        // DRAGON BALL Z: Teletransportación Instantánea (Shunkan Ido)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(1980, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.22);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      }
      else {
        // SUPER MARIO BROS: Moneda clásica (B5 -> E6)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
        gain.gain.setValueAtTime(0.11, now);
        gain.gain.setValueAtTime(0.11, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.38);
      }
    } 

    // ========================================================================
    // B. TAREA GUARDADA / CONCLUIDA (ZELDA SECRET & CENTRO POKÉMON)
    // ========================================================================
    else if (type === '1up' || type === 'finish' || type === 'safe' || type === 'saved') {
      const variant = soundCycleCounter % 2;
      
      if (variant === 0) {
        // THE LEGEND OF ZELDA: Sonido de Secreto / Puzzle Resuelto (8 notas legendarias)
        const zeldaNotes = [
          { freq: 783.99, time: 0.00, dur: 0.08 }, // G5
          { freq: 739.99, time: 0.08, dur: 0.08 }, // F#5
          { freq: 622.25, time: 0.16, dur: 0.08 }, // D#5
          { freq: 440.00, time: 0.24, dur: 0.08 }, // A4
          { freq: 415.30, time: 0.32, dur: 0.08 }, // G#4
          { freq: 659.25, time: 0.40, dur: 0.08 }, // E5
          { freq: 830.61, time: 0.48, dur: 0.08 }, // G#5
          { freq: 1046.50, time: 0.56, dur: 0.32 } // C6 sostenido
        ];
        zeldaNotes.forEach(n => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(n.freq, now + n.time);
          gain.gain.setValueAtTime(0.12, now + n.time);
          gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + n.time);
          osc.stop(now + n.time + n.dur);
        });
      } else {
        // POKÉMON: Melodía de Curación de la Enfermera Joy (Centro Pokémon Game Boy)
        const pokeNotes = [
          { freq: 739.99, time: 0.00, dur: 0.11 }, // F#5
          { freq: 739.99, time: 0.12, dur: 0.11 }, // F#5
          { freq: 739.99, time: 0.24, dur: 0.11 }, // F#5
          { freq: 987.77, time: 0.36, dur: 0.22 }, // B5
          { freq: 830.61, time: 0.58, dur: 0.16 }, // G#5
          { freq: 739.99, time: 0.74, dur: 0.38 }  // F#5
        ];
        pokeNotes.forEach(n => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(n.freq, now + n.time);
          gain.gain.setValueAtTime(0.1, now + n.time);
          gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + n.time);
          osc.stop(now + n.time + n.dur);
        });
      }
    }

    // ========================================================================
    // C. PINTAR TRAMOS CON CLIC DERECHO (PAC-MAN WAKA-WAKA ALTERNANTE)
    // ========================================================================
    else if (type === 'laser' || type === 'paint' || type === 'waka') {
      const isAlt = (soundCycleCounter % 2) === 0;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      if (isAlt) {
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.04);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.09);
      } else {
        osc.frequency.setValueAtTime(340, now);
        osc.frequency.exponentialRampToValueAtTime(620, now + 0.04);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.09);
      }
      gain.gain.setValueAtTime(0.13, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    }

    // ========================================================================
    // D. ERRORES Y MANIOBRAS PROHIBIDAS (POKÉMON BATTLE ALERT & ZELDA WRONG)
    // ========================================================================
    else if (type === 'forbidden' || type === 'hazard' || type === 'alert' || type === 'error') {
      const variant = soundCycleCounter % 2;
      
      if (variant === 0) {
        // POKÉMON: Alarma de Encuentro Salvaje / Batalla crítica de Game Boy
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(840, now);
        osc.frequency.linearRampToValueAtTime(160, now + 0.12);
        osc.frequency.setValueAtTime(840, now + 0.13);
        osc.frequency.linearRampToValueAtTime(160, now + 0.25);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else {
        // THE LEGEND OF ZELDA: Sonido de Error / Ocarina Desafinada (Buzzer disonante)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'square';
        osc2.type = 'square';
        osc1.frequency.setValueAtTime(196, now); // G3
        osc2.frequency.setValueAtTime(185, now); // F#3 (disonante)
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.3);
        osc2.stop(now + 0.3);
      }
    }

    // ========================================================================
    // E. SALTO, CONMUTACIÓN O DESPEGUE DE FICHA (MARIO JUMP & PAC-MAN FRUTA)
    // ========================================================================
    else if (type === 'jump' || type === 'switch' || type === 'warp') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.13);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.13);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    }
    else if (type === 'horn') {
      // Bocina de dresina ferroviaria bi-tono (Honk-Honk)
      [220, 277].forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.linearRampToValueAtTime(freq * 0.98, now + 0.28);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      });
      [220, 277].forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + 0.22);
        osc.frequency.linearRampToValueAtTime(freq * 0.98, now + 0.52);
        gain.gain.setValueAtTime(0.15, now + 0.22);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + 0.22);
        osc.stop(now + 0.58);
      });
    }
    else if (type === 'boing') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.2);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    }
    else if (type === 'xmas') {
      const jingle = [
        { f: 659.25, t: 0.00 }, { f: 659.25, t: 0.12 }, { f: 659.25, t: 0.24 },
        { f: 659.25, t: 0.40 }, { f: 659.25, t: 0.52 }, { f: 659.25, t: 0.64 },
        { f: 659.25, t: 0.80 }, { f: 783.99, t: 0.92 }, { f: 523.25, t: 1.04 },
        { f: 587.33, t: 1.16 }, { f: 659.25, t: 1.28 }
      ];
      jingle.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.12, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + 0.16);
      });
    }
    else if (type === 'whoosh') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.25);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.7);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.75);
    }
    else if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.03);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    }
  } catch (e) {
    console.warn('Audio no disponible', e);
  }
}

// ------------------------------------------------------------------------------
// 4. INICIALIZACIÓN
// ------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initSoundToggle();
  initTrackZones();
  initPanZoomControls();
  initPegmanMultiZoneDrag();
  initInterlockingSwitchesAndSignals();
  initQuickEditCard();
  initModals();
  initDockTabsAndSearch();
  initReportAndExport();
  initDailySheetModal();
  initCatenaryControl();
  initDockToggle();
  initEasterEggs();
  initTokenContextMenu();
  
  loadPersistedState();
  renderAll();
  initAnimationEngine();
  
  showToast('🎮 Simulador ATS L2: Escala semántica y Sala Arcade / Huevos de Pascua activados.', 'success');
});

function initClock() {
  const clockEl = document.getElementById('clock-display');
  function update() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hours}:${mins}:${secs}`;
  }
  update();
  setInterval(update, 1000);
}

function initSoundToggle() {
  const btn = document.getElementById('btn-sound-toggle');
  const icon = document.getElementById('sound-icon');
  const text = document.getElementById('sound-text');
  
  btn.addEventListener('click', () => {
    appState.audioEnabled = !appState.audioEnabled;
    if (appState.audioEnabled) {
      btn.classList.add('sound-on');
      icon.textContent = '🔊';
      text.textContent = 'Audio ATS';
      playSound('coin');
      showToast('Audio ATS activado', 'success');
    } else {
      btn.classList.remove('sound-on');
      icon.textContent = '🔇';
      text.textContent = 'Silenciado';
      showToast('Audio silenciado', 'info');
    }
    persistState();
  });
}

function smoothGlideToX(targetX) {
  const windowWidth = 1250;
  const targetViewX = Math.max(0, Math.min(3550 - windowWidth, targetX - windowWidth / 2));
  
  const startX = appState.viewBox.x;
  const startTime = performance.now();
  const duration = 400;
  
  function step(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    
    appState.viewBox.x = startX + (targetViewX - startX) * eased;
    appState.viewBox.y = 20;
    appState.viewBox.width = windowWidth;
    appState.viewBox.height = 420;
    
    const svg = document.getElementById('track-svg');
    svg.setAttribute('viewBox', `${appState.viewBox.x} ${appState.viewBox.y} ${appState.viewBox.width} ${appState.viewBox.height}`);
    
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

// ------------------------------------------------------------------------------
// 5. ENCLAVAMIENTO DE SEGURIDAD ATS (SEPARACIÓN OBLIGATORIA ENTRE VEHÍCULOS)
// ------------------------------------------------------------------------------

/**
 * Verificación estricta de incompatibilidad:
 * 1. Personal a pie vs Vehículo:
 *    - Si el personal está en ZONA SEGURA (inSafeZone === true), la vía está despejada y los vehículos SÍ pueden ingresar.
 *    - Si el personal está EN VÍA ACTIVA (inSafeZone === false), se bloquea cualquier vehículo por peligro de arrollamiento.
 * 2. Vehículo vs Vehículo:
 *    - Dos vehículos NO pueden coexistir en la misma zona en la misma vía.
 *    - Además, DEBEN DEJAR MÍNIMO 1 CANTÓN LIBRE DE SEPARACIÓN (zona buffer de seguridad por frenado).
 */
function checkZonesConflict(zoneIds, via, entityType, ignoreEntityId = null) {
  if (!zoneIds || zoneIds.length === 0) return { conflict: false, reason: '' };
  
  const zoneList = Array.isArray(zoneIds) ? zoneIds : Array.from(zoneIds);
  
  // Verificación específica para Ramales D1 y D2
  if (via === 'D1' || via === 'D2' || zoneList.some(id => id.includes('RAMAL-D'))) {
    const ramalId = via === 'D1' || zoneList.includes('Z-RAMAL-D1') ? 'D1' : 'D2';
    const ramalZoneId = ramalId === 'D1' ? 'Z-RAMAL-D1' : 'Z-RAMAL-D2';
    const existingCrews = appState.crews.filter(c => c.id !== ignoreEntityId && (c.via === ramalId || c.zones.includes(ramalZoneId)));
    const existingVehs = appState.vehicles.filter(v => v.id !== ignoreEntityId && (v.via === ramalId || v.zones.includes(ramalZoneId)));
    
    if (entityType === 'vehicle') {
      if (existingVehs.length > 0) {
        return { conflict: true, reason: `¡PROHIBIDO! El ramal ${ramalId} hacia PTSA ya está ocupado por ${existingVehs[0].responsible || existingVehs[0].vehicleType}. Solo se permite 1 vehículo por ramal.` };
      }
      const activeCrew = existingCrews.find(c => !c.inSafeZone);
      if (activeCrew) {
        return { conflict: true, reason: `¡PROHIBIDO! En el ramal ${ramalId} la cuadrilla "${activeCrew.responsible}" está activa sobre la vía. Para autorizar paso de vehículo, replegar a zona segura.` };
      }
    } else {
      if (existingVehs.length > 0) {
        return { conflict: true, reason: `¡PROHIBIDO! En el ramal ${ramalId} está operando ${existingVehs[0].responsible || existingVehs[0].vehicleType}. Prohibido ingreso a pie.` };
      }
    }
    return { conflict: false, reason: '' };
  }
  
  const targetIndices = zoneList.map(id => ZONAS_VIA.findIndex(z => z.id === id)).filter(i => i !== -1);
  if (targetIndices.length === 0) return { conflict: false, reason: '' };
  
  const targetMin = Math.min(...targetIndices);
  const targetMax = Math.max(...targetIndices);
  
  if (entityType === 'vehicle') {
    // 1. Verificar si hay cuadrillas a pie activas en el riel (no replegadas en zona segura)
    const conflictCrew = appState.crews.find(c => 
      !c.inSafeZone && c.via === via && c.zones.some(z => zoneList.includes(z))
    );
    if (conflictCrew) {
      return {
        conflict: true,
        reason: `¡PROHIBIDO! Incompatibilidad ATS en ${via}: La cuadrilla "${conflictCrew.responsible}" está activa sobre el riel. Para autorizar paso de vehículo, replegarla a [Zona Segura / Andén].`
      };
    }
    
    // 2. Verificar separación con otros vehículos en la misma vía (Prohibida coexistencia y mínimo 1 cantón buffer libre)
    for (const v of appState.vehicles) {
      if (ignoreEntityId && v.id === ignoreEntityId) continue;
      if (v.via !== via) continue;
      
      const vIndices = v.zones.map(id => ZONAS_VIA.findIndex(z => z.id === id)).filter(i => i !== -1);
      if (vIndices.length === 0) continue;
      
      const vMin = Math.min(...vIndices);
      const vMax = Math.max(...vIndices);
      
      // Coexistencia en el mismo cantón
      if (!(targetMax < vMin || targetMin > vMax)) {
        return {
          conflict: true,
          reason: `¡PROHIBIDO! Incompatibilidad ATS en ${via}: El vehículo auxiliar "${v.vehicleType}" ya opera en esta misma zona. Prohibida la coexistencia en el mismo cantón por riesgo de colisión.`
        };
      }
      
      // Distancia de separación: mínimo 1 cantón libre de buffer
      const gap = targetMin > vMax ? (targetMin - vMax - 1) : (vMin - targetMax - 1);
      if (gap < 1) {
        return {
          conflict: true,
          reason: `¡PROHIBIDO! Distancia de seguridad ATS insuficiente en ${via}: Se exige mínimo 1 cantón de seguridad libre entre vehículos auxiliares ("${v.vehicleType}") como margen de frenado.`
        };
      }
    }
  } else if (entityType === 'crew') {
    // Si se introduce una cuadrilla a pie en una zona ocupada por un vehículo auxiliar
    const conflictVehicle = appState.vehicles.find(v => 
      v.via === via && v.zones.some(z => zoneList.includes(z))
    );
    if (conflictVehicle) {
      return {
        conflict: true,
        reason: `¡PROHIBIDO! Incompatibilidad ATS en ${via}: El vehículo "${conflictVehicle.vehicleType}" está en maniobra. No se autoriza personal en vía activa.`
      };
    }
  }
  
  return { conflict: false, reason: '' };
}

function initPegmanMultiZoneDrag() {
  const ghost = document.getElementById('pegman-drag-ghost');
  const ghostEmoji = document.getElementById('ghost-emoji');
  const ghostViaBadge = document.getElementById('ghost-via-badge');
  const prohibitionHud = document.getElementById('prohibition-hud');
  const prohibitionText = document.getElementById('prohibition-text');
  
  const chipCrew = document.getElementById('chip-crew');
  const chipVehicle = document.getElementById('chip-vehicle');
  
  window.addEventListener('contextmenu', (e) => {
    if (appState.isDraggingPegman) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, { capture: true });
  
  function startDragging(type, clientX, clientY) {
    appState.dragStartZoneIndex = null;
    appState.isDraggingPegman = true;
    document.body.classList.add('is-dragging-token');
    appState.draggedType = type;
    appState.hoveredVia = 'V2';
    appState.draggedZonesSet.clear();
    appState.hasPaintedMultiZones = false;
    appState.isPaintingWithRightClick = false;
    appState.isCurrentHoverForbidden = false;
    appState.forbiddenReason = '';
    
    // Cerrar menú contextual de token si estaba abierto
    const ctxMenu = document.getElementById('vp-token-ctxmenu');
    if (ctxMenu) ctxMenu.style.display = 'none';
    
    ghostEmoji.textContent = type === 'crew' ? '👷' : '🚜';
    if (ghostViaBadge) {
      ghostViaBadge.textContent = 'VÍA 2 ◄ (CALLAO) (Clic Der: Colocar tramos)';
      ghostViaBadge.className = 'ghost-via-badge via-v2';
    }
    
    ghost.style.display = 'flex';
    ghost.style.flexDirection = 'column';
    ghost.style.alignItems = 'center';
    ghost.style.left = `${clientX}px`;
    ghost.style.top = `${clientY}px`;
    
    clearDragSelectionSpan();
    playSound('jump');
  }
  
  if (chipCrew) {
    chipCrew.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        e.preventDefault();
        startDragging('crew', e.clientX, e.clientY);
      }
    });
    chipCrew.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      startDragging('crew', touch.clientX, touch.clientY);
    }, { passive: true });
  }
  
  if (chipVehicle) {
    chipVehicle.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        e.preventDefault();
        startDragging('vehicle', e.clientX, e.clientY);
      }
    });
    chipVehicle.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      startDragging('vehicle', touch.clientX, touch.clientY);
    }, { passive: true });
  }
  
  window.addEventListener('mousemove', (e) => {
    if (!appState.isDraggingPegman) return;
    handlePegmanHoverAndPaint(e.clientX, e.clientY, e.buttons);
  });
  
  window.addEventListener('touchmove', (e) => {
    if (!appState.isDraggingPegman) return;
    const touch = e.touches[0];
    handlePegmanHoverAndPaint(touch.clientX, touch.clientY, 1);
  }, { passive: true });
  
  // CLIC DERECHO PARA COLOCAR Y SELECCIONAR TRAMOS QUIRÚRGICAMENTE
  window.addEventListener('mousedown', (e) => {
    if (appState.isDraggingPegman && e.button === 2) {
      e.preventDefault();
      e.stopPropagation();
      appState.isPaintingWithRightClick = true;
      appState.hasPaintedMultiZones = true;
      
      const svgPoint = getSvgPoint(e.clientX, e.clientY);
      const isInsideRailArea = svgPoint.x >= 40 && svgPoint.x <= 3520 && svgPoint.y >= 40 && svgPoint.y <= 480;
      const targetVia = svgPoint.y >= 275 ? 'V1' : 'V2';
      appState.hoveredVia = targetVia;
      
      const hitZone = ZONAS_VIA.find(z => svgPoint.x >= z.xStart && svgPoint.x <= z.xEnd);
      if (hitZone && isInsideRailArea) {
        if (!appState.draggedZonesSet.has(hitZone.id)) {
          appState.draggedZonesSet.add(hitZone.id);
          playSound('laser');
        }
        
        const conflict = checkZonesConflict(Array.from(appState.draggedZonesSet), targetVia, appState.draggedType, appState.reassigningEntity ? appState.reassigningEntity.id : null);
        if (conflict.conflict) {
          appState.isCurrentHoverForbidden = true;
          appState.forbiddenReason = conflict.reason;
          prohibitionHud.style.display = 'flex';
          prohibitionHud.style.left = `${e.clientX}px`;
          prohibitionHud.style.top = `${e.clientY - 50}px`;
          prohibitionText.textContent = conflict.reason;
          if (ghostViaBadge) {
            ghostViaBadge.textContent = '🚫 PROHIBIDO';
            ghostViaBadge.className = 'ghost-via-badge via-forbidden';
          }
        } else {
          clearForbidden();
        }
        renderDragSelectionSpan(targetVia);
      }
    }
  }, { capture: true });
  
  window.addEventListener('mouseup', (e) => {
    if (appState.isDraggingPegman && e.button === 2) {
      e.preventDefault();
      appState.isPaintingWithRightClick = false;
    }
  }, { capture: true });
  
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && appState.isDraggingPegman) {
      ghost.style.display = 'none';
      clearForbidden();
      clearDragSelectionSpan();
      appState.isDraggingPegman = false;
      document.body.classList.remove('is-dragging-token');
      appState.draggedZonesSet.clear();
      appState.hasPaintedMultiZones = false;
      appState.reassigningEntity = null;
      showToast('Arrastre cancelado por el operador', 'info');
    }
  });
  
  function handlePegmanHoverAndPaint(clientX, clientY, buttons) {
    ghost.style.left = `${clientX}px`;
    ghost.style.top = `${clientY}px`;
    
    const svgPoint = getSvgPoint(clientX, clientY);
    const isInsideRailArea = svgPoint.x >= 40 && svgPoint.x <= 3520 && svgPoint.y >= 30 && svgPoint.y <= 480;
    
    let targetVia = svgPoint.y >= 275 ? 'V1' : 'V2';
    let hitZone = null;
    
    // Proximidad interactiva a Ramal D1: (2920, 220) a (3010, 22)
    if (svgPoint.x >= 2890 && svgPoint.x <= 3040 && svgPoint.y >= 15 && svgPoint.y <= 235) {
      const expectedYD1 = 220 - (svgPoint.x - 2920) * (198.0 / 90.0);
      if (Math.abs(svgPoint.y - expectedYD1) < 14 && svgPoint.y < 205) {
        targetVia = 'D1';
        hitZone = ZONAS_VIA.find(z => z.id === 'Z-RAMAL-D1');
      }
    }
    
    // Proximidad interactiva a Ramal D2: (3440, 220) a (3340, 22)
    if (!hitZone && svgPoint.x >= 3320 && svgPoint.x <= 3460 && svgPoint.y >= 15 && svgPoint.y <= 235) {
      const expectedYD2 = 220 - (3440 - svgPoint.x) * (198.0 / 100.0);
      if (Math.abs(svgPoint.y - expectedYD2) < 14 && svgPoint.y < 205) {
        targetVia = 'D2';
        hitZone = ZONAS_VIA.find(z => z.id === 'Z-RAMAL-D2');
      }
    }
    
    if (!hitZone) {
      hitZone = ZONAS_VIA.filter(z => !z.isRamal).find(z => svgPoint.x >= z.xStart && svgPoint.x <= z.xEnd);
    }
    
    appState.hoveredVia = targetVia;
    
    if (ghostViaBadge && !appState.isCurrentHoverForbidden) {
      let viaLabel = targetVia === 'V1' ? 'VÍA 1 ► (HACIA ATE)' : (targetVia === 'V2' ? 'VÍA 2 ◄ (HACIA CALLAO)' : `RAMAL ${targetVia} ◄► PTSA`);
      const hint = appState.draggedZonesSet.size > 0 
        ? `(${appState.draggedZonesSet.size} tramos marcados)` 
        : `(Clic der: colocar tramos)`;
      ghostViaBadge.textContent = `${viaLabel} ${hint}`;
      ghostViaBadge.className = `ghost-via-badge via-${targetVia.toLowerCase()}`;
    }
    
    if (hitZone && isInsideRailArea) {
      const isRightClick = (buttons & 2) === 2 || appState.isPaintingWithRightClick;
      
      // EL ARRASTRE DE VÍA ES ESTRICTAMENTE CON CLIC DERECHO:
      // Si el operador solo mueve el mouse (con zoom o paneo), NO se agregan tramos al Set.
      // Los tramos solo se van agregando cuando el operador aprieta o mantiene el clic derecho.
      if (isRightClick) {
        appState.hasPaintedMultiZones = true;
        if (!appState.draggedZonesSet.has(hitZone.id)) {
          appState.draggedZonesSet.add(hitZone.id);
          playSound('waka');
        }
      }
      
      const testZones = appState.draggedZonesSet.size > 0 ? Array.from(appState.draggedZonesSet) : [hitZone.id];
      const conflict = checkZonesConflict(testZones, targetVia, appState.draggedType, appState.reassigningEntity ? appState.reassigningEntity.id : null);
      
      if (conflict.conflict) {
        if (!appState.isCurrentHoverForbidden) {
          playSound('forbidden');
        }
        appState.isCurrentHoverForbidden = true;
        appState.forbiddenReason = conflict.reason;
        
        prohibitionHud.style.display = 'flex';
        prohibitionHud.style.left = `${clientX}px`;
        prohibitionHud.style.top = `${clientY - 50}px`;
        prohibitionText.textContent = conflict.reason;
        
        if (ghostViaBadge) {
          ghostViaBadge.textContent = '🚫 PROHIBIDO';
          ghostViaBadge.className = 'ghost-via-badge via-forbidden';
        }
      } else {
        clearForbidden();
      }
      
      if (appState.draggedZonesSet.size > 0) {
        renderDragSelectionSpan(targetVia);
      } else {
        clearDragSelectionSpan();
      }
    } else {
      clearForbidden();
      if (appState.draggedZonesSet.size === 0) {
        clearDragSelectionSpan();
      }
    }
  }
  
  function clearForbidden() {
    appState.isCurrentHoverForbidden = false;
    appState.forbiddenReason = '';
    prohibitionHud.style.display = 'none';
    if (ghostViaBadge && appState.isDraggingPegman && appState.hoveredVia) {
      ghostViaBadge.textContent = appState.hoveredVia === 'V1' ? 'VÍA 1 ► (HACIA ATE)' : 'VÍA 2 ◄ (HACIA CALLAO)';
      ghostViaBadge.className = `ghost-via-badge via-${appState.hoveredVia.toLowerCase()}`;
    }
  }
  
  window.addEventListener('mouseup', (e) => {
    if (!appState.isDraggingPegman) return;
    if (e.button === 0) {
      finalizeDrop(e.clientX, e.clientY);
    }
  });
  
  window.addEventListener('touchend', (e) => {
    if (!appState.isDraggingPegman) return;
    const touch = e.changedTouches[0];
    finalizeDrop(touch.clientX, touch.clientY);
  });
  
  function finalizeDrop(clientX, clientY) {
    if (appState.isDraggingPegman && appState.viaRequerida && appState.hoveredVia !== appState.viaRequerida) {
      playSound('forbidden');
      showToast(`Primero coloca la ${appState.viaRequerida === 'V1' ? 'Vía 1' : 'Vía 2'}. Después se pedirá la otra.`, 'warning');
      return;
    }
    ghost.style.display = 'none';
    
    if (!appState.isDraggingPegman) return;
    
    const via = appState.hoveredVia || 'V2';
    let selectedZonesList = Array.from(appState.draggedZonesSet);
    
    if (selectedZonesList.length === 0) {
      // Si el operador no colocó tramos con clic derecho, se toma el cantón único sobre el que soltó el cursor
      const svgPoint = getSvgPoint(clientX, clientY);
      const isInsideRailArea = svgPoint.x >= 40 && svgPoint.x <= 3520 && svgPoint.y >= 40 && svgPoint.y <= 480;
      const hitZone = ZONAS_VIA.find(z => svgPoint.x >= z.xStart && svgPoint.x <= z.xEnd);
      if (hitZone && isInsideRailArea) {
        selectedZonesList = [hitZone.id];
      } else {
        clearForbidden();
        clearDragSelectionSpan();
        appState.isDraggingPegman = false;
        document.body.classList.remove('is-dragging-token');
        appState.hasPaintedMultiZones = false;
        appState.reassigningEntity = null;
        return;
      }
    }
    
    // Verificación estricta de enclavamiento
    const conflict = checkZonesConflict(selectedZonesList, via, appState.draggedType, appState.reassigningEntity ? appState.reassigningEntity.id : null);
    
    if (conflict.conflict || appState.isCurrentHoverForbidden) {
      playSound('hazard');
      showToast(`🚫 BLOQUEADO POR ENCLAVAMIENTO ATS: ${conflict.reason || appState.forbiddenReason}`, 'danger');
      clearForbidden();
      clearDragSelectionSpan();
      appState.isDraggingPegman = false;
      document.body.classList.remove('is-dragging-token');
      appState.draggedZonesSet.clear();
      appState.hasPaintedMultiZones = false;
      appState.reassigningEntity = null;
      return;
    }
    
    clearForbidden();
    clearDragSelectionSpan();
    
    const sortedZones = selectedZonesList
      .map(id => ZONAS_VIA.find(z => z.id === id))
      .filter(Boolean)
      .sort((a, b) => a.xStart - b.xStart);
    
    let xMin = sortedZones[0].xStart;
    let xMax = sortedZones[sortedZones.length - 1].xEnd;
    let centerX = xMin + (xMax - xMin) / 2;
    if (via === 'D1' || sortedZones.some(z => z.id === 'Z-RAMAL-D1')) {
      xMin = 2920; xMax = 3010; centerX = 2965;
    } else if (via === 'D2' || sortedZones.some(z => z.id === 'Z-RAMAL-D2')) {
      xMin = 3340; xMax = 3440; centerX = 3390;
    }
    
    triggerPlacementRipple(clientX, clientY);
    playSound('coin');
    
    const curTime = new Date().toLocaleTimeString('es-PE', { hour12: false, hour: '2-digit', minute: '2-digit' });
    
    // SI ESTÁBAMOS REUBICANDO O AMPLIANDO UN TRABAJO PREEXISTENTE
    if (appState.reassigningEntity) {
      const existing = appState.reassigningEntity;
      existing.via = via;
      existing.zones = sortedZones.map(z => z.id);
      existing.zoneLabel = sortedZones.length > 1 ? (sortedZones[0].name + ' ➔ ' + sortedZones[sortedZones.length - 1].name) : sortedZones[0].name;
      existing.xMin = xMin;
      existing.xMax = xMax;
      existing.x = centerX;
      
      appState.historyLog.push({
        timestamp: new Date().toISOString(),
        action: 'REUBICACION_TRAMO',
        detail: (existing.type === 'crew' ? 'Cuadrilla ' + existing.responsible : 'Vehículo ' + existing.vehicleType) + ' reubicado/ampliado en ' + existing.zoneLabel + ' (' + via + ').'
      });
      
      showToast('✔ ' + (existing.responsible || existing.vehicleType) + ' reubicado/ampliado exitosamente en ' + existing.zoneLabel + ' (' + via + ').', 'success');
      
      appState.reassigningEntity = null;
      appState.isDraggingPegman = false;
      document.body.classList.remove('is-dragging-token');
      appState.hasPaintedMultiZones = false;
      appState.draggedZonesSet.clear();
      persistState();
      renderAll();
      if (appState.colaReubicacion && appState.colaReubicacion.length) {
        const siguiente = appState.colaReubicacion.shift();
        appState.viaRequerida = siguiente.via;
        startReassigningToken(siguiente, clientX, clientY, true);
        showToast(`Ahora coloca la ${siguiente.via === 'V1' ? 'Vía 1' : 'Vía 2'} de ${siguiente.responsible || siguiente.vehicleType}.`, 'info');
        return;
      }
      appState.viaRequerida = null;
      ofrecerConexionRamal(existing);
      return;
    }
    
    if (appState.draggedType === 'crew') {
      const crewCount = appState.crews.length + 1;
      const newCrew = {
        id: `CRW-${Date.now().toString().slice(-4)}`,
        type: 'crew',
        responsible: `Cuadrilla #${crewCount}`,
        company: 'Mantenimiento de Vía',
        count: 4,
        radio: `Ch-02 / R${100 + crewCount}`,
        via: via,
        zones: sortedZones.map(z => z.id),
        zoneLabel: sortedZones.length > 1 ? `${sortedZones[0].name} ➔ ${sortedZones[sortedZones.length - 1].name}` : sortedZones[0].name,
        xMin: xMin,
        xMax: xMax,
        x: centerX,
        speed: 16,
        dir: 1,
        isWorking: false,
        inSafeZone: false,
        workTimer: 0,
        workCountdown: 6 + Math.random() * 4,
        timeIn: curTime,
        timeOut: '',
        notes: 'Inspección y conservación de vía'
      };
      
      appState.crews.push(newCrew);
      appState.historyLog.push({
        timestamp: new Date().toISOString(),
        action: 'INGRESO_CUADRILLA',
        detail: `Cuadrilla ${newCrew.responsible} autorizada en ${newCrew.zoneLabel} (${via}).`
      });
      
      showToast(`👷 ${newCrew.responsible} en vía. Haz clic sobre ella o en Editar para ajustar datos o poner en Zona Segura.`, 'success');
      
    } else if (appState.draggedType === 'vehicle') {
      const vehCount = appState.vehicles.length + 1;
      const newVehicle = {
        id: `VEH-${Date.now().toString().slice(-4)}`,
        type: 'vehicle',
        vehicleType: `Dresina D-0${Math.min(vehCount, 9)}`,
        driver: `Operador ${vehCount}`,
        leader: `Resp. Maniobra`,
        company: 'Vía y Catenaria',
        radio: `Ch-01 / Tráfico`,
        via: via,
        zones: sortedZones.map(z => z.id),
        zoneLabel: sortedZones.length > 1 ? `${sortedZones[0].name} ➔ ${sortedZones[sortedZones.length - 1].name}` : sortedZones[0].name,
        xMin: xMin,
        xMax: xMax,
        x: centerX,
        speed: 28,
        dir: 1,
        timeIn: curTime,
        timeOut: '',
        notes: 'Maniobra de auscultación y catenaria'
      };
      
      appState.vehicles.push(newVehicle);
      appState.historyLog.push({
        timestamp: new Date().toISOString(),
        action: 'INGRESO_VEHICULO',
        detail: `Vehículo ${newVehicle.vehicleType} en maniobra sobre ${newVehicle.zoneLabel} (${via}).`
      });
      
      showToast(`🚜 ${newVehicle.vehicleType} en vía. Toca para editar o concluir.`, 'success');
    }
    
    appState.isDraggingPegman = false;
    document.body.classList.remove('is-dragging-token');
    appState.hasPaintedMultiZones = false;
    appState.draggedZonesSet.clear();
    ofrecerConexionRamal(appState.draggedType === 'crew' ? appState.crews[appState.crews.length - 1] : appState.vehicles[appState.vehicles.length - 1]);
    persistState();
    renderAll();
  }
}

function renderDragSelectionSpan(via) {
  const spanLayer = document.getElementById('drag-selection-layer');
  if (!spanLayer) return;
  spanLayer.innerHTML = '';
  
  if (appState.draggedZonesSet.size === 0) return;
  
  const isForbidden = appState.isCurrentHoverForbidden;
  const strokeColor = isForbidden ? '#ef4444' : (appState.draggedType === 'crew' ? '#f59e0b' : '#38bdf8');
  
  // Resaltado diagonal especial para Ramales D1 y D2
  if (via === 'D1' || appState.draggedZonesSet.has('Z-RAMAL-D1')) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M 2920,220 L 3010,22');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', strokeColor);
    path.setAttribute('stroke-width', '16');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('opacity', '0.45');
    path.setAttribute('stroke-dasharray', isForbidden ? '8 6' : '10 5');
    spanLayer.appendChild(path);
    return;
  }
  if (via === 'D2' || appState.draggedZonesSet.has('Z-RAMAL-D2')) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M 3440,220 L 3340,22');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', strokeColor);
    path.setAttribute('stroke-width', '16');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('opacity', '0.45');
    path.setAttribute('stroke-dasharray', isForbidden ? '8 6' : '10 5');
    spanLayer.appendChild(path);
    return;
  }
  
  const sorted = Array.from(appState.draggedZonesSet)
    .map(id => ZONAS_VIA.find(z => z.id === id))
    .filter(Boolean)
    .sort((a, b) => a.xStart - b.xStart);
  
  if (sorted.length === 0) return;
  
  const xMin = sorted[0].xStart;
  const xMax = sorted[sorted.length - 1].xEnd;
  const yTrack = via === 'V1' ? 330 : 220;
  
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', xMin);
  rect.setAttribute('y', yTrack - 16);
  rect.setAttribute('width', Math.max(30, xMax - xMin));
  rect.setAttribute('height', 32);
  rect.setAttribute('rx', '6');
  rect.setAttribute('class', isForbidden ? 'hazard-laser-barrier' : '');
  rect.setAttribute('fill', isForbidden ? 'rgba(239, 68, 68, 0.38)' : (appState.draggedType === 'crew' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(56, 189, 248, 0.25)'));
  rect.setAttribute('stroke', strokeColor);
  rect.setAttribute('stroke-width', isForbidden ? '3.5' : '2.5');
  rect.setAttribute('stroke-dasharray', isForbidden ? '8 6' : 'none');
  
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', xMin + (xMax - xMin) / 2);
  text.setAttribute('y', via === 'V1' ? yTrack + 32 : yTrack - 22);
  text.setAttribute('fill', isForbidden ? '#ef4444' : (appState.draggedType === 'crew' ? '#fbbf24' : '#38bdf8'));
  text.setAttribute('font-size', '10.5');
  text.setAttribute('font-weight', 'bold');
  text.setAttribute('font-family', 'monospace');
  text.setAttribute('text-anchor', 'middle');
  const zoneSummary = sorted.length > 1 ? `${sorted[0].name.split(' ')[0]} ➔ ${sorted[sorted.length - 1].name.split(' ')[0]} (${sorted.length} tramos)` : sorted[0].name;
  text.textContent = isForbidden 
    ? `⚠️ [${via}] ¡ZONA BLOQUEADA POR RIESGO DE COLISIÓN!` 
    : `[${via}] ${zoneSummary} (Click der: pintar más)`;
  
  spanLayer.appendChild(rect);
  spanLayer.appendChild(text);
}

function clearDragSelectionSpan() {
  const spanLayer = document.getElementById('drag-selection-layer');
  if (spanLayer) spanLayer.innerHTML = '';
}

function getSvgPoint(clientX, clientY) {
  const svg = document.getElementById('track-svg');
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

function triggerPlacementRipple(clientX, clientY) {
  const svg = document.getElementById('track-svg');
  const ripplesLayer = document.getElementById('ripples-layer');
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const svgPt = pt.matrixTransform(svg.getScreenCTM().inverse());
  
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', svgPt.x);
  circle.setAttribute('cy', svgPt.y);
  circle.setAttribute('r', '6');
  circle.setAttribute('fill', 'none');
  circle.setAttribute('stroke', '#38bdf8');
  circle.setAttribute('class', 'placement-ripple');
  
  ripplesLayer.appendChild(circle);
  setTimeout(() => circle.remove(), 1200);
}

// ------------------------------------------------------------------------------
// 6. TARJETA DE EDICIÓN RÁPIDA (SIEMPRE VISIBLE EN PANTALLA)
// ------------------------------------------------------------------------------
function populateQuickEditZoneSelects() {
  const startSelect = document.getElementById('quickcard-zone-start');
  const endSelect = document.getElementById('quickcard-zone-end');
  if (!startSelect || !endSelect) return;
  
  startSelect.innerHTML = '';
  endSelect.innerHTML = '';
  ZONAS_VIA.forEach((z, idx) => {
    const optA = document.createElement('option');
    optA.value = z.id;
    optA.textContent = (idx + 1) + '. ' + z.name;
    startSelect.appendChild(optA);

    const optB = document.createElement('option');
    optB.value = z.id;
    optB.textContent = (idx + 1) + '. ' + z.name;
    endSelect.appendChild(optB);
  });
}

function updateQuickcardZoneSummary() {
  const startSelect = document.getElementById('quickcard-zone-start');
  const endSelect = document.getElementById('quickcard-zone-end');
  const viaSelect = document.getElementById('quickcard-via');
  const descInput = document.getElementById('quickcard-zones-desc');
  if (!startSelect || !endSelect || !descInput || !viaSelect) return;
  
  const idxA = ZONAS_VIA.findIndex(z => z.id === startSelect.value);
  const idxB = ZONAS_VIA.findIndex(z => z.id === endSelect.value);
  if (idxA === -1 || idxB === -1) return;
  
  const minIdx = Math.min(idxA, idxB);
  const maxIdx = Math.max(idxA, idxB);
  const zonesSpan = ZONAS_VIA.slice(minIdx, maxIdx + 1);
  const via = viaSelect.value || 'V2';
  
  const label = zonesSpan.length > 1 
    ? (zonesSpan[0].name.split(' ')[0] + ' ➔ ' + zonesSpan[zonesSpan.length - 1].name.split(' ')[0] + ' (' + zonesSpan.length + ' tramos contiguos en ' + via + ')')
    : (zonesSpan[0].name + ' (' + via + ')');
  descInput.value = label;
}

function initQuickEditCard() {
  populateQuickEditZoneSelects();
  
  const card = document.getElementById('token-quickcard');
  const respInput = document.getElementById('quickcard-resp');
  const compSelect = document.getElementById('quickcard-company');
  const radioInput = document.getElementById('quickcard-radio');
  const countInput = document.getElementById('quickcard-count');
  const timeInInput = document.getElementById('quickcard-timein');
  const timeOutInput = document.getElementById('quickcard-timeout');
  const notesInput = document.getElementById('quickcard-notes');
  const viaSelect = document.getElementById('quickcard-via');
  const startSelect = document.getElementById('quickcard-zone-start');
  const endSelect = document.getElementById('quickcard-zone-end');
  const btnReassign = document.getElementById('quickcard-btn-reassign');
  const btnSafeZone = document.getElementById('quickcard-btn-safezone');
  const btnSave = document.getElementById('quickcard-btn-save');
  const btnFinish = document.getElementById('quickcard-btn-finish');
  const btnDel = document.getElementById('quickcard-btn-del');
  const btnClose = document.getElementById('quickcard-close');
  
  if (startSelect) startSelect.addEventListener('change', updateQuickcardZoneSummary);
  if (endSelect) endSelect.addEventListener('change', updateQuickcardZoneSummary);
  if (viaSelect) viaSelect.addEventListener('change', updateQuickcardZoneSummary);
  
  // Botón para reubicar / ampliar en el mapa directamente
  if (btnReassign) {
    btnReassign.addEventListener('click', () => {
      if (!appState.selectedTokenForQuickEdit) return;
      const token = appState.selectedTokenForQuickEdit;
      card.style.display = 'none';
      
      // Activar modo de reasignación pegman sobre entidad existente
      appState.reassigningEntity = token;
      appState.isDraggingPegman = true;
      document.body.classList.add('is-dragging-token');
      appState.draggedType = token.type;
      appState.hoveredVia = token.via;
      appState.draggedZonesSet.clear();
      token.zones.forEach(zid => appState.draggedZonesSet.add(zid));
      appState.hasPaintedMultiZones = token.zones.length > 1;
      
      const ghost = document.getElementById('pegman-drag-ghost');
      const ghostEmoji = document.getElementById('ghost-emoji');
      const ghostViaBadge = document.getElementById('ghost-via-badge');
      if (ghost && ghostEmoji && ghostViaBadge) {
        ghostEmoji.textContent = token.type === 'crew' ? '👷' : '🚜';
        ghostViaBadge.textContent = token.via === 'V1' ? 'VÍA 1 ► (HACIA ATE)' : 'VÍA 2 ◄ (HACIA CALLAO)';
        ghostViaBadge.className = 'ghost-via-badge via-' + token.via.toLowerCase();
        ghost.style.display = 'flex';
        ghost.style.left = '50vw';
        ghost.style.top = '35vh';
      }
      
      renderDragSelectionSpan(token.via);
      playSound('jump');
      showToast('📍 Mover/Ampliar ' + (token.responsible || token.vehicleType) + ': Pasa el mouse por la vía (clic derecho para más tramos) y suelta.', 'info');
    });
  }
  
  btnClose.addEventListener('click', () => {
    card.style.display = 'none';
    appState.selectedTokenForQuickEdit = null;
  });
  
  btnSave.addEventListener('click', () => {
    if (!appState.selectedTokenForQuickEdit) return;
    const token = appState.selectedTokenForQuickEdit;
    
    // 1. Calcular nuevas zonas y vía desde los selectores
    const newVia = (viaSelect ? viaSelect.value : token.via) || 'V2';
    const sId = startSelect ? startSelect.value : token.zones[0];
    const eId = endSelect ? endSelect.value : token.zones[token.zones.length - 1];
    
    const idxA = ZONAS_VIA.findIndex(z => z.id === sId);
    const idxB = ZONAS_VIA.findIndex(z => z.id === eId);
    const minIdx = Math.min(idxA !== -1 ? idxA : 0, idxB !== -1 ? idxB : 0);
    const maxIdx = Math.max(idxA !== -1 ? idxA : 0, idxB !== -1 ? idxB : 0);
    const selectedZones = ZONAS_VIA.slice(minIdx, maxIdx + 1);
    const selectedZoneIds = selectedZones.map(z => z.id);
    
    // 2. Validar con enclavamiento ATS excluyendo a la misma entidad
    const conflict = checkZonesConflict(selectedZoneIds, newVia, token.type, token.id);
    if (conflict.conflict) {
      playSound('hazard');
      showToast('🚫 BLOQUEADO POR ENCLAVAMIENTO ATS: ' + conflict.reason, 'danger');
      return;
    }
    
    // 3. Aplicar reubicación o ampliación de tramo
    const xMin = selectedZones[0].xStart;
    const xMax = selectedZones[selectedZones.length - 1].xEnd;
    const centerX = xMin + (xMax - xMin) / 2;
    
    const viaChanged = token.via !== newVia;
    const zonesChanged = token.zones.join(',') !== selectedZoneIds.join(',');
    
    token.via = newVia;
    token.zones = selectedZoneIds;
    token.xMin = xMin;
    token.xMax = xMax;
    token.zoneLabel = selectedZones.length > 1 ? (selectedZones[0].name + ' ➔ ' + selectedZones[selectedZones.length - 1].name) : selectedZones[0].name;
    
    // Si cambió de tramo o vía, reposicionar suavemente dentro del nuevo cantón
    if (viaChanged || zonesChanged) {
      token.x = centerX;
      appState.historyLog.push({
        timestamp: new Date().toISOString(),
        action: 'CAMBIO_TRAMO',
        detail: (token.type === 'crew' ? 'Cuadrilla ' + token.responsible : 'Vehículo ' + token.vehicleType) + ' reubicado/ampliado a ' + token.zoneLabel + ' (' + newVia + ').'
      });
    }
    
    if (token.type === 'crew') {
      token.responsible = respInput.value.trim() || token.responsible;
      token.company = compSelect.value;
      token.radio = radioInput.value.trim() || token.radio;
      token.count = parseInt(countInput.value, 10) || token.count;
      token.timeIn = timeInInput.value.trim() || token.timeIn;
      token.timeOut = timeOutInput.value.trim() || token.timeOut;
      token.notes = notesInput.value.trim() || token.notes;
    } else {
      token.vehicleType = respInput.value.trim() || token.vehicleType;
      token.company = compSelect.value;
      token.radio = radioInput.value.trim() || token.radio;
      token.timeIn = timeInInput.value.trim() || token.timeIn;
      token.timeOut = timeOutInput.value.trim() || token.timeOut;
      token.notes = notesInput.value.trim() || token.notes;
    }
    
    propagarEdicionGrupo(token);
    card.style.display = 'none';
    playSound('coin');
    persistState();
    renderAll();
    showToast('✔ Trabajo guardado y actualizado en ' + token.zoneLabel + ' (' + token.via + ').', 'success');
  });
  
  if (btnSafeZone) {
    btnSafeZone.addEventListener('click', () => {
      if (!appState.selectedTokenForQuickEdit) return;
      toggleSafeZone(appState.selectedTokenForQuickEdit.id);
      card.style.display = 'none';
    });
  }
  
  btnFinish.addEventListener('click', () => {
    if (!appState.selectedTokenForQuickEdit) return;
    const token = appState.selectedTokenForQuickEdit;
    const curTime = new Date().toLocaleTimeString('es-PE', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const finalTimeOut = timeOutInput.value.trim() || curTime;
    
    concludeWorkJob(token.id, finalTimeOut, notesInput.value.trim() || token.notes);
    card.style.display = 'none';
  });
  
  btnDel.addEventListener('click', () => {
    if (!appState.selectedTokenForQuickEdit) return;
    if (appState.selectedTokenForQuickEdit.type === 'crew') {
      removeCrew(appState.selectedTokenForQuickEdit.id);
    } else {
      removeVehicle(appState.selectedTokenForQuickEdit.id);
    }
    card.style.display = 'none';
  });
}

function openQuickEditForToken(token, clientX, clientY) {
  appState.selectedTokenForQuickEdit = token;
  appState.editarGrupoIds = null;
  const card = document.getElementById('token-quickcard');
  const title = document.getElementById('quickcard-title');
  const respInput = document.getElementById('quickcard-resp');
  const compSelect = document.getElementById('quickcard-company');
  const radioInput = document.getElementById('quickcard-radio');
  const countInput = document.getElementById('quickcard-count');
  const countBox = document.getElementById('quickcard-count-box');
  const timeInInput = document.getElementById('quickcard-timein');
  const timeOutInput = document.getElementById('quickcard-timeout');
  const notesInput = document.getElementById('quickcard-notes');
  const zonesDesc = document.getElementById('quickcard-zones-desc');
  const btnSafeZone = document.getElementById('quickcard-btn-safezone');
  
  const curTime = new Date().toLocaleTimeString('es-PE', { hour12: false, hour: '2-digit', minute: '2-digit' });
  
  if (token.type === 'crew') {
    title.innerHTML = `<span>👷</span> Editar Cuadrilla (${token.via}) <span style="cursor:pointer;" id="quickcard-close">✕</span>`;
    respInput.value = token.responsible;
    compSelect.value = token.company || 'Mantenimiento de Vía';
    radioInput.value = token.radio;
    countInput.value = token.count;
    countBox.style.display = 'flex';
    
    if (btnSafeZone) {
      btnSafeZone.style.display = 'inline-flex';
      btnSafeZone.textContent = token.inSafeZone ? '🚶 Reanudar en Vía' : '🛡️ Mover a Andén (Zona Segura)';
      btnSafeZone.className = `btn-table-action btn-safe-zone ${token.inSafeZone ? 'active-safe' : ''}`;
    }
  } else {
    title.innerHTML = `<span>🚜</span> Editar Vehículo (${token.via}) <span style="cursor:pointer;" id="quickcard-close">✕</span>`;
    respInput.value = token.vehicleType;
    compSelect.value = token.company || 'Vía y Catenaria';
    radioInput.value = token.radio;
    countBox.style.display = 'none';
    if (btnSafeZone) btnSafeZone.style.display = 'none';
  }
  
  timeInInput.value = token.timeIn || curTime;
  timeOutInput.value = token.timeOut || curTime;
  notesInput.value = token.notes || '';
  zonesDesc.value = token.zoneLabel || 'Zona asignada';
  
  const viaSelect = document.getElementById('quickcard-via');
  const startSelect = document.getElementById('quickcard-zone-start');
  const endSelect = document.getElementById('quickcard-zone-end');
  
  if (viaSelect) viaSelect.value = token.via || 'V2';
  if (startSelect && token.zones && token.zones.length > 0) {
    startSelect.value = token.zones[0];
  }
  if (endSelect && token.zones && token.zones.length > 0) {
    endSelect.value = token.zones[token.zones.length - 1];
  }
  updateQuickcardZoneSummary();
  
  // Posicionamiento fixed siempre centrado en pantalla (visible y accesible al 100%)
  card.style.display = 'flex';
  
  document.getElementById('quickcard-close').onclick = () => {
    card.style.display = 'none';
  };
}

// ------------------------------------------------------------------------------
// 7. ZONA SEGURA / ANDÉN (DESPEJE TEMPORAL DE VÍA PARA PASO DE VEHÍCULOS)
// ------------------------------------------------------------------------------
window.toggleSafeZone = function(crewId, event) {
  if (event) event.stopPropagation();
  const crew = appState.crews.find(c => c.id === crewId);
  if (!crew) return;
  
  crew.inSafeZone = !crew.inSafeZone;
  
  if (crew.inSafeZone) {
    crew.isWorking = false;
    playSound('1up');
    showToast(`🛡️ Cuadrilla ${crew.responsible} en ZONA SEGURA (Andén). Vía libre para paso de vehículos.`, 'success');
    appState.historyLog.push({
      timestamp: new Date().toISOString(),
      action: 'REPLIEGUE_ZONA_SEGURA',
      detail: `Cuadrilla ${crew.responsible} se replegó a zona segura en ${crew.zoneLabel} (${crew.via}).`
    });
  } else {
    playSound('jump');
    showToast(`🚶 Cuadrilla ${crew.responsible} reanudó labores activas sobre el riel.`, 'info');
    appState.historyLog.push({
      timestamp: new Date().toISOString(),
      action: 'RETORNO_A_VIA',
      detail: `Cuadrilla ${crew.responsible} retomó labores en vía principal (${crew.via}).`
    });
  }
  
  persistState();
  renderAll();
};

function concludeWorkJob(jobId, finalTimeOut, finalNotes) {
  let item = null;
  const cIdx = appState.crews.findIndex(c => c.id === jobId);
  if (cIdx !== -1) {
    item = appState.crews.splice(cIdx, 1)[0];
  } else {
    const vIdx = appState.vehicles.findIndex(v => v.id === jobId);
    if (vIdx !== -1) {
      item = appState.vehicles.splice(vIdx, 1)[0];
    }
  }
  
  if (!item) return;
  
  item.timeOut = finalTimeOut || new Date().toLocaleTimeString('es-PE', { hour12: false, hour: '2-digit', minute: '2-digit' });
  item.notes = finalNotes || item.notes || 'Trabajo completado y vía despejada';
  item.status = 'CONCLUIDO';
  item.completedTimestamp = new Date().toISOString();
  
  appState.completedJobs.unshift(item);
  appState.historyLog.push({
    timestamp: new Date().toISOString(),
    action: 'TRABAJO_CONCLUIDO',
    detail: `${item.type === 'crew' ? 'Cuadrilla ' + item.responsible : 'Vehículo ' + item.vehicleType} concluyó trabajo en ${item.zoneLabel} (${item.via}) a las ${item.timeOut}.`
  });
  
  playSound('1up');
  persistState();
  renderAll();
  showToast(`✔ Trabajo ${item.responsible || item.vehicleType} marcado como CONCLUIDO y archivado.`, 'success');
}

// ------------------------------------------------------------------------------
// 8. TRAMOS SVG Y HITBOXES
// ------------------------------------------------------------------------------
function initTrackZones() {
  const zonesLayer = document.getElementById('track-zones-layer');
  
  ZONAS_VIA.forEach(zone => {
    const gZone = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gZone.setAttribute('class', 'svg-track-zone');
    gZone.setAttribute('id', `hitbox-${zone.id}`);
    gZone.setAttribute('data-zone-id', zone.id);
    
    if (zone.isRamal) {
      const pathHit = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathHit.setAttribute('d', zone.pathD);
      pathHit.setAttribute('fill', 'none');
      pathHit.setAttribute('stroke', 'rgba(56, 189, 248, 0.001)');
      pathHit.setAttribute('stroke-width', '32');
      pathHit.setAttribute('data-via', zone.ramalId);
      gZone.appendChild(pathHit);
    } else {
      const rectV2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rectV2.setAttribute('x', zone.xStart);
      rectV2.setAttribute('y', zone.v2Y - 14);
      rectV2.setAttribute('width', zone.xEnd - zone.xStart);
      rectV2.setAttribute('height', 28);
      rectV2.setAttribute('fill', 'rgba(56, 189, 248, 0.001)');
      rectV2.setAttribute('data-via', 'V2');
      
      const rectV1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rectV1.setAttribute('x', zone.xStart);
      rectV1.setAttribute('y', zone.v1Y - 14);
      rectV1.setAttribute('width', zone.xEnd - zone.xStart);
      rectV1.setAttribute('height', 28);
      rectV1.setAttribute('fill', 'rgba(56, 189, 248, 0.001)');
      rectV1.setAttribute('data-via', 'V1');
      
      gZone.appendChild(rectV2);
      gZone.appendChild(rectV1);
    }
    
    zonesLayer.appendChild(gZone);
  });
}

// ------------------------------------------------------------------------------
// 9. APARATOS DE VÍA INTERACTIVOS
// ------------------------------------------------------------------------------
function initInterlockingSwitchesAndSignals() {
  document.querySelectorAll('.switch-group').forEach(sw => {
    sw.addEventListener('click', (e) => {
      e.stopPropagation();
      const swId = sw.getAttribute('data-switch-id');
      if (!swId) return;
      
      const current = appState.switchesState[swId] || 'direct';
      const next = current === 'direct' ? 'diverted' : 'direct';
      appState.switchesState[swId] = next;
      
      if (next === 'diverted') {
        sw.classList.add('switch-diverted');
        showToast(`Cambiavías ${swId}: Vía Desviada`, 'warning');
      } else {
        sw.classList.remove('switch-diverted');
        showToast(`Cambiavías ${swId}: Vía Directa`, 'info');
      }
      
      playSound('jump');
      persistState();
    });
  });
}

// ------------------------------------------------------------------------------
// 10. CONTROLES DE ZOOM Y PANEO
// ------------------------------------------------------------------------------
function initPanZoomControls() {
  const svg = document.getElementById('track-svg');
  const container = document.getElementById('svg-pan-zoom-container');
  
  function applyViewBox() {
    svg.setAttribute('viewBox', `${appState.viewBox.x} ${appState.viewBox.y} ${appState.viewBox.width} ${appState.viewBox.height}`);
  }
  
  document.getElementById('btn-zoom-in').addEventListener('click', () => {
    zoomByFactor(0.85);
  });
  
  document.getElementById('btn-zoom-out').addEventListener('click', () => {
    zoomByFactor(1.18);
  });
  
  document.getElementById('btn-zoom-reset').addEventListener('click', () => {
    appState.viewBox = { x: 0, y: -65, width: 3550, height: 585 };
    applyViewBox();
    playSound('coin');
  });
  
  document.getElementById('btn-zoom-fit').addEventListener('click', () => {
    appState.viewBox = { x: 0, y: -65, width: 3550, height: 585 };
    applyViewBox();
    playSound('coin');
  });
  
  function zoomByFactor(factor) {
    const newWidth = appState.viewBox.width * factor;
    const newHeight = appState.viewBox.height * factor;
    
    if (newWidth >= 500 && newWidth <= 6000) {
      const dw = newWidth - appState.viewBox.width;
      const dh = newHeight - appState.viewBox.height;
      appState.viewBox.x -= dw / 2;
      appState.viewBox.y -= dh / 2;
      appState.viewBox.width = newWidth;
      appState.viewBox.height = newHeight;
      applyViewBox();
      playSound('click');
    }
  }
  
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 0.88 : 1.14;
    const newWidth = appState.viewBox.width * factor;
    const newHeight = appState.viewBox.height * factor;
    
    if (newWidth >= 500 && newWidth <= 6500) {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const mouseSvgX = appState.viewBox.x + (mouseX / container.clientWidth) * appState.viewBox.width;
      const mouseSvgY = appState.viewBox.y + (mouseY / container.clientHeight) * appState.viewBox.height;
      
      appState.viewBox.x = mouseSvgX - (mouseX / container.clientWidth) * newWidth;
      appState.viewBox.y = mouseSvgY - (mouseY / container.clientHeight) * newHeight;
      appState.viewBox.width = newWidth;
      appState.viewBox.height = newHeight;
      
      applyViewBox();
    }
  }, { passive: false });
  
  container.addEventListener('mousedown', (e) => {
    if (appState.isDraggingPegman || e.target.closest('.modal-overlay') || e.target.closest('.action-btn')) return;
    if (e.button === 0) {
      appState.isPanning = true;
      appState.startPan = { x: e.clientX, y: e.clientY };
    }
  });
  
  window.addEventListener('mousemove', (e) => {
    if (!appState.isPanning) return;
    const dx = (e.clientX - appState.startPan.x) * (appState.viewBox.width / container.clientWidth);
    const dy = (e.clientY - appState.startPan.y) * (appState.viewBox.height / container.clientHeight);
    appState.viewBox.x -= dx;
    appState.viewBox.y -= dy;
    appState.startPan = { x: e.clientX, y: e.clientY };
    applyViewBox();
  });
  
  window.addEventListener('mouseup', () => {
    appState.isPanning = false;
  });
}

// ------------------------------------------------------------------------------
// 11. MODALES
// ------------------------------------------------------------------------------
function initModals() {
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-close');
      closeModal(targetId);
      playSound('click');
    });
  });
  
  const btnPitch = document.getElementById('btn-open-pitch');
  if (btnPitch) {
    btnPitch.addEventListener('click', () => {
      playSound('coin');
      openModal('modal-pitch');
    });
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// ------------------------------------------------------------------------------
// 12. RENDERIZADO VISUAL CON SPRITES RICOS DE VIDEOJUEGO
// ------------------------------------------------------------------------------
function renderAll() {
  renderWorkSpans();
  renderCatenaryLayer();
  renderEntitiesDOM();
  updateCounters();
  renderTable();
}

function renderWorkSpans() {
  const layer = document.getElementById('work-span-layer');
  layer.innerHTML = '';
  
  appState.crews.forEach(crew => {
    if (crew.via === 'D1' || (crew.zones && crew.zones.includes('Z-RAMAL-D1'))) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M 2920,220 L 3010,22');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', crew.inSafeZone ? '#14b8a6' : '#f59e0b');
      path.setAttribute('stroke-width', '18');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('opacity', '0.35');
      path.setAttribute('stroke-dasharray', crew.inSafeZone ? '4 4' : '8 4');
      path.style.cursor = 'pointer';
      path.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showTokenContextMenu(crew, e.clientX, e.clientY);
      });
      layer.appendChild(path);
      return;
    }
    if (crew.via === 'D2' || (crew.zones && crew.zones.includes('Z-RAMAL-D2'))) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M 3440,220 L 3340,22');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', crew.inSafeZone ? '#14b8a6' : '#f59e0b');
      path.setAttribute('stroke-width', '18');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('opacity', '0.35');
      path.setAttribute('stroke-dasharray', crew.inSafeZone ? '4 4' : '8 4');
      path.style.cursor = 'pointer';
      path.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showTokenContextMenu(crew, e.clientX, e.clientY);
      });
      layer.appendChild(path);
      return;
    }
    const yTrack = crew.via === 'V1' ? 330 : 220;
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', crew.xMin);
    rect.setAttribute('y', yTrack - 14);
    rect.setAttribute('width', Math.max(20, crew.xMax - crew.xMin));
    rect.setAttribute('height', 28);
    rect.setAttribute('rx', '5');
    rect.setAttribute('fill', crew.inSafeZone ? 'rgba(13, 148, 136, 0.16)' : 'rgba(245, 158, 11, 0.18)');
    rect.setAttribute('stroke', crew.inSafeZone ? '#14b8a6' : '#f59e0b');
    rect.setAttribute('stroke-width', '2');
    rect.setAttribute('stroke-dasharray', crew.inSafeZone ? '4 4' : '8 4');
    rect.style.cursor = 'pointer';
    rect.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showTokenContextMenu(crew, e.clientX, e.clientY);
    });
    layer.appendChild(rect);
  });
  
  appState.vehicles.forEach(veh => {
    if (veh.via === 'D1' || (veh.zones && veh.zones.includes('Z-RAMAL-D1'))) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M 2920,220 L 3010,22');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#38bdf8');
      path.setAttribute('stroke-width', '18');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('opacity', '0.35');
      path.setAttribute('stroke-dasharray', '8 4');
      path.style.cursor = 'pointer';
      path.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showTokenContextMenu(veh, e.clientX, e.clientY);
      });
      layer.appendChild(path);
      return;
    }
    if (veh.via === 'D2' || (veh.zones && veh.zones.includes('Z-RAMAL-D2'))) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M 3440,220 L 3340,22');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#38bdf8');
      path.setAttribute('stroke-width', '18');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('opacity', '0.35');
      path.setAttribute('stroke-dasharray', '8 4');
      path.style.cursor = 'pointer';
      path.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showTokenContextMenu(veh, e.clientX, e.clientY);
      });
      layer.appendChild(path);
      return;
    }
    const model = getVehicleModel(veh);
    const yTrack = veh.via === 'V1' ? 330 : 220;
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', veh.xMin);
    rect.setAttribute('y', yTrack - 14);
    rect.setAttribute('width', Math.max(20, veh.xMax - veh.xMin));
    rect.setAttribute('height', 28);
    rect.setAttribute('rx', '5');
    rect.setAttribute('fill', 'rgba(56, 189, 248, 0.18)');
    rect.setAttribute('stroke', '#38bdf8');
    rect.setAttribute('stroke-width', '2');
    rect.style.cursor = 'pointer';
    rect.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showTokenContextMenu(veh, e.clientX, e.clientY);
    });
    layer.appendChild(rect);
  });
}


// Función para despegar una entidad en modo reasignación (como la primera vez, conservando 100% sus datos)
function startReassigningToken(entity, clientX, clientY, continuandoCola) {
  const card = document.getElementById('token-quickcard');
  if (card) card.style.display = 'none';
  if (!continuandoCola) {
    appState.colaReubicacion = [];
    appState.viaRequerida = null;
  }
  
  appState.dragStartZoneIndex = null;
  
  appState.reassigningEntity = entity;
  appState.isDraggingPegman = true;
  document.body.classList.add('is-dragging-token');
  appState.draggedType = entity.type;
  appState.hoveredVia = entity.via;
  appState.draggedZonesSet.clear();
  appState.hasPaintedMultiZones = false;
  appState.isPaintingWithRightClick = false;
  appState.isCurrentHoverForbidden = false;
  appState.forbiddenReason = '';
  
  const ghost = document.getElementById('pegman-drag-ghost');
  const ghostEmoji = document.getElementById('ghost-emoji');
  const ghostViaBadge = document.getElementById('ghost-via-badge');
  if (ghost && ghostEmoji && ghostViaBadge) {
    ghostEmoji.textContent = entity.type === 'crew' ? '👷' : '🚜';
    ghostViaBadge.textContent = (entity.via === 'V1' ? 'VÍA 1 ► (HACIA ATE)' : 'VÍA 2 ◄ (HACIA CALLAO)') + ' (Clic Der: Colocar tramos)';
    ghostViaBadge.className = 'ghost-via-badge via-' + entity.via.toLowerCase();
    ghost.style.display = 'flex';
    ghost.style.left = (clientX || (window.innerWidth / 2)) + 'px';
    ghost.style.top = (clientY || (window.innerHeight / 2)) + 'px';
  }
  
  clearDragSelectionSpan();
  playSound('jump');
  showToast('📍 Moviendo ' + (entity.responsible || entity.vehicleType) + ': Arrastra el cursor y usa clic derecho sobre los tramos a asignar.', 'info');
}


// ==============================================================================
// MENÚ CONTEXTUAL PARA TOKENS EN VISTA DE VÍA (EDITAR / ELIMINAR / REUBICAR)
// Accesible con clic derecho sobre cualquier personaje o dresina en la VP
// ==============================================================================
let _ctxMenuToken = null; // Token actualmente asociado al menú contextual abierto

function initTokenContextMenu() {
  const menu = document.getElementById('vp-token-ctxmenu');
  if (!menu) return;

  const header   = document.getElementById('ctxmenu-header');
  const btnEdit  = document.getElementById('ctxmenu-edit');
  const btnReassign = document.getElementById('ctxmenu-reassign');
  const btnSafe  = document.getElementById('ctxmenu-safezone');
  const btnSafeText = document.getElementById('ctxmenu-safezone-text');
  const btnFinish = document.getElementById('ctxmenu-finish');
  const btnDel   = document.getElementById('ctxmenu-delete');

  // EDITAR → Abre la tarjeta de edición rápida (QuickEdit)
  btnEdit.addEventListener('click', () => {
    if (!_ctxMenuToken) return;
    menu.style.display = 'none';
    playSound('coin');
    filaEditar(_ctxMenuToken.id);
  });

  // REUBICAR / AMPLIAR → Entra en modo de reasignación por arrastre
  btnReassign.addEventListener('click', () => {
    if (!_ctxMenuToken) return;
    menu.style.display = 'none';
    filaMover(_ctxMenuToken.id);
  });

  // ZONA SEGURA → Replegar/Reanudar (solo cuadrillas a pie)
  btnSafe.addEventListener('click', () => {
    if (!_ctxMenuToken || _ctxMenuToken.type !== 'crew') return;
    menu.style.display = 'none';
    filaAndén(_ctxMenuToken.id);
  });

  // CONCLUIR TRABAJO → Archivar como concluido con hora de salida
  btnFinish.addEventListener('click', () => {
    if (!_ctxMenuToken) return;
    menu.style.display = 'none';
    const curTime = new Date().toLocaleTimeString('es-PE', { hour12: false, hour: '2-digit', minute: '2-digit' });
    filaConcluir(_ctxMenuToken.id);
  });

  // ELIMINAR → Despejar de la vía
  btnDel.addEventListener('click', () => {
    if (!_ctxMenuToken) return;
    menu.style.display = 'none';
    filaDespejar(_ctxMenuToken.id);
  });

  // Cerrar el menú al hacer clic fuera o presionar Escape
  document.addEventListener('mousedown', (e) => {
    if (menu.style.display !== 'none' && !menu.contains(e.target)) {
      menu.style.display = 'none';
      _ctxMenuToken = null;
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.style.display !== 'none') {
      menu.style.display = 'none';
      _ctxMenuToken = null;
    }
  });
}

/**
 * Abre el menú contextual flotante sobre un token de cuadrilla o vehículo.
 * @param {Object} token - Entidad crew o vehicle del appState.
 * @param {number} clientX - Coordenada X del clic derecho.
 * @param {number} clientY - Coordenada Y del clic derecho.
 */
function showTokenContextMenu(token, clientX, clientY) {
  const menu = document.getElementById('vp-token-ctxmenu');
  if (!menu) return;

  _ctxMenuToken = token;
  playSound('click');

  const header   = document.getElementById('ctxmenu-header');
  const btnSafe  = document.getElementById('ctxmenu-safezone');
  const btnSafeText = document.getElementById('ctxmenu-safezone-text');

  if (token.type === 'crew') {
    header.textContent = '👷 ' + (token.responsible || 'Cuadrilla') + ' (' + token.via + ')';
    btnSafe.style.display = 'flex';
    btnSafeText.textContent = token.inSafeZone ? 'Reanudar en Vía' : 'Mover a Zona Segura';
  } else {
    header.textContent = '🚜 ' + (token.vehicleType || 'Vehículo') + ' (' + token.via + ')';
    btnSafe.style.display = 'none';
  }

  // Posicionar sin desbordar la pantalla
  menu.style.display = 'block';
  const menuW = menu.offsetWidth;
  const menuH = menu.offsetHeight;
  let posX = clientX;
  let posY = clientY;

  if (posX + menuW > window.innerWidth - 8) {
    posX = window.innerWidth - menuW - 8;
  }
  if (posY + menuH > window.innerHeight - 8) {
    posY = window.innerHeight - menuH - 8;
  }
  if (posX < 4) posX = 4;
  if (posY < 4) posY = 4;

  menu.style.left = posX + 'px';
  menu.style.top = posY + 'px';
}

// ==============================================================================
// RESOLUCIÓN DE MODELOS VISUALES DIFERENCIADOS (CUADRILLAS Y VEHÍCULOS)
// ==============================================================================
function getCrewModel(crew) {
  if (!crew) return { id: 0, index: 0 };
  const num = parseInt((crew.id || '').replace(/\D/g, ''), 10) || 0;
  return { id: num, index: num % 10 };
}

function getVehicleModel(veh) {
  if (!veh) return { id: 0, index: 0 };
  const num = parseInt((veh.id || '').replace(/\D/g, ''), 10) || 0;
  return { id: num, index: num % 10 };
}

// ==============================================================================
// CATÁLOGO DE 10 MODELOS DISTINTOS DE PERSONAS A PIE (SILUETAS Y EQUIPOS ÚNICOS)
// ==============================================================================
function renderCrewVisualModel(crew, modelIndex) {
  const mIdx = Math.abs(modelIndex % 10);
  const isWorking = !!crew.isWorking;
  
  // 10 Modelos Morfológicamente Únicos de Cuadrilla a Pie (Diseño Industrial Ferroviario)
  switch(mIdx) {
    case 0:
      // M0: Bateador de vía
      return `
        <g class="crew-companion-group" transform="translate(-16, 0)">
          <rect x="-3" y="-10" width="6" height="12" rx="1" fill="#475569" stroke="#1e293b" stroke-width="1.2" />
          <polygon points="-5,-8 5,-8 0,-16" fill="#f97316" stroke="#9a3412" stroke-width="1.2" />
        </g>
        <g class="crew-char-body">
          <g class="crew-leg-left"><path d="M -4,4 L -4,11 L -1,11 L -1,4 Z" fill="#1e293b" /><path d="M -5,11 L 0,11 L 0,15 L -6,15 Z" fill="#451a03" /></g>
          <g class="crew-leg-right"><path d="M 1,4 L 1,11 L 4,11 L 4,4 Z" fill="#1e293b" /><path d="M 0,11 L 5,11 L 5,15 L -1,15 Z" fill="#451a03" /></g>
          <path d="M -7,-6 L 7,-6 L 6,4 L -6,4 Z" fill="#ff6b1a" stroke="#9a3412" stroke-width="1.3" />
          <line x1="-5" y1="-4" x2="5" y2="2" stroke="#f8fafc" stroke-width="1.6" />
          <line x1="5" y1="-4" x2="-5" y2="2" stroke="#f8fafc" stroke-width="1.6" />
          <circle cx="0" cy="-9" r="4.2" fill="#fde68a" />
          <path d="M -5.5,-11 Q 0,-17 5.5,-11 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.2" />
          <rect x="-7" y="-10" width="2.2" height="4" rx="1" fill="#1e293b" />
          <rect x="4.8" y="-10" width="2.2" height="4" rx="1" fill="#1e293b" />
          <g class="crew-tamper-tool" style="display:${isWorking ? 'block' : 'none'};">
            <rect x="-1" y="-2" width="14" height="10" rx="2" fill="#d97706" stroke="#78350f" stroke-width="1.2" />
            <line x1="3" y1="-4" x2="11" y2="-4" stroke="#1e293b" stroke-width="2.2" stroke-linecap="round" />
            <line x1="3" y1="8" x2="2" y2="16" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" />
            <line x1="9" y1="8" x2="10" y2="16" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" />
            <circle cx="2" cy="16" r="1.4" fill="#fef08a" class="crew-work-sparks" />
            <circle cx="10" cy="16" r="1.4" fill="#fef08a" class="crew-work-sparks" />
          </g>
          <g class="crew-patrol-tool" style="display:${isWorking ? 'none' : 'block'};">
            <line x1="4" y1="-4" x2="14" y2="-10" stroke="#94a3b8" stroke-width="2.2" stroke-linecap="round" />
            <rect x="12" y="-12" width="5" height="4" rx="1" fill="#475569" />
          </g>
          <g class="crew-safe-thumbsup" style="display:none;">
            <circle cx="5" cy="-7" r="3.5" fill="#fde68a" stroke="#ca8a04" stroke-width="1" />
            <path d="M 4,-8 L 6,-10 L 6,-6 Z" fill="#f97316" />
          </g>
        </g>`;

    case 1:
      // M1: Inspector ATS
      return `
        <g class="crew-companion-group" transform="translate(-16, 0)">
          <rect x="-4" y="-3" width="8" height="6" rx="1" fill="#facc15" stroke="#ca8a04" stroke-width="1.2" />
          <rect x="-3" y="-2" width="6" height="4" fill="#0f172a" />
        </g>
        <g class="crew-char-body">
          <g class="crew-leg-left"><path d="M -4,4 L -4,11 L -1,11 L -1,4 Z" fill="#1e293b" /><path d="M -5,11 L 0,11 L 0,15 L -6,15 Z" fill="#451a03" /></g>
          <g class="crew-leg-right"><path d="M 1,4 L 1,11 L 4,11 L 4,4 Z" fill="#1e293b" /><path d="M 0,11 L 5,11 L 5,15 L -1,15 Z" fill="#451a03" /></g>
          <path d="M -7,-6 L 7,-6 L 6,4 L -6,4 Z" fill="#ff6b1a" stroke="#9a3412" stroke-width="1.3" />
          <line x1="-5" y1="-1" x2="5" y2="-1" stroke="#f8fafc" stroke-width="1.6" />
          <rect x="-8" y="-9" width="3" height="5" rx="0.6" fill="#1e293b" />
          <line x1="-6.5" y1="-9" x2="-6.5" y2="-13" stroke="#1e293b" stroke-width="1.2" />
          <circle cx="0" cy="-9" r="4.2" fill="#fde68a" />
          <path d="M -5.5,-11 Q 0,-17 5.5,-11 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.2" />
          <path d="M -3.5,-9 L 3.5,-9 L 2.5,-6 L -2.5,-6 Z" fill="#38bdf8" opacity="0.9" />
          <g class="crew-tamper-tool" style="display:${isWorking ? 'block' : 'none'};">
            <rect x="4" y="-6" width="11" height="8" rx="1.2" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2" />
            <rect x="5.5" y="-4.5" width="8" height="5" fill="#0369a1" />
            <line x1="6.5" y1="-2" x2="11.5" y2="-2" stroke="#38bdf8" stroke-width="1.2" />
            <line x1="14" y1="-2" x2="22" y2="-2" stroke="#38bdf8" stroke-width="1" opacity="0.6" class="surveyor-laser-beam" />
          </g>
          <g class="crew-patrol-tool" style="display:${isWorking ? 'none' : 'block'};">
            <rect x="4" y="-2" width="4" height="8" rx="1" fill="#1e293b" />
            <circle cx="6" cy="-4" r="2.2" fill="#fef08a" />
          </g>
          <g class="crew-safe-thumbsup" style="display:none;">
            <circle cx="5" cy="-7" r="3.5" fill="#fde68a" stroke="#ca8a04" stroke-width="1" />
            <path d="M 4,-8 L 6,-10 L 6,-6 Z" fill="#f97316" />
          </g>
        </g>`;

    case 2:
      // M2: Soldador aluminotérmico
      return `
        <g class="crew-companion-group" transform="translate(-16, 0)">
          <rect x="-4" y="-12" width="3.5" height="14" rx="1" fill="#1e3a8a" stroke="#1d4ed8" stroke-width="1" />
          <rect x="0.5" y="-10" width="3.5" height="12" rx="1" fill="#7f1d1d" stroke="#b91c1c" stroke-width="1" />
        </g>
        <g class="crew-char-body">
          <g class="crew-leg-left"><path d="M -4,4 L -4,11 L -1,11 L -1,4 Z" fill="#1e293b" /><path d="M -5,11 L 0,11 L 0,15 L -6,15 Z" fill="#451a03" /></g>
          <g class="crew-leg-right"><path d="M 1,4 L 1,11 L 4,11 L 4,4 Z" fill="#1e293b" /><path d="M 0,11 L 5,11 L 5,15 L -1,15 Z" fill="#451a03" /></g>
          <path d="M -7,-6 L 7,-6 L 6,4 L -6,4 Z" fill="#ff6b1a" stroke="#9a3412" stroke-width="1.3" />
          <path d="M -5,-4 L 5,-4 L 4,3 L -4,3 Z" fill="#b45309" />
          <rect x="-4.5" y="-13" width="9" height="9" rx="2" fill="#1e293b" stroke="#ca8a04" stroke-width="1.2" />
          <rect x="-2.5" y="-10" width="5" height="3" rx="0.5" fill="#f59e0b" />
          <circle cx="0" cy="-9" r="4.2" fill="#fde68a" />
          <g class="crew-tamper-tool" style="display:${isWorking ? 'block' : 'none'};">
            <line x1="-2" y1="0" x2="8" y2="6" stroke="#94a3b8" stroke-width="2.2" stroke-linecap="round" />
            <polygon points="8,6 13,7 9,10" fill="#38bdf8" />
            <circle cx="10" cy="8" r="1.3" fill="#ffffff" class="crew-work-sparks" />
            <circle cx="13" cy="5" r="1.3" fill="#fbbf24" class="crew-work-sparks" />
            <circle cx="12" cy="11" r="1.2" fill="#ef4444" class="crew-work-sparks" />
          </g>
          <g class="crew-patrol-tool" style="display:${isWorking ? 'none' : 'block'};">
            <line x1="4" y1="2" x2="13" y2="-5" stroke="#94a3b8" stroke-width="2.2" stroke-linecap="round" />
            <polygon points="13,-5 16,-7 14,-3" fill="#475569" />
          </g>
          <g class="crew-safe-thumbsup" style="display:none;">
            <circle cx="5" cy="-7" r="3.5" fill="#fde68a" stroke="#ca8a04" stroke-width="1" />
            <path d="M 4,-8 L 6,-10 L 6,-6 Z" fill="#f97316" />
          </g>
        </g>`;

    case 3:
      // M3: Técnico ultrasónico
      return `
        <g class="crew-companion-group" transform="translate(-16, 0)">
          <rect x="-4" y="-6" width="8" height="10" rx="1" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2" />
          <line x1="0" y1="-6" x2="0" y2="-11" stroke="#94a3b8" stroke-width="1.2" />
        </g>
        <g class="crew-char-body">
          <g class="crew-leg-left"><path d="M -4,4 L -4,11 L -1,11 L -1,4 Z" fill="#1e293b" /><path d="M -5,11 L 0,11 L 0,15 L -6,15 Z" fill="#451a03" /></g>
          <g class="crew-leg-right"><path d="M 1,4 L 1,11 L 4,11 L 4,4 Z" fill="#1e293b" /><path d="M 0,11 L 5,11 L 5,15 L -1,15 Z" fill="#451a03" /></g>
          <path d="M -7,-6 L 7,-6 L 6,4 L -6,4 Z" fill="#ff6b1a" stroke="#9a3412" stroke-width="1.3" />
          <line x1="-5" y1="-1" x2="5" y2="-1" stroke="#f8fafc" stroke-width="1.6" />
          <circle cx="0" cy="-9" r="4.2" fill="#fde68a" />
          <path d="M -5.5,-11 Q 0,-17 5.5,-11 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="1.2" />
          <path d="M -5.5,-8 A 5.5,5.5 0 0 1 5.5,-8" stroke="#1e293b" stroke-width="1.6" fill="none" />
          <circle cx="-5.5" cy="-8" r="2.2" fill="#facc15" />
          <circle cx="5.5" cy="-8" r="2.2" fill="#facc15" />
          <g class="crew-tamper-tool" style="display:${isWorking ? 'block' : 'none'};">
            <rect x="-1" y="2" width="16" height="5" rx="1" fill="#334155" stroke="#64748b" stroke-width="1.2" />
            <circle cx="2" cy="7" r="2.5" fill="#0f172a" stroke="#cbd5e1" stroke-width="1" />
            <circle cx="12" cy="7" r="2.5" fill="#0f172a" stroke="#cbd5e1" stroke-width="1" />
            <rect x="6" y="-5" width="7" height="7" rx="1" fill="#0f172a" stroke="#22c55e" stroke-width="1" />
            <line x1="7" y1="-1.5" x2="12" y2="-1.5" stroke="#22c55e" stroke-width="1.2" />
            <polygon points="3,6 6,6 7,15 2,15" fill="#22c55e" opacity="0.45" />
          </g>
          <g class="crew-patrol-tool" style="display:${isWorking ? 'none' : 'block'};">
            <path d="M 4,-2 L 12,-2 L 12,2 L 8,4 L 4,2 Z" fill="#94a3b8" stroke="#475569" stroke-width="1.2" />
          </g>
          <g class="crew-safe-thumbsup" style="display:none;">
            <circle cx="5" cy="-7" r="3.5" fill="#fde68a" stroke="#ca8a04" stroke-width="1" />
            <path d="M 4,-8 L 6,-10 L 6,-6 Z" fill="#f97316" />
          </g>
        </g>`;

    case 4:
      // M4: Liniero catenaria
      return `
        <g class="crew-companion-group" transform="translate(-16, 0)">
          <rect x="-2" y="-6" width="4" height="12" rx="1" fill="#eab308" stroke="#a16207" stroke-width="1.2" />
          <circle cx="0" cy="-8" r="2.5" fill="#ef4444" />
          <text x="0" y="-5" font-size="4" fill="#0f172a" text-anchor="middle" font-weight="bold">⚡</text>
        </g>
        <g class="crew-char-body">
          <g class="crew-leg-left"><path d="M -4,4 L -4,11 L -1,11 L -1,4 Z" fill="#1e293b" /><path d="M -5,11 L 0,11 L 0,15 L -6,15 Z" fill="#451a03" /></g>
          <g class="crew-leg-right"><path d="M 1,4 L 1,11 L 4,11 L 4,4 Z" fill="#1e293b" /><path d="M 0,11 L 5,11 L 5,15 L -1,15 Z" fill="#451a03" /></g>
          <path d="M -7,-6 L 7,-6 L 6,4 L -6,4 Z" fill="#ff6b1a" stroke="#9a3412" stroke-width="1.3" />
          <line x1="-4" y1="-6" x2="-1" y2="4" stroke="#f8fafc" stroke-width="1.6" />
          <line x1="4" y1="-6" x2="1" y2="4" stroke="#f8fafc" stroke-width="1.6" />
          <circle cx="0" cy="-9" r="4.2" fill="#fde68a" />
          <path d="M -5.5,-11 Q 0,-17 5.5,-11 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="1.2" />
          <circle cx="-7" cy="0" r="2.2" fill="#facc15" />
          <circle cx="7" cy="0" r="2.2" fill="#facc15" />
          <g class="crew-tamper-tool" style="display:${isWorking ? 'block' : 'none'};">
            <line x1="4" y1="2" x2="10" y2="-22" stroke="#eab308" stroke-width="2.2" stroke-linecap="round" />
            <path d="M 9,-21 L 11,-24 L 14,-23" fill="none" stroke="#e2e8f0" stroke-width="1.8" />
            <circle cx="12" cy="-23" r="1.6" fill="#38bdf8" class="crew-work-sparks" />
          </g>
          <g class="crew-patrol-tool" style="display:${isWorking ? 'none' : 'block'};">
            <line x1="4" y1="-2" x2="16" y2="-2" stroke="#eab308" stroke-width="2.2" stroke-linecap="round" />
            <rect x="14" y="-4" width="4" height="4" rx="1" fill="#475569" />
          </g>
          <g class="crew-safe-thumbsup" style="display:none;">
            <circle cx="5" cy="-7" r="3.5" fill="#fde68a" stroke="#ca8a04" stroke-width="1" />
            <path d="M 4,-8 L 6,-10 L 6,-6 Z" fill="#f97316" />
          </g>
        </g>`;

    case 5:
      // M5: Mecánico de agujas
      return `
        <g class="crew-companion-group" transform="translate(-16, 0)">
          <rect x="-4" y="-2" width="8" height="6" rx="1" fill="#b91c1c" stroke="#7f1d1d" stroke-width="1.2" />
          <line x1="-2" y1="-2" x2="2" y2="-2" stroke="#fca5a5" stroke-width="1.2" />
        </g>
        <g class="crew-char-body">
          <g class="crew-leg-left"><path d="M -4,4 L -4,11 L -1,11 L -1,4 Z" fill="#1e293b" /><path d="M -5,11 L 0,11 L 0,15 L -6,15 Z" fill="#451a03" /></g>
          <g class="crew-leg-right"><path d="M 1,4 L 1,11 L 4,11 L 4,4 Z" fill="#1e293b" /><path d="M 0,11 L 5,11 L 5,15 L -1,15 Z" fill="#451a03" /></g>
          <path d="M -7,-6 L 7,-6 L 6,4 L -6,4 Z" fill="#ff6b1a" stroke="#9a3412" stroke-width="1.3" />
          <rect x="-5" y="-2" width="10" height="3" rx="0.5" fill="#475569" />
          <circle cx="0" cy="-9" r="4.2" fill="#fde68a" />
          <path d="M -5.5,-11 Q 0,-17 5.5,-11 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="1.2" />
          <g class="crew-tamper-tool" style="display:${isWorking ? 'block' : 'none'};">
            <line x1="-2" y1="1" x2="14" y2="-4" stroke="#cbd5e1" stroke-width="2.4" stroke-linecap="round" />
            <circle cx="14" cy="-4" r="2.2" fill="#475569" />
          </g>
          <g class="crew-patrol-tool" style="display:${isWorking ? 'none' : 'block'};">
            <line x1="4" y1="-2" x2="13" y2="-6" stroke="#94a3b8" stroke-width="2.2" stroke-linecap="round" />
            <rect x="11" y="-9" width="4" height="5" rx="1" fill="#eab308" />
          </g>
          <g class="crew-safe-thumbsup" style="display:none;">
            <circle cx="5" cy="-7" r="3.5" fill="#fde68a" stroke="#ca8a04" stroke-width="1" />
            <path d="M 4,-8 L 6,-10 L 6,-6 Z" fill="#f97316" />
          </g>
        </g>`;

    case 6:
      // M6: Topógrafo
      return `
        <g class="crew-companion-group" transform="translate(-16, 0)">
          <line x1="0" y1="-12" x2="0" y2="12" stroke="#ef4444" stroke-width="1.6" />
          <line x1="0" y1="-4" x2="0" y2="4" stroke="#f8fafc" stroke-width="1.6" />
          <circle cx="0" cy="-12" r="2.5" fill="#38bdf8" stroke="#0284c7" stroke-width="1" />
        </g>
        <g class="crew-char-body">
          <g class="crew-leg-left"><path d="M -4,4 L -4,11 L -1,11 L -1,4 Z" fill="#1e293b" /><path d="M -5,11 L 0,11 L 0,15 L -6,15 Z" fill="#451a03" /></g>
          <g class="crew-leg-right"><path d="M 1,4 L 1,11 L 4,11 L 4,4 Z" fill="#1e293b" /><path d="M 0,11 L 5,11 L 5,15 L -1,15 Z" fill="#451a03" /></g>
          <path d="M -7,-6 L 7,-6 L 6,4 L -6,4 Z" fill="#ff6b1a" stroke="#9a3412" stroke-width="1.3" />
          <line x1="-5" y1="-3" x2="5" y2="-3" stroke="#f8fafc" stroke-width="1.6" />
          <circle cx="0" cy="-9" r="4.2" fill="#fde68a" />
          <path d="M -5.5,-11 Q 0,-17 5.5,-11 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.2" />
          <path d="M -4,-12 L 4,-12 L 3,-10 L -3,-10 Z" fill="#f8fafc" />
          <g class="crew-tamper-tool" style="display:${isWorking ? 'block' : 'none'};">
            <line x1="0" y1="2" x2="-5" y2="13" stroke="#b45309" stroke-width="1.8" />
            <line x1="0" y1="2" x2="0" y2="14" stroke="#cbd5e1" stroke-width="1.8" />
            <line x1="0" y1="2" x2="5" y2="13" stroke="#b45309" stroke-width="1.8" />
            <rect x="-3.5" y="-7" width="7" height="7" rx="1.5" fill="#15803d" stroke="#166534" stroke-width="1.2" />
            <circle cx="0" cy="-3.5" r="1.8" fill="#38bdf8" />
            <line x1="3.5" y1="-3.5" x2="18" y2="-3.5" stroke="#ef4444" stroke-width="1.2" />
            <circle cx="18" cy="-3.5" r="1.4" fill="#ef4444" class="crew-work-sparks" />
          </g>
          <g class="crew-patrol-tool" style="display:${isWorking ? 'none' : 'block'};">
            <line x1="3" y1="-2" x2="10" y2="-10" stroke="#b45309" stroke-width="1.8" />
            <line x1="3" y1="-2" x2="10" y2="2" stroke="#b45309" stroke-width="1.8" />
            <line x1="3" y1="-2" x2="10" y2="-4" stroke="#cbd5e1" stroke-width="1.8" />
          </g>
          <g class="crew-safe-thumbsup" style="display:none;">
            <circle cx="5" cy="-7" r="3.5" fill="#fde68a" stroke="#ca8a04" stroke-width="1" />
            <path d="M 4,-8 L 6,-10 L 6,-6 Z" fill="#f97316" />
          </g>
        </g>`;

    case 7:
      // M7: Ingeniero fibra óptica
      return `
        <g class="crew-companion-group" transform="translate(-16, 0)">
          <circle cx="0" cy="-4" r="4" fill="none" stroke="#eab308" stroke-width="1.6" />
        </g>
        <g class="crew-char-body">
          <g class="crew-leg-left"><path d="M -4,4 L -4,11 L -1,11 L -1,4 Z" fill="#1e293b" /><path d="M -5,11 L 0,11 L 0,15 L -6,15 Z" fill="#451a03" /></g>
          <g class="crew-leg-right"><path d="M 1,4 L 1,11 L 4,11 L 4,4 Z" fill="#1e293b" /><path d="M 0,11 L 5,11 L 5,15 L -1,15 Z" fill="#451a03" /></g>
          <path d="M -7,-6 L 7,-6 L 6,4 L -6,4 Z" fill="#ff6b1a" stroke="#9a3412" stroke-width="1.3" />
          <rect x="-6" y="-4" width="5" height="8" rx="1" fill="#475569" />
          <circle cx="0" cy="-9" r="4.2" fill="#fde68a" />
          <path d="M -5.5,-11 Q 0,-17 5.5,-11 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.2" />
          <circle cx="2" cy="-8.5" r="1.5" fill="#38bdf8" />
          <g class="crew-tamper-tool" style="display:${isWorking ? 'block' : 'none'};">
            <line x1="-2" y1="3" x2="12" y2="3" stroke="#94a3b8" stroke-width="1.8" />
            <line x1="0" y1="3" x2="-2" y2="12" stroke="#475569" stroke-width="1.2" />
            <line x1="10" y1="3" x2="12" y2="12" stroke="#475569" stroke-width="1.2" />
            <rect x="0" y="-3" width="10" height="6" rx="1.2" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2" />
            <rect x="2" y="-1.5" width="6" height="3" fill="#0284c7" />
            <circle cx="5" cy="0" r="1.2" fill="#ffffff" class="crew-work-sparks" />
          </g>
          <g class="crew-patrol-tool" style="display:${isWorking ? 'none' : 'block'};">
            <rect x="4" y="-4" width="7" height="5" rx="1" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2" />
            <rect x="5.5" y="-2.5" width="4" height="2" fill="#38bdf8" />
          </g>
          <g class="crew-safe-thumbsup" style="display:none;">
            <circle cx="5" cy="-7" r="3.5" fill="#fde68a" stroke="#ca8a04" stroke-width="1" />
            <path d="M 4,-8 L 6,-10 L 6,-6 Z" fill="#f97316" />
          </g>
        </g>`;

    case 8:
      // M8: Operador tronzadora
      return `
        <g class="crew-companion-group" transform="translate(-16, 0)">
          <rect x="-2" y="-2" width="4" height="10" rx="1" fill="#dc2626" stroke="#991b1b" stroke-width="1.2" />
          <circle cx="0" cy="-4" r="1.5" fill="#f8fafc" />
        </g>
        <g class="crew-char-body">
          <g class="crew-leg-left"><path d="M -4,4 L -4,11 L -1,11 L -1,4 Z" fill="#1e293b" /><path d="M -5,11 L 0,11 L 0,15 L -6,15 Z" fill="#451a03" /></g>
          <g class="crew-leg-right"><path d="M 1,4 L 1,11 L 4,11 L 4,4 Z" fill="#1e293b" /><path d="M 0,11 L 5,11 L 5,15 L -1,15 Z" fill="#451a03" /></g>
          <path d="M -7,-6 L 7,-6 L 6,4 L -6,4 Z" fill="#ff6b1a" stroke="#9a3412" stroke-width="1.3" />
          <circle cx="0" cy="-9" r="4.2" fill="#fde68a" />
          <path d="M -5.5,-11 Q 0,-17 5.5,-11 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.2" />
          <rect x="-3" y="-10" width="7" height="6" rx="1.5" fill="#38bdf8" opacity="0.75" />
          <g class="crew-tamper-tool" style="display:${isWorking ? 'block' : 'none'};">
            <rect x="-2" y="-3" width="9" height="7" rx="1.5" fill="#1e293b" stroke="#475569" stroke-width="1.2" />
            <circle cx="8" cy="5" r="6" fill="#1e293b" stroke="#94a3b8" stroke-width="1.2" />
            <circle cx="8" cy="5" r="1.8" fill="#e2e8f0" />
            <path d="M 4,-2 A 6,6 0 0 1 12,1" stroke="#facc15" stroke-width="1.6" fill="none" />
            <circle cx="4" cy="6" r="1.3" fill="#ffffff" class="crew-work-sparks" />
            <circle cx="1" cy="9" r="1.4" fill="#f59e0b" class="crew-work-sparks" />
            <circle cx="-1" cy="12" r="1.2" fill="#ef4444" class="crew-work-sparks" />
          </g>
          <g class="crew-patrol-tool" style="display:${isWorking ? 'none' : 'block'};">
            <circle cx="8" cy="-1" r="4" fill="#1e293b" stroke="#94a3b8" stroke-width="1.2" />
            <circle cx="8" cy="-1" r="1.2" fill="#e2e8f0" />
          </g>
          <g class="crew-safe-thumbsup" style="display:none;">
            <circle cx="5" cy="-7" r="3.5" fill="#fde68a" stroke="#ca8a04" stroke-width="1" />
            <path d="M 4,-8 L 6,-10 L 6,-6 Z" fill="#f97316" />
          </g>
        </g>`;

    case 9:
    default:
      // M9: Guardavías
      return `
        <g class="crew-companion-group" transform="translate(-16, 0)">
          <circle cx="-3" cy="-4" r="2.2" fill="#ef4444" />
          <circle cx="3" cy="-4" r="2.2" fill="#ef4444" />
          <rect x="-5" y="2" width="10" height="1.5" rx="0.4" fill="#0f172a" />
        </g>
        <g class="crew-char-body">
          <g class="crew-leg-left"><path d="M -4,4 L -4,11 L -1,11 L -1,4 Z" fill="#1e293b" /><path d="M -5,11 L 0,11 L 0,15 L -6,15 Z" fill="#451a03" /></g>
          <g class="crew-leg-right"><path d="M 1,4 L 1,11 L 4,11 L 4,4 Z" fill="#1e293b" /><path d="M 0,11 L 5,11 L 5,15 L -1,15 Z" fill="#451a03" /></g>
          <path d="M -7,-6 L 7,-6 L 6,4 L -6,4 Z" fill="#ff6b1a" stroke="#9a3412" stroke-width="1.3" />
          <line x1="-6" y1="-3" x2="6" y2="-3" stroke="#f8fafc" stroke-width="1.6" />
          <line x1="-5" y1="1" x2="5" y2="1" stroke="#f8fafc" stroke-width="1.6" />
          <circle cx="0" cy="-9" r="4.2" fill="#fde68a" />
          <path d="M -5.5,-11 Q 0,-17 5.5,-11 Z" fill="#dc2626" stroke="#991b1b" stroke-width="1.2" />
          <circle cx="0" cy="-13" r="1.3" fill="#f8fafc" />
          <g class="crew-tamper-tool" style="display:${isWorking ? 'block' : 'none'};">
            <line x1="5" y1="2" x2="5" y2="-12" stroke="#94a3b8" stroke-width="1.8" />
            <polygon points="1,-16 9,-16 12,-13 12,-7 9,-4 1,-4 -2,-7 -2,-13" fill="#dc2626" stroke="#f8fafc" stroke-width="1" />
            <rect x="-3" y="0" width="4" height="6" rx="0.8" fill="#1e293b" />
            <circle cx="-1" cy="5" r="1.8" fill="#ef4444" class="crew-work-sparks" />
          </g>
          <g class="crew-patrol-tool" style="display:${isWorking ? 'none' : 'block'};">
            <line x1="4" y1="2" x2="4" y2="-10" stroke="#991b1b" stroke-width="2.2" />
            <rect x="2" y="-14" width="4" height="6" rx="1" fill="#dc2626" />
          </g>
          <g class="crew-safe-thumbsup" style="display:none;">
            <circle cx="5" cy="-7" r="3.5" fill="#fde68a" stroke="#ca8a04" stroke-width="1" />
            <path d="M 4,-8 L 6,-10 L 6,-6 Z" fill="#f97316" />
          </g>
        </g>`;
  }
}

function renderVehicleVisualModel(veh, modelIndex) {
  const mIdx = Math.abs(modelIndex % 10);
  
  switch(mIdx) {
    case 0:
      // MODELO 0: DRESINA DE CATENARIA PLASSER & THEURER MTW 100
      return `
        <!-- Chasis ferroviario pesado de acero -->
        <rect x="-52" y="2" width="104" height="10" rx="2" fill="#0f172a" stroke="#334155" stroke-width="1.2" />
        <rect x="-50" y="4" width="100" height="5" fill="url(#hazard-stripes)" rx="1" />
        <g transform="translate(34, 13)"><circle cx="0" cy="0" r="5.5" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5" /><g class="veh-wheel-spoke"><line x1="-4" y1="0" x2="4" y2="0" stroke="#94a3b8" stroke-width="1.5" /><line x1="0" y1="-4" x2="0" y2="4" stroke="#94a3b8" stroke-width="1.5" /></g><circle cx="0" cy="0" r="2" fill="#64748b" /></g>
        <g transform="translate(-34, 13)"><circle cx="0" cy="0" r="5.5" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5" /><g class="veh-wheel-spoke"><line x1="-4" y1="0" x2="4" y2="0" stroke="#94a3b8" stroke-width="1.5" /><line x1="0" y1="-4" x2="0" y2="4" stroke="#94a3b8" stroke-width="1.5" /></g><circle cx="0" cy="0" r="2" fill="#64748b" /></g>
        <!-- Batea trasera con tambor bobinador de hilo de contacto de cobre 1500V -->
        <rect x="-50" y="-3" width="54" height="5" fill="#1e293b" />
        <circle cx="-24" cy="-6" r="5.5" fill="#b45309" stroke="#78350f" stroke-width="1.2" />
        <circle cx="-24" cy="-6" r="2" fill="#fde68a" />
        <rect x="-46" y="-8.5" width="12" height="6" rx="1" fill="#0f172a" stroke="#38bdf8" stroke-width="1" />
        <!-- Torreta elevadora de tijera hidráulica con barandilla perimetral -->
        <g class="veh-scissor-lift-group">
          <line x1="-12" y1="-9" x2="-4" y2="-19" stroke="#cbd5e1" stroke-width="1.6" />
          <line x1="-4" y1="-9" x2="-12" y2="-19" stroke="#cbd5e1" stroke-width="1.6" />
          <rect x="-15" y="-23" width="16" height="4" rx="0.8" fill="#0284c7" stroke="#0369a1" stroke-width="1" />
          <line x1="-15" y1="-27" x2="1" y2="-27" stroke="#ffffff" stroke-width="1.2" />
          <line x1="-15" y1="-27" x2="-15" y2="-23" stroke="#ffffff" stroke-width="1.2" />
          <line x1="1" y1="-27" x2="1" y2="-23" stroke="#ffffff" stroke-width="1.2" />
        </g>
        <!-- Cabina derecha -->
        <path d="M 4,-14 L 14,-23 L 44,-23 L 49,-14 L 49,2 L 4,2 Z" fill="#0284c7" stroke="#0369a1" stroke-width="1.4" />
        <polygon points="26,-21 43,-21 46,-12 26,-12" fill="url(#veh-glass-polar)" />
        <rect x="15" y="-25.5" width="6" height="3" rx="0.8" fill="#f59e0b" class="beacon-strobe-a" />
        <rect x="46" y="-8" width="5" height="3" rx="0.8" fill="#fef08a" />
        <rect x="46" y="-3" width="5" height="3" rx="0.8" fill="#fef08a" />
        <rect x="15" y="-25.5" width="6" height="3" rx="0.8" fill="#38bdf8" class="beacon-strobe-a" />
        <rect x="37" y="-25.5" width="6" height="3" rx="0.8" fill="#facc15" class="beacon-strobe-b" />`;

    case 1:
      // MODELO 1: CAMIÓN BIVIAL TOLVA DE BALASTO
      return `
        <!-- Chasis industrial de camión con ruedas de carretera y guía ferroviaria -->
        <rect x="-56" y="2" width="112" height="10" rx="2" fill="#0f172a" stroke="#334155" stroke-width="1.2" />
        <rect x="-54" y="4" width="108" height="5" fill="url(#hazard-stripes)" rx="1" />
        <g transform="translate(34, 13)"><circle cx="0" cy="0" r="5.5" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5" /><g class="veh-wheel-spoke"><line x1="-4" y1="0" x2="4" y2="0" stroke="#94a3b8" stroke-width="1.2" /><line x1="0" y1="-4" x2="0" y2="4" stroke="#94a3b8" stroke-width="1.2" /></g><circle cx="0" cy="0" r="2" fill="#64748b" /></g>
        <g transform="translate(-34, 13)"><circle cx="0" cy="0" r="5.5" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5" /><g class="veh-wheel-spoke"><line x1="-4" y1="0" x2="4" y2="0" stroke="#94a3b8" stroke-width="1.2" /><line x1="0" y1="-4" x2="0" y2="4" stroke="#94a3b8" stroke-width="1.2" /></g><circle cx="0" cy="0" r="2" fill="#64748b" /></g>
        <!-- Tolva volquete basculante trasera de alta capacidad -->
        <polygon points="-54,-13 -4,-13 2,-2 -54,-2" fill="#1e293b" stroke="#334155" stroke-width="1.2" />
        <!-- Carga de piedra balasto de granito visible -->
        <ellipse cx="-26" cy="-13" rx="20" ry="3.5" fill="#64748b" stroke="#475569" stroke-width="0.8" />
        <!-- Cabina alta de camión MAN TGS naranja con visera y snorkel de admisión -->
        <path d="M 2,-14 L 10,-26 L 48,-26 L 54,-14 L 54,2 L 2,2 Z" fill="#0284c7" stroke="#0369a1" stroke-width="1.4" />
        <!-- Calandra frontal imponente con radiador negro y faros dobles -->
        <rect x="46" y="-12" width="7.5" height="13" fill="#0f172a" rx="1" />
        <line x1="47" y1="-10" x2="52" y2="-10" stroke="#cbd5e1" stroke-width="0.9" />
        <line x1="47" y1="-7" x2="52" y2="-7" stroke="#cbd5e1" stroke-width="0.9" />
        <line x1="47" y1="-4" x2="52" y2="-4" stroke="#cbd5e1" stroke-width="0.9" />
        <polygon points="26,-24 45,-24 48,-14 26,-14" fill="url(#veh-glass-polar)" />
        <!-- Tubo de escape vertical con deflector de lluvia -->
        <line x1="5" y1="-2" x2="5" y2="-28" stroke="#475569" stroke-width="2.2" />
        <line x1="3" y1="-28" x2="7" y2="-28" stroke="#94a3b8" stroke-width="1.5" class="veh-exhaust-flapper" />
        <rect x="22" y="-28.5" width="22" height="3" rx="1" fill="#38bdf8" class="beacon-strobe-a" />`;

    case 2:
      // MODELO 2: FURGÓN BIVIAL TALLER DE ENCLAVAMIENTOS Y SEÑALIZACIÓN (Persianas enrollables y antena satelital)
      return `
        <rect x="-52" y="2" width="104" height="10" rx="2" fill="#0f172a" stroke="#334155" stroke-width="1.2" />
        <g transform="translate(32, 13)"><circle cx="0" cy="0" r="5.5" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5" /><g class="veh-wheel-spoke"><line x1="-4" y1="0" x2="4" y2="0" stroke="#94a3b8" stroke-width="1.2" /><line x1="0" y1="-4" x2="0" y2="4" stroke="#94a3b8" stroke-width="1.2" /></g><circle cx="0" cy="0" r="2" fill="#64748b" /></g>
        <g transform="translate(-32, 13)"><circle cx="0" cy="0" r="5.5" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5" /><g class="veh-wheel-spoke"><line x1="-4" y1="0" x2="4" y2="0" stroke="#94a3b8" stroke-width="1.2" /><line x1="0" y1="-4" x2="0" y2="4" stroke="#94a3b8" stroke-width="1.2" /></g><circle cx="0" cy="0" r="2" fill="#64748b" /></g>
        <!-- Furgón carrozado técnico en azul oscuro/petróleo con persianas de aluminio -->
        <rect x="-50" y="-16" width="56" height="18" rx="2" fill="#0f172a" stroke="#0284c7" stroke-width="1.2" />
        <!-- Persianas enrollables de acceso rápido a instrumental -->
        <rect x="-47" y="-13" width="22" height="13" rx="1" fill="#334155" stroke="#94a3b8" stroke-width="0.8" />
        <line x1="-47" y1="-10" x2="-25" y2="-10" stroke="#64748b" stroke-width="0.8" />
        <line x1="-47" y1="-7" x2="-25" y2="-7" stroke="#64748b" stroke-width="0.8" />
        <line x1="-47" y1="-4" x2="-25" y2="-4" stroke="#64748b" stroke-width="0.8" />
        <rect x="-21" y="-13" width="23" height="13" rx="1" fill="#334155" stroke="#94a3b8" stroke-width="0.8" />
        <!-- Baca portaequipajes en techo con escalera plegable y antena parabólica -->
        <line x1="-48" y1="-19" x2="4" y2="-19" stroke="#cbd5e1" stroke-width="1.2" />
        <path d="M -35,-19 L -32,-25 A 4,4 0 0 1 -24,-23 Z" fill="#94a3b8" stroke="#e2e8f0" stroke-width="0.8" />
        <!-- Cabina integrada de furgón Mercedes Sprinter / Unimog -->
        <path d="M 6,-14 L 14,-22 L 42,-22 L 48,-12 L 48,2 L 6,2 Z" fill="#0369a1" stroke="#0284c7" stroke-width="1.3" />
        <polygon points="26,-20 40,-20 44,-12 26,-12" fill="url(#veh-glass-polar)" />
        <rect x="24" y="-24.5" width="6" height="2.8" rx="0.8" fill="#38bdf8" class="beacon-strobe-a" />
        <rect x="36" y="-24.5" width="6" height="2.8" rx="0.8" fill="#38bdf8" class="beacon-strobe-b" />`;

    case 3:
      // MODELO 3: PLATAFORMA ELEVADORA BIVIAL DE TIJERA "VÍA VERDE" (Cesta aérea articulada verde/blanca)
      return `
        <rect x="-52" y="2" width="104" height="10" rx="2" fill="#0f172a" stroke="#334155" stroke-width="1.2" />
        <rect x="-50" y="4" width="100" height="5" fill="#16a34a" />
        <g transform="translate(32, 13)"><circle cx="0" cy="0" r="5.5" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5" /><g class="veh-wheel-spoke"><line x1="-4" y1="0" x2="4" y2="0" stroke="#94a3b8" stroke-width="1.2" /><line x1="0" y1="-4" x2="0" y2="4" stroke="#94a3b8" stroke-width="1.2" /></g><circle cx="0" cy="0" r="2" fill="#64748b" /></g>
        <g transform="translate(-32, 13)"><circle cx="0" cy="0" r="5.5" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5" /><g class="veh-wheel-spoke"><line x1="-4" y1="0" x2="4" y2="0" stroke="#94a3b8" stroke-width="1.2" /><line x1="0" y1="-4" x2="0" y2="4" stroke="#94a3b8" stroke-width="1.2" /></g><circle cx="0" cy="0" r="2" fill="#64748b" /></g>
        <!-- Estabilizadores telescópicos hidráulicos exteriores -->
        <rect x="-48" y="0" width="6" height="12" rx="1" fill="#475569" stroke="#cbd5e1" stroke-width="0.8" />
        <rect x="2" y="0" width="6" height="12" rx="1" fill="#475569" stroke="#cbd5e1" stroke-width="0.8" />
        <!-- Mecanismo de tijera pantográfico extendido con cesta de trabajo en altura -->
        <g class="veh-scissor-lift-group">
          <line x1="-42" y1="-3" x2="-22" y2="-14" stroke="#cbd5e1" stroke-width="2" />
          <line x1="-22" y1="-3" x2="-42" y2="-14" stroke="#cbd5e1" stroke-width="2" />
          <line x1="-42" y1="-14" x2="-22" y2="-24" stroke="#cbd5e1" stroke-width="2" />
          <line x1="-22" y1="-14" x2="-42" y2="-24" stroke="#cbd5e1" stroke-width="2" />
          <!-- Cesta amplia con barandilla y focos de trabajo -->
          <rect x="-46" y="-28" width="28" height="5" rx="1" fill="#16a34a" stroke="#15803d" stroke-width="1" />
          <line x1="-46" y1="-33" x2="-18" y2="-33" stroke="#ffffff" stroke-width="1.4" />
          <circle cx="-18" cy="-33" r="2.2" fill="#facc15" />
          <circle cx="-18" cy="-33" r="4" fill="#facc15" opacity="0.3" />
        </g>
        <!-- Cabina aerodinámica en verde esmeralda y blanco corporativo -->
        <path d="M 6,-14 L 14,-22 L 44,-22 L 48,-13 L 48,2 L 6,2 Z" fill="#ffffff" stroke="#16a34a" stroke-width="1.4" />
        <path d="M 6,-2 L 48,-2 L 48,2 L 6,2 Z" fill="#16a34a" />
        <polygon points="26,-20 42,-20 45,-12 26,-12" fill="url(#veh-glass-polar)" />
        <rect x="25" y="-24.5" width="14" height="3" rx="1" fill="#facc15" class="beacon-strobe-a" />`;

    case 4:
      // MODELO 4: CISTERNA BIVIAL DE LAVADO DE TÚNEL Y VÍA (Tanque de acero inoxidable y barra difusora)
      return `
        <rect x="-54" y="2" width="108" height="10" rx="2" fill="#0f172a" stroke="#334155" stroke-width="1.2" />
        <g transform="translate(32, 13)"><circle cx="0" cy="0" r="5.5" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5" /><g class="veh-wheel-spoke"><line x1="-4" y1="0" x2="4" y2="0" stroke="#94a3b8" stroke-width="1.2" /><line x1="0" y1="-4" x2="0" y2="4" stroke="#94a3b8" stroke-width="1.2" /></g><circle cx="0" cy="0" r="2" fill="#64748b" /></g>
        <g transform="translate(-32, 13)"><circle cx="0" cy="0" r="5.5" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5" /><g class="veh-wheel-spoke"><line x1="-4" y1="0" x2="4" y2="0" stroke="#94a3b8" stroke-width="1.2" /><line x1="0" y1="-4" x2="0" y2="4" stroke="#94a3b8" stroke-width="1.2" /></g><circle cx="0" cy="0" r="2" fill="#64748b" /></g>
        <!-- Tanque cilíndrico de acero inoxidable con cinchas cromadas -->
        <rect x="-52" y="-18" width="56" height="20" rx="8" fill="url(#metal-chrome)" stroke="#64748b" stroke-width="1.2" />
        <line x1="-38" y1="-18" x2="-38" y2="2" stroke="#334155" stroke-width="1.6" />
        <line x1="-10" y1="-18" x2="-10" y2="2" stroke="#334155" stroke-width="1.6" />
        <!-- Boca de carga superior y pasarela con escalera -->
        <rect x="-28" y="-21" width="8" height="3" rx="1" fill="#475569" stroke="#94a3b8" stroke-width="0.8" />
        <!-- Barra de toberas de lavado a alta presión en la parte delantera -->
        <g transform="translate(48, 4)">
          <line x1="0" y1="-4" x2="0" y2="8" stroke="#38bdf8" stroke-width="2.5" />
          <polygon points="0,2 6,4 0,6" fill="#38bdf8" opacity="0.8" />
          <polygon points="0,6 6,8 0,10" fill="#38bdf8" opacity="0.8" />
        </g>
        <!-- Cabina limpia en blanco y azul cian -->
        <path d="M 6,-14 L 14,-23 L 44,-23 L 48,-14 L 48,2 L 6,2 Z" fill="#f8fafc" stroke="#0284c7" stroke-width="1.4" />
        <polygon points="26,-21 42,-21 45,-12 26,-12" fill="url(#veh-glass-polar)" />
        <rect x="25" y="-25.5" width="12" height="3" rx="1" fill="#0284c7" class="beacon-strobe-a" />`;

    case 5:
      // MODELO 5: VEHÍCULO PESADO DE RESCATE Y ENCARRILAMIENTO (Cabrestante 15T, luces de emergencia rojo/azul)
      return `
        <rect x="-54" y="2" width="108" height="10" rx="2" fill="#0f172a" stroke="#334155" stroke-width="1.2" />
        <g transform="translate(32, 13)"><circle cx="0" cy="0" r="5.5" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5" /><g class="veh-wheel-spoke"><line x1="-4" y1="0" x2="4" y2="0" stroke="#94a3b8" stroke-width="1.2" /><line x1="0" y1="-4" x2="0" y2="4" stroke="#94a3b8" stroke-width="1.2" /></g><circle cx="0" cy="0" r="2" fill="#64748b" /></g>
        <g transform="translate(-32, 13)"><circle cx="0" cy="0" r="5.5" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5" /><g class="veh-wheel-spoke"><line x1="-4" y1="0" x2="4" y2="0" stroke="#94a3b8" stroke-width="1.2" /><line x1="0" y1="-4" x2="0" y2="4" stroke="#94a3b8" stroke-width="1.2" /></g><circle cx="0" cy="0" r="2" fill="#64748b" /></g>
        <!-- Carrocería de intervención rápida rojo bomberos con patrón battenburg reflectante -->
        <rect x="-52" y="-17" width="56" height="19" rx="2" fill="#dc2626" stroke="#991b1b" stroke-width="1.3" />
        <!-- Racks de gatos hidráulicos pesados de encarrilamiento -->
        <rect x="-48" y="-14" width="22" height="12" rx="1" fill="#facc15" stroke="#ca8a04" stroke-width="0.8" />
        <rect x="-22" y="-14" width="22" height="12" rx="1" fill="#facc15" stroke="#ca8a04" stroke-width="0.8" />
        <!-- Cabrestante frontal pesado de 15 toneladas con gancho -->
        <rect x="48" y="2" width="8" height="7" rx="1" fill="#1e293b" stroke="#94a3b8" stroke-width="0.8" />
        <circle cx="52" cy="5.5" r="2.2" fill="#cbd5e1" />
        <!-- Cabina doble de rescate pesada con defensas tubulares -->
        <path d="M 6,-14 L 14,-24 L 46,-24 L 50,-13 L 50,2 L 6,2 Z" fill="#dc2626" stroke="#b91c1c" stroke-width="1.4" />
        <polygon points="26,-22 44,-22 47,-13 26,-13" fill="url(#veh-glass-polar)" />
        <!-- Barra de luces LED de emergencia combinada Rojo y Azul -->
        <rect x="20" y="-27" width="12" height="3.2" rx="1" fill="#ef4444" class="veh-rescue-strobe-red" />
        <rect x="34" y="-27" width="12" height="3.2" rx="1" fill="#3b82f6" class="veh-rescue-strobe-blue" />`;

    case 6:
      // MODELO 6: COCHE LABORATORIO DE AUSCULTACIÓN Y GEOMETRÍA DE VÍA (Sensores ópticos y haz láser inferior)
      return `
        <!-- Chasis de coche ferroviario largo y aerodinámico en plata y azul marino -->
        <rect x="-56" y="2" width="112" height="10" rx="2" fill="#0f172a" stroke="#334155" stroke-width="1.2" />
        <g transform="translate(36, 13)"><circle cx="0" cy="0" r="5.5" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5" /><g class="veh-wheel-spoke"><line x1="-4" y1="0" x2="4" y2="0" stroke="#94a3b8" stroke-width="1.2" /><line x1="0" y1="-4" x2="0" y2="4" stroke="#94a3b8" stroke-width="1.2" /></g><circle cx="0" cy="0" r="2" fill="#64748b" /></g>
        <g transform="translate(-36, 13)"><circle cx="0" cy="0" r="5.5" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5" /><g class="veh-wheel-spoke"><line x1="-4" y1="0" x2="4" y2="0" stroke="#94a3b8" stroke-width="1.2" /><line x1="0" y1="-4" x2="0" y2="4" stroke="#94a3b8" stroke-width="1.2" /></g><circle cx="0" cy="0" r="2" fill="#64748b" /></g>
        <!-- Carrocería de vagón técnico de pasajeros/laboratorio con ventanillas panorámicas -->
        <path d="M -54,-18 L -48,-22 L 48,-22 L 54,-18 L 54,2 L -54,2 Z" fill="#f1f5f9" stroke="#0284c7" stroke-width="1.4" />
        <rect x="-54" y="-7" width="108" height="5" fill="#0284c7" />
        <!-- Ventanillas del centro de cómputo y adquisición telemétrica -->
        <rect x="-42" y="-18" width="14" height="8" rx="1.5" fill="url(#veh-glass-polar)" />
        <rect x="-24" y="-18" width="14" height="8" rx="1.5" fill="url(#veh-glass-polar)" />
        <rect x="-6" y="-18" width="14" height="8" rx="1.5" fill="url(#veh-glass-polar)" />
        <rect x="12" y="-18" width="14" height="8" rx="1.5" fill="url(#veh-glass-polar)" />
        <polygon points="32,-19 46,-19 49,-12 32,-12" fill="url(#veh-glass-polar)" />
        <!-- Cúpula de antena GPS diferencial en techo -->
        <ellipse cx="-16" cy="-24" rx="6" ry="2.5" fill="#ffffff" stroke="#94a3b8" stroke-width="0.8" />
        <!-- Sistema de perfilometría láser inferior escaneando el riel -->
        <g transform="translate(0, 10)">
          <rect x="-10" y="0" width="20" height="3" rx="1" fill="#0f172a" stroke="#22c55e" stroke-width="0.8" />
          <polygon points="-6,3 6,3 10,9 -10,9" fill="#22c55e" opacity="0.45" class="ultrasonic-radar-beam" />
        </g>`;

    case 7:
      // MODELO 7: CAMIONETA BIVIAL 4x4 DE INSPECCIÓN RÁPIDA (Toyota Hilux Rail con barra antivuelco y focos LED)
      return `
        <!-- Chasis ligero de camioneta con ruedas todoterreno y ruedas guía de tren -->
        <rect x="-48" y="2" width="96" height="9" rx="2" fill="#0f172a" stroke="#334155" stroke-width="1.2" />
        <g transform="translate(28, 12)"><circle cx="0" cy="0" r="5" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5" /></g>
        <g transform="translate(-28, 12)"><circle cx="0" cy="0" r="5" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5" /></g>
        <!-- Tolva trasera abierta con barra antivuelco y rueda de repuesto -->
        <path d="M -46,-8 L -14,-8 L -14,2 L -46,2 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
        <!-- Barra tubular antivuelco con focos de largo alcance -->
        <path d="M -16,2 L -16,-17 L -11,-17 L -11,2" stroke="#0f172a" stroke-width="2" fill="none" />
        <circle cx="-13.5" cy="-19" r="2" fill="#facc15" />
        <circle cx="-13.5" cy="-19" r="3.5" fill="#facc15" opacity="0.3" />
        <!-- Rueda de repuesto y bidón de combustible en la tolva -->
        <circle cx="-32" cy="-4" r="4.5" fill="#1e293b" stroke="#64748b" stroke-width="1" />
        <!-- Cabina doble blanca de pickup con defensa frontal -->
        <path d="M -14,-8 L -8,-19 L 24,-19 L 36,-9 L 44,-9 L 44,2 L -14,2 Z" fill="#ffffff" stroke="#94a3b8" stroke-width="1.3" />
        <polygon points="8,-17 22,-17 32,-9 8,-9" fill="url(#veh-glass-polar)" />
        <polygon points="-6,-17 6,-17 6,-9 -6,-9" fill="url(#veh-glass-polar)" />
        <!-- Barra LED frontal en parrilla delantera -->
        <rect x="42" y="-6" width="3" height="6" rx="0.5" fill="#facc15" />
        <rect x="6" y="-21" width="12" height="2.5" rx="0.8" fill="#f59e0b" class="beacon-strobe-a" />`;

    case 8:
      // MODELO 8: AMOLADORA DE RIELES SPENO / TREN DE REPERFILADO (Faldones blindados anti-chispa y chimeneas ciclónicas)
      return `
        <!-- Chasis industrial acorazado color grafito y franjas de advertencia -->
        <rect x="-56" y="2" width="112" height="10" rx="2" fill="#0f172a" stroke="#334155" stroke-width="1.2" />
        <rect x="-54" y="4" width="108" height="5" fill="url(#hazard-stripes)" rx="1" />
        <g transform="translate(34, 13)"><circle cx="0" cy="0" r="5.5" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5" /><g class="veh-wheel-spoke"><line x1="-4" y1="0" x2="4" y2="0" stroke="#94a3b8" stroke-width="1.2" /><line x1="0" y1="-4" x2="0" y2="4" stroke="#94a3b8" stroke-width="1.2" /></g><circle cx="0" cy="0" r="2" fill="#64748b" /></g>
        <g transform="translate(-34, 13)"><circle cx="0" cy="0" r="5.5" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5" /><g class="veh-wheel-spoke"><line x1="-4" y1="0" x2="4" y2="0" stroke="#94a3b8" stroke-width="1.2" /><line x1="0" y1="-4" x2="0" y2="4" stroke="#94a3b8" stroke-width="1.2" /></g><circle cx="0" cy="0" r="2" fill="#64748b" /></g>
        <!-- Carrocería de locomotora amoladora de perfil bajo y gran robustez -->
        <rect x="-52" y="-18" width="70" height="20" rx="2" fill="#1e293b" stroke="#475569" stroke-width="1.4" />
        <!-- Faldones de contención de chispas en bajos con fulgor interno incandescente -->
        <rect x="-48" y="2" width="60" height="5" rx="1" fill="#78350f" stroke="#ea580c" stroke-width="0.8" />
        <circle cx="-35" cy="5" r="1.5" fill="#fbbf24" class="crew-work-sparks" />
        <circle cx="-15" cy="5" r="1.5" fill="#fbbf24" class="crew-work-sparks" />
        <!-- Chimeneas ciclónicas extractoras de polvo de sílice y humos -->
        <rect x="-42" y="-24" width="7" height="7" rx="1" fill="#0f172a" stroke="#64748b" stroke-width="0.8" />
        <rect x="-24" y="-24" width="7" height="7" rx="1" fill="#0f172a" stroke="#64748b" stroke-width="0.8" />
        <!-- Cabina frontal angulada con lunas reforzadas de seguridad -->
        <path d="M 18,-14 L 26,-22 L 48,-22 L 52,-13 L 52,2 L 18,2 Z" fill="#334155" stroke="#facc15" stroke-width="1.3" />
        <polygon points="32,-20 45,-20 48,-12 32,-12" fill="url(#veh-glass-polar)" />
        <rect x="26" y="-24.5" width="20" height="3" rx="1" fill="#facc15" class="beacon-strobe-a" />`;

    case 9:
    default:
      // MODELO 9: CAMIÓN BIVIAL CON GRÚA HIDRÁULICA ARTICULADA PALFINGER (Brazo articulado y carril suspendido)
      return `
        <rect x="-54" y="2" width="108" height="10" rx="2" fill="#0f172a" stroke="#334155" stroke-width="1.2" />
        <rect x="-52" y="4" width="104" height="5" fill="url(#hazard-stripes)" rx="1" />
        <g transform="translate(32, 13)"><circle cx="0" cy="0" r="5.5" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5" /><g class="veh-wheel-spoke"><line x1="-4" y1="0" x2="4" y2="0" stroke="#94a3b8" stroke-width="1.2" /><line x1="0" y1="-4" x2="0" y2="4" stroke="#94a3b8" stroke-width="1.2" /></g><circle cx="0" cy="0" r="2" fill="#64748b" /></g>
        <g transform="translate(-32, 13)"><circle cx="0" cy="0" r="5.5" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5" /><g class="veh-wheel-spoke"><line x1="-4" y1="0" x2="4" y2="0" stroke="#94a3b8" stroke-width="1.2" /><line x1="0" y1="-4" x2="0" y2="4" stroke="#94a3b8" stroke-width="1.2" /></g><circle cx="0" cy="0" r="2" fill="#64748b" /></g>
        <!-- Plataforma plana trasera transportando traviesas de hormigón -->
        <rect x="-50" y="-3" width="54" height="5" fill="#1e293b" />
        <rect x="-46" y="-7" width="12" height="4" fill="#94a3b8" rx="0.5" />
        <rect x="-30" y="-7" width="12" height="4" fill="#94a3b8" rx="0.5" />
        <!-- Grúa hidráulica articulada naranja Palfinger entre cabina y caja -->
        <g class="veh-crane-load-sway" transform="translate(-4, -2)">
          <!-- Base giratoria y columna vertical -->
          <rect x="-3" y="-12" width="6" height="12" rx="1" fill="#ea580c" stroke="#9a3412" stroke-width="0.8" />
          <!-- Brazo principal oblicuo -->
          <line x1="0" y1="-12" x2="-14" y2="-25" stroke="#ea580c" stroke-width="3" stroke-linecap="round" />
          <!-- Brazo secundario telescópico horizontal -->
          <line x1="-14" y1="-25" x2="-28" y2="-21" stroke="#ea580c" stroke-width="2.4" stroke-linecap="round" />
          <line x1="-28" y1="-21" x2="-36" y2="-20" stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round" />
          <!-- Cable de acero y gancho sosteniendo un segmento de carril UIC 54 -->
          <line x1="-36" y1="-20" x2="-36" y2="-8" stroke="#0f172a" stroke-width="1.2" />
          <path d="M -38,-8 L -36,-6 L -34,-8" fill="none" stroke="#475569" stroke-width="1.5" />
          <line x1="-46" y1="-6" x2="-26" y2="-6" stroke="#94a3b8" stroke-width="2.5" />
        </g>
        <!-- Cabina de camión pesada amarilla con spoiler superior -->
        <path d="M 6,-14 L 14,-23 L 44,-23 L 48,-14 L 48,2 L 6,2 Z" fill="#f1f5f9" stroke="#0284c7" stroke-width="1.3" />
        <polygon points="26,-21 42,-21 45,-12 26,-12" fill="url(#veh-glass-polar)" />
        <rect x="25" y="-25.5" width="14" height="3" rx="1" fill="#facc15" class="beacon-strobe-a" />`;
  }
}

const PALETA_GRUPOS_PERMISO = ['#22d3ee', '#f472b6', '#a3e635', '#c084fc', '#fb923c', '#38bdf8', '#f43f5e', '#facc15'];

function grupoPermisoKey(c) {
  return c && c.ot && c.type === 'crew' ? `${c.ot}|${c.responsible}` : null;
}

function colorGrupoPermiso(c) {
  const key = grupoPermisoKey(c);
  if (!key) return null;
  const claves = [...new Set(appState.crews.map(grupoPermisoKey).filter(Boolean))];
  return PALETA_GRUPOS_PERMISO[claves.indexOf(key) % PALETA_GRUPOS_PERMISO.length];
}

// Cuadrillas con el mismo permiso y responsable en la misma zona (o ambas vías) comparten
// el estado del primero de su grupo: avanzan, trabajan y hacen emotes juntas.
function asignarSeguidoresDeGrupo() {
  const primero = {};
  appState.crews.forEach(c => {
    c.seguidorDe = null;
    const key = grupoPermisoKey(c);
    if (!key) return;
    const lider = primero[key];
    if (!lider) { primero[key] = c; return; }
    if (c.xMin === lider.xMin && c.xMax === lider.xMax) c.seguidorDe = lider.id;
  });
}

function copiarEstadoSeguidor(seguidor, lider) {
  seguidor.x = lider.x;
  seguidor.dir = lider.dir;
  seguidor.isWorking = lider.isWorking;
  seguidor.workTimer = lider.workTimer;
  seguidor.workCountdown = lider.workCountdown;
  seguidor.inSafeZone = lider.inSafeZone;
  // Fase de paso y fundido caminar/trabajar: copiarlos del líder mantiene al grupo
  // con las piernas perfectamente sincronizadas (comparten x en cada frame).
  seguidor.walkPhase = lider.walkPhase;
  seguidor._swing = lider._swing;
}

function sincronizarBurbujaSeguidor(seguidor, lider) {
  const bL = document.getElementById(`retro-bubble-${lider.id}`);
  const bF = document.getElementById(`retro-bubble-${seguidor.id}`);
  const sL = document.getElementById(`bubble-slot-${lider.id}`);
  const sF = document.getElementById(`bubble-slot-${seguidor.id}`);
  if (!bL || !bF || !sL || !sF) return;
  if (bF.style.display !== bL.style.display) bF.style.display = bL.style.display;
  if (sF.innerHTML !== sL.innerHTML) sF.innerHTML = sL.innerHTML;
}

function renderEntitiesDOM() {
  const layer = document.getElementById("dynamic-entities-layer");
  const badgesLayer = document.getElementById("multicrew-badges-layer");
  layer.innerHTML = "";
  badgesLayer.innerHTML = "";
  
  const zoneGroups = {};
  appState.crews.forEach(crew => {
    const firstZone = crew.zones[0] || "Z0";
    const key = `${firstZone}_${crew.via}`;
    if (!zoneGroups[key]) zoneGroups[key] = [];
    zoneGroups[key].push(crew);
  });
  
  // DIBUJAR CUADRILLAS A PIE CON SPRITE ARCADE DE VIDEOJUEGO
  appState.crews.forEach((crew) => {
    const model = getCrewModel(crew);
    let yPos;
    let xCrew = crew.x;
    if (crew.via === 'D1' || (crew.zones && crew.zones.includes('Z-RAMAL-D1'))) {
      xCrew = 2965;
      yPos = 121;
    } else if (crew.via === 'D2' || (crew.zones && crew.zones.includes('Z-RAMAL-D2'))) {
      xCrew = 3390;
      yPos = 121;
    } else {
      yPos = crew.inSafeZone ? (crew.via === "V1" ? 370 : 172) : (crew.via === "V1" ? 330 : 220);
    }
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "crew-token");
    g.setAttribute("id", `token-${crew.id}`);
    g.setAttribute("transform", `translate(${xCrew}, ${yPos})`);
    g.setAttribute("data-id", crew.id);
    
    g.innerHTML = `
      <rect class="token-hitbox" x="-30" y="-40" width="60" height="60" fill="transparent" style="pointer-events:all; cursor:pointer;" />
      ${colorGrupoPermiso(crew) ? `<ellipse cx="0" cy="15" rx="22" ry="5.5" fill="none" stroke="${colorGrupoPermiso(crew)}" stroke-width="2.2" stroke-dasharray="6 3" style="pointer-events:none;" />` : ''}
      <!-- Sombra de contacto sobre el riel/balasto (Grounded Shadow) -->
      <ellipse cx="0" cy="15.5" rx="13" ry="3" fill="rgba(2, 6, 23, 0.82)" style="pointer-events:none;" />

      <!-- Resplandor sutil de estado en la base -->
      <ellipse cx="0" cy="15" rx="18" ry="4.5" fill="${crew.inSafeZone ? "rgba(16, 185, 129, 0.35)" : "rgba(245, 158, 11, 0.28)"}" style="pointer-events:none;" />

      <!-- Haz de linterna frontal táctica (LED Headlamp) -->
      <g class="crew-flashlight-beam" style="pointer-events:none; display:${crew.inSafeZone ? "none" : "block"};">
        <polygon points="4,-10 34,-18 34,-2" fill="url(#crew-beam-grad)" />
        <ellipse cx="26" cy="14" rx="8" ry="2" fill="rgba(254, 240, 138, 0.25)" />
      </g>

      <!-- Conos de seguridad compactos en extremos de zona si está trabajando -->
      <g class="crew-safety-cones" style="display:${crew.isWorking ? "block" : "none"}; pointer-events:none;">
        <g transform="translate(-24, 7)">
          <polygon points="-4,6 4,6 1.5,-7 -1.5,-7" fill="#f97316" />
          <line x1="-2.5" y1="0" x2="2.5" y2="0" stroke="#ffffff" stroke-width="1.2" />
          <rect x="-5" y="6" width="10" height="1.5" rx="0.4" fill="#0f172a" />
        </g>
        <g transform="translate(24, 7)">
          <polygon points="-4,6 4,6 1.5,-7 -1.5,-7" fill="#f97316" />
          <line x1="-2.5" y1="0" x2="2.5" y2="0" stroke="#ffffff" stroke-width="1.2" />
          <rect x="-5" y="6" width="10" height="1.5" rx="0.4" fill="#0f172a" />
        </g>
      </g>

      <!-- Visual de Cuadrilla Diferenciada (10 Modelos Únicos con Atuendos y Equipos Reales) -->
      <g class="crew-visual" style="pointer-events:none;">
        ${renderCrewVisualModel(crew, (parseInt((crew.id || '').replace(/\D/g, ''), 10) || 0))}
      </g>

      <!-- Globo de Emote Retro / Acción Especial de Videojuego -->
      <g class="crew-retro-bubble" id="retro-bubble-${crew.id}" style="display:none; pointer-events:none;" transform="translate(0, -60)">
        <path d="M -26,-22 L 26,-22 Q 30,-22 30,-18 L 30,6 Q 30,10 26,10 L 4,10 L 0,16 L -4,10 L -26,10 Q -30,10 -30,6 L -30,-18 Q -30,-22 -26,-22 Z" fill="#090d16" stroke="#f59e0b" stroke-width="1.8" />
        <g class="bubble-content-slot" id="bubble-slot-${crew.id}"></g>
      </g>

      <!-- Cartela con Datos y Estado -->
      <rect x="-72" y="-38" width="144" height="18" rx="4" fill="#070d17" fill-opacity="0.94" stroke="${crew.inSafeZone ? "#10b981" : "#f59e0b"}" stroke-width="1.4" style="pointer-events:none;" />
      ${colorGrupoPermiso(crew) ? `<rect x="-72" y="-38" width="6" height="18" rx="2" fill="${colorGrupoPermiso(crew)}" style="pointer-events:none;" />` : ''}
      <text class="crew-status-label" x="0" y="-25" fill="#ffffff" font-size="9" font-weight="bold" font-family="monospace" text-anchor="middle" style="pointer-events:none;">
        ${crew.inSafeZone ? "🛡️ " + crew.responsible.slice(0, 11) + " [Andén]" : "👷 " + crew.responsible.slice(0, 11) + " (" + (crew.count || "?") + "p)"}
      </text>
    `;
    
        let crewStartX = 0, crewStartY = 0, crewMoved = false;
    g.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      crewStartX = e.clientX;
      crewStartY = e.clientY;
      crewMoved = false;
      
      function onMove(evt) {
        if (Math.hypot(evt.clientX - crewStartX, evt.clientY - crewStartY) > 6 && !crewMoved) {
          crewMoved = true;
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", onUp);
          
          appState.reassigningEntity = crew;
          appState.isDraggingPegman = true;
          document.body.classList.add('is-dragging-token');
          appState.draggedType = 'crew';
          appState.hoveredVia = crew.via;
          appState.draggedZonesSet.clear();
          crew.zones.forEach(zid => appState.draggedZonesSet.add(zid));
          appState.hasPaintedMultiZones = crew.zones.length > 1;
          
          const ghost = document.getElementById("pegman-drag-ghost");
          const ghostEmoji = document.getElementById("ghost-emoji");
          const ghostViaBadge = document.getElementById("ghost-via-badge");
          if (ghost && ghostEmoji && ghostViaBadge) {
            ghostEmoji.textContent = '👷';
            ghostViaBadge.textContent = crew.via === 'V1' ? 'VÍA 1 ► (HACIA ATE)' : 'VÍA 2 ◄ (HACIA CALLAO)';
            ghostViaBadge.className = 'ghost-via-badge via-' + crew.via.toLowerCase();
            ghost.style.display = 'flex';
            ghost.style.left = evt.clientX + 'px';
            ghost.style.top = evt.clientY + 'px';
          }
          renderDragSelectionSpan(crew.via);
          playSound("jump");
          showToast('📍 Moviendo ' + crew.responsible + ': Arrastra por la vía (clic derecho para más tramos) y suelta.', 'info');
        }
      }
      function onUp() {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      }
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    });

        // Clic derecho para menú contextual con opciones Editar / Eliminar / Reubicar
    g.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      showTokenContextMenu(crew, e.clientX, e.clientY);
    });
        // Doble clic para reubicar / mover cuadrilla a otra zona
    g.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      startReassigningToken(crew, e.clientX, e.clientY);
    });
    // Huevo de pascua fácil: Clic en conos de seguridad de la cuadrilla -> Boing elástico
    const conesGroup = g.querySelector(".crew-safety-cones");
    if (conesGroup) {
      conesGroup.style.pointerEvents = "all";
      conesGroup.style.cursor = "pointer";
      conesGroup.addEventListener("click", (e) => {
        e.stopPropagation();
        playSound("boing");
        showToast("⚠️ ¡Boing! Conos de balizamiento elásticos señalizados.", "info");
      });
    }

    g.addEventListener("click", (e) => {
      e.stopPropagation();
      if (crewMoved) return;
      playSound("coin");
    });
    
    layer.appendChild(g);
  });
  
  // BADGES DE COEXISTENCIA MULTI-CUADRILLA
  Object.keys(zoneGroups).forEach(key => {
    const group = zoneGroups[key];
    if (group.length >= 2) {
      const firstCrew = group[0];
      // FIX JITTER: Usar coordenada estática fija del cantón para evitar parpadeo y temblor al pasar el mouse
      const firstZone = ZONAS_VIA.find(z => z.id === firstCrew.zones[0]) || { xStart: 100, xEnd: 200 };
      const centerX = firstZone.xStart + (firstZone.xEnd - firstZone.xStart) / 2;
      const yPos = firstCrew.via === "V1" ? 376 : 174;
      
      const gBadge = document.createElementNS("http://www.w3.org/2000/svg", "g");
      gBadge.setAttribute("class", "multicrew-badge");
      gBadge.setAttribute("transform", `translate(${centerX}, ${yPos})`);
      gBadge.setAttribute("title", "Múltiples cuadrillas a pie coexistiendo. Toca para ver detalle.");
      
      gBadge.innerHTML = `
        <rect x="-65" y="-10" width="130" height="20" rx="10" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5" />
        <text x="0" y="4" fill="#ffffff" font-size="9" font-weight="900" font-family="sans-serif" text-anchor="middle">
          👥 ${group.length} CUADRILLAS A PIE
        </text>
      `;
      
      gBadge.addEventListener("click", (e) => {
        e.stopPropagation();
        playSound("coin");
        showMultiCrewPopover(group, e.clientX, e.clientY);
      });
      
      badgesLayer.appendChild(gBadge);
    }
  });
  
  // DIBUJAR VEHÍCULOS AUXILIARES: DRESINA BIVIAL PESADA (NO ES UN TREN)
  appState.vehicles.forEach(veh => {
    const model = getVehicleModel(veh);
    let yPos;
    let xVeh = veh.x;
    if (veh.via === 'D1' || (veh.zones && veh.zones.includes('Z-RAMAL-D1'))) {
      xVeh = 2965;
      yPos = 121;
    } else if (veh.via === 'D2' || (veh.zones && veh.zones.includes('Z-RAMAL-D2'))) {
      xVeh = 3390;
      yPos = 121;
    } else {
      yPos = veh.via === "V1" ? 330 : 220;
    }
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "vehicle-token");
    g.setAttribute("id", `token-${veh.id}`);
    g.setAttribute("transform", `translate(${xVeh}, ${yPos})`);
    g.setAttribute("data-id", veh.id);
    
    g.innerHTML = `
      <rect class="token-hitbox" x="-56" y="-40" width="120" height="60" fill="transparent" style="pointer-events:all; cursor:pointer;" />
      <!-- Sombra de contacto ferroviaria (Grounded Track Shadow) -->
      <ellipse cx="0" cy="16" rx="52" ry="4.5" fill="rgba(0, 0, 0, 0.65)" style="pointer-events:none;" />
      
      <!-- Resplandor sutil de vía -->
      <rect x="-54" y="-20" width="108" height="38" rx="6" fill="rgba(56, 189, 248, 0.08)" stroke="rgba(56, 189, 248, 0.25)" stroke-width="0.8" style="pointer-events:none;" />
      
      <!-- Haz luminoso direccional hacia adelante con gradiente suave -->
      <polygon class="headlight-beam" points="48,-2 135,-20 135,14" fill="url(#headlight-beam-east)" opacity="0.75" style="pointer-events:none;" />
      
      <!-- Carroceria y Morfologia de Vehículo Auxiliar (10 Modelos Distintos de Dresina) -->
      <g class="veh-visual veh-chug-vibe" style="pointer-events:none;">
        ${renderVehicleVisualModel(veh, (parseInt((veh.id || '').replace(/\D/g, ''), 10) || 0))}
      </g>
      
      <!-- Cartela informativa de vehiculo -->
      <rect x="-70" y="-36" width="140" height="17" rx="3.5" fill="#0a121e" stroke="#38bdf8" stroke-width="1.3" style="pointer-events:none;" />
      <text class="veh-status-label" x="0" y="-24" fill="#38bdf8" font-size="9" font-weight="bold" font-family="monospace" text-anchor="middle" style="pointer-events:none;">
        🚜 ${veh.vehicleType.slice(0, 16)}
      </text>
    `;
    
        let vehStartX = 0, vehStartY = 0, vehMoved = false;
    g.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      vehStartX = e.clientX;
      vehStartY = e.clientY;
      vehMoved = false;
      
      function onMove(evt) {
        if (Math.hypot(evt.clientX - vehStartX, evt.clientY - vehStartY) > 6 && !vehMoved) {
          vehMoved = true;
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", onUp);
          
          appState.reassigningEntity = veh;
          appState.isDraggingPegman = true;
          document.body.classList.add('is-dragging-token');
          appState.draggedType = 'vehicle';
          appState.hoveredVia = veh.via;
          appState.draggedZonesSet.clear();
          veh.zones.forEach(zid => appState.draggedZonesSet.add(zid));
          appState.hasPaintedMultiZones = veh.zones.length > 1;
          
          const ghost = document.getElementById("pegman-drag-ghost");
          const ghostEmoji = document.getElementById("ghost-emoji");
          const ghostViaBadge = document.getElementById("ghost-via-badge");
          if (ghost && ghostEmoji && ghostViaBadge) {
            ghostEmoji.textContent = '🚜';
            ghostViaBadge.textContent = veh.via === 'V1' ? 'VÍA 1 ► (HACIA ATE)' : 'VÍA 2 ◄ (HACIA CALLAO)';
            ghostViaBadge.className = 'ghost-via-badge via-' + veh.via.toLowerCase();
            ghost.style.display = 'flex';
            ghost.style.left = evt.clientX + 'px';
            ghost.style.top = evt.clientY + 'px';
          }
          renderDragSelectionSpan(veh.via);
          playSound("jump");
          showToast('📍 Moviendo ' + veh.vehicleType + ': Arrastra por la vía (clic derecho para más tramos) y suelta.', 'info');
        }
      }
      function onUp() {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      }
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    });

        // Clic derecho para menú contextual con opciones Editar / Eliminar / Reubicar
    g.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      showTokenContextMenu(veh, e.clientX, e.clientY);
    });
        // Doble clic para reubicar / mover vehículo a otra zona
    g.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      startReassigningToken(veh, e.clientX, e.clientY);
    });
    // Clic en vehículo / dresina -> Sonido de bocina ferroviaria Honk-Honk!
    g.addEventListener("click", (e) => {
      e.stopPropagation();
      if (vehMoved) return;
      playSound("horn");
      showToast(`🚜 ¡Honk-Honk! Bocina de ${veh.vehicleType} activada.`, "info");
    });
    
    layer.appendChild(g);
  });
}

// ------------------------------------------------------------------------------
// 13. MOTOR DE ANIMACIÓN Y GESTOS DE VIDEOJUEGO (DESACOPLADO A 60 FPS)
// ------------------------------------------------------------------------------
let lastAnimTimestamp = performance.now();

// Factor de amplitud global: con prefers-reduced-motion se atenúa el movimiento
// decorativo (bob, piernas, chug) en lugar de congelar al personal sobre la vía.
const AMP_MOVIMIENTO = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.3 : 1;

// Cache por ficha de los nodos .crew-work-sparks (NodeList estático). Se invalida
// sola si renderEntitiesDOM() reconstruye el token (cambia la referencia al <g>).
function nodosSparksDeCrew(crew, el) {
  const cache = crew._sparksCache;
  if (cache && cache.el === el) return cache.nodes;
  const nodes = el.querySelectorAll(".crew-work-sparks");
  crew._sparksCache = { el, nodes };
  return nodes;
}

// Apaga las chispas una sola vez (_sparksLit evita reescribir opacity cada frame).
function apagarSparksDeCrew(crew, el) {
  if (!crew._sparksLit) return;
  crew._sparksLit = false;
  nodosSparksDeCrew(crew, el).forEach(sp => { sp.style.opacity = "0"; });
}

function initAnimationEngine() {
  function tick(timestamp) {
    const dt = Math.min((timestamp - lastAnimTimestamp) / 1000, 0.1);
    lastAnimTimestamp = timestamp;
    
    // ========================================================================
    // ESCALA SEMÁNTICA DINÁMICA (ALTA VISIBILIDAD EN VISTA GENERAL):
    // Cuando el usuario está en vista general (zoom alejado, viewBox width ~3550px),
    // los personajes, vehículos y badges crecen automáticamente ~2.35x para ser
    // inmediatamente visibles, nítidos y legibles sin verse diminutos.
    // Al acercar el zoom (viewBox width <= 1100px), la escala vuelve suavemente a 1.0x.
    // ========================================================================
    const currentZoomWidth = (appState && appState.viewBox && appState.viewBox.width) || 3550;
    // Calibración de escala semántica para zoom:
    // En zoom cercano (width <= 1100), los personajes y dresinas se reducen a 0.65x - 0.85x para no tapar la vía.
    // En zoom alejado / vista general (width ~ 3550), crecen hasta ~2.20x para verse grandes, nítidos y claros.
    const zoomFactor = Math.max(0, Math.min(1, (currentZoomWidth - 600) / (3550 - 600)));
    const semanticScale = 0.65 + Math.pow(zoomFactor, 0.85) * 1.55;
    
    // 1. Actualizar animacion de Cuadrillas a pie
    asignarSeguidoresDeGrupo();
    appState.crews.forEach(crew => {
      const minX = (crew.xMin || 100) + 25;
      const maxX = (crew.xMax || 300) - 25;
      const liderGrupo = crew.seguidorDe ? appState.crews.find(c => c.id === crew.seguidorDe) : null;
      if (liderGrupo) copiarEstadoSeguidor(crew, liderGrupo);
      
      if (crew.inSafeZone) {
        crew.isWorking = false;
        const el = document.getElementById(`token-${crew.id}`);
        if (el) {
          const ySafe = crew.via === "V1" ? 370 : 172;
          const tSafe = `translate(${crew.x.toFixed(1)}, ${ySafe.toFixed(1)}) scale(${semanticScale.toFixed(3)})`;
          if (el.getAttribute("transform") !== tSafe) el.setAttribute("transform", tSafe);
          
          const label = el.querySelector(".crew-status-label");
          if (label) {
            const textoSafe = `🛡️ ${crew.responsible} [Andén Seguro]`;
            if (label.textContent !== textoSafe) label.textContent = textoSafe;
          }
          apagarSparksDeCrew(crew, el);
          if (crew._toolMode !== "safe") {
            crew._toolMode = "safe";
            const cones = el.querySelector(".crew-safety-cones");
            if (cones) cones.style.display = "none";
            const thumbs = el.querySelector(".crew-safe-thumbsup");
            if (thumbs) thumbs.style.display = "block";
            const tamper = el.querySelector(".crew-tamper-tool");
            if (tamper) tamper.style.display = "none";
            const patrol = el.querySelector(".crew-patrol-tool");
            if (patrol) patrol.style.display = "none";
          }
        }
        return;
      }
      
      const isD1Crew = crew.via === 'D1' || (crew.zones && crew.zones.includes('Z-RAMAL-D1'));
      const isD2Crew = crew.via === 'D2' || (crew.zones && crew.zones.includes('Z-RAMAL-D2'));
      
      let curMinX = minX;
      let curMaxX = maxX;
      if (isD1Crew) {
        curMinX = 2930;
        curMaxX = 3000;
      } else if (isD2Crew) {
        curMinX = 3350;
        curMaxX = 3430;
      }
      
      if (liderGrupo) {
        sincronizarBurbujaSeguidor(crew, liderGrupo);
      } else if (crew.isWorking) {
        crew.workTimer -= dt;
        crew.emoteCooldown = (crew.emoteCooldown || (1.5 + Math.random() * 3.5)) - dt;
        
        if (crew.emoteCooldown <= 0) {
          const emotes = ['dbz', 'pokemon', 'pacman', 'xmas'];
          const chosen = emotes[Math.floor(Math.random() * emotes.length)];
          crew.activeEmote = chosen;
          crew.emoteDuration = 2.4;
          crew.emoteCooldown = 6.0 + Math.random() * 5.5;
          
          const bubbleEl = document.getElementById(`retro-bubble-${crew.id}`);
          const slotEl = document.getElementById(`bubble-slot-${crew.id}`);
          if (bubbleEl && slotEl) {
            if (chosen === 'dbz') {
              slotEl.innerHTML = `
                <circle cx="0" cy="-6" r="9" fill="#facc15" class="ki-sphere-burst" />
                <text x="0" y="-3" font-size="8" font-family="monospace" font-weight="900" fill="#ffffff" text-anchor="middle">⚡KI!</text>
              `;
            } else if (chosen === 'pokemon') {
              slotEl.innerHTML = `
                <text x="-9" y="-2" font-size="12">⚡</text>
                <circle cx="4" cy="-5" r="7" fill="#facc15" stroke="#ca8a04" stroke-width="0.8" />
                <text x="4" y="-3" font-size="7" font-weight="900" fill="#000" text-anchor="middle">PIKA</text>
              `;
            } else if (chosen === 'pacman') {
              slotEl.innerHTML = `
                <g transform="translate(-10, -5)">
                  <circle cx="0" cy="0" r="7" fill="#facc15" />
                  <polygon points="0,0 7,-4 7,4" fill="#090d16" class="pacman-mouth" />
                  <circle cx="10" cy="0" r="1.5" fill="#ffffff" />
                  <circle cx="15" cy="0" r="1.5" fill="#ffffff" />
                  <circle cx="20" cy="0" r="1.5" fill="#ffffff" />
                </g>
              `;
            } else if (chosen === 'xmas') {
              slotEl.innerHTML = `
                <text x="-5" y="-1" font-size="13" text-anchor="middle">🎅</text>
                <text x="12" y="2" font-size="10">🎁</text>
              `;
            }
            bubbleEl.style.display = 'block';
          }
        }
        
        if (crew.emoteDuration > 0) {
          crew.emoteDuration -= dt;
          if (crew.emoteDuration <= 0) {
            const bubbleEl = document.getElementById(`retro-bubble-${crew.id}`);
            if (bubbleEl) bubbleEl.style.display = 'none';
          }
        }
        
        if (crew.workTimer <= 0) {
          crew.isWorking = false;
          crew.workCountdown = 6 + Math.random() * 5;
          const bubbleEl = document.getElementById(`retro-bubble-${crew.id}`);
          if (bubbleEl) bubbleEl.style.display = 'none';
        }
      } else {
        const bubbleEl = document.getElementById(`retro-bubble-${crew.id}`);
        if (bubbleEl && bubbleEl.style.display !== 'none') {
          bubbleEl.style.display = 'none';
        }
        crew.x += (crew.speed || 15) * (crew.dir || 1) * dt;
        crew.workCountdown -= dt;
        
        if (crew.x >= curMaxX) {
          crew.x = curMaxX;
          crew.dir = -1;
          crew.isWorking = true;
          crew.workTimer = 3.6;
        } else if (crew.x <= curMinX) {
          crew.x = curMinX;
          crew.dir = 1;
          crew.isWorking = true;
          crew.workTimer = 3.6;
        } else if (crew.workCountdown <= 0) {
          crew.isWorking = true;
          crew.workTimer = 3.2;
          crew.workCountdown = 7 + Math.random() * 4;
        }
      }
      
      // --- Suavizado de transiciones caminar <-> trabajar (independiente del framerate).
      // _swing (0..1) actúa de fundido: amortigua piernas y bob al detenerse, sin el
      // salto seco de antes al conmutar isWorking. walkPhase acumula fase con dt, así
      // la cadencia queda ligada a la velocidad real sobre la vía (time-based, no por frame).
      const targetSwing = crew.isWorking ? 0 : 1;
      if (crew._swing === undefined) crew._swing = targetSwing;
      if (crew.walkPhase === undefined) crew.walkPhase = Math.random() * Math.PI * 2;
      crew._swing += (targetSwing - crew._swing) * (1 - Math.exp(-10 * dt));
      if (!crew.isWorking) {
        crew.walkPhase += dt * ((Math.abs(crew.speed) || 15) / 14) * Math.PI * 2;
      }
      const swing = crew._swing;
      
      const el = document.getElementById(`token-${crew.id}`);
      if (el) {
        let yBase;
        if (isD1Crew) {
          yBase = 220 - (crew.x - 2920) * (198.0 / 90.0);
        } else if (isD2Crew) {
          yBase = 220 - (3440 - crew.x) * (198.0 / 100.0);
        } else {
          yBase = crew.via === "V1" ? 330 : 220;
        }
        
        // Bob vertical sincronizado con el paso (2 apoyos por ciclo, máx 1.2px al caminar);
        // pulso leve en faena. Fundido por swing para no dar saltos al conmutar estado.
        const bobWalk = -Math.cos(crew.walkPhase * 2) * 1.2 * swing * AMP_MOVIMIENTO;
        const bobWork = Math.sin(timestamp / 210) * 1.0 * (1 - swing) * AMP_MOVIMIENTO;
        el.setAttribute("transform", `translate(${crew.x.toFixed(1)}, ${(yBase + bobWalk + bobWork).toFixed(1)}) scale(${semanticScale.toFixed(3)})`);
        
        // Squash & stretch de videojuego para dar peso y juego al personaje
        // (el caminar se liga a walkPhase: estira al alzar el cuerpo, comprime al apoyar)
        const visual = el.querySelector(".crew-visual");
        if (visual) {
          const squashY = 1 + Math.sin(timestamp / 120) * 0.035 * (1 - swing)
                        - Math.cos(crew.walkPhase * 2) * 0.035 * swing;
          const squashX = (crew.dir || 1) * (1 / squashY);
          visual.setAttribute("transform", `scale(${squashX.toFixed(3)}, ${squashY.toFixed(3)})`);
        }
        
        // Linterna: el atributo se escribe solo si cambia el sentido de la marcha
        // (la comprobación con getAttribute cubre también el re-render del token).
        const beam = el.querySelector(".crew-flashlight-beam");
        if (beam) {
          const escalaBeam = `scale(${crew.dir || 1}, 1)`;
          if (crew._flashDir !== (crew.dir || 1) || beam.getAttribute("transform") !== escalaBeam) {
            crew._flashDir = crew.dir || 1;
            beam.setAttribute("transform", escalaBeam);
          }
          if (crew._flashOn !== true) {
            crew._flashOn = true;
            beam.style.display = "block";
          }
        }
        
        // Chispas: opacidad con pulso sinusoidal suave SOLO mientras trabaja (antes:
        // un solo nodo con opacidad fija + parpadeo CSS brusco en todos). Cache por ficha.
        if (crew.isWorking) {
          const sparksNodos = nodosSparksDeCrew(crew, el);
          const numSparks = sparksNodos.length;
          if (AMP_MOVIMIENTO < 1) {
            // prefers-reduced-motion: brillo casi constante, oscilación mínima
            for (let i = 0; i < numSparks; i++) sparksNodos[i].style.opacity = "0.7";
          } else {
            for (let i = 0; i < numSparks; i++) {
              const pulso = 0.3 + 0.6 * (0.5 + 0.5 * Math.sin(timestamp / 170 + i * 0.9));
              sparksNodos[i].style.opacity = pulso.toFixed(3);
            }
          }
          crew._sparksLit = true;
        } else {
          apagarSparksDeCrew(crew, el);
        }
        
        // Conmutación de herramientas trabajar <-> marchar dentro del bucle: los
        // display se escriben UNA vez por cambio de estado (caché _toolMode), no por frame.
        const modoHerramientas = crew.isWorking ? "work" : "walk";
        if (crew._toolMode !== modoHerramientas) {
          crew._toolMode = modoHerramientas;
          const cones = el.querySelector(".crew-safety-cones");
          if (cones) cones.style.display = modoHerramientas === "work" ? "block" : "none";
          
          const tamper = el.querySelector(".crew-tamper-tool");
          if (tamper) tamper.style.display = modoHerramientas === "work" ? "block" : "none";
          
          const patrol = el.querySelector(".crew-patrol-tool");
          if (patrol) patrol.style.display = modoHerramientas === "walk" ? "block" : "none";
          
          const thumbs = el.querySelector(".crew-safe-thumbsup");
          if (thumbs) thumbs.style.display = "none";
        }

        // Kinemática procedimental: walk-cycle ligado a walkPhase y amortiguado por
        // swing -> los pies se asientan sin salto al empezar a trabajar; quietas en faena.
        const legL = el.querySelector(".crew-leg-left");
        const legR = el.querySelector(".crew-leg-right");
        if (legL && legR && (swing > 0.001 || crew._legsActive)) {
          crew._legsActive = swing > 0.001;
          const legAngle = Math.sin(crew.walkPhase) * 22 * (crew.dir || 1) * swing * AMP_MOVIMIENTO;
          legL.setAttribute("transform", `rotate(${legAngle.toFixed(2)}, -3, 4)`);
          legR.setAttribute("transform", `rotate(${(-legAngle).toFixed(2)}, 3, 4)`);
        }

        // La vibración fina de la herramienta la anima CSS (.crew-tamper-tool /
        // tamperPercuss); escribirle aquí un transform sería ignorado porque la
        // animación CSS tiene prioridad sobre el atributo (antes era un write fallido por frame).
        const flagEl = el.querySelector(".companion-flag");
        if (flagEl) {
          const flagSway = Math.sin(timestamp / 110) * 12;
          flagEl.setAttribute("transform", `rotate(${flagSway.toFixed(1)}, -5, -9)`);
        }
        
        const label = el.querySelector(".crew-status-label");
        if (label) {
          const textoLabel = crew.isWorking ? `👷 ${crew.responsible} [Trabajando]` : `👷 ${crew.responsible} (${crew.count || '?'}p)`;
          if (label.textContent !== textoLabel) label.textContent = textoLabel;
        }
      }
    });
    
    // 2. Actualizar animacion de Vehiculos Auxiliares
    appState.vehicles.forEach(veh => {
    const model = getVehicleModel(veh);
      const minX = (veh.xMin || 100) + 45;
      const maxX = (veh.xMax || 300) - 45;
      
      const isD1Veh = veh.via === 'D1' || (veh.zones && veh.zones.includes('Z-RAMAL-D1'));
      const isD2Veh = veh.via === 'D2' || (veh.zones && veh.zones.includes('Z-RAMAL-D2'));
      
      let curMinX = minX;
      let curMaxX = maxX;
      if (isD1Veh) {
        curMinX = 2935;
        curMaxX = 2995;
      } else if (isD2Veh) {
        curMinX = 3355;
        curMaxX = 3425;
      }
      
      const velocidadVeh = veh.speed ?? 26;
      veh.x += velocidadVeh * (veh.dir || 1) * dt;
      // Fundido de movimiento: rumble/chug/squash solo existen mientras realmente rueda.
      const enMarcha = Math.abs(velocidadVeh) > 0.01;
      const objetivoBlend = enMarcha ? 1 : 0;
      if (veh._moveBlend === undefined) veh._moveBlend = objetivoBlend;
      veh._moveBlend += (objetivoBlend - veh._moveBlend) * (1 - Math.exp(-8 * dt));
      
      if (veh.x >= curMaxX) {
        veh.x = curMaxX;
        veh.dir = -1;
      } else if (veh.x <= curMinX) {
        veh.x = curMinX;
        veh.dir = 1;
      }
      
      const el = document.getElementById(`token-${veh.id}`);
      if (el) {
        let yBase;
        let rotDeg = 0;
        if (isD1Veh) {
          yBase = 220 - (veh.x - 2920) * (198.0 / 90.0);
          rotDeg = -65.5;
        } else if (isD2Veh) {
          yBase = 220 - (3440 - veh.x) * (198.0 / 100.0);
          rotDeg = 63.2;
        } else {
          yBase = veh.via === "V1" ? 330 : 220;
          rotDeg = 0;
        }
        
        const blend = veh._moveBlend;
        const rumble = Math.sin(timestamp / 35) * 0.7 * blend * AMP_MOVIMIENTO;
        el.setAttribute("transform", `translate(${veh.x.toFixed(1)}, ${(yBase + rumble).toFixed(2)}) scale(${semanticScale.toFixed(3)})`);
        
        // Chug-chug y cabeceo de suspensión del vehículo auxiliar: translate/rotate
        // mínimos añadidos al transform del visual y amortiguados por blend
        // (cero balanceo si está detenida). Sin conflictos CSS desde la fix de veh-chug-vibe.
        const visual = el.querySelector(".veh-visual");
        if (visual) {
          const chugY = Math.sin(timestamp / 95) * 0.55 * blend * AMP_MOVIMIENTO;
          const cabeceo = Math.sin(timestamp / 160) * 0.8 * blend * AMP_MOVIMIENTO;
          const squashY = 1 + Math.sin(timestamp / 90) * 0.025 * blend;
          const squashX = (veh.dir || 1) * (1 / squashY);
          const baseScale = `scale(${squashX.toFixed(3)}, ${squashY.toFixed(3)})`;
          const baseRot = rotDeg !== 0 ? ` rotate(${(rotDeg * (veh.dir || 1)).toFixed(2)})` : '';
          visual.setAttribute("transform", `translate(0, ${chugY.toFixed(2)}) rotate(${cabeceo.toFixed(2)}) ${baseScale}${baseRot}`);
        }
        
        // El haz solo se reescribe al cambiar de sentido (y una vez tras re-render):
        // reasignar points/fill cada frame recomputa el gradiente y hace titilar el faro.
        const beam = el.querySelector(".headlight-beam");
        if (beam) {
          const puntosBeam = veh.dir === -1 ? "-48,-2 -135,-22 -135,16" : "48,-2 135,-22 135,16";
          if (veh._beamDir !== veh.dir || beam.getAttribute("points") !== puntosBeam) {
            veh._beamDir = veh.dir;
            beam.setAttribute("points", puntosBeam);
            beam.setAttribute("fill", veh.dir === -1 ? "url(#headlight-beam-west)" : "url(#headlight-beam-east)");
          }
        }

        // Ruedas: solo se escriben cuando cambia el grado efectivo (y nada si está parada)
        const spokes = el.querySelectorAll(".veh-wheel-spoke");
        if (spokes.length > 0 && blend > 0.02) {
          const wheelDeg = ((veh.x * 14) % 360).toFixed(1);
          if (veh._wheelDeg !== wheelDeg) {
            veh._wheelDeg = wheelDeg;
            spokes.forEach(sp => sp.setAttribute("transform", `rotate(${wheelDeg})`));
          }
        }

        // Mariposa de escape: aleteo por CSS (.veh-exhaust-flapper / flapperBounce);
        // sin transform JS que la animación CSS pisaría de todos modos.
      }
    });
    
    requestAnimationFrame(tick);
  }
  
  requestAnimationFrame(tick);
}

// ------------------------------------------------------------------------------
// 14. POPOVER DE MÚLTIPLES CUADRILLAS A PIE
// ------------------------------------------------------------------------------
function showMultiCrewPopover(crews, clientX, clientY) {
  const popover = document.getElementById('multicrew-popover');
  const title = document.getElementById('popover-title');
  const body = document.getElementById('popover-body');
  
  title.textContent = `Coexistencia de Personal (${crews[0].via}): ${crews.length} Cuadrillas`;
  body.innerHTML = '';
  
  crews.forEach((c, idx) => {
    const item = document.createElement('div');
    item.className = 'popover-crew-item';
    item.innerHTML = `
      <div style="display:flex; justify-content:space-between;">
        <strong>#${idx + 1} ${c.responsible} (${c.count || '?'} pers)</strong>
        <span style="color:#38bdf8; font-weight:bold;">Radio: ${c.radio}</span>
      </div>
      <div>Empresa: ${c.company} | Ingreso: ${c.timeIn}</div>
      <div style="margin-top:6px; display:flex; gap:6px;">
        <button class="btn-table-action" onclick="focusEntityOnMap('${c.id}')">Centrar</button>
        <button class="btn-table-action btn-move-action" onclick="moveEntityFromTable('${c.id}', event)">📍 Mover</button>
        <button class="btn-table-action btn-safe-zone" onclick="toggleSafeZone('${c.id}')">${c.inSafeZone ? 'A Vía' : 'Andén'}</button>
        <button class="btn-table-action" onclick="concludeWorkJob('${c.id}')">Concluir</button>
        <button class="btn-table-action danger" onclick="removeCrew('${c.id}')">Despejar</button>
      </div>
    `;
    body.appendChild(item);
  });
  
  popover.style.left = `${Math.min(clientX, window.innerWidth - 320)}px`;
  popover.style.top = `${Math.min(clientY, window.innerHeight - 250)}px`;
  popover.style.display = 'block';
  
  document.getElementById('popover-close').onclick = () => {
    popover.style.display = 'none';
  };
}

// ------------------------------------------------------------------------------
// 15. BITÁCORA ACTIVA CON BÚSQUEDA Y PESTAÑA DE TERMINADOS
// ------------------------------------------------------------------------------
function initDockTabsAndSearch() {
  document.querySelectorAll('.dock-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.dock-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      appState.activeTab = tab.getAttribute('data-tab');
      playSound('click');
      renderTable();
    });
  });
  
  const searchInput = document.getElementById('dock-search-input');
  searchInput.addEventListener('input', (e) => {
    appState.searchQuery = e.target.value.toLowerCase().trim();
    renderTable();
  });
}

function renderTable() {
  const tbody = document.getElementById('work-table-body');
  tbody.innerHTML = '';
  
  let rows = [];
  
  if (appState.activeTab === 'completed') {
    rows = appState.completedJobs.map(j => ({ ...j, isCompleted: true }));
  } else {
    if (appState.activeTab === 'all' || appState.activeTab === 'crews') {
      appState.crews.forEach(c => rows.push({ ...c, category: 'crew', isCompleted: false }));
    }
    if (appState.activeTab === 'all' || appState.activeTab === 'vehicles') {
      appState.vehicles.forEach(v => rows.push({ ...v, category: 'vehicle', isCompleted: false }));
    }
  }
  
  if (appState.searchQuery) {
    const q = appState.searchQuery;
    rows = rows.filter(item => {
      const resp = (item.responsible || item.vehicleType || '').toLowerCase();
      const comp = (item.company || item.driver || '').toLowerCase();
      const rad = (item.radio || '').toLowerCase();
      const via = (item.via || '').toLowerCase();
      const zone = (item.zoneLabel || '').toLowerCase();
      return resp.includes(q) || comp.includes(q) || rad.includes(q) || via.includes(q) || zone.includes(q);
    });
  }
  
  if (rows.length === 0) {
    const msg = appState.activeTab === 'completed'
      ? '— No hay trabajos concluidos archivados en esta guardia —'
      : '— Vía Principal despejada o no hay registros que coincidan con la búsqueda —';
    tbody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding:18px; color:#64748b;">${msg}</td></tr>`;
    return;
  }
  
  const filas = agruparFilasTabla(rows);
  filas.forEach(fila => {
    const item = fila.base;
    const items = fila.items;
    const tr = document.createElement('tr');
    const isCrew = item.type === 'crew' || item.category === 'crew';
    const isCompleted = item.isCompleted;
    const vias = [...new Set(items.map(i => i.via))].sort();
    const viaHtml = vias.map(v => `<span class="tag-badge ${v === 'V1' ? 'tag-via-1' : 'tag-via-2'}">${v}</span>`).join(' ');
    const tramosHtml = items.length > 1 && new Set(items.map(i => i.zoneLabel)).size > 1
      ? items.map(i => `<strong>${i.via}:</strong> ${i.zoneLabel}`).join('<br>')
      : `<strong>${item.zoneLabel || 'Tramo asignado'}</strong>`;
    const punto = isCrew && colorGrupoPermiso(item) ? ` <span style="color:${colorGrupoPermiso(item)}">●</span>` : '';
    
    tr.innerHTML = `
      <td>
        <span class="tag-badge ${isCompleted ? 'tag-completed' : (isCrew ? (item.inSafeZone ? 'tag-safezone' : 'tag-crew') : 'tag-vehicle')}">
          ${isCompleted ? '✔ Concluido' : (isCrew ? (item.inSafeZone ? '🛡️ En Andén' : '👷 Cuadrilla') : '🚜 Vehículo')}
        </span>
      </td>
      <td><strong>${isCrew ? item.responsible : item.vehicleType}</strong>${punto}</td>
      <td><strong style="color:#fde68a;">${item.ot || '—'}</strong></td>
      <td>${item.company || (isCrew ? 'Mantenimiento Vía' : 'Vía y Catenaria')}</td>
      <td>${viaHtml}</td>
      <td>${tramosHtml}</td>
      <td><strong style="color:#38bdf8;">${item.radio}</strong></td>
      <td>${isCrew ? `${item.count || '?'} pers.` : (item.leader || '—')}</td>
      <td>
        ${isCompleted 
          ? '<span style="color:#10b981; font-weight:bold;">✔ Concluido</span>' 
          : (isCrew && item.inSafeZone 
              ? '<span style="color:#2dd4bf; font-weight:bold;">🛡️ Andén Seguro</span>' 
              : '<span style="color:#38bdf8; font-weight:bold;">● En Vía</span>')}
      </td>
      <td>${item.timeIn || '—'}</td>
      <td><strong style="color:${isCompleted ? '#a7f3d0' : '#94a3b8'};">${item.timeOut || (isCompleted ? '—' : 'Pendiente')}</strong></td>
      <td>
        ${!isCompleted ? `
          <button class="btn-table-action" onclick="filaVer('${item.id}')" title="Centrar en el mapa">Ver</button>
          <button class="btn-table-action" onclick="filaEditar('${item.id}', event)" title="Editar datos completos">Editar</button>
          <button class="btn-table-action btn-move-action" onclick="filaMover('${item.id}', event)" title="Reubicar o ampliar cantones en el plano">📍 Mover</button>
          ${isCrew ? `<button class="btn-table-action btn-safe-zone ${item.inSafeZone ? 'active-safe' : ''}" onclick="filaAndén('${item.id}', event)" title="Mover a Andén / Zona Segura">${item.inSafeZone ? '🚶 A Vía' : '🛡️ Andén'}</button>` : ''}
          <button class="btn-table-action btn-finish-action" onclick="filaConcluir('${item.id}')" title="Concluir trabajo">✔ Concluir</button>
          <button class="btn-table-action danger" onclick="filaDespejar('${item.id}')" title="Despejar">Despejar</button>
        ` : `
          <button class="btn-table-action" onclick="reopenCompletedJob('${item.id}')" title="Reabrir a Vía Principal">Reabrir</button>
          <button class="btn-table-action danger" onclick="deleteCompletedJob('${item.id}')" title="Eliminar del archivo">Borrar</button>
        `}
      </td>
    `;
    
    if (!isCompleted) {
      tr.addEventListener('click', (e) => {
        if (e.target.tagName.toLowerCase() === 'button') return;
        focusEntityOnMap(item.id);
      });
    }
    
    tbody.appendChild(tr);
  });
}

// Una fila por trabajo: fichas del mismo permiso y responsable (ej. V1 y V2) se muestran juntas
function claveFilaTrabajo(e) {
  return e.ot ? `${e.type}|${e.ot}|${e.responsible || e.vehicleType}` : `solo|${e.id}`;
}

function agruparFilasTabla(rows) {
  if (appState.activeTab === 'completed') return rows.map(r => ({ base: r, items: [r] }));
  const mapa = new Map();
  rows.forEach(r => {
    const k = claveFilaTrabajo(r);
    if (!mapa.has(k)) mapa.set(k, { base: r, items: [] });
    mapa.get(k).items.push(r);
  });
  return [...mapa.values()].map(f => ({ base: ordenarViasGrupo(f.items)[0], items: ordenarViasGrupo(f.items) }));
}

function ordenarViasGrupo(items) {
  const orden = { V1: 1, V2: 2, D1: 3, D2: 4 };
  return items.slice().sort((a, b) => (orden[a.via] || 9) - (orden[b.via] || 9));
}

function miembrosGrupoTrabajo(id) {
  const todas = [...appState.crews, ...appState.vehicles];
  const e = todas.find(x => x.id === id);
  if (!e) return [];
  const k = claveFilaTrabajo(e);
  return todas.filter(x => claveFilaTrabajo(x) === k);
}

// Si un trabajo en Vía 2 pasa por el empalme de D1 o D2, pregunta si se conecta.
// Si no pasa por el empalme, no pregunta.
function ofrecerConexionRamal(entidad) {
  if (!entidad || entidad.via !== 'V2' || entidad.inSafeZone) return;
  const opciones = [];
  if (entidad.xMin <= 3010 && entidad.xMax >= 2920) opciones.push('D1');
  if (entidad.xMin <= 3440 && entidad.xMax >= 3340) opciones.push('D2');
  if (!opciones.length) return;
  const d1 = document.getElementById('rc-d1');
  const d2 = document.getElementById('rc-d2');
  d1.hidden = !opciones.includes('D1');
  d2.hidden = !opciones.includes('D2');
  document.getElementById('rc-text').textContent =
    `${entidad.responsible || entidad.vehicleType} (permiso ${entidad.ot || 's/n'}) pasa por el empalme ${opciones.join(' / ')} del ramal. ¿Quieres conectar el mismo trabajo al ramal?`;
  const conectar = (ramal) => {
    closeModal('modal-ramal-conexion');
    crearConexionRamal(entidad, ramal);
  };
  d1.onclick = () => conectar('D1');
  d2.onclick = () => conectar('D2');
  document.getElementById('rc-no').onclick = () => closeModal('modal-ramal-conexion');
  openModal('modal-ramal-conexion');
}

function crearConexionRamal(origen, ramal) {
  const xMin = ramal === 'D1' ? 2920 : 3340;
  const xMax = ramal === 'D1' ? 3010 : 3440;
  const copia = {
    ...origen,
    id: `${origen.type === 'crew' ? 'CRW' : 'VEH'}-${ramal}${Date.now().toString().slice(-6)}`,
    via: ramal,
    zones: [ramal === 'D1' ? 'Z-RAMAL-D1' : 'Z-RAMAL-D2'],
    zoneLabel: ramal === 'D1' ? 'Ramal D1 (Vía 2 ⇄ Patio Taller Santa Anita)' : 'Ramal D2 (Vía 2 ⇄ Patio Taller Santa Anita)',
    xMin,
    xMax,
    x: (xMin + xMax) / 2,
    isWorking: false,
    workTimer: 0
  };
  if (origen.type === 'crew') appState.crews.push(copia);
  else appState.vehicles.push(copia);
  appState.historyLog.push({
    timestamp: new Date().toISOString(),
    action: 'CONEXION_RAMAL',
    detail: `${origen.responsible || origen.vehicleType} (${origen.ot || 's/n'}) conectado al ramal ${ramal}.`
  });
  persistState();
  renderAll();
  showToast(`Trabajo conectado al ramal ${ramal}.`, 'success');
}

// Pregunta a qué vía aplicar la acción; si el trabajo solo está en una vía, ejecuta directo
function pedirAlcanceVias(titulo, texto, miembros, cb) {
  if (miembros.length < 2) { cb(miembros); return; }
  document.getElementById('group-scope-title').textContent = titulo;
  document.getElementById('group-scope-text').textContent = texto;
  ['V1', 'V2', 'D1', 'D2'].forEach(via => {
    const btn = document.getElementById(`gs-${via.toLowerCase()}`);
    const m = miembros.find(x => x.via === via);
    btn.hidden = !m;
    btn.onclick = () => { closeModal('modal-group-scope'); if (m) cb([m]); };
  });
  openModal('modal-group-scope');
}

window.filaVer = function(id) { focusEntityOnMap(id); };

window.filaEditar = function(id, event) {
  if (event) event.stopPropagation();
  const grupo = miembrosGrupoTrabajo(id);
  pedirAlcanceVias('Editar trabajo', 'Elige la vía que vas a editar.', grupo, sel => {
    if (!sel.length) return;
    editEntityFromTable(sel[0].id, event);
    appState.editarGrupoIds = null;
  });
};

window.filaMover = function(id, event) {
  if (event) event.stopPropagation();
  pedirAlcanceVias('Mover trabajo', 'Elige la vía que vas a reubicar.', miembrosGrupoTrabajo(id), sel => {
    if (sel[0]) moveEntityFromTable(sel[0].id, null);
  });
};


window.filaAndén = function(id, event) {
  if (event) event.stopPropagation();
  const grupo = miembrosGrupoTrabajo(id);
  const quiero = !(grupo.find(m => m.id === id) || grupo[0]).inSafeZone;
  pedirAlcanceVias('Zona segura', 'Elige la vía a replegar a andén o a retomar en vía.', grupo, sel => {
    sel.forEach(m => { if (!!m.inSafeZone !== quiero) toggleSafeZone(m.id); });
  });
};

window.filaConcluir = function(id) {
  pedirAlcanceVias('Concluir trabajo', 'Elige la vía que se archiva como concluida.', miembrosGrupoTrabajo(id), sel => {
    const curTime = new Date().toLocaleTimeString('es-PE', { hour12: false, hour: '2-digit', minute: '2-digit' });
    sel.forEach(m => concludeWorkJob(m.id, curTime, m.notes || 'Trabajo concluido desde tabla'));
  });
};

window.filaDespejar = function(id) {
  pedirAlcanceVias('Despejar de vía', 'Elige la vía que vas a despejar.', miembrosGrupoTrabajo(id), sel => {
    sel.forEach(m => { if (m.type === 'crew') removeCrew(m.id); else removeVehicle(m.id); });
  });
};

// Copia los datos compartidos a las demás vías del mismo trabajo cuando se editó "ambas vías"
function propagarEdicionGrupo(token) {
  const ids = appState.editarGrupoIds;
  appState.editarGrupoIds = null;
  if (!ids || !ids.includes(token.id)) return;
  const campos = token.type === 'crew'
    ? ['responsible', 'company', 'radio', 'count', 'timeIn', 'timeOut', 'notes']
    : ['vehicleType', 'company', 'radio', 'timeIn', 'timeOut', 'notes'];
  const todas = [...appState.crews, ...appState.vehicles];
  ids.filter(id => id !== token.id).forEach(id => {
    const o = todas.find(x => x.id === id);
    if (o) campos.forEach(k => { o[k] = token[k]; });
  });
}


window.moveEntityFromTable = function(entityId, event) {
  if (event) event.stopPropagation();
  const crew = appState.crews.find(c => c.id === entityId);
  const veh = appState.vehicles.find(v => v.id === entityId);
  const target = crew || veh;
  if (target) {
    focusEntityOnMap(entityId);
    startReassigningToken(target);
  }
};

window.editEntityFromTable = function(entityId, event) {
  if (event) event.stopPropagation();
  const crew = appState.crews.find(c => c.id === entityId);
  const veh = appState.vehicles.find(v => v.id === entityId);
  const target = crew || veh;
  if (target) {
    focusEntityOnMap(entityId);
    openQuickEditForToken(target, event ? event.clientX : 400, event ? event.clientY : 200);
  }
};

window.reopenCompletedJob = function(jobId) {
  const idx = appState.completedJobs.findIndex(j => j.id === jobId);
  if (idx === -1) return;
  const job = appState.completedJobs[idx];
  
  // VERIFICACIÓN ESTRICTA DE SEGURIDAD ATS ANTES DE REABRIR
  // Bloquea si un vehículo choca con otro o con personal en vía activa
  const conflict = checkZonesConflict(job.zones, job.via, job.type);
  if (conflict.conflict) {
    playSound('forbidden');
    showToast(`🚫 BLOQUEADO POR ENCLAVAMIENTO ATS: No se puede reabrir ${job.responsible || job.vehicleType} en ${job.via}. ${conflict.reason}`, 'danger');
    return;
  }
  
  // Si no hay conflicto, reabrir a vía activa
  appState.completedJobs.splice(idx, 1);
  delete job.isCompleted;
  delete job.status;
  job.timeOut = '';
  
  if (job.type === 'crew') {
    appState.crews.push(job);
  } else {
    appState.vehicles.push(job);
  }
  
  playSound('pokemon_heal');
  persistState();
  renderAll();
  showToast(`✔ ${job.responsible || job.vehicleType} reabierto exitosamente en ${job.zoneLabel} (${job.via}).`, 'success');
};

window.deleteCompletedJob = function(jobId) {
  const idx = appState.completedJobs.findIndex(j => j.id === jobId);
  if (idx !== -1) {
    appState.completedJobs.splice(idx, 1);
    playSound('click');
    persistState();
    renderAll();
    showToast('Registro eliminado de la bitácora histórica.', 'info');
  }
};

function updateCounters() {
  const crewCount = appState.crews.length;
  const vehicleCount = appState.vehicles.length;
  const completedCount = appState.completedJobs.length;
  
  const occupiedZones = new Set();
  appState.crews.forEach(c => {
    if (!c.inSafeZone) c.zones.forEach(z => occupiedZones.add(z));
  });
  appState.vehicles.forEach(v => v.zones.forEach(z => occupiedZones.add(z)));
  
  document.getElementById('counter-crews').textContent = crewCount;
  document.getElementById('counter-vehicles').textContent = vehicleCount;
  document.getElementById('counter-zones').textContent = occupiedZones.size;
  
  document.getElementById('badge-tab-all').textContent = crewCount + vehicleCount;
  document.getElementById('badge-tab-crews').textContent = crewCount;
  document.getElementById('badge-tab-vehicles').textContent = vehicleCount;
  
  const compBadge = document.getElementById('badge-tab-completed');
  if (compBadge) compBadge.textContent = completedCount;
}

// ------------------------------------------------------------------------------
// 16. ACCIONES OPERATIVAS: CENTRAR Y DESPEJAR
// ------------------------------------------------------------------------------
window.focusEntityOnMap = function(entityId) {
  let targetX = null;
  const crew = appState.crews.find(c => c.id === entityId);
  const veh = appState.vehicles.find(v => v.id === entityId);
  
  if (crew) targetX = crew.x;
  else if (veh) targetX = veh.x;
  
  if (targetX !== null) {
    smoothGlideToX(targetX);
    playSound('coin');
    showToast(`Centrado en elemento ${entityId}`, 'info');
  }
};

window.removeCrew = function(crewId) {
  const idx = appState.crews.findIndex(c => c.id === crewId);
  if (idx !== -1) {
    const crew = appState.crews[idx];
    appState.crews.splice(idx, 1);
    appState.historyLog.push({
      timestamp: new Date().toISOString(),
      action: 'SALIDA_CUADRILLA',
      detail: `Cuadrilla ${crew.responsible} desocupó la vía.`
    });
    
    const popover = document.getElementById('multicrew-popover');
    if (popover) popover.style.display = 'none';
    const card = document.getElementById('token-quickcard');
    if (card) card.style.display = 'none';
    
    playSound('jump');
    persistState();
    renderAll();
    showToast(`Cuadrilla de ${crew.responsible} desocupó la vía.`, 'warning');
  }
};

window.removeVehicle = function(vehId) {
  const idx = appState.vehicles.findIndex(v => v.id === vehId);
  if (idx !== -1) {
    const veh = appState.vehicles[idx];
    appState.vehicles.splice(idx, 1);
    appState.historyLog.push({
      timestamp: new Date().toISOString(),
      action: 'SALIDA_VEHICULO',
      detail: `Vehículo ${veh.vehicleType} concluyó maniobras y salió de vía principal.`
    });
    
    const card = document.getElementById('token-quickcard');
    if (card) card.style.display = 'none';
    
    playSound('jump');
    persistState();
    renderAll();
    showToast(`Vehículo ${veh.vehicleType} concluyó maniobra.`, 'warning');
  }
};

// ------------------------------------------------------------------------------
// 17. PARTE DIARIO OFICIAL DE GUARDIA (IMPRIMIBLE / FIRMAS SPCO Y OPERADOR)
// ------------------------------------------------------------------------------
function initDailySheetModal() {
  const btnOpen = document.getElementById('btn-open-daily-sheet');
  const btnPrint = document.getElementById('btn-print-daily-sheet');
  const btnExportHTML = document.getElementById('btn-export-sheet-html');
  
  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      playSound('coin');
      generateDailySheetHTML();
      openModal('modal-daily-sheet');
    });
  }
  
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      playSound('coin');
      window.print();
    });
  }
  
  if (btnExportHTML) {
    btnExportHTML.addEventListener('click', () => {
      playSound('coin');
      exportDailySheetStandalone();
    });
  }
}

function generateDailySheetHTML() {
  const container = document.getElementById('printable-daily-sheet');
  if (!container) return;
  
  const now = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = now.toLocaleDateString('es-PE', dateOptions);
  const formattedTime = now.toLocaleTimeString('es-PE', { hour12: false, hour: '2-digit', minute: '2-digit' });
  
  const currentHour = now.getHours();
  let shiftName = 'TURNO 1 (MAÑANA: 06:00 - 14:00)';
  if (currentHour >= 14 && currentHour < 22) {
    shiftName = 'TURNO 2 (TARDE: 14:00 - 22:00)';
  } else if (currentHour >= 22 || currentHour < 6) {
    shiftName = 'TURNO 3 (NOCHE: 22:00 - 06:00 - MANTENIMIENTO)';
  }
  
  let totalPersonal = 0;
  appState.crews.forEach(c => totalPersonal += (c.count || 0));
  
  let html = `
    <!-- Cabecera Oficial Metro de Lima Línea 2 -->
    <div class="official-sheet-header">
      <div class="official-logo-box">
        <div class="official-logo-badge">L2</div>
        <div class="official-title-box">
          <h2>METRO DE LIMA Y CALLAO — LÍNEA 2</h2>
          <p>PUESTO DE CONTROL CENTRAL (PCO) / OCIR ATS — CONTROL DE TRABAJOS EN VÍA</p>
        </div>
      </div>
      <div class="official-meta-box">
        <strong>REPORTE SPCO</strong><br>
        <span>REF: ATS-VP-ETAPA-1A</span>
      </div>
    </div>

    <!-- Metadatos de la Guardia -->
    <div class="official-meta-grid">
      <div class="official-meta-item">
        <label>Fecha de Guardia:</label>
        <strong style="text-transform: capitalize;">${formattedDate}</strong>
      </div>
      <div class="official-meta-item">
        <label>Turno Operativo:</label>
        <strong>${shiftName}</strong>
      </div>
      <div class="official-meta-item">
        <label>Hora de Corte / Emisión:</label>
        <strong>${formattedTime} hrs</strong>
      </div>
      <div class="official-meta-item">
        <label>Sector Cobertura:</label>
        <strong>E20 Evitamiento ➔ E24 M. Sta Anita + PTSA</strong>
      </div>
    </div>

    <!-- Resumen Cuantitativo -->
    <div style="display:flex; justify-content:space-between; background:#e2e8f0; padding:8px 14px; border-radius:4px; margin-bottom:14px; font-size:11px; font-weight:bold;">
      <span>Cuadrillas en Vía: ${appState.crews.length}</span>
      <span>Vehículos Auxiliares: ${appState.vehicles.length}</span>
      <span>Total Personal Desplegado: ${totalPersonal} operarios</span>
      <span>Trabajos Concluidos: ${appState.completedJobs.length}</span>
    </div>

    <!-- SECCIÓN 1: TRABAJOS ACTIVOS EN VÍA AL CORTE -->
    <div class="sheet-section-title">1. TRABAJOS Y MANIOBRAS ACTIVAS EN VÍA PRINCIPAL (CORTE DE RELEVO)</div>
    <table class="sheet-table">
      <thead>
        <tr>
          <th style="width:75px;">Categoría</th>
          <th>ID / Responsable</th>
          <th style="width:110px;">Permiso</th>
          <th>Empresa / Disciplina</th>
          <th style="width:40px;">Vía</th>
          <th>Tramos Cubiertos</th>
          <th>Radio TETRA</th>
          <th style="width:50px;">Personal</th>
          <th style="width:65px;">Hora Ingreso</th>
          <th>Observaciones de Tarea</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  if (appState.crews.length === 0 && appState.vehicles.length === 0) {
    html += `<tr><td colspan="10" style="text-align:center; padding:12px; color:#64748b;">(Sin trabajos activos en vía principal al momento del corte de guardia)</td></tr>`;
  } else {
    appState.crews.forEach(c => {
      html += `
        <tr>
          <td><span class="sheet-badge sheet-badge-crew">${c.inSafeZone ? '🛡️ En Andén' : '👷 Cuadrilla'}</span></td>
          <td><strong>${c.responsible}</strong></td>
          <td><strong>${c.ot || '—'}</strong></td>
          <td>${c.company}</td>
          <td><span class="sheet-badge ${c.via === 'V1' ? 'sheet-badge-v1' : 'sheet-badge-v2'}">${c.via}</span></td>
          <td>${c.zoneLabel}</td>
          <td><strong>${c.radio}</strong></td>
          <td>${c.count || '?'} pers.</td>
          <td>${c.timeIn}</td>
          <td>${c.inSafeZone ? 'En zona segura de andén (vía despejada)' : (c.notes || 'Mantenimiento de infraestructura')}</td>
        </tr>
      `;
    });
    
    appState.vehicles.forEach(v => {
      html += `
        <tr>
          <td><span class="sheet-badge sheet-badge-veh">🚜 Vehículo</span></td>
          <td><strong>${v.vehicleType}</strong></td>
          <td><strong>${v.ot || '—'}</strong></td>
          <td>${v.company}</td>
          <td><span class="sheet-badge ${v.via === 'V1' ? 'sheet-badge-v1' : 'sheet-badge-v2'}">${v.via}</span></td>
          <td>${v.zoneLabel}</td>
          <td><strong>${v.radio}</strong></td>
          <td>${v.driver || 'Operador'}</td>
          <td>${v.timeIn}</td>
          <td>${v.notes || 'Maniobra auxiliar en vía'}</td>
        </tr>
      `;
    });
  }
  
  html += `
      </tbody>
    </table>

    <!-- SECCIÓN 2: TRABAJOS CONCLUIDOS DURANTE LA GUARDIA -->
    <div class="sheet-section-title">2. REGISTRO DE TRABAJOS CONCLUIDOS Y DESPEJES (HISTORIAL DEL TURNO)</div>
    <table class="sheet-table">
      <thead>
        <tr>
          <th style="width:75px;">Categoría</th>
          <th>Responsable / Unidad</th>
          <th style="width:110px;">Permiso</th>
          <th>Empresa</th>
          <th style="width:40px;">Vía</th>
          <th>Tramos Autorizados</th>
          <th style="width:65px;">Hora Ingreso</th>
          <th style="width:65px;">Hora Salida</th>
          <th>Estado Despeje</th>
          <th>Informe / Observaciones</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  if (appState.completedJobs.length === 0) {
    html += `<tr><td colspan="10" style="text-align:center; padding:12px; color:#64748b;">(Sin trabajos terminados registrados durante este turno)</td></tr>`;
  } else {
    appState.completedJobs.forEach(j => {
      const isCrew = j.type === 'crew' || j.category === 'crew';
      html += `
        <tr>
          <td><span class="sheet-badge ${isCrew ? 'sheet-badge-crew' : 'sheet-badge-veh'}">${isCrew ? '👷 Cuadrilla' : '🚜 Vehículo'}</span></td>
          <td><strong>${isCrew ? j.responsible : j.vehicleType}</strong></td>
          <td><strong>${j.ot || '—'}</strong></td>
          <td>${j.company}</td>
          <td><span class="sheet-badge ${j.via === 'V1' ? 'sheet-badge-v1' : 'sheet-badge-v2'}">${j.via}</span></td>
          <td>${j.zoneLabel}</td>
          <td>${j.timeIn || '—'}</td>
          <td><strong>${j.timeOut || '—'}</strong></td>
          <td><span style="color:#15803d; font-weight:bold;">✔ Vía Despejada</span></td>
          <td>${j.notes || 'Conforme sin novedades'}</td>
        </tr>
      `;
    });
  }
  
  html += `
      </tbody>
    </table>

    <!-- SECCIÓN 3: CASILLEROS DE FIRMA MANUSCRITA Y CONFORMIDAD OPERATIVA -->
    <div class="sheet-signatures-box">
      <!-- Cuadro Firma Operador -->
      <div class="signature-card">
        <h4>CONFORMIDAD DEL OPERADOR ATS / OCIR (TURNO SALIENTE)</h4>
        
        <div class="sig-field-line">
          <span>Nombre y Apellidos (a mano):</span>
          <div class="handwrite-line"></div>
        </div>

        <div class="sig-field-line">
          <span>Código Operador / DNI:</span>
          <div class="handwrite-line"></div>
        </div>

        <div class="sig-field-line" style="margin-top:20px;">
          <span>Firma:</span>
          <div class="handwrite-line"></div>
        </div>
      </div>

      <!-- Cuadro Firma Supervisor SPCO -->
      <div class="signature-card">
        <h4>VISTO BUENO SUPERVISOR PCO (SPCO LÍNEA 2)</h4>
        
        <div class="sig-field-line">
          <span>Nombre y Apellidos (a mano):</span>
          <div class="handwrite-line"></div>
        </div>

        <div class="sig-field-line">
          <span>Matrícula SPCO:</span>
          <div class="handwrite-line"></div>
        </div>

        <div class="sig-field-line" style="margin-top:20px;">
          <span>Firma y Sello Oficial:</span>
          <div class="handwrite-line"></div>
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

function exportDailySheetStandalone() {
  const container = document.getElementById('printable-daily-sheet');
  if (!container) return;
  
  const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte SPCO ATS - Metro de Lima Línea 2</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background: #fff; color: #000; padding: 25px; margin: 0; }
    .official-sheet-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2.5px solid #0284c7; padding-bottom: 12px; margin-bottom: 14px; }
    .official-logo-box { display: flex; align-items: center; gap: 10px; }
    .official-logo-badge { background: #0284c7; color: #fff; font-size: 16px; font-weight: 900; padding: 6px 12px; border-radius: 6px; }
    .official-title-box h2 { font-size: 15px; font-weight: 900; margin: 0; }
    .official-title-box p { font-size: 10.5px; color: #555; margin: 2px 0 0 0; }
    .official-meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: #f1f5f9; padding: 10px 14px; border: 1px solid #cbd5e1; margin-bottom: 16px; font-size: 11px; }
    .official-meta-item label { display: block; font-size: 9px; text-transform: uppercase; font-weight: 800; color: #64748b; }
    .sheet-section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #0369a1; border-left: 3.5px solid #0284c7; padding-left: 8px; margin: 14px 0 8px 0; }
    .sheet-table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 14px; }
    .sheet-table th { background: #0f172a; color: #fff; padding: 6px 8px; border: 1px solid #334155; text-align: left; }
    .sheet-table td { padding: 6px 8px; border: 1px solid #cbd5e1; vertical-align: middle; }
    .sheet-table tr:nth-child(even) td { background: #f8fafc; }
    .sheet-badge { display: inline-block; padding: 2px 6px; border-radius: 3px; font-weight: 800; font-size: 9px; }
    .sheet-badge-v1 { background: #dcfce7; color: #15803d; }
    .sheet-badge-v2 { background: #dbeafe; color: #1d4ed8; }
    .sheet-badge-crew { background: #fef3c7; color: #b45309; }
    .sheet-badge-veh { background: #e0f2fe; color: #0369a1; }
    .sheet-signatures-box { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px; padding-top: 14px; border-top: 1.5px solid #cbd5e1; }
    .signature-card { border: 1.5px dashed #94a3b8; border-radius: 6px; padding: 12px 16px; background: #fafafa; }
    .signature-card h4 { font-size: 11px; font-weight: 800; text-align: center; margin-bottom: 18px; }
    .sig-field-line { display: flex; align-items: flex-end; gap: 8px; margin-bottom: 12px; font-size: 10.5px; }
    .sig-field-line .handwrite-line { flex: 1; border-bottom: 1px solid #000; height: 14px; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  ${container.innerHTML}
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const dlAnchor = document.createElement('a');
  dlAnchor.href = url;
  dlAnchor.download = `REPORTE_SPCO_L2_ATS_${new Date().toISOString().slice(0, 10)}.html`;
  dlAnchor.click();
  showToast('Reporte SPCO descargado en HTML para firma', 'success');
}

// ------------------------------------------------------------------------------
// 18. REPORTES OCIR Y RESPALDOS
// ------------------------------------------------------------------------------
function initReportAndExport() {
  const btnReport = document.getElementById('btn-open-report');
  const btnExport = document.getElementById('btn-export-json');
  const btnImport = document.getElementById('btn-import-json');
  const fileInput = document.getElementById('file-import-input');
  const btnClearAll = document.getElementById('btn-clear-all');
  
  if (btnReport) {
    btnReport.addEventListener('click', () => {
      playSound('coin');
      generateShiftReport();
      openModal('modal-report');
    });
  }
  
// btnReport condicional arriba
  
  document.getElementById('btn-copy-report').addEventListener('click', () => {
    const text = document.getElementById('report-content-text').innerText;
    navigator.clipboard.writeText(text).then(() => {
      playSound('coin');
      showToast('Acta copiada al portapapeles', 'success');
    });
  });
  
  document.getElementById('btn-print-report').addEventListener('click', () => {
    playSound('coin');
    window.print();
  });
  
  if (btnExport) btnExport.addEventListener('click', () => {
    playSound('coin');
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(appState, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `ATS_OCIR_VP_RESPALDO_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchor.click();
    showToast('Respaldo descargado exitosamente', 'success');
  });
  
  if (btnImport) btnImport.addEventListener('click', () => {
    playSound('coin');
    fileInput.click();
  });
  
  if (fileInput) fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.crews && imported.vehicles) {
          appState.crews = imported.crews;
          appState.vehicles = imported.vehicles;
          if (Array.isArray(imported.completedJobs)) appState.completedJobs = imported.completedJobs;
          if (imported.historyLog) appState.historyLog = imported.historyLog;
          persistState();
          renderAll();
          showToast('Datos restaurados correctamente', 'success');
        } else {
          alert('El archivo no contiene un formato de respaldo válido de ATS.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  });
  
  btnClearAll.addEventListener('click', () => {
    if (appState.crews.length === 0 && appState.vehicles.length === 0) {
      showToast('La vía ya se encuentra despejada.', 'info');
      return;
    }
    const ok = confirm('¿Confirmas el despeje total de la Vía Principal? Todas las cuadrillas y vehículos saldrán del plano.');
    if (ok) {
      playSound('hazard');
      appState.crews = [];
      appState.vehicles = [];
      appState.historyLog.push({
        timestamp: new Date().toISOString(),
        action: 'DESPEJE_TOTAL',
        detail: 'El operador OCIR ejecutó el despeje total de la Vía Principal.'
      });
      persistState();
      renderAll();
      showToast('Vía Principal completamente despejada', 'warning');
    }
  });
}

function generateShiftReport() {
  const reportBox = document.getElementById('report-content-text');
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('es-PE', { hour12: false });
  
  let totalPersonal = 0;
  appState.crews.forEach(c => totalPersonal += (c.count || 0));
  
  let txt = `========================================================================================\n`;
  txt += `           METRO DE LIMA - LÍNEA 2 | ACTA DE TRABAJOS EN VÍA PRINCIPAL (OCIR ATS)        \n`;
  txt += `========================================================================================\n`;
  txt += `FECHA DE GENERACIÓN : ${dateStr} - ${timeStr}\n`;
  txt += `TRAMO OPERATIVO     : ETAPA 1A (E20 Evitamiento - E24 Mercado Santa Anita)\n`;
  txt += `TOTAL CUADRILLAS EN VÍA : ${appState.crews.length} (${totalPersonal} operarios en total)\n`;
  txt += `TOTAL VEHÍCULOS EN VÍA  : ${appState.vehicles.length}\n`;
  txt += `TOTAL TRABAJOS CONCLUIDOS : ${appState.completedJobs.length}\n`;
  txt += `----------------------------------------------------------------------------------------\n\n`;
  
  txt += `1. DETALLE DE CUADRILLAS A PIE EN VÍA PRINCIPAL:\n`;
  if (appState.crews.length === 0) {
    txt += `   (Sin cuadrillas activas al momento del corte)\n\n`;
  } else {
    appState.crews.forEach((c, i) => {
      txt += `   [#${i + 1}] Responsable : ${c.responsible.padEnd(22)} | Cant: ${String(c.count || '?').padStart(2)} pers. | Radio TETRA: ${c.radio}\n`;
      txt += `        Empresa     : ${c.company}\n`;
      txt += `        Tramos      : ${c.zoneLabel} (${c.via})\n`;
      txt += `        Estado      : ${c.inSafeZone ? 'En Andén (Zona Segura)' : 'En vía activa'} | Ingreso: ${c.timeIn} | Obs: ${c.notes || '—'}\n`;
      txt += `   -------------------------------------------------------------------------------------\n`;
    });
    txt += `\n`;
  }
  
  txt += `2. DETALLE DE VEHÍCULOS AUXILIARES EN MANIOBRA:\n`;
  if (appState.vehicles.length === 0) {
    txt += `   (Sin vehículos auxiliares en vía al momento del corte)\n\n`;
  } else {
    appState.vehicles.forEach((v, i) => {
      txt += `   [#${i + 1}] Unidad      : ${v.vehicleType}\n`;
      txt += `        Operador    : ${(v.driver || 'Operador').padEnd(22)} | Resp. a Bordo: ${v.leader || '—'}\n`;
      txt += `        Canal Radio : ${v.radio} | Vía: ${v.via}\n`;
      txt += `        Tramos      : ${v.zoneLabel} | Ingreso: ${v.timeIn} | Obs: ${v.notes || '—'}\n`;
      txt += `   -------------------------------------------------------------------------------------\n`;
    });
    txt += `\n`;
  }
  
  txt += `3. RESUMEN DE TRABAJOS CONCLUIDOS DURANTE EL TURNO:\n`;
  if (appState.completedJobs.length === 0) {
    txt += `   (Sin trabajos concluidos al corte)\n\n`;
  } else {
    appState.completedJobs.forEach((j, i) => {
      txt += `   [#${i + 1}] ${j.type === 'crew' ? 'Cuadrilla' : 'Vehículo'} : ${(j.responsible || j.vehicleType).padEnd(22)} | Vía: ${j.via}\n`;
      txt += `        Horarios    : Ingreso: ${j.timeIn} ➔ Salida: ${j.timeOut}\n`;
      txt += `        Tramos      : ${j.zoneLabel} | Empresa: ${j.company}\n`;
      txt += `   -------------------------------------------------------------------------------------\n`;
    });
    txt += `\n`;
  }
  
  txt += `4. HISTORIAL DE NOVEDADES DEL TURNO:\n`;
  if (appState.historyLog.length === 0) {
    txt += `   (Sin registros en la bitácora)\n`;
  } else {
    appState.historyLog.slice(-10).reverse().forEach(log => {
      const time = new Date(log.timestamp).toLocaleTimeString('es-PE', { hour12: false });
      txt += `   [${time}] ${log.detail}\n`;
    });
  }
  txt += `\n========================================================================================\n`;
  txt += `OPERADOR DE CONTROL INTEGRADO (OCIR ATS) : ___________________________________________\n`;
  txt += `SUPERVISOR DE OPERACIONES (SPCO L2)      : ___________________________________________\n`;
  
  reportBox.innerText = txt;
}


// ------------------------------------------------------------------------------
// SISTEMA DE CONTROL DE CATENARIA Y TENSIÓN 1500V DC (METRO DE LIMA LÍNEA 2)
// ------------------------------------------------------------------------------
function initCatenaryControl() {
  const btnPanel = document.getElementById('btn-catenary-panel');
  const btnAllOn = document.getElementById('btn-catenary-all-on');
  const btnAllOff = document.getElementById('btn-catenary-all-off');
  const btnToggleMode = document.getElementById('btn-catenary-toggle-mode');
  
  if (btnPanel) {
    btnPanel.addEventListener('click', () => {
      playSound('coin');
      renderCatenarySectorGrid();
      openModal('modal-catenary');
    });
  }
  
  if (btnAllOn) {
    btnAllOn.addEventListener('click', () => {
      appState.catenary.deenergizedZones = [];
      playSound('1up');
      persistState();
      renderAll();
      renderCatenarySectorGrid();
      updateCatenaryButtonStatus();
      showToast('⚡ Catenaria: Tensión 1500V DC RESTABLECIDA en toda la Vía Principal.', 'success');
    });
  }
  
  if (btnAllOff) {
    btnAllOff.addEventListener('click', () => {
      appState.catenary.deenergizedZones = ZONAS_CATENARIA.map(z => z.id);
      playSound('forbidden');
      persistState();
      renderAll();
      renderCatenarySectorGrid();
      updateCatenaryButtonStatus();
      showToast('⛔ Catenaria: CORTE GENERAL DE TENSIÓN aplicado (0V en toda la línea).', 'danger');
    });
  }
  
  if (btnToggleMode) {
    btnToggleMode.addEventListener('click', () => {
      appState.catenary.interactiveMode = !appState.catenary.interactiveMode;
      btnToggleMode.classList.toggle('active', appState.catenary.interactiveMode);
      playSound('jump');
      if (appState.catenary.interactiveMode) {
        showToast('🔌 Modo selector activo: Haz clic directamente sobre cualquier tramo en la vía para cortar o energizar 1500V.', 'info');
        closeModal('modal-catenary');
      } else {
        showToast('Modo selector desactivado.', 'info');
      }
    });
  }
  
  updateCatenaryButtonStatus();
}

function updateCatenaryButtonStatus() {
  const btn = document.getElementById('btn-catenary-panel');
  const icon = document.getElementById('catenary-icon');
  const text = document.getElementById('catenary-status-text');
  if (!btn || !icon || !text) return;
  
  const cuts = appState.catenary.deenergizedZones.length;
  const total = ZONAS_CATENARIA.length;
  
  btn.className = 'action-btn btn-catenary';
  
  if (cuts === 0) {
    icon.textContent = '⚡';
    text.textContent = '1500V: Conforme';
  } else if (cuts >= total) {
    icon.textContent = '⛔';
    text.textContent = '0V: Corte Total';
    btn.classList.add('catenary-danger');
  } else if (cuts === 1 && appState.catenary.deenergizedZones.includes('Z-36')) {
    icon.textContent = '⚡';
    text.textContent = '1500V (Z-36: 0V)';
  } else {
    icon.textContent = '⚡';
    text.textContent = `${cuts} Zonas 0V`;
    btn.classList.add('catenary-warning');
  }
}

function renderCatenarySectorGrid() {
  const grid = document.getElementById('catenary-sector-grid');
  if (!grid) return;
  grid.innerHTML = '';
  
  ZONAS_CATENARIA.forEach(zone => {
    const isCut = appState.catenary.deenergizedZones.includes(zone.id);
    const card = document.createElement('div');
    card.className = `catenary-sector-card ${isCut ? 'deenergized' : ''}`;
    
    card.innerHTML = `
      <div class="sector-info">
        <span class="sector-title">${zone.name}</span>
        <span class="sector-status">${isCut ? '⛔ CORTE DE TENSIÓN (0V)' : '⚡ ENERGIZADO (1500V DC)'}</span>
      </div>
      <button class="sector-toggle-btn ${isCut ? 'btn-restore' : 'btn-cut'}" type="button">
        ${isCut ? 'Restablecer' : 'Cortar 0V'}
      </button>
    `;
    
    const btn = card.querySelector('.sector-toggle-btn');
    btn.addEventListener('click', () => {
      toggleZoneCatenary(zone.id);
      renderCatenarySectorGrid();
    });
    
    grid.appendChild(card);
  });
}

function toggleZoneCatenary(zoneId) {
  const idx = appState.catenary.deenergizedZones.indexOf(zoneId);
  const zone = ZONAS_CATENARIA.find(z => z.id === zoneId);
  const name = zone ? zone.name : zoneId;
  
  if (idx !== -1) {
    // Restablecer tensión
    appState.catenary.deenergizedZones.splice(idx, 1);
    playSound('coin');
    showToast(`⚡ Catenaria [${name}]: Tensión 1500V DC restablecida.`, 'success');
  } else {
    // Aplicar corte
    appState.catenary.deenergizedZones.push(zoneId);
    playSound('laser');
    showToast(`⛔ Catenaria [${name}]: CORTE DE TENSIÓN 1500V aplicado (Libranza de vía).`, 'warning');
  }
  
  persistState();
  renderAll();
  updateCatenaryButtonStatus();
}

function renderCatenaryLayer() {
  const layer = document.getElementById('catenary-layer');
  if (!layer) return;
  layer.innerHTML = '';
  
  ZONAS_CATENARIA.forEach(zone => {
    const isCut = appState.catenary.deenergizedZones.includes(zone.id);
    const gZone = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gZone.setAttribute('class', 'catenary-sector-group');
    gZone.setAttribute('data-zone-id', zone.id);
    
    const clickHandler = (e) => {
      if (appState.catenary.interactiveMode) {
        e.stopPropagation();
        toggleZoneCatenary(zone.id);
      }
    };

    if (isCut) {
      // Zona Desenergizada (0V - Corte Seguro): hilo tenue y cartela de advertencia
      const lineCut = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      lineCut.setAttribute('x1', zone.xStart);
      lineCut.setAttribute('y1', zone.y);
      lineCut.setAttribute('x2', zone.xEnd);
      lineCut.setAttribute('y2', zone.y);
      lineCut.setAttribute('class', 'catenary-cut-line');
      lineCut.style.cursor = appState.catenary.interactiveMode ? 'pointer' : 'default';
      lineCut.setAttribute('title', `${zone.name} [0V CORTE DE TENSIÓN]. Clic para alternar.`);
      lineCut.addEventListener('click', clickHandler);
      gZone.appendChild(lineCut);

      // Cartela técnica si la zona está desenergizada (0V)
      const midX = zone.xStart + (zone.xEnd - zone.xStart) / 2;
      const badgeY = zone.via === 'V1' ? zone.y + 16 : zone.y - 16;
      const gBadge = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      gBadge.setAttribute('class', 'catenary-cut-badge');
      gBadge.setAttribute('transform', `translate(${midX}, ${badgeY})`);
      gBadge.innerHTML = `
        <rect x="-44" y="-8.5" width="88" height="17" rx="3.5" fill="#7f1d1d" stroke="#ef4444" stroke-width="1.2" />
        <text x="0" y="3.5" fill="#fecaca" font-size="8" font-family="monospace" font-weight="900" text-anchor="middle">⚡ ZONA ${zone.num}: 0V</text>
      `;
      gZone.appendChild(gBadge);

      if (zone.hasD1) {
        const pathD1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathD1.setAttribute('d', 'M 2920,216 L 3010,18');
        pathD1.setAttribute('class', 'catenary-cut-line');
        pathD1.style.cursor = appState.catenary.interactiveMode ? 'pointer' : 'default';
        pathD1.setAttribute('title', `D1 hacia PTSA [0V CORTE]. Clic para alternar.`);
        pathD1.addEventListener('click', clickHandler);
        gZone.appendChild(pathD1);
      }
      if (zone.hasD2) {
        const pathD2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathD2.setAttribute('d', 'M 3440,216 L 3340,18');
        pathD2.setAttribute('class', 'catenary-cut-line');
        pathD2.style.cursor = appState.catenary.interactiveMode ? 'pointer' : 'default';
        pathD2.setAttribute('title', `D2 hacia PTSA [0V CORTE]. Clic para alternar.`);
        pathD2.addEventListener('click', clickHandler);
        gZone.appendChild(pathD2);
      }
    } else {
      // Zona Energizada 1500V DC: ARCO DE RAYO / PLASMA REFINADO Y DELGADO (Sin nodos de chispas flotantes)
      // 1. Capa Corona Eléctrica (Aura tenue y delgada)
      const corona = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      corona.setAttribute('x1', zone.xStart);
      corona.setAttribute('y1', zone.y);
      corona.setAttribute('x2', zone.xEnd);
      corona.setAttribute('y2', zone.y);
      corona.setAttribute('class', 'catenary-corona-arc');
      gZone.appendChild(corona);

      // 2. Capa Flujo de Plasma Eléctrico (Interactiva para conmutar)
      const plasma = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      plasma.setAttribute('x1', zone.xStart);
      plasma.setAttribute('y1', zone.y);
      plasma.setAttribute('x2', zone.xEnd);
      plasma.setAttribute('y2', zone.y);
      plasma.setAttribute('class', 'catenary-plasma-stream');
      plasma.style.cursor = appState.catenary.interactiveMode ? 'pointer' : 'default';
      plasma.setAttribute('title', `${zone.name} [1500V DC ENERGIZADO]. Clic para alternar.`);
      plasma.addEventListener('click', clickHandler);
      gZone.appendChild(plasma);

      // 3. Capa Núcleo de Rayo Blanco Incandescente Ultrafino
      const core = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      core.setAttribute('x1', zone.xStart);
      core.setAttribute('y1', zone.y);
      core.setAttribute('x2', zone.xEnd);
      core.setAttribute('y2', zone.y);
      core.setAttribute('class', 'catenary-lightning-core');
      gZone.appendChild(core);

      // Ramales D1 y D2 si aplica con el mismo efecto de rayo refinado
      if (zone.hasD1) {
        const d1Group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        d1Group.innerHTML = `
          <path d="M 2920,216 L 3010,18" class="catenary-corona-arc" />
          <path d="M 2920,216 L 3010,18" class="catenary-plasma-stream" style="cursor:${appState.catenary.interactiveMode ? 'pointer' : 'default'};" />
          <path d="M 2920,216 L 3010,18" class="catenary-lightning-core" />
        `;
        d1Group.querySelector('.catenary-plasma-stream').addEventListener('click', clickHandler);
        gZone.appendChild(d1Group);
      }

      if (zone.hasD2) {
        const d2Group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        d2Group.innerHTML = `
          <path d="M 3440,216 L 3340,18" class="catenary-corona-arc" />
          <path d="M 3440,216 L 3340,18" class="catenary-plasma-stream" style="cursor:${appState.catenary.interactiveMode ? 'pointer' : 'default'};" />
          <path d="M 3440,216 L 3340,18" class="catenary-lightning-core" />
        `;
        d2Group.querySelector('.catenary-plasma-stream').addEventListener('click', clickHandler);
        gZone.appendChild(d2Group);
      }
    }
    
    layer.appendChild(gZone);
  });
}
// ------------------------------------------------------------------------------
// 19. PERSISTENCIA LOCAL
// ------------------------------------------------------------------------------
function persistState() {
  try {
    const payload = {
      crews: appState.crews,
      vehicles: appState.vehicles,
      completedJobs: appState.completedJobs,
      historyLog: appState.historyLog,
      switchesState: appState.switchesState,
      audioEnabled: appState.audioEnabled,
      catenary: appState.catenary
    };
    localStorage.setItem(appState.STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error('Error al guardar en LocalStorage:', e);
  }
}


function seedDefaultShiftWorks() {
  appState.crews = [
    {
      id: 'CRW-1001',
      type: 'crew',
      responsible: 'Cuadrilla #1',
      company: 'Mantenimiento de Vía',
      count: 4,
      radio: 'Ch-02 / R101',
      via: 'V2',
      zones: ['Z-PV19-E20', 'Z-E20', 'Z-E20-PV20'],
      zoneLabel: 'PV19 a E20 Evitamiento ➔ E20 Evitamiento a PV20 (CV-01)',
      xMin: 50,
      xMax: 860,
      x: 450,
      speed: 16,
      dir: 1,
      isWorking: true,
      inSafeZone: false,
      workTimer: 3.5,
      workCountdown: 5,
      timeIn: '10:43',
      timeOut: '',
      notes: 'Conservación de vía y fijaciones'
    },
    {
      id: 'CRW-1002',
      type: 'crew',
      responsible: 'Cuadrilla #2',
      company: 'Mantenimiento de Vía',
      count: 4,
      radio: 'Ch-02 / R102',
      via: 'V1',
      zones: ['Z-PV19-E20'],
      zoneLabel: 'PV19 a E20 Evitamiento',
      xMin: 50,
      xMax: 380,
      x: 220,
      speed: 14,
      dir: -1,
      isWorking: false,
      inSafeZone: false,
      workTimer: 3.0,
      workCountdown: 6,
      timeIn: '11:05',
      timeOut: '',
      notes: 'Inspección de balasto y juntas'
    },
    {
      id: 'CRW-1003',
      type: 'crew',
      responsible: 'Cuadrilla #3',
      company: 'Vía y Catenaria',
      count: 4,
      radio: 'Ch-02 / R103',
      via: 'V2',
      zones: ['Z-E21', 'Z-E21-PV21'],
      zoneLabel: 'Estación E21 Óvalo Santa Anita ➔ PV21 (Bretelle E)',
      xMin: 1160,
      xMax: 1640,
      x: 1280,
      speed: 15,
      dir: 1,
      isWorking: true,
      inSafeZone: false,
      workTimer: 4.0,
      workCountdown: 4,
      timeIn: '11:20',
      timeOut: '',
      notes: 'Revisión de hilo de contacto catenaria'
    },
    {
      id: 'CRW-1004',
      type: 'crew',
      responsible: 'Cuadrilla #4',
      company: 'Señalización y Telecomunicaciones',
      count: 4,
      radio: 'Ch-02 / R104',
      via: 'V2',
      zones: ['Z-PV21-E22', 'Z-E22'],
      zoneLabel: 'PV21 a E22 Colectora Industrial',
      xMin: 1640,
      xMax: 2000,
      x: 1880,
      speed: 14,
      dir: 1,
      isWorking: true,
      inSafeZone: false,
      workTimer: 3.5,
      workCountdown: 5,
      timeIn: '11:35',
      timeOut: '',
      notes: 'Calibración de balizas eurobalise'
    },
    {
      id: 'CRW-1005',
      type: 'crew',
      responsible: 'Cuadrilla #5',
      company: 'Mantenimiento de Vía',
      count: 4,
      radio: 'Ch-02 / R105',
      via: 'V1',
      zones: ['Z-E21-PV21'],
      zoneLabel: 'E21 Óvalo a PV21 (Bretelle E)',
      xMin: 1360,
      xMax: 1640,
      x: 1480,
      speed: 15,
      dir: -1,
      isWorking: false,
      inSafeZone: false,
      workTimer: 3.2,
      workCountdown: 7,
      timeIn: '11:50',
      timeOut: '',
      notes: 'Mantenimiento de aguja BT-02'
    },
    {
      id: 'CRW-1006',
      type: 'crew',
      responsible: 'Cuadrilla #6',
      company: 'Mantenimiento de Vía',
      count: 4,
      radio: 'Ch-02 / R106',
      via: 'V1',
      zones: ['Z-E24', 'Z-E24-PV24'],
      zoneLabel: 'E24 Mercado Santa Anita ➔ PV24 (Topera Este)',
      xMin: 3060,
      xMax: 3510,
      x: 3200,
      speed: 16,
      dir: 1,
      isWorking: true,
      inSafeZone: false,
      workTimer: 4.2,
      workCountdown: 5,
      timeIn: '12:05',
      timeOut: '',
      notes: 'Alineación de vía en topera este'
    }
  ];

  appState.vehicles = [
    {
      id: 'VEH-2001',
      type: 'vehicle',
      vehicleType: 'Dresina D-01',
      driver: 'Operador 1',
      leader: 'Resp. Maniobra',
      company: 'Vía y Catenaria',
      radio: 'Ch-01 / Tráfico',
      via: 'V2',
      zones: ['Z-E20-PV20'],
      zoneLabel: 'E20 Evitamiento a PV20 (CV-01)',
      xMin: 580,
      xMax: 860,
      x: 720,
      speed: 26,
      dir: 1,
      timeIn: '10:05',
      timeOut: '',
      notes: 'Dresina auscultadora ultrasónica'
    },
    {
      id: 'VEH-2002',
      type: 'vehicle',
      vehicleType: 'Dresina D-02',
      driver: 'Operador 2',
      leader: 'Resp. Maniobra',
      company: 'Vía y Catenaria',
      radio: 'Ch-01 / Tráfico',
      via: 'V1',
      zones: ['Z-E20', 'Z-E20-PV20', 'Z-PV20-E21'],
      zoneLabel: 'Estación E20 Evitamiento ➔ PV20 a E21 Óvalo Santa Anita',
      xMin: 380,
      xMax: 1160,
      x: 820,
      speed: 26,
      dir: 1,
      timeIn: '10:11',
      timeOut: '',
      notes: 'Inspección geométrica de vía 1'
    },
    {
      id: 'VEH-2003',
      type: 'vehicle',
      vehicleType: 'Dresina D-03',
      driver: 'Operador 3',
      leader: 'Resp. Maniobra',
      company: 'Vía y Catenaria',
      radio: 'Ch-01 / Tráfico',
      via: 'V1',
      zones: ['Z-E22', 'Z-E22-PV22'],
      zoneLabel: 'E22 Colectora Industrial ➔ PV22 (CV-02)',
      xMin: 1800,
      xMax: 2260,
      x: 2050,
      speed: 26,
      dir: -1,
      timeIn: '10:41',
      timeOut: '',
      notes: 'Mantenimiento de catenaria Vía 1'
    },
    {
      id: 'VEH-2004',
      type: 'vehicle',
      vehicleType: 'Dresina D-04',
      driver: 'Operador 4',
      leader: 'Resp. Maniobra',
      company: 'Vía y Catenaria',
      radio: 'Ch-01 / Tráfico',
      via: 'V2',
      zones: ['Z-E23', 'Z-E23-PV23'],
      zoneLabel: 'E23 Hermilio Valdizán a PV23',
      xMin: 2420,
      xMax: 2720,
      x: 2560,
      speed: 24,
      dir: 1,
      timeIn: '11:15',
      timeOut: '',
      notes: 'Bivial pesado para control de desvíos'
    }
  ];
  persistState();
}

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(appState.STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data.crews)) appState.crews = data.crews;
      if (Array.isArray(data.vehicles)) appState.vehicles = data.vehicles;
      if (Array.isArray(data.completedJobs)) appState.completedJobs = data.completedJobs;
      if (Array.isArray(data.historyLog)) appState.historyLog = data.historyLog;
      if (data.switchesState) appState.switchesState = data.switchesState;
      if (data.catenary && Array.isArray(data.catenary.deenergizedZones)) {
        appState.catenary.deenergizedZones = data.catenary.deenergizedZones;
        updateCatenaryButtonStatus();
      }
      if (typeof data.audioEnabled === 'boolean') {
        appState.audioEnabled = data.audioEnabled;
        const btn = document.getElementById('btn-sound-toggle');
        const icon = document.getElementById('sound-icon');
        const text = document.getElementById('sound-text');
        if (btn && icon && text) {
          if (appState.audioEnabled) {
            btn.classList.add('sound-on');
            icon.textContent = '🔊';
            text.textContent = 'Audio ATS';
          } else {
            btn.classList.remove('sound-on');
            icon.textContent = '🔇';
            text.textContent = 'Silenciado';
          }
        }
      }
    }
  } catch (e) {
    console.warn('No se encontraron datos previos');
  }

  // Si no hay datos en vía al inicio, sembrar los trabajos oficiales del turno para que la vía nunca quede vacía
  if ((!appState.crews || appState.crews.length === 0) && (!appState.vehicles || appState.vehicles.length === 0)) {
    seedDefaultShiftWorks();
  }
}

// ------------------------------------------------------------------------------
// 20. NOTIFICACIONES TOAST
// ------------------------------------------------------------------------------
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'success') toast.style.borderColor = '#10b981';
  if (type === 'warning') toast.style.borderColor = '#f59e0b';
  if (type === 'danger') toast.style.borderColor = '#ef4444';
  
  toast.textContent = message;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.25s forwards';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

// ==============================================================================
// 21. COLAPSO Y MINIMIZACIÓN DE BITÁCORA (EXPANSIÓN DE PANTALLA)
// ==============================================================================
function initDockToggle() {
  const btnToggle = document.getElementById('btn-toggle-dock');
  const dock = document.getElementById('bottom-dock');
  if (!btnToggle || !dock) return;
  
  btnToggle.addEventListener('click', () => {
    dock.classList.toggle('dock-collapsed');
    const isCollapsed = dock.classList.contains('dock-collapsed');
    btnToggle.textContent = isCollapsed ? '▲ Mostrar Bitácora' : '▼ Ocultar Bitácora';
    playSound('coin');
    showToast(isCollapsed ? 'Plano de vía maximizado en pantalla completa.' : 'Bitácora de trabajos restaurada.', 'info');
  });
}

// ==============================================================================
// 22. SINTETIZADOR CHIPTUNE MELÓDICO WEB AUDIO API Y HUEVOS DE PASCUA ANIME / RETRO
// ==============================================================================
let activeSongTimeouts = [];
let activeSongAudioNodes = [];
let activeSongName = null;

function stopCurrentSong() {
  activeSongTimeouts.forEach(t => clearTimeout(t));
  activeSongTimeouts = [];
  
  activeSongAudioNodes.forEach(node => {
    try {
      if (node.stop) node.stop();
      if (node.disconnect) node.disconnect();
    } catch(e) {}
  });
  activeSongAudioNodes = [];
  activeSongName = null;
  
  // Limpiar auras de todos los tokens
  document.querySelectorAll('.saiyan-aura, .starman-rainbow, .pikachu-storm, .zelda-triforce, .eva-berserk').forEach(el => {
    el.classList.remove('saiyan-aura', 'starman-rainbow', 'pikachu-storm', 'zelda-triforce', 'eva-berserk');
  });

  // Limpiar indicadores visuales de reproducción en la Sala Arcade
  document.querySelectorAll('.arcade-btn-play').forEach(btn => btn.classList.remove('active-song'));
}

function applyAuraToAllTokens(auraClass) {
  document.querySelectorAll('.crew-token, .vehicle-token, .multicrew-badge').forEach(el => {
    el.classList.add(auraClass);
  });
}

function playChiptuneSong(songKey) {
  stopCurrentSong();
  
  // Si el audio está silenciado, activarlo automáticamente para escuchar el secreto
  if (!appState.audioEnabled) {
    appState.audioEnabled = true;
    const btn = document.getElementById('btn-sound-toggle');
    const icon = document.getElementById('sound-icon');
    const text = document.getElementById('sound-text');
    if (btn && icon && text) {
      btn.classList.add('sound-on');
      icon.textContent = '🔊';
      text.textContent = 'Audio ATS';
    }
  }

  const ctx = getAudioContext();
  if (!ctx) return;
  activeSongName = songKey;
  const now = ctx.currentTime + 0.05;

  // Diccionario de Frecuencias de Notas Musicales (Hz)
  const N = {
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
    C4: 261.63, Cs4: 277.18, D4: 293.66, Ds4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.00, Gs4: 415.30, A4: 440.00, As4: 466.16, B4: 493.88,
    C5: 523.25, Cs5: 554.37, D5: 587.33, Ds5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99, Gs5: 830.61, A5: 880.00, As5: 932.33, B5: 987.77,
    C6: 1046.50, D6: 1174.66, E6: 1318.51, G6: 1567.98
  };

  // Helper para sintetizar una nota con tipo de onda, vibrato y envolvente ADSR
  function playNote(freq, startOffset, dur, type = 'square', vol = 0.12, vibrato = false) {
    if (!freq) return;
    const tStart = now + startOffset;
    const tEnd = tStart + dur;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, tStart);

    if (vibrato) {
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(6.0, tStart);
      lfoGain.gain.setValueAtTime(freq * 0.02, tStart);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(tStart);
      lfo.stop(tEnd);
      activeSongAudioNodes.push(lfo, lfoGain);
    }

    gain.gain.setValueAtTime(0.001, tStart);
    gain.gain.linearRampToValueAtTime(vol, tStart + 0.015);
    gain.gain.setValueAtTime(vol, tEnd - 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, tEnd);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(tStart);
    osc.stop(tEnd);

    activeSongAudioNodes.push(osc, gain);
  }

  // Helper para bajo y percusión chiptune
  function playBass(freq, startOffset, dur, vol = 0.14) {
    playNote(freq, startOffset, dur, 'triangle', vol);
  }

  // ==========================================================================
  // 1. DRAGON BALL Z — "CHA-LA HEAD-CHA-LA" (CORO COMPLETO)
  // ==========================================================================
  if (songKey === 'dbz') {
    applyAuraToAllTokens('saiyan-aura');
    showToast('🔥 ¡MODO SUPER SAIYAN ACTIVADO! Cha-La Head-Cha-La sonando a todo volumen...', 'warning');

    const melody = [
      // "Cha-la! Head-cha-la!"
      { f: N.G4, t: 0.00, d: 0.22 }, { f: N.G4, t: 0.24, d: 0.20 }, { f: N.A4, t: 0.46, d: 0.22 },
      { f: N.B4, t: 0.70, d: 0.45, v: true }, { f: N.D5, t: 1.20, d: 0.45, v: true },
      // "Egao urutora Z de"
      { f: N.C5, t: 1.70, d: 0.22 }, { f: N.B4, t: 1.94, d: 0.22 }, { f: N.A4, t: 2.18, d: 0.45 },
      { f: N.G4, t: 2.68, d: 0.22 }, { f: N.A4, t: 2.92, d: 0.22 }, { f: N.B4, t: 3.16, d: 0.45, v: true },
      { f: N.G4, t: 3.66, d: 0.45 },
      // "Kyou mo ai-yai-yai-yai-yai!"
      { f: N.E4, t: 4.15, d: 0.20 }, { f: N.G4, t: 4.38, d: 0.20 }, { f: N.A4, t: 4.60, d: 0.20 },
      { f: N.B4, t: 4.82, d: 0.20 }, { f: N.C5, t: 5.04, d: 0.45 }, { f: N.B4, t: 5.52, d: 0.20 },
      { f: N.A4, t: 5.74, d: 0.20 }, { f: N.G4, t: 5.96, d: 0.85, v: true },
      // Fanfarria heroica de cierre DBZ
      { f: N.D4, t: 6.90, d: 0.15 }, { f: N.G4, t: 7.08, d: 0.15 }, { f: N.B4, t: 7.26, d: 0.15 },
      { f: N.D5, t: 7.44, d: 0.15 }, { f: N.G5, t: 7.62, d: 0.95, v: true }
    ];

    melody.forEach(m => {
      playNote(m.f, m.t, m.d, 'square', 0.13, m.v);
      playBass(m.f / 2, m.t, m.d, 0.12);
    });

    // Programar fin de canción a los 8.8s
    activeSongTimeouts.push(setTimeout(() => {
      stopCurrentSong();
    }, 8800));
  }

  // ==========================================================================
  // 2. SUPER MARIO BROS — OVERWORLD THEME & INVENCIBILIDAD STARMAN
  // ==========================================================================
  else if (songKey === 'mario') {
    applyAuraToAllTokens('starman-rainbow');
    showToast('⭐ ¡MODO STARMAN ACTIVADO! Super Mario Bros — ¡Invencibilidad total en cantones!', 'success');

    const melody = [
      // Intro clásica
      { f: N.E5, t: 0.00, d: 0.12 }, { f: N.E5, t: 0.16, d: 0.12 }, { f: N.E5, t: 0.40, d: 0.12 },
      { f: N.C5, t: 0.56, d: 0.12 }, { f: N.E5, t: 0.72, d: 0.18 }, { f: N.G5, t: 1.00, d: 0.25 },
      { f: N.G4, t: 1.35, d: 0.28 },
      // Frase A principal
      { f: N.C5, t: 1.80, d: 0.22 }, { f: N.G4, t: 2.10, d: 0.22 }, { f: N.E4, t: 2.40, d: 0.22 },
      { f: N.A4, t: 2.70, d: 0.22 }, { f: N.B4, t: 2.95, d: 0.22 }, { f: N.As4, t: 3.20, d: 0.18 },
      { f: N.A4, t: 3.42, d: 0.22 }, { f: N.G4, t: 3.70, d: 0.18 }, { f: N.E5, t: 3.92, d: 0.22 },
      { f: N.G5, t: 4.18, d: 0.22 }, { f: N.A5, t: 4.44, d: 0.32 }, { f: N.F5, t: 4.80, d: 0.18 },
      { f: N.G5, t: 5.02, d: 0.22 }, { f: N.E5, t: 5.30, d: 0.22 }, { f: N.C5, t: 5.56, d: 0.18 },
      { f: N.D5, t: 5.78, d: 0.18 }, { f: N.B4, t: 6.00, d: 0.40 },
      // Fanfarria 1-Up final
      { f: N.E5, t: 6.60, d: 0.10 }, { f: N.G5, t: 6.72, d: 0.10 }, { f: N.E6, t: 6.84, d: 0.12 },
      { f: N.C6, t: 6.98, d: 0.12 }, { f: N.D6, t: 7.12, d: 0.12 }, { f: N.G6, t: 7.26, d: 0.45 }
    ];

    melody.forEach(m => {
      playNote(m.f, m.t, m.d, 'square', 0.12);
      playBass(m.f / 2, m.t, m.d, 0.11);
    });

    activeSongTimeouts.push(setTimeout(() => {
      stopCurrentSong();
    }, 8200));
  }

  // ==========================================================================
  // 3. POKÉMON — WILD BATTLE THEME (GAME BOY DMG RED/BLUE)
  // ==========================================================================
  else if (songKey === 'pokemon') {
    applyAuraToAllTokens('pikachu-storm');
    showToast('⚡ ¡UN POKÉMON SALVAJE APARECIÓ! Tormenta eléctrica en la catenaria 1500V...', 'info');

    // Descenso cromático de encuentro inicial Game Boy
    const chromatic = [
      { f: N.B5, t: 0.00 }, { f: N.As5, t: 0.05 }, { f: N.A5, t: 0.10 }, { f: N.Gs5, t: 0.15 },
      { f: N.G5, t: 0.20 }, { f: N.Fs5, t: 0.25 }, { f: N.F5, t: 0.30 }, { f: N.E5, t: 0.35 }
    ];
    chromatic.forEach(c => playNote(c.f, c.t, 0.045, 'sawtooth', 0.13));

    // Tema principal de combate
    const melody = [
      { f: N.E4, t: 0.50, d: 0.16 }, { f: N.G4, t: 0.68, d: 0.16 }, { f: N.B4, t: 0.86, d: 0.16 },
      { f: N.E5, t: 1.04, d: 0.28 }, { f: N.D5, t: 1.35, d: 0.16 }, { f: N.B4, t: 1.53, d: 0.16 },
      { f: N.G4, t: 1.71, d: 0.16 }, { f: N.A4, t: 1.90, d: 0.28 },
      { f: N.B4, t: 2.22, d: 0.16 }, { f: N.A4, t: 2.40, d: 0.16 }, { f: N.G4, t: 2.58, d: 0.16 },
      { f: N.E4, t: 2.76, d: 0.32 }, { f: N.Fs4, t: 3.12, d: 0.16 }, { f: N.G4, t: 3.30, d: 0.16 },
      { f: N.A4, t: 3.48, d: 0.16 }, { f: N.B4, t: 3.66, d: 0.55 },
      // Segunda frase enérgica
      { f: N.E5, t: 4.30, d: 0.18 }, { f: N.D5, t: 4.52, d: 0.18 }, { f: N.E5, t: 4.74, d: 0.18 },
      { f: N.G5, t: 4.96, d: 0.30 }, { f: N.Fs5, t: 5.30, d: 0.18 }, { f: N.E5, t: 5.52, d: 0.18 },
      { f: N.D5, t: 5.74, d: 0.25 }, { f: N.B4, t: 6.02, d: 0.65 }
    ];

    melody.forEach(m => {
      playNote(m.f, m.t, m.d, 'square', 0.13);
      playBass(m.f / 2, m.t, m.d, 0.12);
    });

    activeSongTimeouts.push(setTimeout(() => {
      stopCurrentSong();
    }, 7200));
  }

  // ==========================================================================
  // 4. THE LEGEND OF ZELDA — "SONG OF STORMS" (VALS EN RE MENOR)
  // ==========================================================================
  else if (songKey === 'zelda') {
    applyAuraToAllTokens('zelda-triforce');
    showToast('🗡️ ¡CANCIÓN DE LAS TORMENTAS! El poder sagrado de la Trifuerza protege la vía...', 'success');

    const melody = [
      // Compás 1 & 2: D - F - High D
      { f: N.D4, t: 0.00, d: 0.18 }, { f: N.F4, t: 0.20, d: 0.18 }, { f: N.D5, t: 0.42, d: 0.46, v: true },
      { f: N.D4, t: 0.95, d: 0.18 }, { f: N.F4, t: 1.15, d: 0.18 }, { f: N.D5, t: 1.37, d: 0.46, v: true },
      // Compás 3 & 4: E - F - E - F - E - C - A
      { f: N.E5, t: 1.90, d: 0.28 }, { f: N.F5, t: 2.22, d: 0.14 }, { f: N.E5, t: 2.38, d: 0.14 },
      { f: N.F5, t: 2.54, d: 0.14 }, { f: N.E5, t: 2.70, d: 0.14 }, { f: N.C5, t: 2.86, d: 0.28 },
      { f: N.A4, t: 3.18, d: 0.65, v: true },
      // Compás 5 & 6: A - D - F - G - A
      { f: N.A4, t: 3.90, d: 0.24 }, { f: N.D4, t: 4.18, d: 0.24 }, { f: N.F4, t: 4.46, d: 0.18 },
      { f: N.G4, t: 4.66, d: 0.18 }, { f: N.A4, t: 4.88, d: 0.65, v: true },
      // Compás 7 & 8: A - D - F - G - E
      { f: N.A4, t: 5.60, d: 0.24 }, { f: N.D4, t: 5.88, d: 0.24 }, { f: N.F4, t: 6.16, d: 0.18 },
      { f: N.G4, t: 6.36, d: 0.18 }, { f: N.E4, t: 6.58, d: 0.90, v: true }
    ];

    melody.forEach(m => {
      // Onda triangular flauta ocarina con suave vibrato
      playNote(m.f, m.t, m.d, 'triangle', 0.16, m.v);
      playBass(m.f / 2, m.t, m.d, 0.09);
    });

    activeSongTimeouts.push(setTimeout(() => {
      stopCurrentSong();
    }, 7800));
  }

  // ==========================================================================
  // 5. NEON GENESIS EVANGELION — "A CRUEL ANGEL'S THESIS" (MODO BERSERK)
  // ==========================================================================
  else if (songKey === 'evangelion') {
    applyAuraToAllTokens('eva-berserk');
    showToast('🤖 ¡MODO BERSERK ACTIVADO! Unidad EVA-01 sincronizada con Vía Principal...', 'danger');

    const melody = [
      // "Zankoku na tenshi no you ni..."
      { f: N.C4, t: 0.00, d: 0.24 }, { f: N.D4, t: 0.26, d: 0.24 }, { f: N.Ds4, t: 0.52, d: 0.42 },
      { f: N.F4, t: 0.98, d: 0.24 }, { f: N.G4, t: 1.24, d: 0.42, v: true }, { f: N.Ds4, t: 1.70, d: 0.24 },
      { f: N.F4, t: 1.96, d: 0.42 }, { f: N.Ds4, t: 2.42, d: 0.24 }, { f: N.D4, t: 2.68, d: 0.24 },
      { f: N.C4, t: 2.94, d: 0.45 },
      // "Shounen yo shinwa ni nare!"
      { f: N.D4, t: 3.44, d: 0.24 }, { f: N.Ds4, t: 3.70, d: 0.24 }, { f: N.F4, t: 3.96, d: 0.24 },
      { f: N.G4, t: 4.22, d: 0.42 }, { f: N.C5, t: 4.68, d: 0.55, v: true }, { f: N.As4, t: 5.26, d: 0.24 },
      { f: N.G4, t: 5.52, d: 0.24 }, { f: N.F4, t: 5.78, d: 0.24 }, { f: N.G4, t: 6.04, d: 0.95, v: true }
    ];

    melody.forEach(m => {
      // Sintetizador Sawtooth cortante estilo brass anime de los 90s
      playNote(m.f, m.t, m.d, 'sawtooth', 0.12, m.v);
      playBass(m.f / 2, m.t, m.d, 0.14);
    });

    activeSongTimeouts.push(setTimeout(() => {
      stopCurrentSong();
    }, 7500));
  }

  // ==========================================================================
  // 6. NAVIDAD L2 — VILLANCICO CHIPTUNE CAMPANILLAS (DOMINIO PÚBLICO)
  // ==========================================================================
  else if (songKey === 'xmas') {
    showToast('🎅 ¡MODO NAVIDAD EN LÍNEA 2! Campanillas chiptune en andenes.', 'success');
    const melody = [
      { f: N.E5, t: 0.00, d: 0.18 }, { f: N.E5, t: 0.22, d: 0.18 }, { f: N.E5, t: 0.44, d: 0.36 },
      { f: N.E5, t: 0.84, d: 0.18 }, { f: N.E5, t: 1.06, d: 0.18 }, { f: N.E5, t: 1.28, d: 0.36 },
      { f: N.E5, t: 1.68, d: 0.18 }, { f: N.G5, t: 1.90, d: 0.18 }, { f: N.C5, t: 2.12, d: 0.24 },
      { f: N.D5, t: 2.40, d: 0.24 }, { f: N.E5, t: 2.68, d: 0.55 }
    ];
    melody.forEach(m => {
      playNote(m.f, m.t, m.d, 'triangle', 0.13);
      playBass(m.f / 2, m.t, m.d, 0.10);
    });
    activeSongTimeouts.push(setTimeout(() => stopCurrentSong(), 3600));
  }

  // ==========================================================================
  // 7. PAC-MAN — INTERLUDIO ARCADE MAZE (WAKA-WAKA ORIGINAL)
  // ==========================================================================
  else if (songKey === 'pacman') {
    showToast('ᗧ••• ¡WAKA-WAKA! Modo arcade laberinto activado.', 'warning');
    const now0 = ctx.currentTime + 0.05;
    for (let i = 0; i < 12; i++) {
      const t = i * 0.16;
      const f = i % 2 === 0 ? 280 : 360;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(f, now0 + t);
      gain.gain.setValueAtTime(0.10, now0 + t);
      gain.gain.exponentialRampToValueAtTime(0.001, now0 + t + 0.10);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now0 + t);
      osc.stop(now0 + t + 0.10);
      activeSongAudioNodes.push(osc, gain);
    }
    activeSongTimeouts.push(setTimeout(() => stopCurrentSong(), 2200));
  }

  // ==========================================================================
  // 8. SONIC THE HEDGEHOG — CHIME DE ANILLOS + RIFF SPEED ZONE ORIGINAL
  // ==========================================================================
  else if (songKey === 'sonic') {
    showToast('💨 ¡VELOCIDAD SUPERSÓNICA! Anillos y estela azul activados.', 'info');
    const melody = [
      { f: N.B5, t: 0.00, d: 0.12 }, { f: N.E6, t: 0.14, d: 0.18 },
      { f: N.B5, t: 0.36, d: 0.12 }, { f: N.E6, t: 0.50, d: 0.18 },
      { f: N.G5, t: 0.80, d: 0.12 }, { f: N.B5, t: 0.94, d: 0.12 }, { f: N.D6, t: 1.08, d: 0.30 },
      { f: N.E6, t: 1.44, d: 0.12 }, { f: N.G6, t: 1.58, d: 0.40 }
    ];
    melody.forEach(m => {
      playNote(m.f, m.t, m.d, 'square', 0.12);
      playBass(m.f / 2, m.t, m.d, 0.10);
    });
    activeSongTimeouts.push(setTimeout(() => stopCurrentSong(), 2400));
  }
}

// ==============================================================================
// 23. HOTSPOTS DE PASCUA, CONTADOR Y SALA ARCADE
// ==============================================================================
const EASTER_HOTSPOTS = [
  { key: 'pokemon', label: 'Pokémon', icon: '⚡', x: 895, y: 32, song: 'pokemon', aura: 'pikachu-storm', official: 'https://www.youtube.com/@PokemonOficialES' },
  { key: 'dbz', label: 'Dragon Ball Z', icon: '🔥', x: 1040, y: 170, song: 'dbz', aura: 'saiyan-aura', official: 'https://www.youtube.com/@DragonBallOficial' },
  { key: 'xmas', label: 'Navidad L2', icon: '🎄', x: 1260, y: 86, song: 'xmas', aura: null, official: 'https://open.spotify.com/search/villancicos%20clasicos' },
  { key: 'mario', label: 'Super Mario', icon: '⭐', x: 44, y: 172, song: 'mario', aura: 'starman-rainbow', official: 'https://www.youtube.com/@NintendoAmerica' },
  { key: 'zelda', label: 'Zelda', icon: '🗡️', x: 3514, y: 172, song: 'zelda', aura: 'zelda-triforce', official: 'https://www.youtube.com/@NintendoAmerica' },
  { key: 'pacman', label: 'Pac-Man', icon: '•••', x: 1900, y: 402, song: 'pacman', aura: null, official: 'https://www.youtube.com/@BandaiNamcoAm' },
  { key: 'sonic', label: 'Sonic', icon: '💨', x: 2120, y: 170, song: 'sonic', aura: null, official: 'https://www.youtube.com/@SEGA' },
  { key: 'eva', label: 'Tetris / EVA', icon: '⬡', x: 3304, y: -42, song: 'evangelion', aura: 'eva-berserk', official: 'https://open.spotify.com/search/evangelion%20cruel%20angel%20thesis' }
];

const EASTER_STORAGE_KEY = 'ATS_REPLICA_EASTER_HOTSPOTS_V1';

function getDiscoveredHotspots() {
  try {
    const raw = localStorage.getItem(EASTER_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (e) {
    return {};
  }
}

function saveDiscoveredHotspots(map) {
  try {
    localStorage.setItem(EASTER_STORAGE_KEY, JSON.stringify(map));
  } catch (e) { /* noop */ }
}

function updateEasterCounter() {
  const discovered = getDiscoveredHotspots();
  const count = Object.values(discovered).filter(Boolean).length;
  const text = `${count}/8`;
  const headerCounter = document.getElementById('easter-counter');
  const modalCounter = document.getElementById('arcade-counter');
  if (headerCounter) headerCounter.textContent = text;
  if (modalCounter) modalCounter.textContent = text;
  EASTER_HOTSPOTS.forEach(h => {
    const card = document.querySelector(`.arcade-card[data-hotspot="${h.key}"]`);
    if (!card) return;
    const status = card.querySelector('.arcade-status');
    if (discovered[h.key]) {
      card.classList.add('discovered');
      if (status) status.textContent = '✓ Descubierto';
    } else {
      card.classList.remove('discovered');
      if (status) status.textContent = '🔒 Pista de ubicación';
    }
  });
  return count;
}

function renderEasterHotspots() {
  const layer = document.getElementById('easter-hotspots-layer');
  if (!layer) return;
  layer.innerHTML = '';
  EASTER_HOTSPOTS.forEach(h => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'easter-hotspot');
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.setAttribute('aria-label', `Secreto ${h.label}`);
    g.setAttribute('transform', `translate(${h.x}, ${h.y})`);
    g.setAttribute('data-hotspot', h.key);

    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('class', 'hotspot-ring');
    ring.setAttribute('r', '9');
    layer.appendChild(g);
    g.appendChild(ring);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('class', 'hotspot-label');
    label.setAttribute('y', '22');
    label.textContent = h.label;
    g.appendChild(label);

    g.addEventListener('click', (e) => {
      e.stopPropagation();
      discoverHotspot(h.key);
    });
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        discoverHotspot(h.key);
      }
    });
  });
}

function discoverHotspot(key) {
  const hotspot = EASTER_HOTSPOTS.find(h => h.key === key);
  if (!hotspot) return;
  const discovered = getDiscoveredHotspots();
  const wasNew = !discovered[key];
  discovered[key] = true;
  saveDiscoveredHotspots(discovered);
  updateEasterCounter();

  if (hotspot.song) {
    playChiptuneSong(hotspot.song);
  }
  if (hotspot.aura) {
    applyAuraToAllTokens(hotspot.aura);
    setTimeout(() => {
      document.querySelectorAll(`.${hotspot.aura}`).forEach(el => el.classList.remove(hotspot.aura));
    }, 6000);
  }

  if (key === 'xmas') {
    document.querySelectorAll('.crew-token').forEach(el => {
      el.classList.add('santa-pompon');
      setTimeout(() => el.classList.remove('santa-pompon'), 6000);
    });
  } else if (key === 'pacman') {
    document.querySelectorAll('.vehicle-token').forEach(el => {
      el.classList.add('pacman-mouth');
      setTimeout(() => el.classList.remove('pacman-mouth'), 6000);
    });
  } else if (key === 'sonic') {
    document.querySelectorAll('.vehicle-token').forEach(el => {
      el.style.filter = 'drop-shadow(0 0 8px #38bdf8)';
      setTimeout(() => el.style.filter = '', 4000);
    });
  }

  if (wasNew) {
    const btn = document.getElementById('btn-open-easter-eggs');
    if (btn) {
      btn.classList.remove('discovered-flash');
      void btn.offsetWidth;
      btn.classList.add('discovered-flash');
      setTimeout(() => btn.classList.remove('discovered-flash'), 1200);
    }
    showToast(`🎮 ¡Secreto descubierto! ${hotspot.label}`, 'success');
  }
}

function initEasterEggs() {
  renderEasterHotspots();
  updateEasterCounter();

  // Botón para abrir la Sala Arcade
  const btnOpen = document.getElementById('btn-open-easter-eggs');
  const modal = document.getElementById('modal-easter-eggs');
  if (btnOpen && modal) {
    btnOpen.addEventListener('click', () => {
      modal.classList.add('active');
      playSound('coin');
    });
  }

  // Botones de reproducción en el modal
  document.querySelectorAll('[data-song]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const song = e.currentTarget.getAttribute('data-song');
      playChiptuneSong(song);
      document.querySelectorAll('.arcade-btn-play').forEach(b => b.classList.remove('active-song'));
      e.currentTarget.classList.add('active-song');
    });
  });

  const btnStopAll = document.getElementById('btn-stop-all-audio');
  if (btnStopAll) {
    btnStopAll.addEventListener('click', () => {
      stopCurrentSong();
      document.querySelectorAll('.arcade-btn-play').forEach(b => b.classList.remove('active-song'));
      showToast('Toda la música fue detenida.', 'info');
    });
  }

  // Listener del Código Konami y Palabras Clave por Teclado
  const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiProgress = 0;
  let typedBuffer = '';

  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    const expected = konamiPattern[konamiProgress].toLowerCase();
    if (key === expected) {
      konamiProgress++;
      if (konamiProgress === konamiPattern.length) {
        konamiProgress = 0;
        playChiptuneSong('dbz');
        showToast('🎮 ¡CÓDIGO KONAMI DESBLOQUEADO! MODO SUPER SAIYAN DESATADO.', 'warning');
      }
    } else {
      konamiProgress = 0;
    }

    if (e.key.length === 1 && /[a-z0-9]/i.test(e.key)) {
      typedBuffer += e.key.toLowerCase();
      if (typedBuffer.length > 15) typedBuffer = typedBuffer.slice(-15);

      if (typedBuffer.endsWith('gamer')) {
        playSound('1up');
        showToast('👾 ¡MODO GAMER ACTIVADO! Explora el plano para descubrir secretos.', 'warning');
        typedBuffer = '';
      } else if (typedBuffer.endsWith('navidad') || typedBuffer.endsWith('xmas')) {
        discoverHotspot('xmas');
        typedBuffer = '';
      } else if (typedBuffer.endsWith('pacman')) {
        discoverHotspot('pacman');
        typedBuffer = '';
      } else if (typedBuffer.endsWith('sonic')) {
        discoverHotspot('sonic');
        typedBuffer = '';
      } else if (typedBuffer.endsWith('dbz') || typedBuffer.endsWith('goku')) {
        playChiptuneSong('dbz');
        typedBuffer = '';
      } else if (typedBuffer.endsWith('mario') || typedBuffer.endsWith('star')) {
        playChiptuneSong('mario');
        typedBuffer = '';
      } else if (typedBuffer.endsWith('poke') || typedBuffer.endsWith('pika')) {
        playChiptuneSong('pokemon');
        typedBuffer = '';
      } else if (typedBuffer.endsWith('zelda') || typedBuffer.endsWith('link')) {
        playChiptuneSong('zelda');
        typedBuffer = '';
      } else if (typedBuffer.endsWith('eva') || typedBuffer.endsWith('shinji')) {
        playChiptuneSong('evangelion');
        typedBuffer = '';
      }
    }
  });

  // Clics secretos en la interfaz
  const brandBadge = document.querySelector('.brand-badge');
  if (brandBadge) {
    let clickCount = 0;
    let clickTimer = null;
    brandBadge.style.cursor = 'pointer';
    brandBadge.addEventListener('click', () => {
      clickCount++;
      clearTimeout(clickTimer);
      if (clickCount >= 3) {
        clickCount = 0;
        playChiptuneSong('mario');
      } else {
        clickTimer = setTimeout(() => { clickCount = 0; }, 700);
      }
    });
  }

  const vitalityBadge = document.querySelector('.system-vitality-badge');
  if (vitalityBadge) {
    let clickCount = 0;
    let clickTimer = null;
    vitalityBadge.style.cursor = 'pointer';
    vitalityBadge.addEventListener('click', () => {
      clickCount++;
      clearTimeout(clickTimer);
      if (clickCount >= 5) {
        clickCount = 0;
        playChiptuneSong('dbz');
      } else {
        clickTimer = setTimeout(() => { clickCount = 0; }, 800);
      }
    });
  }

  const clockDisplay = document.getElementById('clock-display');
  if (clockDisplay) {
    let clickCount = 0;
    let clickTimer = null;
    clockDisplay.style.cursor = 'pointer';
    clockDisplay.addEventListener('click', () => {
      clickCount++;
      clearTimeout(clickTimer);
      if (clickCount >= 5) {
        clickCount = 0;
        playChiptuneSong('evangelion');
      } else {
        clickTimer = setTimeout(() => { clickCount = 0; }, 800);
      }
    });
  }
}

