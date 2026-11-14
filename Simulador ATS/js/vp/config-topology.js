/* Classic global script: mantiene el ámbito global compartido entre archivos. */
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


const PALETA_GRUPOS_PERMISO = ['#22d3ee', '#f472b6', '#a3e635', '#c084fc', '#fb923c', '#38bdf8', '#f43f5e', '#facc15'];

