/* Classic global script: mantiene el ámbito global compartido entre archivos. */


// ------------------------------------------------------------------------------
// 13. MOTOR DE ANIMACIÓN Y GESTOS DE VIDEOJUEGO (DESACOPLADO A 60 FPS)
// ------------------------------------------------------------------------------
let lastAnimTimestamp = performance.now();

// Factor de amplitud global: con prefers-reduced-motion se atenúa el movimiento
// decorativo (bob, piernas, chug) en lugar de congelar al personal sobre la vía.
const AMP_MOVIMIENTO = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.3 : 1;
const CREW_VISUAL_SCALE = 1.55;

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

function aplicarSpriteCrewSiActivo(crew, el) {
  if (!el) return;
  const atlasKey = crewSpriteAtlasKey(crew);
  if (!atlasKey) return;
  if (crew._spriteFrame === undefined) return;
  spritePilotSetFrame(el, atlasKey, crew._spriteFrame);
}

function aplicarSpriteVehSiActivo(veh, el) {
  if (!el) return;
  const atlasKey = vehicleSpriteAtlasKey(veh);
  if (!atlasKey) return;
  if (veh._spriteFrame === undefined) return;
  spritePilotSetFrame(el, atlasKey, veh._spriteFrame);
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
      const crewVisual = getCrewModel(crew);
      const crewProfile = crewVisual.profile || getCrewVisualProfile(crewVisual.index);
      const minX = (crew.xMin || 100) + 25;
      const maxX = (crew.xMax || 300) - 25;
      const liderGrupo = crew.seguidorDe ? appState.crews.find(c => c.id === crew.seguidorDe) : null;
      if (liderGrupo) copiarEstadoSeguidor(crew, liderGrupo);

      const spriteStateCrew = spritePilotStateForCrew(crew);
      const crewAtlasKey = crewSpriteAtlasKey(crew);
      if (crewAtlasKey) {
        if (liderGrupo) {
          crew._spriteState = liderGrupo._spriteState;
          crew._spritePhase = liderGrupo._spritePhase;
          crew._spriteFrame = liderGrupo._spriteFrame;
        }
        advanceSpritePilotFrame(crew, crewAtlasKey, spriteStateCrew, dt, !!liderGrupo);
      }

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
            el.querySelectorAll(".crew-svg-fallback .crew-tamper-tool").forEach(tamper => {
              tamper.style.display = "none";
              tamper.classList.remove("is-working");
            });
            const roleAccessory = el.querySelector(".crew-role-accessory");
            if (roleAccessory) {
              roleAccessory.style.display = "none";
              roleAccessory.classList.remove("is-working");
            }
            const patrol = el.querySelector(".crew-patrol-tool");
            if (patrol) patrol.style.display = "none";
            const sparksOverlay = el.querySelector(".crew-sparks-overlay");
            if (sparksOverlay) sparksOverlay.style.display = "none";
          }
          const visual = el.querySelector(".crew-visual");
          const safeVisualTransform = `translate(0, -15) scale(${CREW_VISUAL_SCALE}) translate(0, 15)`;
          if (visual && visual.getAttribute("transform") !== safeVisualTransform) {
            visual.setAttribute("transform", safeVisualTransform);
          }
          aplicarSpriteCrewSiActivo(crew, el);
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
          crew.workCountdown = crewProfile.walkSeconds + Math.random() * 1.5;
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
          crew.workTimer = crewProfile.workSeconds;
        } else if (crew.x <= curMinX) {
          crew.x = curMinX;
          crew.dir = 1;
          crew.isWorking = true;
          crew.workTimer = crewProfile.workSeconds;
        } else if (crew.workCountdown <= 0) {
          crew.isWorking = true;
          crew.workTimer = crewProfile.workSeconds;
          crew.workCountdown = crewProfile.walkSeconds + Math.random() * 1.5;
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
        crew.walkPhase += dt * ((Math.abs(crew.speed) || 15) / 14) * Math.PI * 2 * crewProfile.gait;
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
        const bobWalk = -Math.cos(crew.walkPhase * 2) * crewProfile.bob * swing * AMP_MOVIMIENTO;
        const bobWork = Math.sin(timestamp / (185 + crewVisual.index * 13)) * (0.7 + crewProfile.bob * 0.25) * (1 - swing) * AMP_MOVIMIENTO;
        el.setAttribute("transform", `translate(${crew.x.toFixed(1)}, ${(yBase + bobWalk + bobWork).toFixed(1)}) scale(${semanticScale.toFixed(3)})`);
        
        // Squash & stretch de videojuego para dar peso y juego al personaje
        // (el caminar se liga a walkPhase: estira al alzar el cuerpo, comprime al apoyar)
        const visual = el.querySelector(".crew-visual");
        if (visual) {
          const squashY = 1 + Math.sin(timestamp / (105 + crewVisual.index * 11)) * 0.035 * (1 - swing)
                        - Math.cos(crew.walkPhase * 2) * 0.035 * swing;
          const squashX = (crew.dir || 1) * (1 / squashY);
          const sx = squashX * CREW_VISUAL_SCALE;
          const sy = squashY * CREW_VISUAL_SCALE;
          visual.setAttribute("transform", `translate(0, -15) scale(${sx.toFixed(3)}, ${sy.toFixed(3)}) translate(0, 15)`);
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
          
          const trabajandoAhora = modoHerramientas === "work";
          el.querySelectorAll(".crew-svg-fallback .crew-tamper-tool").forEach(tamper => {
            tamper.style.display = trabajandoAhora ? "block" : "none";
            tamper.classList.toggle("is-working", trabajandoAhora);
          });
          const roleAccessory = el.querySelector(".crew-role-accessory");
          if (roleAccessory) {
            roleAccessory.style.display = "block";
            roleAccessory.classList.toggle("is-working", trabajandoAhora);
          }
          
          const patrol = el.querySelector(".crew-patrol-tool");
          if (patrol) patrol.style.display = modoHerramientas === "walk" ? "block" : "none";
          
          const thumbs = el.querySelector(".crew-safe-thumbsup");
          if (thumbs) thumbs.style.display = "none";

          const sparksOverlay = el.querySelector(".crew-sparks-overlay");
          if (sparksOverlay) sparksOverlay.style.display = modoHerramientas === "work" ? "block" : "none";
        }

        // Kinemática procedimental: walk-cycle ligado a walkPhase y amortiguado por
        // swing -> los pies se asientan sin salto al empezar a trabajar; quietas en faena.
        const legL = el.querySelector(".crew-leg-left");
        const legR = el.querySelector(".crew-leg-right");
        if (legL && legR && (swing > 0.001 || crew._legsActive)) {
          crew._legsActive = swing > 0.001;
          const legAngle = Math.sin(crew.walkPhase) * crewProfile.stepAngle * (crew.dir || 1) * swing * AMP_MOVIMIENTO;
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
          const textoLabel = crew.isWorking
            ? `👷 ${crew.responsible} [Trabajando]`
            : `👷 ${crew.responsible} (${crew.count || '?'}p)`;
          if (label.textContent !== textoLabel) label.textContent = textoLabel;
        }

        aplicarSpriteCrewSiActivo(crew, el);
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

      const spriteStateVeh = spritePilotStateForVehicle(veh);
      const vehicleAtlasKey = vehicleSpriteAtlasKey(veh);
      if (vehicleAtlasKey) {
        advanceSpritePilotFrame(veh, vehicleAtlasKey, spriteStateVeh, dt, false);
      }

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

        // Ruedas: giro 100% por JS (attribute transform, wheelDeg según distancia);
        // el CSS ya no anima .veh-wheel-spoke. No se escribe nada con blend <= 0.02,
        // de modo que al detenerse el vehículo las ruedas quedan congeladas en su
        // último ángulo (solo se escriben cuando cambia el grado efectivo).
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

        aplicarSpriteVehSiActivo(veh, el);
      }
    });
    
    requestAnimationFrame(tick);
  }
  
  requestAnimationFrame(tick);
}
