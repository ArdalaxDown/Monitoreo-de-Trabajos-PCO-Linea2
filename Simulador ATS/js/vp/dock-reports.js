/* Classic global script: mantiene el ámbito global compartido entre archivos. */


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

