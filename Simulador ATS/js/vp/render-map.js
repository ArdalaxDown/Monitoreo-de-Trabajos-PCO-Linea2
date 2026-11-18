/* Classic global script: mantiene el ámbito global compartido entre archivos. */


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
    const target = e.target instanceof Element ? e.target : null;
    if (appState.isDraggingPegman || target?.closest('.crew-token, .vehicle-token')) {
      appState.isPanning = false;
      appState.startPan = null;
      return;
    }
    if (target?.closest('.modal-overlay, .action-btn')) return;
    if (e.button === 0) {
      appState.isPanning = true;
      appState.startPan = { x: e.clientX, y: e.clientY };
    }
  });
  
  window.addEventListener('mousemove', (e) => {
    if (!appState.isPanning || appState.isDraggingPegman) return;
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

    const crewModelIdx = getCrewModel(crew).index;
    const crewSpriteHtml = renderCrewSpritePilot(crew);

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
      <g class="crew-visual crew-model-${crewModelIdx} ${crewSpriteHtml ? 'sprite-pilot-active' : ''}" transform="translate(0, -15) scale(1.55) translate(0, 15)" style="pointer-events:none;">
        <g class="crew-svg-fallback" style="pointer-events:none;">
          ${renderCrewVisualModel(crew, crewModelIdx)}
        </g>
        ${crewSpriteHtml || ''}
        ${crewSpriteHtml ? renderCrewRoleAccessory(crew, crewModelIdx) : ''}
      </g>

      <!-- Globo de Emote Retro / Acción Especial de Videojuego -->
      <g class="crew-retro-bubble" id="retro-bubble-${crew.id}" style="display:none; pointer-events:none;" transform="translate(0, -82)">
        <path d="M -26,-22 L 26,-22 Q 30,-22 30,-18 L 30,6 Q 30,10 26,10 L 4,10 L 0,16 L -4,10 L -26,10 Q -30,10 -30,6 L -30,-18 Q -30,-22 -26,-22 Z" fill="#090d16" stroke="#f59e0b" stroke-width="1.8" />
        <g class="bubble-content-slot" id="bubble-slot-${crew.id}"></g>
      </g>

      <!-- Cartela con Datos y Estado -->
      <rect x="-72" y="-58" width="144" height="18" rx="4" fill="#070d17" fill-opacity="0.94" stroke="${crew.inSafeZone ? "#10b981" : "#f59e0b"}" stroke-width="1.4" style="pointer-events:none;" />
      ${colorGrupoPermiso(crew) ? `<rect x="-72" y="-58" width="6" height="18" rx="2" fill="${colorGrupoPermiso(crew)}" style="pointer-events:none;" />` : ''}
      <text class="crew-status-label" x="0" y="-45" fill="#ffffff" font-size="9" font-weight="bold" font-family="monospace" text-anchor="middle" style="pointer-events:none;">
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
          appState.isPanning = false;
          appState.startPan = null;
          document.body.classList.add('is-dragging-token');
           appState.draggedType = 'crew';
           appState.hoveredVia = crew.via;
           appState.draggedZonesSet.clear();
           appState.dragCandidateZoneId = null;
           appState.hasPaintedMultiZones = false;
          
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

    const vehicleModel = getVehicleModel(veh);
    const vehModelIdx = vehicleModel.index;
    const unitCode = (veh.vehicleType.match(/D-\d+/i) || [])[0] || '';
    const vehLabel = veh.shortLabel || `${vehicleModel.profile.shortLabel} ${unitCode}`.trim();
    const vehSpriteHtml = renderVehicleSpritePilot(veh);
    const vehLabelOffset = vehSpriteHtml ? -22 : 0;

    g.innerHTML = `
      <rect class="token-hitbox" x="-56" y="-40" width="120" height="60" fill="transparent" style="pointer-events:all; cursor:pointer;" />
      <!-- Sombra de contacto ferroviaria (Grounded Track Shadow) -->
      <ellipse cx="0" cy="16" rx="52" ry="4.5" fill="rgba(0, 0, 0, 0.65)" style="pointer-events:none;" />
      
      <!-- Resplandor sutil de vía -->
      <rect x="-54" y="-20" width="108" height="38" rx="6" fill="rgba(56, 189, 248, 0.08)" stroke="rgba(56, 189, 248, 0.25)" stroke-width="0.8" style="pointer-events:none;" />
      
      <!-- Haz luminoso direccional hacia adelante con gradiente suave -->
      <polygon class="headlight-beam" points="48,-2 135,-20 135,14" fill="url(#headlight-beam-east)" opacity="0.75" style="pointer-events:none;" />
      
      <!-- Carroceria y Morfologia de Vehículo Auxiliar (10 Modelos Distintos de Dresina) -->
      <g class="veh-visual veh-model-${vehModelIdx} veh-chug-vibe ${vehSpriteHtml ? 'sprite-pilot-active' : ''}" style="pointer-events:none;">
        <g class="veh-svg-fallback" style="pointer-events:none;">
          ${renderVehicleVisualModel(veh, vehModelIdx)}
        </g>
        ${vehSpriteHtml || ''}
        ${vehSpriteHtml ? renderVehicleRoleAccessory(veh, vehModelIdx) : ''}
      </g>
      
      <!-- Cartela informativa de vehiculo -->
      <rect x="-70" y="${-36 + vehLabelOffset}" width="140" height="17" rx="3.5" fill="#0a121e" stroke="#38bdf8" stroke-width="1.3" style="pointer-events:none;" />
      <text class="veh-status-label" x="0" y="${-24 + vehLabelOffset}" fill="#38bdf8" font-size="9" font-weight="bold" font-family="monospace" text-anchor="middle" style="pointer-events:none;">
        🚜 ${vehLabel.slice(0, 16)}
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
          appState.isPanning = false;
          appState.startPan = null;
          document.body.classList.add('is-dragging-token');
           appState.draggedType = 'vehicle';
           appState.hoveredVia = veh.via;
           appState.draggedZonesSet.clear();
           appState.dragCandidateZoneId = null;
           appState.hasPaintedMultiZones = false;
          
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
      const pointerMode = appState.catenary.interactiveMode ? 'stroke' : 'none';
      document.querySelectorAll('#catenary-layer .catenary-plasma-stream, #catenary-layer .catenary-cut-line').forEach(line => {
        line.style.pointerEvents = pointerMode;
        line.style.cursor = appState.catenary.interactiveMode ? 'pointer' : 'default';
      });
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
       lineCut.style.pointerEvents = appState.catenary.interactiveMode ? 'stroke' : 'none';
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
         pathD1.style.pointerEvents = appState.catenary.interactiveMode ? 'stroke' : 'none';
        pathD1.setAttribute('title', `D1 hacia PTSA [0V CORTE]. Clic para alternar.`);
        pathD1.addEventListener('click', clickHandler);
        gZone.appendChild(pathD1);
      }
      if (zone.hasD2) {
        const pathD2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
         pathD2.setAttribute('d', 'M 3440,216 L 3340,18');
         pathD2.setAttribute('class', 'catenary-cut-line');
         pathD2.style.cursor = appState.catenary.interactiveMode ? 'pointer' : 'default';
         pathD2.style.pointerEvents = appState.catenary.interactiveMode ? 'stroke' : 'none';
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
       plasma.style.pointerEvents = appState.catenary.interactiveMode ? 'stroke' : 'none';
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
        const d1Plasma = d1Group.querySelector('.catenary-plasma-stream');
        d1Plasma.style.pointerEvents = appState.catenary.interactiveMode ? 'stroke' : 'none';
        d1Plasma.addEventListener('click', clickHandler);
        gZone.appendChild(d1Group);
      }

      if (zone.hasD2) {
        const d2Group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        d2Group.innerHTML = `
          <path d="M 3440,216 L 3340,18" class="catenary-corona-arc" />
          <path d="M 3440,216 L 3340,18" class="catenary-plasma-stream" style="cursor:${appState.catenary.interactiveMode ? 'pointer' : 'default'};" />
          <path d="M 3440,216 L 3340,18" class="catenary-lightning-core" />
         `;
        const d2Plasma = d2Group.querySelector('.catenary-plasma-stream');
        d2Plasma.style.pointerEvents = appState.catenary.interactiveMode ? 'stroke' : 'none';
        d2Plasma.addEventListener('click', clickHandler);
        gZone.appendChild(d2Group);
      }
    }
    
    layer.appendChild(gZone);
  });
}
