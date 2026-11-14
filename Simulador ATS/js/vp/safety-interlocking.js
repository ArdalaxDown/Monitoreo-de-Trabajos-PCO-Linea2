/* Classic global script: mantiene el ámbito global compartido entre archivos. */


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
}function grupoPermisoKey(c) {
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
