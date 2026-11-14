/**
 * ==============================================================================
 * SIMULADOR ATS — PATIO TALLER SANTA ANITA (PTSA)
 * SIEMENS PCO LÍNEA 2 & HITACHI RAIL STS (AS-BUILT)
 * Geometría Real de Vías TK, Cocheras, Nave de Talleres y Subestaciones SER
 * ==============================================================================
 */

// BLOQUEO ABSOLUTO DEL MENÚ CONTEXTUAL DEL NAVEGADOR
window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  e.stopPropagation();
  return false;
}, { capture: true });

// ------------------------------------------------------------------------------
// 1. CATÁLOGO DE VÍAS TK Y SECTORES DE PATIO TALLER SANTA ANITA (PTSA)
// ------------------------------------------------------------------------------
const PTSA_TRACK_ZONES = [
  // Nave Principal de Talleres y Cocheras Cubiertas (TK-08 a TK-19)
  { id: "TK-08", name: "Vía TK-08 (Nave de Talleres)", type: "nave", xStart: 1850, xEnd: 2640, y: 420, catenaryZone: "Z-103" },
  { id: "TK-13", name: "Vía TK-13 (Nave de Talleres)", type: "nave", xStart: 1850, xEnd: 2640, y: 450, catenaryZone: "Z-103" },
  { id: "TK-14", name: "Vía TK-14 (Nave de Talleres)", type: "nave", xStart: 1850, xEnd: 2640, y: 480, catenaryZone: "Z-103" },
  { id: "TK-09", name: "Vía TK-09 (Nave de Talleres)", type: "nave", xStart: 1850, xEnd: 2640, y: 550, catenaryZone: "Z-104" },
  { id: "TK-15", name: "Vía TK-15 (Nave de Talleres)", type: "nave", xStart: 1850, xEnd: 2640, y: 580, catenaryZone: "Z-104" },
  { id: "TK-16", name: "Vía TK-16 (Nave de Talleres)", type: "nave", xStart: 1850, xEnd: 2640, y: 610, catenaryZone: "Z-104" },
  { id: "TK-10", name: "Vía TK-10 (Nave de Talleres)", type: "nave", xStart: 1850, xEnd: 2640, y: 660, catenaryZone: "Z-104" },
  { id: "TK-17", name: "Vía TK-17 (Nave de Talleres)", type: "nave", xStart: 1850, xEnd: 2640, y: 690, catenaryZone: "Z-104" },
  { id: "TK-19", name: "Vía TK-19 (Nave de Talleres)", type: "nave", xStart: 1850, xEnd: 2640, y: 720, catenaryZone: "Z-104" },
  { id: "TK-18", name: "Vía TK-18 (Nave de Talleres)", type: "nave", xStart: 1850, xEnd: 2640, y: 750, catenaryZone: "Z-104" },

  // Haz Diagonal Exterior (Estacionamiento TK-26 a TK-36)
  { id: "TK-35-36", name: "Vías TK-35 / TK-36 (Cochera Exterior)", type: "ladder", xStart: 1350, xEnd: 1510, y: 240, catenaryZone: "Z-101" },
  { id: "TK-33-34", name: "Vías TK-33 / TK-34 (Cochera Exterior)", type: "ladder", xStart: 1370, xEnd: 1530, y: 280, catenaryZone: "Z-101" },
  { id: "TK-31-32", name: "Vías TK-31 / TK-32 (Cochera Exterior)", type: "ladder", xStart: 1390, xEnd: 1550, y: 320, catenaryZone: "Z-101" },
  { id: "TK-29-30", name: "Vías TK-29 / TK-30 (Cochera Exterior)", type: "ladder", xStart: 1410, xEnd: 1570, y: 360, catenaryZone: "Z-101" },
  { id: "TK-27-28", name: "Vías TK-27 / TK-28 (Cochera Exterior)", type: "ladder", xStart: 1430, xEnd: 1590, y: 400, catenaryZone: "Z-101" },
  { id: "TK-26", name: "Vía TK-26 (Cochera Exterior)", type: "ladder", xStart: 1450, xEnd: 1610, y: 440, catenaryZone: "Z-101" },

  // Vías Perimetrales y de Prueba
  { id: "TK-TEST", name: "Vía de Prueba (TK-TEST / W TEST)", type: "ring", xStart: 1550, xEnd: 2450, y: 945, catenaryZone: "Z-105" },
  { id: "TK-LAVADO", name: "Planta de Lavado y Foso (W 04 / W 05)", type: "ring", xStart: 1200, xEnd: 1440, y: 880, catenaryZone: "Z-105" },
  { id: "T-04", name: "Lazo Curva Oeste T-04", type: "curve", xStart: 100, xEnd: 400, y: 500, catenaryZone: "Z-102" },
  { id: "T-05", name: "Vía Inferior Sur T-05", type: "ring", xStart: 1500, xEnd: 2350, y: 845, catenaryZone: "Z-105" },
  { id: "ANILLO-NORTE", name: "Anillo Norte (Zona 101/102)", type: "ring", xStart: 1100, xEnd: 2650, y: 27, catenaryZone: "Z-101" },
  { id: "RAMAL-D1-PTSA", name: "Enlace Ramal D1 hacia Vía Principal", type: "connection", xStart: 2450, xEnd: 2750, y: 920, catenaryZone: "Z-102" },
  { id: "RAMAL-D2-PTSA", name: "Enlace Ramal D2 hacia Vía Principal", type: "connection", xStart: 2680, xEnd: 2980, y: 980, catenaryZone: "Z-102" }
];

// ZONAS OFICIALES DE CATENARIA PTSA 1500V DC (SIEMENS & HITACHI RAIL)
const ZONAS_CATENARIA_PTSA = [
  { id: "Z-101", num: 101, name: "Zona 101: Anillo Norte y Haz de Cocheras Exteriores TK-26 a TK-36", sub: "SER A (+SECA)", defaultCut: false },
  { id: "Z-102", num: 102, name: "Zona 102: Lazo Perimetral T-04 y Conexión de Rampas D1/D2", sub: "SER B (+SECB) y SER D (+SECD)", defaultCut: false },
  { id: "Z-103", num: 103, name: "Zona 103: Nave Talleres Sector Norte (Vías TK-08, TK-13, TK-14)", sub: "SER B (+SCB1, TPS_103)", defaultCut: false },
  { id: "Z-104", num: 104, name: "Zona 104: Nave Talleres Sector Sur (Vías TK-09, TK-10, TK-15 a TK-19)", sub: "SER B (+SCB2, TPS_104)", defaultCut: false },
  { id: "Z-105", num: 105, name: "Zona 105: Vía de Prueba (TK-TEST), Planta de Lavado y Vía T-05", sub: "SER C (+SECC, TPS_105)", defaultCut: false }
];

// ------------------------------------------------------------------------------
// 2. ESTADO GLOBAL PTSA
// ------------------------------------------------------------------------------
const ptsaState = {
  crews: [],
  vehicles: [],
  completedJobs: [],
  historyLog: [],
  activeTab: 'all',
  searchQuery: '',
  selectedTokenForQuickEdit: null,
  
  catenary: {
    deenergizedZones: [],
    interactiveMode: false
  },
  
  isDraggingPegman: false,
  draggedType: null,
  hoveredTrackId: 'TK-08',
  draggedZonesSet: new Set(),
  isCurrentHoverForbidden: false,
  forbiddenReason: '',
  reassigningEntity: null,
  
  audioEnabled: true,
  audioCtx: null,
  
  viewBox: { x: 0, y: 0, width: 3100, height: 1200 },
  isPanning: false,
  startPan: { x: 0, y: 0 },
  
  STORAGE_KEY: 'ATS_PTSA_STATE_V1'
};

// ------------------------------------------------------------------------------
// 3. SINTETIZADOR DE AUDIO
// ------------------------------------------------------------------------------
function getAudioContext() {
  if (!ptsaState.audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) ptsaState.audioCtx = new AudioContext();
  }
  if (ptsaState.audioCtx && ptsaState.audioCtx.state === 'suspended') {
    ptsaState.audioCtx.resume();
  }
  return ptsaState.audioCtx;
}

function playSound(type) {
  if (!ptsaState.audioEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    if (type === 'coin' || type === 'drop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'jump') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.12);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'forbidden' || type === 'hazard') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(840, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.14);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === '1up' || type === 'finish') {
      const notes = [783.99, 739.99, 622.25, 440.00, 659.25, 830.61, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.1, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.07);
      });
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
  initQuickNav();
  initTrackZonesHitboxes();
  initPanZoomControls();
  initPegmanDragDropPTSA();
  initQuickEditCardPTSA();
  initModalsPTSA();
  initDockTabsAndSearchPTSA();
  initCatenaryControlPTSA();
  initDailySheetModalPTSA();
  
  loadPersistedStatePTSA();
  renderAllPTSA();
  initAnimationEnginePTSA();
  
  showToast('SIEMENS PCO: Simulador Patio Taller Santa Anita (PTSA) cargado.', 'info');
});

function initClock() {
  const clockEl = document.getElementById('clock-display');
  function update() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${h}:${m}:${s}`;
  }
  update();
  setInterval(update, 1000);
}

function initSoundToggle() {
  const btn = document.getElementById('btn-sound-toggle');
  const icon = document.getElementById('sound-icon');
  const text = document.getElementById('sound-text');
  
  btn.addEventListener('click', () => {
    ptsaState.audioEnabled = !ptsaState.audioEnabled;
    if (ptsaState.audioEnabled) {
      btn.classList.add('sound-on');
      icon.textContent = '🔊';
      text.textContent = 'Audio ATS';
      playSound('coin');
      showToast('Audio ATS activado en PTSA', 'success');
    } else {
      btn.classList.remove('sound-on');
      icon.textContent = '🔇';
      text.textContent = 'Silenciado';
      showToast('Audio silenciado', 'info');
    }
    persistStatePTSA();
  });
}

function initQuickNav() {
  document.querySelectorAll('#station-quicknav .nav-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const targetX = parseFloat(pill.getAttribute('data-x'));
      const targetY = parseFloat(pill.getAttribute('data-y')) || 500;
      if (!isNaN(targetX)) {
        smoothGlideToPoint(targetX, targetY);
        playSound('jump');
      }
    });
  });
}

function smoothGlideToPoint(targetX, targetY) {
  const windowWidth = 1400;
  const windowHeight = 700;
  const targetViewX = Math.max(0, Math.min(3100 - windowWidth, targetX - windowWidth / 2));
  const targetViewY = Math.max(0, Math.min(1200 - windowHeight, targetY - windowHeight / 2));
  
  const startX = ptsaState.viewBox.x;
  const startY = ptsaState.viewBox.y;
  const startTime = performance.now();
  const duration = 400;
  
  function step(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    
    ptsaState.viewBox.x = startX + (targetViewX - startX) * eased;
    ptsaState.viewBox.y = startY + (targetViewY - startY) * eased;
    ptsaState.viewBox.width = windowWidth;
    ptsaState.viewBox.height = windowHeight;
    
    const svg = document.getElementById('ptsa-track-svg');
    svg.setAttribute('viewBox', `${ptsaState.viewBox.x} ${ptsaState.viewBox.y} ${ptsaState.viewBox.width} ${ptsaState.viewBox.height}`);
    
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ------------------------------------------------------------------------------
// 5. ENCLAVAMIENTO DE SEGURIDAD EN PATIO TALLER (PTSA)
// ------------------------------------------------------------------------------
function checkPTSAConflict(trackId, entityType, ignoreEntityId = null) {
  if (!trackId) return { conflict: false, reason: '' };
  
  const existingCrews = ptsaState.crews.filter(c => c.id !== ignoreEntityId && (c.via === trackId || (c.zones && c.zones.includes(trackId))));
  const existingVehs = ptsaState.vehicles.filter(v => v.id !== ignoreEntityId && (v.via === trackId || (v.zones && v.zones.includes(trackId))));
  
  if (entityType === 'vehicle') {
    if (existingVehs.length > 0) {
      return { conflict: true, reason: `¡PROHIBIDO! La vía ${trackId} ya está ocupada por ${existingVehs[0].vehicleType || 'otro vehículo'}. Prohibido ingreso simultáneo.` };
    }
    const activeCrew = existingCrews.find(c => !c.inSafeZone);
    if (activeCrew) {
      return { conflict: true, reason: `¡PROHIBIDO! En la vía ${trackId} la cuadrilla "${activeCrew.responsible}" labora en vía activa. Para maniobras de vehículos, replegar a zona segura.` };
    }
  } else if (entityType === 'crew') {
    if (existingVehs.length > 0) {
      return { conflict: true, reason: `¡PROHIBIDO! En la vía ${trackId} se encuentra en maniobra ${existingVehs[0].vehicleType}. Prohibido acceso de personal a pie.` };
    }
  }
  
  return { conflict: false, reason: '' };
}

// ------------------------------------------------------------------------------
// 6. ARRASTRE Y COLOCACIÓN PEGMAN EN VÍAS TK DE PTSA
// ------------------------------------------------------------------------------
function initPegmanDragDropPTSA() {
  const ghost = document.getElementById('pegman-drag-ghost');
  const ghostEmoji = document.getElementById('ghost-emoji');
  const ghostViaBadge = document.getElementById('ghost-via-badge');
  const prohibitionHud = document.getElementById('prohibition-hud');
  const prohibitionText = document.getElementById('prohibition-text');
  
  const chipCrew = document.getElementById('chip-crew');
  const chipVehicle = document.getElementById('chip-vehicle');
  
  function startDragging(type, clientX, clientY) {
    ptsaState.isDraggingPegman = true;
    ptsaState.draggedType = type;
    ptsaState.hoveredTrackId = 'TK-08';
    ptsaState.draggedZonesSet.clear();
    ptsaState.isCurrentHoverForbidden = false;
    ptsaState.forbiddenReason = '';
    
    ghostEmoji.textContent = type === 'crew' ? '👷' : '🚜';
    ghostViaBadge.textContent = 'VÍA TK (PTSA)';
    ghostViaBadge.className = 'ghost-via-badge via-v2';
    
    ghost.style.display = 'flex';
    ghost.style.left = `${clientX}px`;
    ghost.style.top = `${clientY}px`;
    
    playSound('jump');
  }
  
  if (chipCrew) {
    chipCrew.addEventListener('mousedown', (e) => {
      if (e.button === 0) { e.preventDefault(); startDragging('crew', e.clientX, e.clientY); }
    });
  }
  if (chipVehicle) {
    chipVehicle.addEventListener('mousedown', (e) => {
      if (e.button === 0) { e.preventDefault(); startDragging('vehicle', e.clientX, e.clientY); }
    });
  }
  
  window.addEventListener('mousemove', (e) => {
    if (!ptsaState.isDraggingPegman) return;
    ghost.style.left = `${e.clientX}px`;
    ghost.style.top = `${e.clientY}px`;
    
    const svgPoint = getSvgPointPTSA(e.clientX, e.clientY);
    const hitTrack = findNearestPTSATrack(svgPoint.x, svgPoint.y);
    
    if (hitTrack) {
      ptsaState.hoveredTrackId = hitTrack.id;
      ghostViaBadge.textContent = hitTrack.id;
      
      const conflict = checkPTSAConflict(hitTrack.id, ptsaState.draggedType, ptsaState.reassigningEntity ? ptsaState.reassigningEntity.id : null);
      if (conflict.conflict) {
        if (!ptsaState.isCurrentHoverForbidden) playSound('forbidden');
        ptsaState.isCurrentHoverForbidden = true;
        ptsaState.forbiddenReason = conflict.reason;
        
        prohibitionHud.style.display = 'flex';
        prohibitionHud.style.left = `${e.clientX}px`;
        prohibitionHud.style.top = `${e.clientY - 50}px`;
        prohibitionText.textContent = conflict.reason;
        ghostViaBadge.className = 'ghost-via-badge via-forbidden';
      } else {
        clearForbiddenPTSA();
      }
      renderDragSpanPTSA(hitTrack);
    } else {
      clearForbiddenPTSA();
      clearDragSpanPTSA();
    }
  });
  
  function clearForbiddenPTSA() {
    ptsaState.isCurrentHoverForbidden = false;
    ptsaState.forbiddenReason = '';
    prohibitionHud.style.display = 'none';
  }
  
  window.addEventListener('mouseup', (e) => {
    if (!ptsaState.isDraggingPegman) return;
    finalizeDropPTSA(e.clientX, e.clientY);
  });
  
  function finalizeDropPTSA(clientX, clientY) {
    ghost.style.display = 'none';
    if (!ptsaState.isDraggingPegman) return;
    
    const svgPoint = getSvgPointPTSA(clientX, clientY);
    const hitTrack = findNearestPTSATrack(svgPoint.x, svgPoint.y);
    
    if (!hitTrack) {
      clearForbiddenPTSA();
      clearDragSpanPTSA();
      ptsaState.isDraggingPegman = false;
      ptsaState.reassigningEntity = null;
      return;
    }
    
    const conflict = checkPTSAConflict(hitTrack.id, ptsaState.draggedType, ptsaState.reassigningEntity ? ptsaState.reassigningEntity.id : null);
    if (conflict.conflict) {
      playSound('hazard');
      showToast(`🚫 BLOQUEADO: ${conflict.reason}`, 'danger');
      clearForbiddenPTSA();
      clearDragSpanPTSA();
      ptsaState.isDraggingPegman = false;
      ptsaState.reassigningEntity = null;
      return;
    }
    
    clearForbiddenPTSA();
    clearDragSpanPTSA();
    playSound('coin');
    
    const curTime = new Date().toLocaleTimeString('es-PE', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const midX = (hitTrack.xStart + hitTrack.xEnd) / 2;
    
    if (ptsaState.reassigningEntity) {
      const existing = ptsaState.reassigningEntity;
      existing.via = hitTrack.id;
      existing.zones = [hitTrack.id];
      existing.zoneLabel = hitTrack.name;
      existing.xMin = hitTrack.xStart;
      existing.xMax = hitTrack.xEnd;
      existing.x = midX;
      existing.y = hitTrack.y;
      
      ptsaState.historyLog.push({
        timestamp: new Date().toISOString(),
        action: 'REUBICACION_PTSA',
        detail: `${existing.responsible || existing.vehicleType} reubicado en ${hitTrack.name}.`
      });
      showToast(`✔ ${existing.responsible || existing.vehicleType} reubicado en ${hitTrack.name}.`, 'success');
      
      ptsaState.reassigningEntity = null;
      ptsaState.isDraggingPegman = false;
      persistStatePTSA();
      renderAllPTSA();
      return;
    }
    
    if (ptsaState.draggedType === 'crew') {
      const count = ptsaState.crews.length + 1;
      const newCrew = {
        id: `CRW-P${Date.now().toString().slice(-4)}`,
        type: 'crew',
        responsible: `Cuadrilla Taller #${count}`,
        company: 'Taller Material Rodante',
        count: 4,
        radio: `Ch-01 / Maniobras`,
        via: hitTrack.id,
        zones: [hitTrack.id],
        zoneLabel: hitTrack.name,
        xMin: hitTrack.xStart,
        xMax: hitTrack.xEnd,
        x: midX,
        y: hitTrack.y,
        speed: 12,
        dir: 1,
        isWorking: true,
        inSafeZone: false,
        timeIn: curTime,
        timeOut: '',
        notes: 'Mantenimiento preventivo en nave de talleres'
      };
      ptsaState.crews.push(newCrew);
      showToast(`👷 ${newCrew.responsible} asignada a ${hitTrack.id}.`, 'success');
    } else {
      const count = ptsaState.vehicles.length + 1;
      const newVeh = {
        id: `VEH-P${Date.now().toString().slice(-4)}`,
        type: 'vehicle',
        vehicleType: `Dresina Patio D-P0${Math.min(count, 9)}`,
        driver: `Operador Taller ${count}`,
        leader: `Jefe de Maniobras PTSA`,
        company: 'Vía y Catenaria PTSA',
        radio: `Ch-01 / Maniobras`,
        via: hitTrack.id,
        zones: [hitTrack.id],
        zoneLabel: hitTrack.name,
        xMin: hitTrack.xStart,
        xMax: hitTrack.xEnd,
        x: midX,
        y: hitTrack.y,
        speed: 18,
        dir: 1,
        timeIn: curTime,
        timeOut: '',
        notes: 'Maniobra interna en cocheras PTSA'
      };
      ptsaState.vehicles.push(newVeh);
      showToast(`🚜 ${newVeh.vehicleType} en maniobra sobre ${hitTrack.id}.`, 'success');
    }
    
    ptsaState.isDraggingPegman = false;
    persistStatePTSA();
    renderAllPTSA();
  }
}

function findNearestPTSATrack(x, y) {
  let closest = null;
  let minDistance = 60;
  
  PTSA_TRACK_ZONES.forEach(trk => {
    if (x >= trk.xStart - 40 && x <= trk.xEnd + 40) {
      const dy = Math.abs(y - trk.y);
      if (dy < minDistance) {
        minDistance = dy;
        closest = trk;
      }
    }
  });
  return closest;
}

function renderDragSpanPTSA(track) {
  const spanLayer = document.getElementById('drag-selection-layer');
  if (!spanLayer) return;
  spanLayer.innerHTML = '';
  
  const isForbidden = ptsaState.isCurrentHoverForbidden;
  const strokeColor = isForbidden ? '#ef4444' : (ptsaState.draggedType === 'crew' ? '#f59e0b' : '#38bdf8');
  
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', track.xStart);
  rect.setAttribute('y', track.y - 12);
  rect.setAttribute('width', Math.max(30, track.xEnd - track.xStart));
  rect.setAttribute('height', 24);
  rect.setAttribute('rx', '4');
  rect.setAttribute('fill', isForbidden ? 'rgba(239, 68, 68, 0.35)' : 'rgba(56, 189, 248, 0.22)');
  rect.setAttribute('stroke', strokeColor);
  rect.setAttribute('stroke-width', '2');
  rect.setAttribute('stroke-dasharray', isForbidden ? '6 4' : 'none');
  spanLayer.appendChild(rect);
}

function clearDragSpanPTSA() {
  const spanLayer = document.getElementById('drag-selection-layer');
  if (spanLayer) spanLayer.innerHTML = '';
}

function getSvgPointPTSA(clientX, clientY) {
  const svg = document.getElementById('ptsa-track-svg');
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

// ------------------------------------------------------------------------------
// 7. HITBOXES Y TRAMOS DE VÍAS TK EN SVG
// ------------------------------------------------------------------------------
function initTrackZonesHitboxes() {
  const layer = document.getElementById('track-zones-layer');
  if (!layer) return;
  layer.innerHTML = '';
  
  PTSA_TRACK_ZONES.forEach(trk => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', trk.xStart);
    rect.setAttribute('y', trk.y - 14);
    rect.setAttribute('width', trk.xEnd - trk.xStart);
    rect.setAttribute('height', 28);
    rect.setAttribute('fill', 'rgba(56, 189, 248, 0.001)');
    rect.setAttribute('data-track-id', trk.id);
    rect.setAttribute('title', trk.name);
    layer.appendChild(rect);
  });
}

// ------------------------------------------------------------------------------
// 8. CONTROLES DE ZOOM Y PANEO
// ------------------------------------------------------------------------------
function initPanZoomControls() {
  const svg = document.getElementById('ptsa-track-svg');
  const container = document.getElementById('svg-pan-zoom-container');
  
  function applyViewBox() {
    svg.setAttribute('viewBox', `${ptsaState.viewBox.x} ${ptsaState.viewBox.y} ${ptsaState.viewBox.width} ${ptsaState.viewBox.height}`);
  }
  
  document.getElementById('btn-zoom-in').addEventListener('click', () => { zoomByFactor(0.85); });
  document.getElementById('btn-zoom-out').addEventListener('click', () => { zoomByFactor(1.18); });
  document.getElementById('btn-zoom-reset').addEventListener('click', () => {
    ptsaState.viewBox = { x: 0, y: 0, width: 3100, height: 1200 };
    applyViewBox();
    playSound('coin');
  });
  document.getElementById('btn-zoom-fit').addEventListener('click', () => {
    ptsaState.viewBox = { x: 0, y: 0, width: 3100, height: 1200 };
    applyViewBox();
    playSound('coin');
  });
  
  function zoomByFactor(factor) {
    const nw = ptsaState.viewBox.width * factor;
    const nh = ptsaState.viewBox.height * factor;
    if (nw >= 600 && nw <= 6000) {
      ptsaState.viewBox.x -= (nw - ptsaState.viewBox.width) / 2;
      ptsaState.viewBox.y -= (nh - ptsaState.viewBox.height) / 2;
      ptsaState.viewBox.width = nw;
      ptsaState.viewBox.height = nh;
      applyViewBox();
    }
  }
  
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 0.88 : 1.14;
    zoomByFactor(factor);
  }, { passive: false });
  
  container.addEventListener('mousedown', (e) => {
    if (ptsaState.isDraggingPegman || e.target.closest('.modal-overlay') || e.target.closest('.action-btn')) return;
    if (e.button === 0) {
      ptsaState.isPanning = true;
      ptsaState.startPan = { x: e.clientX, y: e.clientY };
    }
  });
  
  window.addEventListener('mousemove', (e) => {
    if (!ptsaState.isPanning) return;
    const dx = (e.clientX - ptsaState.startPan.x) * (ptsaState.viewBox.width / container.clientWidth);
    const dy = (e.clientY - ptsaState.startPan.y) * (ptsaState.viewBox.height / container.clientHeight);
    ptsaState.viewBox.x -= dx;
    ptsaState.viewBox.y -= dy;
    ptsaState.startPan = { x: e.clientX, y: e.clientY };
    applyViewBox();
  });
  
  window.addEventListener('mouseup', () => { ptsaState.isPanning = false; });
}

// ------------------------------------------------------------------------------
// 9. RENDERIZADO VISUAL COMPLETO EN PTSA
// ------------------------------------------------------------------------------
function renderAllPTSA() {
  renderWorkSpansPTSA();
  renderCatenaryLayerPTSA();
  renderEntitiesDOMPTSA();
  updateCountersPTSA();
  renderTablePTSA();
}

function renderWorkSpansPTSA() {
  const layer = document.getElementById('work-span-layer');
  if (!layer) return;
  layer.innerHTML = '';
  
  ptsaState.crews.forEach(c => {
    const trk = PTSA_TRACK_ZONES.find(t => t.id === c.via) || { xStart: c.xMin || 1850, xEnd: c.xMax || 2600, y: c.y || 420 };
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', trk.xStart);
    rect.setAttribute('y', trk.y - 12);
    rect.setAttribute('width', trk.xEnd - trk.xStart);
    rect.setAttribute('height', 24);
    rect.setAttribute('rx', '4');
    rect.setAttribute('fill', c.inSafeZone ? 'rgba(13, 148, 136, 0.16)' : 'rgba(245, 158, 11, 0.22)');
    rect.setAttribute('stroke', c.inSafeZone ? '#14b8a6' : '#f59e0b');
    rect.setAttribute('stroke-width', '2');
    rect.setAttribute('stroke-dasharray', c.inSafeZone ? '4 4' : '8 4');
    rect.style.cursor = 'pointer';
    rect.addEventListener('click', (e) => {
      e.stopPropagation();
      openQuickEditPTSA(c, e.clientX, e.clientY);
    });
    layer.appendChild(rect);
  });
  
  ptsaState.vehicles.forEach(v => {
    const trk = PTSA_TRACK_ZONES.find(t => t.id === v.via) || { xStart: v.xMin || 1850, xEnd: v.xMax || 2600, y: v.y || 420 };
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', trk.xStart);
    rect.setAttribute('y', trk.y - 12);
    rect.setAttribute('width', trk.xEnd - trk.xStart);
    rect.setAttribute('height', 24);
    rect.setAttribute('rx', '4');
    rect.setAttribute('fill', 'rgba(56, 189, 248, 0.2)');
    rect.setAttribute('stroke', '#38bdf8');
    rect.setAttribute('stroke-width', '2');
    rect.style.cursor = 'pointer';
    rect.addEventListener('click', (e) => {
      e.stopPropagation();
      openQuickEditPTSA(v, e.clientX, e.clientY);
    });
    layer.appendChild(rect);
  });
}

function renderCatenaryLayerPTSA() {
  const layer = document.getElementById('catenary-layer');
  if (!layer) return;
  layer.innerHTML = '';
  
  ZONAS_CATENARIA_PTSA.forEach(z => {
    const isCut = ptsaState.catenary.deenergizedZones.includes(z.id);
    if (isCut) {
      // Cartela de corte de tensión 1500V en patio
      const gBadge = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      let badgeX = 1400, badgeY = 150;
      if (z.id === 'Z-103') { badgeX = 2250; badgeY = 380; }
      else if (z.id === 'Z-104') { badgeX = 2250; badgeY = 780; }
      else if (z.id === 'Z-105') { badgeX = 2000; badgeY = 960; }
      gBadge.setAttribute('transform', `translate(${badgeX}, ${badgeY})`);
      gBadge.innerHTML = `
        <rect x="-60" y="-10" width="120" height="20" rx="4" fill="#7f1d1d" stroke="#ef4444" stroke-width="1.2" />
        <text x="0" y="4" fill="#fecaca" font-size="9" font-family="monospace" font-weight="900" text-anchor="middle">⚡ ${z.num}: 0V CORTE</text>
      `;
      layer.appendChild(gBadge);
    }
  });
}

function renderEntitiesDOMPTSA() {
  const layer = document.getElementById('dynamic-entities-layer');
  if (!layer) return;
  layer.innerHTML = '';
  
  // DIBUJAR CUADRILLAS A PIE EN PTSA
  ptsaState.crews.forEach(c => {
    const trk = PTSA_TRACK_ZONES.find(t => t.id === c.via) || { y: 420 };
    const yPos = trk.y;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'crew-token');
    g.setAttribute('id', `token-${c.id}`);
    g.setAttribute('transform', `translate(${c.x}, ${yPos})`);
    
    g.innerHTML = `
      <ellipse cx="0" cy="15" rx="14" ry="3.5" fill="rgba(0, 0, 0, 0.55)" style="pointer-events:none;" />
      <g class="crew-visual" style="pointer-events:none;">
        <circle cx="0" cy="-9" r="4.2" fill="#fde68a" />
        <path d="M -5.5,-11 Q 0,-17 5.5,-11 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1" />
        <path d="M -7,-6 L 7,-6 L 6,5 L -6,5 Z" fill="#ea580c" stroke="#c2410c" stroke-width="1" />
        <line x1="-5" y1="-5" x2="5" y2="4" stroke="#ffffff" stroke-width="1.5" />
        <rect x="-4" y="5" width="3" height="7" fill="#1e293b" />
        <rect x="1" y="5" width="3" height="7" fill="#1e293b" />
      </g>
      <rect x="-60" y="-32" width="120" height="16" rx="3" fill="#0a121e" stroke="#f59e0b" stroke-width="1.2" style="pointer-events:none;" />
      <text x="0" y="-21" fill="#ffffff" font-size="8.5" font-weight="bold" font-family="monospace" text-anchor="middle" style="pointer-events:none;">
        👷 ${c.responsible.slice(0, 11)} (${c.via})
      </text>
    `;
    
    g.addEventListener('click', (e) => {
      e.stopPropagation();
      playSound('coin');
      openQuickEditPTSA(c, e.clientX, e.clientY);
    });
    layer.appendChild(g);
  });
  
  // DIBUJAR DRESINAS EN PTSA
  ptsaState.vehicles.forEach(v => {
    const trk = PTSA_TRACK_ZONES.find(t => t.id === v.via) || { y: 420 };
    const yPos = trk.y;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'vehicle-token');
    g.setAttribute('id', `token-${v.id}`);
    g.setAttribute('transform', `translate(${v.x}, ${yPos})`);
    
    g.innerHTML = `
      <ellipse cx="0" cy="15" rx="38" ry="4" fill="rgba(0, 0, 0, 0.6)" style="pointer-events:none;" />
      <g class="veh-visual" style="pointer-events:none;">
        <rect x="-35" y="-5" width="70" height="16" rx="2" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2" />
        <path d="M -15,-15 L -5,-22 L 25,-22 L 32,-15 L 32,-5 L -15,-5 Z" fill="#f59e0b" stroke="#d97706" stroke-width="1" />
        <circle cx="-20" cy="12" r="4.5" fill="#334155" stroke="#cbd5e1" stroke-width="1.2" />
        <circle cx="20" cy="12" r="4.5" fill="#334155" stroke="#cbd5e1" stroke-width="1.2" />
      </g>
      <rect x="-65" y="-34" width="130" height="16" rx="3" fill="#0a121e" stroke="#38bdf8" stroke-width="1.2" style="pointer-events:none;" />
      <text x="0" y="-23" fill="#38bdf8" font-size="8.5" font-weight="bold" font-family="monospace" text-anchor="middle" style="pointer-events:none;">
        🚜 ${v.vehicleType.slice(0, 14)} (${v.via})
      </text>
    `;
    
    g.addEventListener('click', (e) => {
      e.stopPropagation();
      playSound('coin');
      openQuickEditPTSA(v, e.clientX, e.clientY);
    });
    layer.appendChild(g);
  });
}

// ------------------------------------------------------------------------------
// 10. MOTOR DE ANIMACIÓN EN PTSA (60 FPS)
// ------------------------------------------------------------------------------
let lastAnimPTSA = performance.now();

function initAnimationEnginePTSA() {
  function tick(timestamp) {
    const dt = Math.min((timestamp - lastAnimPTSA) / 1000, 0.1);
    lastAnimPTSA = timestamp;
    
    // Movimiento sutil en vías de patio
    ptsaState.crews.forEach(c => {
      const trk = PTSA_TRACK_ZONES.find(t => t.id === c.via);
      if (trk) {
        c.x += (c.speed || 10) * (c.dir || 1) * dt;
        if (c.x >= trk.xEnd - 20) { c.x = trk.xEnd - 20; c.dir = -1; }
        else if (c.x <= trk.xStart + 20) { c.x = trk.xStart + 20; c.dir = 1; }
        
        const el = document.getElementById(`token-${c.id}`);
        if (el) {
          const bob = Math.sin(timestamp / 180) * 1.5;
          el.setAttribute('transform', `translate(${c.x.toFixed(1)}, ${(trk.y + bob).toFixed(1)})`);
        }
      }
    });
    
    ptsaState.vehicles.forEach(v => {
      const trk = PTSA_TRACK_ZONES.find(t => t.id === v.via);
      if (trk) {
        v.x += (v.speed || 16) * (v.dir || 1) * dt;
        if (v.x >= trk.xEnd - 35) { v.x = trk.xEnd - 35; v.dir = -1; }
        else if (v.x <= trk.xStart + 35) { v.x = trk.xStart + 35; v.dir = 1; }
        
        const el = document.getElementById(`token-${v.id}`);
        if (el) {
          const rumble = Math.sin(timestamp / 35) * 0.7;
          el.setAttribute('transform', `translate(${v.x.toFixed(1)}, ${(trk.y + rumble).toFixed(1)})`);
        }
      }
    });
    
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ------------------------------------------------------------------------------
// 11. MODAL Y EDICIÓN RÁPIDA EN PTSA
// ------------------------------------------------------------------------------
function initQuickEditCardPTSA() {
  const viaSelect = document.getElementById('quickcard-via');
  if (viaSelect) {
    viaSelect.innerHTML = '';
    PTSA_TRACK_ZONES.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = `${t.id}: ${t.name}`;
      viaSelect.appendChild(opt);
    });
  }
  
  const card = document.getElementById('token-quickcard');
  const btnClose = document.getElementById('quickcard-close');
  const btnSave = document.getElementById('quickcard-btn-save');
  const btnFinish = document.getElementById('quickcard-btn-finish');
  const btnDel = document.getElementById('quickcard-btn-del');
  
  if (btnClose) btnClose.addEventListener('click', () => { card.style.display = 'none'; });
  
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      if (!ptsaState.selectedTokenForQuickEdit) return;
      const tok = ptsaState.selectedTokenForQuickEdit;
      const respInput = document.getElementById('quickcard-resp');
      const compSelect = document.getElementById('quickcard-company');
      const radioInput = document.getElementById('quickcard-radio');
      const countInput = document.getElementById('quickcard-count');
      const notesInput = document.getElementById('quickcard-notes');
      
      const newVia = viaSelect.value || tok.via;
      const conflict = checkPTSAConflict(newVia, tok.type, tok.id);
      if (conflict.conflict) {
        playSound('hazard');
        showToast('🚫 ' + conflict.reason, 'danger');
        return;
      }
      
      const trk = PTSA_TRACK_ZONES.find(t => t.id === newVia);
      tok.via = newVia;
      tok.zones = [newVia];
      tok.zoneLabel = trk ? trk.name : newVia;
      if (trk) { tok.y = trk.y; tok.xMin = trk.xStart; tok.xMax = trk.xEnd; tok.x = (trk.xStart + trk.xEnd) / 2; }
      
      tok.responsible = respInput.value.trim() || tok.responsible;
      tok.company = compSelect.value;
      tok.radio = radioInput.value.trim() || tok.radio;
      tok.notes = notesInput.value.trim() || tok.notes;
      if (tok.type === 'crew') tok.count = parseInt(countInput.value, 10) || 4;
      
      card.style.display = 'none';
      playSound('coin');
      persistStatePTSA();
      renderAllPTSA();
      showToast(`✔ Trabajo actualizado en ${tok.zoneLabel}.`, 'success');
    });
  }
  
  if (btnFinish) {
    btnFinish.addEventListener('click', () => {
      if (!ptsaState.selectedTokenForQuickEdit) return;
      concludeJobPTSA(ptsaState.selectedTokenForQuickEdit.id);
      card.style.display = 'none';
    });
  }
  
  if (btnDel) {
    btnDel.addEventListener('click', () => {
      if (!ptsaState.selectedTokenForQuickEdit) return;
      removeEntityPTSA(ptsaState.selectedTokenForQuickEdit.id);
      card.style.display = 'none';
    });
  }
}

function openQuickEditPTSA(item, clientX, clientY) {
  ptsaState.selectedTokenForQuickEdit = item;
  const card = document.getElementById('token-quickcard');
  const title = document.getElementById('quickcard-title');
  const respInput = document.getElementById('quickcard-resp');
  const compSelect = document.getElementById('quickcard-company');
  const radioInput = document.getElementById('quickcard-radio');
  const countInput = document.getElementById('quickcard-count');
  const countBox = document.getElementById('quickcard-count-box');
  const viaSelect = document.getElementById('quickcard-via');
  const notesInput = document.getElementById('quickcard-notes');
  
  title.innerHTML = `<span>${item.type === 'crew' ? '👷' : '🚜'}</span> Editar Trabajo en PTSA <span style="cursor:pointer;" id="quickcard-close">✕</span>`;
  respInput.value = item.responsible || item.vehicleType;
  compSelect.value = item.company || 'Taller Material Rodante';
  radioInput.value = item.radio || 'Ch-01 / Maniobras';
  notesInput.value = item.notes || '';
  viaSelect.value = item.via;
  
  if (item.type === 'crew') {
    countBox.style.display = 'flex';
    countInput.value = item.count || 4;
  } else {
    countBox.style.display = 'none';
  }
  
  card.style.display = 'flex';
  document.getElementById('quickcard-close').onclick = () => { card.style.display = 'none'; };
}

function concludeJobPTSA(jobId) {
  let item = null;
  const cIdx = ptsaState.crews.findIndex(c => c.id === jobId);
  if (cIdx !== -1) item = ptsaState.crews.splice(cIdx, 1)[0];
  else {
    const vIdx = ptsaState.vehicles.findIndex(v => v.id === jobId);
    if (vIdx !== -1) item = ptsaState.vehicles.splice(vIdx, 1)[0];
  }
  if (!item) return;
  
  item.timeOut = new Date().toLocaleTimeString('es-PE', { hour12: false, hour: '2-digit', minute: '2-digit' });
  item.status = 'CONCLUIDO';
  ptsaState.completedJobs.unshift(item);
  
  playSound('1up');
  persistStatePTSA();
  renderAllPTSA();
  showToast(`✔ Trabajo ${item.responsible || item.vehicleType} marcado como CONCLUIDO en PTSA.`, 'success');
}

function removeEntityPTSA(id) {
  ptsaState.crews = ptsaState.crews.filter(c => c.id !== id);
  ptsaState.vehicles = ptsaState.vehicles.filter(v => v.id !== id);
  playSound('jump');
  persistStatePTSA();
  renderAllPTSA();
  showToast('Trabajo despejado del patio.', 'warning');
}

// ------------------------------------------------------------------------------
// 12. TABLA BITÁCORA Y PESTAÑAS PTSA
// ------------------------------------------------------------------------------
function initDockTabsAndSearchPTSA() {
  document.querySelectorAll('.dock-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.dock-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      ptsaState.activeTab = tab.getAttribute('data-tab');
      playSound('click');
      renderTablePTSA();
    });
  });
  
  const searchInput = document.getElementById('dock-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      ptsaState.searchQuery = e.target.value.toLowerCase().trim();
      renderTablePTSA();
    });
  }
  
  const btnClearAll = document.getElementById('btn-clear-all');
  if (btnClearAll) {
    btnClearAll.addEventListener('click', () => {
      if (confirm('¿Confirmas el despeje de todos los trabajos en Patio Taller Santa Anita?')) {
        ptsaState.crews = [];
        ptsaState.vehicles = [];
        playSound('hazard');
        persistStatePTSA();
        renderAllPTSA();
        showToast('Patio Taller despejado.', 'warning');
      }
    });
  }
}

function renderTablePTSA() {
  const tbody = document.getElementById('work-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  let rows = [];
  if (ptsaState.activeTab === 'completed') {
    rows = ptsaState.completedJobs.map(j => ({ ...j, isCompleted: true }));
  } else {
    if (ptsaState.activeTab === 'all' || ptsaState.activeTab === 'crews') {
      ptsaState.crews.forEach(c => rows.push({ ...c, isCompleted: false }));
    }
    if (ptsaState.activeTab === 'all' || ptsaState.activeTab === 'vehicles') {
      ptsaState.vehicles.forEach(v => rows.push({ ...v, isCompleted: false }));
    }
  }
  
  if (ptsaState.searchQuery) {
    const q = ptsaState.searchQuery;
    rows = rows.filter(r => {
      const resp = (r.responsible || r.vehicleType || '').toLowerCase();
      const comp = (r.company || '').toLowerCase();
      const via = (r.via || '').toLowerCase();
      return resp.includes(q) || comp.includes(q) || via.includes(q);
    });
  }
  
  if (rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" style="text-align:center; padding:18px; color:#64748b;">— Sin registros de trabajos activos en Patio Taller Santa Anita —</td></tr>`;
    return;
  }
  
  rows.forEach(item => {
    const isCrew = item.type === 'crew';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="tag-badge ${item.isCompleted ? 'tag-completed' : (isCrew ? 'tag-crew' : 'tag-vehicle')}">${item.isCompleted ? '✔ Concluido' : (isCrew ? '👷 Cuadrilla' : '🚜 Vehículo')}</span></td>
      <td><strong>${isCrew ? item.responsible : item.vehicleType}</strong></td>
      <td>${item.company}</td>
      <td><span class="tag-badge tag-via-1" style="background:#0284c7; color:#fff;">${item.via}</span></td>
      <td><strong>${item.zoneLabel}</strong></td>
      <td><strong style="color:#38bdf8;">${item.radio}</strong></td>
      <td>${isCrew ? `${item.count} pers.` : (item.leader || '—')}</td>
      <td><span style="color:#10b981; font-weight:bold;">${item.isCompleted ? '✔ Concluido' : '● En Vía'}</span></td>
      <td>${item.timeIn || '—'}</td>
      <td>${item.timeOut || 'Pendiente'}</td>
      <td>
        ${!item.isCompleted ? `
          <button class="btn-table-action" onclick="focusPTSA('${item.via}')">Ver</button>
          <button class="btn-table-action btn-finish-action" onclick="concludeJobPTSA('${item.id}')">Concluir</button>
          <button class="btn-table-action danger" onclick="removeEntityPTSA('${item.id}')">Despejar</button>
        ` : `<span style="color:#64748b;">Archivado</span>`}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.focusPTSA = function(viaId) {
  const trk = PTSA_TRACK_ZONES.find(t => t.id === viaId);
  if (trk) {
    smoothGlideToPoint((trk.xStart + trk.xEnd) / 2, trk.y);
    playSound('coin');
  }
};

function updateCountersPTSA() {
  const cCount = ptsaState.crews.length;
  const vCount = ptsaState.vehicles.length;
  const compCount = ptsaState.completedJobs.length;
  
  const occupied = new Set();
  ptsaState.crews.forEach(c => occupied.add(c.via));
  ptsaState.vehicles.forEach(v => occupied.add(v.via));
  
  document.getElementById('counter-crews').textContent = cCount;
  document.getElementById('counter-vehicles').textContent = vCount;
  document.getElementById('counter-zones').textContent = occupied.size;
  
  document.getElementById('badge-tab-all').textContent = cCount + vCount;
  document.getElementById('badge-tab-crews').textContent = cCount;
  document.getElementById('badge-tab-vehicles').textContent = vCount;
  document.getElementById('badge-tab-completed').textContent = compCount;
}

// ------------------------------------------------------------------------------
// 13. CATENARIA Y PARTE DIARIO PTSA
// ------------------------------------------------------------------------------
function initCatenaryControlPTSA() {
  const btn = document.getElementById('btn-catenary-panel');
  if (btn) btn.addEventListener('click', () => {
    renderCatenaryGridPTSA();
    openModalPTSA('modal-catenary');
  });
  
  const btnAllOn = document.getElementById('btn-catenary-all-on');
  if (btnAllOn) btnAllOn.addEventListener('click', () => {
    ptsaState.catenary.deenergizedZones = [];
    playSound('1up');
    persistStatePTSA();
    renderAllPTSA();
    renderCatenaryGridPTSA();
    showToast('⚡ Catenaria PTSA 1500V DC restablecida en todo el patio.', 'success');
  });
  
  const btnAllOff = document.getElementById('btn-catenary-all-off');
  if (btnAllOff) btnAllOff.addEventListener('click', () => {
    ptsaState.catenary.deenergizedZones = ZONAS_CATENARIA_PTSA.map(z => z.id);
    playSound('hazard');
    persistStatePTSA();
    renderAllPTSA();
    renderCatenaryGridPTSA();
    showToast('⛔ Corte general de tensión 1500V aplicado en PTSA.', 'danger');
  });
}

function renderCatenaryGridPTSA() {
  const grid = document.getElementById('catenary-sector-grid');
  if (!grid) return;
  grid.innerHTML = '';
  
  ZONAS_CATENARIA_PTSA.forEach(z => {
    const isCut = ptsaState.catenary.deenergizedZones.includes(z.id);
    const card = document.createElement('div');
    card.className = `catenary-sector-card ${isCut ? 'deenergized' : ''}`;
    card.innerHTML = `
      <div class="sector-info">
        <span class="sector-title">${z.name}</span>
        <span class="sector-status" style="font-size:9.5px; color:#94a3b8;">${z.sub}</span>
        <span class="sector-status">${isCut ? '⛔ CORTE 0V' : '⚡ 1500V ENERGIZADO'}</span>
      </div>
      <button class="sector-toggle-btn ${isCut ? 'btn-restore' : 'btn-cut'}">
        ${isCut ? 'Restablecer' : 'Cortar 0V'}
      </button>
    `;
    card.querySelector('button').addEventListener('click', () => {
      const idx = ptsaState.catenary.deenergizedZones.indexOf(z.id);
      if (idx !== -1) ptsaState.catenary.deenergizedZones.splice(idx, 1);
      else ptsaState.catenary.deenergizedZones.push(z.id);
      playSound('coin');
      persistStatePTSA();
      renderAllPTSA();
      renderCatenaryGridPTSA();
    });
    grid.appendChild(card);
  });
}

function initDailySheetModalPTSA() {
  const btn = document.getElementById('btn-open-daily-sheet');
  const btnPrint = document.getElementById('btn-print-daily-sheet');
  
  if (btn) btn.addEventListener('click', () => {
    generateDailySheetPTSA();
    openModalPTSA('modal-daily-sheet');
  });
  if (btnPrint) btnPrint.addEventListener('click', () => { window.print(); });
}

function generateDailySheetPTSA() {
  const container = document.getElementById('printable-daily-sheet');
  if (!container) return;
  const now = new Date();
  
  let html = `
    <div class="official-sheet-header">
      <div class="official-logo-box">
        <div class="official-logo-badge" style="background:#059669;">PTSA</div>
        <div class="official-title-box">
          <h2>METRO DE LIMA LÍNEA 2 — PATIO TALLER SANTA ANITA (PTSA)</h2>
          <p>PARTE DIARIO OFICIAL DE CONTROL DE MANIOBRAS Y MANTENIMIENTO EN TALLERES</p>
        </div>
      </div>
      <div class="official-meta-box">
        <strong>PARTE DIARIO PTSA</strong><br>
        <span>EMISIÓN: ${now.toLocaleTimeString('es-PE')}</span>
      </div>
    </div>
    <table class="sheet-table" style="width:100%; margin-top:14px;">
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Responsable</th>
          <th>Vía / TK</th>
          <th>Disciplina</th>
          <th>Radio</th>
          <th>Personal</th>
          <th>Hora Ingreso</th>
          <th>Observaciones</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  if (ptsaState.crews.length === 0 && ptsaState.vehicles.length === 0) {
    html += `<tr><td colspan="8" style="text-align:center; padding:12px;">(Sin trabajos activos en Patio Taller al momento del corte)</td></tr>`;
  } else {
    ptsaState.crews.forEach(c => {
      html += `<tr><td>👷 Cuadrilla</td><td><strong>${c.responsible}</strong></td><td>${c.via}</td><td>${c.company}</td><td>${c.radio}</td><td>${c.count} pers.</td><td>${c.timeIn}</td><td>${c.notes}</td></tr>`;
    });
    ptsaState.vehicles.forEach(v => {
      html += `<tr><td>🚜 Vehículo</td><td><strong>${v.vehicleType}</strong></td><td>${v.via}</td><td>${v.company}</td><td>${v.radio}</td><td>—</td><td>${v.timeIn}</td><td>${v.notes}</td></tr>`;
    });
  }
  
  html += `
      </tbody>
    </table>
    <div class="sheet-signatures-box" style="margin-top:24px;">
      <div class="signature-card">
        <h4>CONFORMIDAD DEL OPERADOR PTSA (PCO)</h4>
        <div class="sig-field-line"><span>Firma:</span><div class="handwrite-line"></div></div>
      </div>
      <div class="signature-card">
        <h4>VISTO BUENO JEFE DE PATIO Y TALLERES</h4>
        <div class="sig-field-line"><span>Firma:</span><div class="handwrite-line"></div></div>
      </div>
    </div>
  `;
  container.innerHTML = html;
}

function initModalsPTSA() {
  document.querySelectorAll('[data-close]').forEach(b => {
    b.addEventListener('click', () => {
      const id = b.getAttribute('data-close');
      const m = document.getElementById(id);
      if (m) m.classList.remove('active');
    });
  });
}

function openModalPTSA(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('active');
}

// ------------------------------------------------------------------------------
// 14. PERSISTENCIA Y TRABAJOS SEMILLA POR DEFECTO EN PTSA
// ------------------------------------------------------------------------------
function persistStatePTSA() {
  try {
    const payload = {
      crews: ptsaState.crews,
      vehicles: ptsaState.vehicles,
      completedJobs: ptsaState.completedJobs,
      catenary: ptsaState.catenary,
      audioEnabled: ptsaState.audioEnabled
    };
    localStorage.setItem(ptsaState.STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error('Error al guardar estado PTSA:', e);
  }
}

function loadPersistedStatePTSA() {
  try {
    const raw = localStorage.getItem(ptsaState.STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data.crews)) ptsaState.crews = data.crews;
      if (Array.isArray(data.vehicles)) ptsaState.vehicles = data.vehicles;
      if (Array.isArray(data.completedJobs)) ptsaState.completedJobs = data.completedJobs;
      if (data.catenary) ptsaState.catenary = data.catenary;
    }
  } catch (e) {
    console.warn('Sin datos previos de PTSA');
  }
  
  // Trabajos semilla representativos en PTSA (Nave de Talleres y Maniobras)
  if (ptsaState.crews.length === 0 && ptsaState.vehicles.length === 0) {
    ptsaState.crews = [
      {
        id: "CRW-P1001",
        type: "crew",
        responsible: "Cuadrilla Torno Bogies #1",
        company: "Taller Material Rodante",
        count: 5,
        radio: "Ch-01 / Maniobras",
        via: "TK-18",
        zones: ["TK-18"],
        zoneLabel: "Vía TK-18 (Nave de Talleres)",
        xMin: 1850,
        xEnd: 2640,
        x: 2150,
        y: 750,
        speed: 10,
        dir: 1,
        isWorking: true,
        inSafeZone: false,
        timeIn: "14:15",
        notes: "Mantenimiento preventivo de rodadura en foso"
      },
      {
        id: "CRW-P1002",
        type: "crew",
        responsible: "Cuadrilla Catenaria PTSA #2",
        company: "Catenaria y Subestaciones",
        count: 4,
        radio: "Ch-01 / Tráfico",
        via: "TK-35-36",
        zones: ["TK-35-36"],
        zoneLabel: "Vías TK-35 / TK-36 (Cochera Exterior)",
        xMin: 1350,
        xEnd: 1510,
        x: 1430,
        y: 240,
        speed: 12,
        dir: 1,
        isWorking: true,
        inSafeZone: false,
        timeIn: "14:20",
        notes: "Inspección de seccionador +SECA y ménsulas"
      }
    ];
    
    ptsaState.vehicles = [
      {
        id: "VEH-P2001",
        type: "vehicle",
        vehicleType: "Dresina Maniobras D-P01",
        driver: "Operador Patio 1",
        leader: "Jefe de Maniobras PTSA",
        company: "Vía y Catenaria PTSA",
        radio: "Ch-01 / Maniobras",
        via: "T-05",
        zones: ["T-05"],
        zoneLabel: "Vía Inferior Sur T-05",
        xMin: 1500,
        xEnd: 2350,
        x: 1800,
        y: 845,
        speed: 16,
        dir: 1,
        timeIn: "14:05",
        notes: "Traslado de repuestos entre almacén y nave"
      }
    ];
    persistStatePTSA();
  }
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const t = document.createElement('div');
  t.className = 'toast';
  if (type === 'success') t.style.borderColor = '#10b981';
  if (type === 'warning') t.style.borderColor = '#f59e0b';
  if (type === 'danger') t.style.borderColor = '#ef4444';
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => {
    t.style.animation = 'toastOut 0.25s forwards';
    setTimeout(() => t.remove(), 250);
  }, 3200);
}
