/* Classic global script: mantiene el ámbito global compartido entre archivos. */


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
    appState.dragCandidateZoneId = null;
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

  function resolveDragTarget(svgPoint) {
    const insideRailArea = svgPoint.x >= 40 && svgPoint.x <= 3520 && svgPoint.y >= 10 && svgPoint.y <= 480;
    let targetVia = svgPoint.y >= 275 ? 'V1' : 'V2';
    if (!insideRailArea) return { insideRailArea, targetVia, hitZone: null };

    if (svgPoint.x >= 2890 && svgPoint.x <= 3040 && svgPoint.y <= 235) {
      const expectedYD1 = 220 - (svgPoint.x - 2920) * (198.0 / 90.0);
      if (Math.abs(svgPoint.y - expectedYD1) < 16) {
        return { insideRailArea, targetVia: 'D1', hitZone: ZONAS_VIA.find(z => z.id === 'Z-RAMAL-D1') };
      }
    }

    if (svgPoint.x >= 3320 && svgPoint.x <= 3460 && svgPoint.y <= 235) {
      const expectedYD2 = 220 - (3440 - svgPoint.x) * (198.0 / 100.0);
      if (Math.abs(svgPoint.y - expectedYD2) < 16) {
        return { insideRailArea, targetVia: 'D2', hitZone: ZONAS_VIA.find(z => z.id === 'Z-RAMAL-D2') };
      }
    }

    const hitZone = ZONAS_VIA.filter(z => !z.isRamal).find(z => svgPoint.x >= z.xStart && svgPoint.x <= z.xEnd);
    return { insideRailArea, targetVia, hitZone };
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
      const resolved = resolveDragTarget(svgPoint);
      const { hitZone, insideRailArea, targetVia } = resolved;
      appState.hoveredVia = targetVia;
      if (hitZone && insideRailArea) {
        appState.dragCandidateZoneId = null;
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
        renderDragSelectionSpan(targetVia, Array.from(appState.draggedZonesSet));
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
    const resolved = resolveDragTarget(svgPoint);
    const { hitZone, insideRailArea, targetVia } = resolved;
    
    appState.hoveredVia = targetVia;
    
    if (ghostViaBadge && !appState.isCurrentHoverForbidden) {
      let viaLabel = targetVia === 'V1' ? 'VÍA 1 ► (HACIA ATE)' : (targetVia === 'V2' ? 'VÍA 2 ◄ (HACIA CALLAO)' : `RAMAL ${targetVia} ◄► PTSA`);
      const hint = appState.draggedZonesSet.size > 0 
        ? `(${appState.draggedZonesSet.size} tramos marcados)` 
        : `(Clic der: colocar tramos)`;
      ghostViaBadge.textContent = `${viaLabel} ${hint}`;
      ghostViaBadge.className = `ghost-via-badge via-${targetVia.toLowerCase()}`;
    }
    
    if (hitZone && insideRailArea) {
      const isRightClick = (buttons & 2) === 2 || appState.isPaintingWithRightClick;
      
      // EL ARRASTRE DE VÍA ES ESTRICTAMENTE CON CLIC DERECHO:
      // Si el operador solo mueve el mouse (con zoom o paneo), NO se agregan tramos al Set.
      // Los tramos solo se van agregando cuando el operador aprieta o mantiene el clic derecho.
      if (isRightClick) {
        appState.dragCandidateZoneId = null;
        appState.hasPaintedMultiZones = true;
        if (!appState.draggedZonesSet.has(hitZone.id)) {
          appState.draggedZonesSet.add(hitZone.id);
          playSound('waka');
        }
      } else if (appState.draggedZonesSet.size === 0) {
        appState.dragCandidateZoneId = hitZone.id;
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
      
      const previewZones = appState.draggedZonesSet.size > 0
        ? Array.from(appState.draggedZonesSet)
        : [hitZone.id];
      renderDragSelectionSpan(targetVia, previewZones);
    } else {
      clearForbidden();
      if (appState.draggedZonesSet.size === 0) {
        appState.dragCandidateZoneId = null;
        clearDragSelectionSpan();
      } else {
        renderDragSelectionSpan(targetVia, Array.from(appState.draggedZonesSet));
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
    if (!appState.isDraggingPegman) return;

    let selectedZonesList = Array.from(appState.draggedZonesSet);
    const dropTarget = selectedZonesList.length === 0
      ? resolveDragTarget(getSvgPoint(clientX, clientY))
      : null;
    const via = dropTarget?.targetVia || appState.hoveredVia || 'V2';

    if (appState.viaRequerida && via !== appState.viaRequerida) {
      playSound('forbidden');
      showToast(`Primero coloca la ${appState.viaRequerida === 'V1' ? 'Vía 1' : 'Vía 2'}. Después se pedirá la otra.`, 'warning');
      return;
    }
    ghost.style.display = 'none';

    if (dropTarget) {
      if (dropTarget.hitZone && dropTarget.insideRailArea) {
        selectedZonesList = [dropTarget.hitZone.id];
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
      const visualModelIndex = nextCrewVisualModelIndex(appState.crews);
      const workProfile = getCrewVisualProfile(visualModelIndex);
      const newCrew = {
        id: `CRW-${Date.now().toString().slice(-4)}`,
        type: 'crew',
        visualModelIndex,
        taskLabel: workProfile.shortTask,
        responsible: `Cuadrilla #${crewCount}`,
        company: workProfile.company,
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
        workTimer: workProfile.workSeconds,
        workCountdown: workProfile.walkSeconds,
        timeIn: curTime,
        timeOut: '',
        notes: workProfile.notes
      };
      
      appState.crews.push(newCrew);
      appState.historyLog.push({
        timestamp: new Date().toISOString(),
        action: 'INGRESO_CUADRILLA',
        detail: `Cuadrilla ${newCrew.responsible} autorizada en ${newCrew.zoneLabel} (${via}).`
      });
      
      showToast(`👷 ${newCrew.responsible}: ${workProfile.role}. Haz clic o edita para ajustar la tarea o poner en Zona Segura.`, 'success');
      
    } else if (appState.draggedType === 'vehicle') {
      const vehCount = appState.vehicles.length + 1;
      const visualModelIndex = nextVehicleVisualModelIndex(appState.vehicles);
      const vehicleProfile = getVehicleVisualProfile(visualModelIndex);
      const unitCode = `D-${String(vehCount).padStart(2, '0')}`;
      const newVehicle = {
        id: `VEH-${Date.now().toString().slice(-4)}`,
        type: 'vehicle',
        visualModelIndex,
        shortLabel: `${vehicleProfile.shortLabel} ${unitCode}`,
        vehicleType: `${vehicleProfile.vehicleType} ${unitCode}`,
        driver: `Operador ${vehCount}`,
        leader: `Resp. Maniobra`,
        company: vehicleProfile.company,
        radio: `Ch-01 / Tráfico`,
        via: via,
        zones: sortedZones.map(z => z.id),
        zoneLabel: sortedZones.length > 1 ? `${sortedZones[0].name} ➔ ${sortedZones[sortedZones.length - 1].name}` : sortedZones[0].name,
        xMin: xMin,
        xMax: xMax,
        x: centerX,
        speed: vehicleProfile.speed,
        dir: 1,
        timeIn: curTime,
        timeOut: '',
        notes: vehicleProfile.notes
      };
      
      appState.vehicles.push(newVehicle);
      appState.historyLog.push({
        timestamp: new Date().toISOString(),
        action: 'INGRESO_VEHICULO',
        detail: `Vehículo ${newVehicle.vehicleType} en maniobra sobre ${newVehicle.zoneLabel} (${via}).`
      });
      
      showToast(`🚜 ${vehicleProfile.role} ${unitCode} en vía. Toca para editar o concluir.`, 'success');
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
      appState.dragCandidateZoneId = null;
      appState.hasPaintedMultiZones = false;
      
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
  seleccionarTrabajoVP(token.id);
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
  appState.dragCandidateZoneId = null;
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
