/* Classic global script: mantiene el ámbito global compartido entre archivos. */


// ==============================================================================
// RESOLUCIÓN DE MODELOS VISUALES DIFERENCIADOS (CUADRILLAS Y VEHÍCULOS)
// ==============================================================================
const CREW_VISUAL_PROFILES = [
  { role: 'Bateador de vía', shortTask: 'BATEO', company: 'Mantenimiento de Vía', notes: 'Bateo manual y ajuste de fijaciones', toolClass: 'crew-tool-tamping', gait: 0.92, stepAngle: 20, bob: 1.0, workSeconds: 4.0, walkSeconds: 6.8 },
  { role: 'Inspector ATS', shortTask: 'ATS RADIO', company: 'Señalización y Telecomunicaciones', notes: 'Lectura de balizas y verificación de radio ATS', toolClass: 'crew-tool-radio', gait: 1.08, stepAngle: 24, bob: 1.1, workSeconds: 3.2, walkSeconds: 6.0 },
  { role: 'Soldador aluminotérmico', shortTask: 'SOLDAR', company: 'Soldadura de Rieles', notes: 'Preparación y soldadura aluminotérmica de juntas', toolClass: 'crew-tool-welding', gait: 0.86, stepAngle: 18, bob: 0.8, workSeconds: 4.8, walkSeconds: 7.5 },
  { role: 'Técnico ultrasónico', shortTask: 'ULTRA', company: 'Auscultación de Vía', notes: 'Detección ultrasónica de fisuras en riel', toolClass: 'crew-tool-ultrasonic', gait: 1.02, stepAngle: 22, bob: 0.9, workSeconds: 3.8, walkSeconds: 6.5 },
  { role: 'Liniero de catenaria', shortTask: 'CATENARIA', company: 'Vía y Catenaria', notes: 'Inspección mecánica de ménsulas e hilo de contacto', toolClass: 'crew-tool-catenary', gait: 0.78, stepAngle: 16, bob: 0.7, workSeconds: 4.2, walkSeconds: 7.2 },
  { role: 'Mecánico de cambiavías', shortTask: 'AGUJAS', company: 'Mantenimiento de Cambiavías', notes: 'Engrase y revisión mecánica de agujas sin conmutarlas', toolClass: 'crew-tool-switch', gait: 1.12, stepAngle: 25, bob: 1.0, workSeconds: 3.4, walkSeconds: 5.8 },
  { role: 'Topógrafo de vía', shortTask: 'GEOMETRÍA', company: 'Topografía y Geometría', notes: 'Medición de alineación y nivelación de vía', toolClass: 'crew-tool-survey', gait: 0.84, stepAngle: 17, bob: 0.8, workSeconds: 3.6, walkSeconds: 6.6 },
  { role: 'Técnico de fibra óptica', shortTask: 'FIBRA', company: 'Telecomunicaciones', notes: 'Diagnóstico de empalmes y comunicaciones de fibra', toolClass: 'crew-tool-fiber', gait: 0.98, stepAngle: 21, bob: 0.9, workSeconds: 4.5, walkSeconds: 7.0 },
  { role: 'Operador de tronzadora', shortTask: 'CORTE RIEL', company: 'Corte y Reperfilado', notes: 'Corte localizado y acabado de riel', toolClass: 'crew-tool-cutting', gait: 1.18, stepAngle: 27, bob: 1.2, workSeconds: 3.1, walkSeconds: 5.5 },
  { role: 'Guardavías', shortTask: 'GUARDAVÍAS', company: 'Seguridad Operacional', notes: 'Balizamiento y coordinación del equipo protegido', toolClass: 'crew-tool-flagman', gait: 0.90, stepAngle: 19, bob: 0.8, workSeconds: 2.8, walkSeconds: 6.2 }
];

const VEHICLE_VISUAL_PROFILES = [
  { role: 'Dresina de catenaria', shortLabel: 'CATENARIA', vehicleType: 'Dresina de Catenaria', company: 'Vía y Catenaria', notes: 'Inspección de ménsulas e hilo de contacto', speed: 24 },
  { role: 'Camión bivía tolva', shortLabel: 'TOLVA', vehicleType: 'Camión Bivía Tolva de Balasto', company: 'Mantenimiento de Vía', notes: 'Descarga controlada de balasto', speed: 20 },
  { role: 'Furgón de señalización', shortLabel: 'SEÑAL ATS', vehicleType: 'Furgón Técnico de Señalización ATS', company: 'Señalización y Telecomunicaciones', notes: 'Revisión de balizas y equipos de enclavamiento', speed: 22 },
  { role: 'Plataforma elevadora', shortLabel: 'PLATAFORMA', vehicleType: 'Plataforma Elevadora Bivía', company: 'Vía y Catenaria', notes: 'Acceso elevado para inspección de infraestructura', speed: 14 },
  { role: 'Cisterna de lavado', shortLabel: 'CISTERNA', vehicleType: 'Cisterna Bivía de Lavado', company: 'Servicios de Vía', notes: 'Lavado de túnel y limpieza de vía', speed: 18 },
  { role: 'Unidad de rescate', shortLabel: 'RESCATE', vehicleType: 'Unidad de Rescate y Encarrilamiento', company: 'Rescate Ferroviario', notes: 'Apoyo de rescate y encarrilamiento', speed: 16 },
  { role: 'Laboratorio de vía', shortLabel: 'LAB. VÍA', vehicleType: 'Laboratorio de Geometría de Vía', company: 'Auscultación de Vía', notes: 'Auscultación ultrasónica y geometría de riel', speed: 20 },
  { role: 'Pickup de inspección', shortLabel: 'PICKUP', vehicleType: 'Pickup Bivía de Inspección', company: 'Inspección de Vía', notes: 'Patrullaje e inspección rápida', speed: 30 },
  { role: 'Amoladora de rieles', shortLabel: 'AMOLADORA', vehicleType: 'Amoladora de Reperfilado de Riel', company: 'Reperfilado de Vía', notes: 'Reperfilado localizado con control de chispas', speed: 12 },
  { role: 'Camión grúa bivía', shortLabel: 'GRÚA', vehicleType: 'Camión Grúa Bivía', company: 'Mantenimiento Industrial', notes: 'Izaje de equipos y materiales con carga asegurada', speed: 12 }
];

function indiceVisualExplicito(entity) {
  if (!entity || entity.visualModelIndex === undefined || entity.visualModelIndex === null) return null;
  const index = Number(entity.visualModelIndex);
  return Number.isInteger(index) && index >= 0 && index < 10 ? index : null;
}

function inferirModeloCuadrilla(crew, fallback) {
  const texto = `${crew.company || ''} ${crew.notes || ''} ${crew.zoneLabel || ''}`.toLowerCase();
  if (/catenaria|hilo de contacto/.test(texto)) return 4;
  if (/fibra|óptica|optica/.test(texto)) return 7;
  if (/señal|telecom|baliza|eurobalise|ats/.test(texto)) return 1;
  if (/soldad|aluminotér|aluminoter/.test(texto)) return 2;
  if (/ultra|fisura|balasto y juntas|juntas de balasto/.test(texto)) return 3;
  if (/cambiav|aguja|tirante/.test(texto)) return 5;
  if (/topograf|geometr|alineación|alineacion|nivelación|nivelacion/.test(texto)) return 6;
  if (/tronz|reperfil|corte localizado/.test(texto)) return 8;
  if (/guardav|balizamiento|seguridad operacional/.test(texto)) return 9;
  if (/fijaciones|bateo/.test(texto)) return 0;
  const numeroCuadrilla = (crew.responsible || '').match(/#\s*(\d+)/);
  if (numeroCuadrilla && /inspección y conservación de vía|inspeccion y conservacion de via/i.test(crew.notes || '')) {
    const rolesMantenimiento = [0, 3, 5, 6, 8, 9, 1, 2, 4, 7];
    return rolesMantenimiento[(parseInt(numeroCuadrilla[1], 10) - 1) % rolesMantenimiento.length];
  }
  return fallback;
}

function inferirModeloVehiculo(veh, fallback) {
  const texto = `${veh.vehicleType || ''} ${veh.company || ''} ${veh.notes || ''}`.toLowerCase();
  const dresinaNumber = (veh.vehicleType || '').match(/^Dresina\s+D-(\d+)/i);
  if (dresinaNumber) {
    const legacyDresinaRoles = [0, 6, 0, 2, 1, 3, 4, 5, 8, 9];
    return legacyDresinaRoles[(parseInt(dresinaNumber[1], 10) - 1) % legacyDresinaRoles.length];
  }
  if (/ultra|auscult|fisura/.test(texto)) return 6;
  if (/geometr|inspección geom|inspeccion geom|pickup/.test(texto)) return 7;
  if (/catenaria|hilo de contacto/.test(texto)) return 0;
  if (/tolva|balasto/.test(texto)) return 1;
  if (/señal|telecom|enclav|baliza/.test(texto)) return 2;
  if (/plataforma|elevador/.test(texto)) return 3;
  if (/cisterna|lavado/.test(texto)) return 4;
  if (/rescate|encarril/.test(texto)) return 5;
  if (/amolad|reperfil/.test(texto)) return 8;
  if (/grúa|grua|camión grúa|camion grua|bivía pesado|bivia pesado|desvío|desvio/.test(texto)) return 9;
  return fallback;
}

function getCrewModel(crew) {
  if (!crew) return { id: 0, index: 0 };
  const num = parseInt((crew.id || '').replace(/\D/g, ''), 10) || 0;
  const explicit = indiceVisualExplicito(crew);
  const index = explicit ?? inferirModeloCuadrilla(crew, num % 10);
  if (explicit === null) crew.visualModelIndex = index;
  return { id: num, index, profile: CREW_VISUAL_PROFILES[index] };
}

function getVehicleModel(veh) {
  if (!veh) return { id: 0, index: 0 };
  const num = parseInt((veh.id || '').replace(/\D/g, ''), 10) || 0;
  const explicit = indiceVisualExplicito(veh);
  const index = explicit ?? inferirModeloVehiculo(veh, num % 10);
  if (explicit === null) veh.visualModelIndex = index;
  return { id: num, index, profile: VEHICLE_VISUAL_PROFILES[index] };
}

// Las variantes identifican trabajos y unidades sin alterar sus perfiles de tarea.
const spriteVariantsByIdentity = new Map();
const SPRITE_VARIANT_COUNT = 10;

function normalizarIdentidadVisual(valor) {
  return String(valor ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .trim().replace(/\s+/g, ' ').toUpperCase();
}

function identificarVaf(texto) {
  const comentario = normalizarIdentidadVisual(texto).split(/\bOBS\s*:/, 1)[0];
  const unidades = new Set();
  for (const match of comentario.matchAll(/\bVAF\s*(?:[-#]\s*)?(\d+)\b/g)) {
    const previo = comentario.slice(0, match.index);
    if (/\b(?:SIN|NO USA|NO UTILIZA|NO SE USA|NO SE UTILIZA)\s+$/.test(previo)) continue;
    unidades.add(match[1].replace(/^0+(?=\d)/, ''));
  }
  return unidades.size === 1 ? `VAF ${unidades.values().next().value}` : '';
}

function claveIdentidadVisual(entity) {
  if (entity.type === 'vehicle') {
    // Los rótulos SPCO antiguos podían contener un número de fila o permiso.
    const etiqueta = entity.unitCode ?? (
      entity.id?.startsWith('VEH-SP') ? entity.notes : entity.vehicleType
    );
    const unidad = identificarVaf(etiqueta);
    return unidad ? `vehicle|${unidad}` : '';
  }
  const permiso = normalizarIdentidadVisual(entity.ot);
  const responsable = normalizarIdentidadVisual(entity.responsible);
  if (!permiso || !responsable) return '';
  const cuadrilla = normalizarIdentidadVisual(entity.crewName);
  const empresa = normalizarIdentidadVisual(entity.company);
  return `crew|${JSON.stringify([permiso, responsable, cuadrilla, empresa])}`;
}

function indiceVarianteSprite(valor) {
  return Number.isInteger(valor) && valor >= 0 && valor < SPRITE_VARIANT_COUNT ? valor : null;
}

function asignarVariantesSprite(entities, getModel, type) {
  const asignadas = new Set();
  const reservadas = new Set();
  for (const [key, index] of spriteVariantsByIdentity) {
    if (key.startsWith(type + '|')) reservadas.add(index);
  }
  const pendientes = [];
  for (const entity of entities) {
    const key = claveIdentidadVisual(entity);
    const guardada = spriteVariantsByIdentity.get(key);
    if (guardada === undefined) {
      pendientes.push({ entity, key });
    } else {
      entity.spriteVariantIndex = guardada;
      asignadas.add(guardada);
    }
  }
  for (const { entity, key } of pendientes) {
    const preferida = indiceVarianteSprite(entity.spriteVariantIndex) ?? getModel(entity).index;
    const paleta = Array.from({ length: SPRITE_VARIANT_COUNT }, (_, offset) =>
      (preferida + offset) % SPRITE_VARIANT_COUNT);
    const index = spriteVariantsByIdentity.get(key)
      ?? paleta.find(i => !asignadas.has(i) && !reservadas.has(i))
      ?? paleta.find(i => !asignadas.has(i))
      ?? preferida;
    entity.spriteVariantIndex = index;
    asignadas.add(index);
    if (key) spriteVariantsByIdentity.set(key, index);
  }
}

function actualizarVariantesSprite() {
  asignarVariantesSprite(appState.crews, getCrewModel, 'crew');
  asignarVariantesSprite(appState.vehicles, getVehicleModel, 'vehicle');
}

function cargarVariantesSprite(data) {
  spriteVariantsByIdentity.clear();
  if (!Array.isArray(data)) return;
  for (const item of data) {
    if (!Array.isArray(item)) continue;
    const [key, index] = item;
    if (typeof key === 'string' && /^(crew|vehicle)\|/.test(key) && indiceVarianteSprite(index) !== null) {
      spriteVariantsByIdentity.set(key, index);
    }
  }
}

function nextVisualModelIndex(entities, resolver) {
  const list = Array.isArray(entities) ? entities : [];
  const used = new Set(list.map(entity => resolver(entity).index));
  const start = list.length % 10;
  for (let offset = 0; offset < 10; offset++) {
    const candidate = (start + offset) % 10;
    if (!used.has(candidate)) return candidate;
  }
  return start;
}

function nextCrewVisualModelIndex(crews) {
  return nextVisualModelIndex(crews, getCrewModel);
}

function nextVehicleVisualModelIndex(vehicles) {
  return nextVisualModelIndex(vehicles, getVehicleModel);
}

function getCrewVisualProfile(index) {
  return CREW_VISUAL_PROFILES[Math.abs(Number(index) || 0) % 10];
}

function getVehicleVisualProfile(index) {
  return VEHICLE_VISUAL_PROFILES[Math.abs(Number(index) || 0) % 10];
}

// ==============================================================================
// CATÁLOGO DE 10 MODELOS DISTINTOS DE PERSONAS A PIE (SILUETAS Y EQUIPOS ÚNICOS)
// ==============================================================================
function renderCrewVisualModel(crew, modelIndex) {
  const mIdx = Math.abs(modelIndex % 10);
  const isWorking = !!crew.isWorking;
  const workToolClass = getCrewVisualProfile(mIdx).toolClass;
  
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
          <g class="crew-tamper-tool ${workToolClass} ${isWorking ? 'is-working' : ''}" style="display:${isWorking ? 'block' : 'none'};">
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
          <g class="crew-tamper-tool ${workToolClass} ${isWorking ? 'is-working' : ''}" style="display:${isWorking ? 'block' : 'none'};">
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
          <g class="crew-tamper-tool ${workToolClass} ${isWorking ? 'is-working' : ''}" style="display:${isWorking ? 'block' : 'none'};">
            <line x1="-2" y1="0" x2="8" y2="6" stroke="#94a3b8" stroke-width="2.2" stroke-linecap="round" />
            <polygon points="8,6 13,7 9,10" fill="#38bdf8" />
            <circle cx="10" cy="8" r="1.3" fill="#ffffff" class="crew-work-sparks weld-spark-cascade" />
            <circle cx="13" cy="5" r="1.3" fill="#fbbf24" class="crew-work-sparks weld-spark-cascade" />
            <circle cx="12" cy="11" r="1.2" fill="#ef4444" class="crew-work-sparks weld-spark-cascade" />
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
          <g class="crew-tamper-tool ${workToolClass} ${isWorking ? 'is-working' : ''}" style="display:${isWorking ? 'block' : 'none'};">
            <rect x="-1" y="2" width="16" height="5" rx="1" fill="#334155" stroke="#64748b" stroke-width="1.2" />
            <circle cx="2" cy="7" r="2.5" fill="#0f172a" stroke="#cbd5e1" stroke-width="1" />
            <circle cx="12" cy="7" r="2.5" fill="#0f172a" stroke="#cbd5e1" stroke-width="1" />
            <rect x="6" y="-5" width="7" height="7" rx="1" fill="#0f172a" stroke="#22c55e" stroke-width="1" />
            <line x1="7" y1="-1.5" x2="12" y2="-1.5" stroke="#22c55e" stroke-width="1.2" />
            <polygon points="3,6 6,6 7,15 2,15" fill="#22c55e" opacity="0.45" class="ultrasonic-radar-beam" />
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
          <g class="crew-tamper-tool ${workToolClass} ${isWorking ? 'is-working' : ''}" style="display:${isWorking ? 'block' : 'none'};">
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
          <g class="crew-tamper-tool ${workToolClass} ${isWorking ? 'is-working' : ''}" style="display:${isWorking ? 'block' : 'none'};">
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
          <g class="crew-tamper-tool ${workToolClass} ${isWorking ? 'is-working' : ''}" style="display:${isWorking ? 'block' : 'none'};">
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
          <g class="crew-tamper-tool ${workToolClass} ${isWorking ? 'is-working' : ''}" style="display:${isWorking ? 'block' : 'none'};">
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
          <g class="crew-tamper-tool ${workToolClass} ${isWorking ? 'is-working' : ''}" style="display:${isWorking ? 'block' : 'none'};">
            <rect x="-2" y="-3" width="9" height="7" rx="1.5" fill="#1e293b" stroke="#475569" stroke-width="1.2" />
            <circle cx="8" cy="5" r="6" fill="#1e293b" stroke="#94a3b8" stroke-width="1.2" />
            <circle cx="8" cy="5" r="1.8" fill="#e2e8f0" />
            <path d="M 4,-2 A 6,6 0 0 1 12,1" stroke="#facc15" stroke-width="1.6" fill="none" />
            <circle cx="4" cy="6" r="1.3" fill="#ffffff" class="crew-work-sparks saw-spark-spray" />
            <circle cx="1" cy="9" r="1.4" fill="#f59e0b" class="crew-work-sparks saw-spark-spray" />
            <circle cx="-1" cy="12" r="1.2" fill="#ef4444" class="crew-work-sparks saw-spark-spray" />
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
          <g class="crew-tamper-tool ${workToolClass} ${isWorking ? 'is-working' : ''}" style="display:${isWorking ? 'block' : 'none'};">
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


// ==============================================================================
// PILOTO BLENDER → SPRITES 2D (M0/V0) + perfiles visuales de trabajo VP.
// Cada disciplina escoge un modelo/equipo. M0/V0 usan atlas Blender; M1–M9
// conservan sus modelos SVG especializados.
// ==============================================================================
window.SPRITE_PILOT = {
  schema: 'ats-vp-sprite-pilot/v1',
  enabled: false,
  manifest: null,
  atlases: {},
  basePath: 'assets/sprites/vp/pilot/',
  prefReduced: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

function cargarManifiestoSprite(basePath) {
  if (window.location.protocol !== 'file:') {
    return fetch(basePath + 'manifest.json?v=20261124_02').then(response => {
      if (!response.ok) throw new Error('Manifest ' + response.status);
      return response.json();
    });
  }

  // Un script clásico local puede cargar los metadatos sin hacer fetch desde file://.
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = basePath + 'manifest.js?v=20261124_02';
    script.onload = () => resolve(window.ATS_LOCAL_SPRITE_MANIFEST);
    script.onerror = () => reject(new Error('Manifest local'));
    document.head.appendChild(script);
  });
}

function initSpritePilot() {
  const pilot = window.SPRITE_PILOT;
  cargarManifiestoSprite(pilot.basePath)
    .then(manifest => {
      if (!manifest || manifest.schema !== pilot.schema) throw new Error('schema mismatch');
      const assets = { ...(manifest.assets || {}) };
      Object.entries(manifest.variants || {}).forEach(([family, files]) => {
        const base = assets[`${family}0`];
        if (!base || !Array.isArray(files)) return;
        const template = { ...base };
        delete template.bytes;
        files.forEach((file, variantIndex) => {
          assets[`${family}${variantIndex}`] = {
            ...template,
            file,
            variantIndex,
            variantCount: files.length
          };
        });
      });
      if (usaArteActualizadoSprite()) {
        const previewAssets = manifest.preview?.assets || {};
        for (const asset of Object.values(assets)) {
          Object.assign(asset, previewAssets[asset.file]);
        }
      }
      pilot.manifest = { ...manifest, assets };
      const baseKeys = ['crew_m0', 'vehicle_v0'].filter(key => assets[key]);
      if (baseKeys.length === 0) { pilot.enabled = false; return; }
      pilot.basePending = baseKeys.length;
      baseKeys.forEach(key => requestSpritePilotAtlas(key, true));
    })
    .catch(() => { pilot.enabled = false; });
}

function requestSpritePilotAtlas(atlasKey, isBase = false) {
  const pilot = window.SPRITE_PILOT;
  const asset = pilot && pilot.manifest && pilot.manifest.assets[atlasKey];
  if (!asset) return false;
  const existing = pilot.atlases[atlasKey];
  if (existing) return !!existing.loaded;

  const record = { img: null, loaded: false, loading: true, asset, isBase, baseCounted: false };
  pilot.atlases[atlasKey] = record;
  const img = new Image();
  record.img = img;
  const finishBaseRequest = () => {
    if (!record.isBase || record.baseCounted) return;
    record.baseCounted = true;
    pilot.basePending = Math.max(0, (pilot.basePending || 0) - 1);
  };
  img.onload = () => {
    record.loaded = true;
    record.loading = false;
    finishBaseRequest();
    finalizeSpritePilot();
  };
  img.onerror = () => {
    record.error = true;
    record.loading = false;
    finishBaseRequest();
    finalizeSpritePilot();
  };
  img.src = pilot.basePath + asset.file;
  return false;
}

function finalizeSpritePilot() {
  const pilot = window.SPRITE_PILOT;
  const baseReady = pilot.basePending === 0;
  pilot.enabled = baseReady && Object.values(pilot.atlases).some(a => a.loaded);
  if (pilot.enabled && typeof renderAll === 'function') {
    try { renderAll(); } catch (e) { /* fallback sigue funcionando */ }
  }
}

function spritePilotAtlasLoaded(atlasKey) {
  const pilot = window.SPRITE_PILOT;
  return !!(pilot && pilot.enabled && pilot.manifest && pilot.atlases[atlasKey] && pilot.atlases[atlasKey].loaded);
}

function usaArteActualizadoSprite() {
  return new URLSearchParams(window.location.search).get('spritePilotPreview') !== '0';
}

function crewSpriteAtlasKey(crew) {
  if (!crew || !window.SPRITE_PILOT || !window.SPRITE_PILOT.enabled) return null;
  const variantKey = `crew_m${indiceVarianteSprite(crew.spriteVariantIndex) ?? getCrewModel(crew).index}`;
  if (spritePilotAtlasLoaded(variantKey)) return variantKey;
  if (window.SPRITE_PILOT.manifest.assets[variantKey]) requestSpritePilotAtlas(variantKey);
  return spritePilotAtlasLoaded('crew_m0') ? 'crew_m0' : null;
}

function vehicleSpriteAtlasKey(veh) {
  if (!veh || !window.SPRITE_PILOT || !window.SPRITE_PILOT.enabled) return null;
  const variantKey = `vehicle_v${indiceVarianteSprite(veh.spriteVariantIndex) ?? getVehicleModel(veh).index}`;
  if (spritePilotAtlasLoaded(variantKey)) return variantKey;
  if (window.SPRITE_PILOT.manifest.assets[variantKey]) requestSpritePilotAtlas(variantKey);
  return spritePilotAtlasLoaded('vehicle_v0') ? 'vehicle_v0' : null;
}

function shouldUseCrewSpritePilot(crew) {
  return !!crewSpriteAtlasKey(crew);
}

function shouldUseVehicleSpritePilot(veh) {
  return !!vehicleSpriteAtlasKey(veh);
}

function renderCrewSpritePilot(crew) {
  const atlasKey = crewSpriteAtlasKey(crew);
  if (!atlasKey) return null;
  const pilot = window.SPRITE_PILOT;
  const asset = pilot.manifest.assets[atlasKey];
  // Dimensiones en unidades del mapa, manteniendo relación de aspecto 1:1 de la celda.
  const displayW = 48;
  const displayH = 48;
  const groundY = 15;
  const displayX = -(asset.anchor_px.x * displayW / asset.cell.width);
  const displayY = groundY - (asset.anchor_px.y * displayH / asset.cell.height);
  const totalW = asset.cell.width * asset.grid.columns;
  const totalH = asset.cell.height * asset.grid.rows;
  return `
    <svg class="crew-sprite-svg sprite-pilot sprite-pilot-${getCrewModel(crew).index}" x="${displayX.toFixed(2)}" y="${displayY.toFixed(2)}" width="${displayW}" height="${displayH}" viewBox="0 0 ${asset.cell.width} ${asset.cell.height}" preserveAspectRatio="xMidYMid meet" style="pointer-events:none;">
      <image href="${pilot.basePath}${asset.file}" width="${totalW}" height="${totalH}" />
    </svg>
    ${renderCrewSparkOverlay(crew)}`;
}

function renderCrewSparkOverlay(crew) {
  if (!shouldUseCrewSpritePilot(crew)) return '';
  // Overlay de chispas fuera del fallback para que sigan visibles con el sprite activo.
  // Comparte clase .crew-work-sparks con el fallback, por lo que nodosSparksDeCrew y
  // apagarSparksDeCrew siguen funcionando sin duplicar animación ni nodos por frame.
  return `
    <g class="crew-sparks-overlay" style="display:none; pointer-events:none;">
      <circle cx="2" cy="16" r="1.4" fill="#fef08a" class="crew-work-sparks" />
      <circle cx="10" cy="16" r="1.4" fill="#fef08a" class="crew-work-sparks" />
    </g>`;
}

function renderCrewRoleAccessory(crew, modelIndex) {
  const atlasKey = crewSpriteAtlasKey(crew);
  if (window.SPRITE_PILOT.atlases[atlasKey]?.asset.bakedAccessories) return '';
  const index = Math.abs(modelIndex % 10);
  if (index === 0) return '';
  const profile = getCrewVisualProfile(index);
  let accessory = '';
  switch (index) {
    case 1: // Radio/teléfono ATS
      accessory = `
        <rect x="8" y="-13" width="5.5" height="9" rx="1.1" fill="#0f172a" stroke="#38bdf8" stroke-width="1.1" />
        <rect x="9" y="-11" width="3.5" height="2.6" rx="0.4" fill="#22d3ee" />
        <line x1="10.5" y1="-13" x2="13.5" y2="-17" stroke="#cbd5e1" stroke-width="0.8" />
        <circle cx="10.8" cy="-5.5" r="0.65" fill="#22c55e" />`;
      break;
    case 2: // Soplete y baño de soldadura
      accessory = `
        <line x1="7" y1="0" x2="15" y2="-5" stroke="#475569" stroke-width="2.2" stroke-linecap="round" />
        <rect x="12.5" y="-7" width="4" height="3" rx="0.6" fill="#ea580c" stroke="#fbbf24" stroke-width="0.6" />
        <circle cx="18" cy="-7" r="1.1" fill="#fef08a" class="crew-work-sparks weld-spark-cascade" />
        <circle cx="20" cy="-5" r="0.8" fill="#38bdf8" class="crew-work-sparks weld-spark-cascade" />
        <circle cx="18" cy="-3" r="0.9" fill="#f97316" class="crew-work-sparks weld-spark-cascade" />`;
      break;
    case 3: // Unidad ultrasónica con sonda
      accessory = `
        <rect x="8" y="-10" width="9" height="7" rx="1.2" fill="#064e3b" stroke="#4ade80" stroke-width="0.9" />
        <rect x="10" y="-8.5" width="4.5" height="2.4" rx="0.4" fill="#a7f3d0" />
        <line x1="15" y1="-4" x2="19" y2="1" stroke="#cbd5e1" stroke-width="1.3" />
        <polygon points="18,0 24,3 18,6" fill="#22c55e" opacity="0.32" class="ultrasonic-radar-beam" />`;
      break;
    case 4: // Pértiga de inspección mecánica de catenaria
      accessory = `
        <line x1="8" y1="2" x2="15" y2="-20" stroke="#eab308" stroke-width="2.2" stroke-linecap="round" />
        <line x1="13.5" y1="-19.5" x2="18" y2="-19.5" stroke="#cbd5e1" stroke-width="1.7" stroke-linecap="round" />
        <rect x="11.5" y="-22.5" width="4.5" height="3" rx="0.6" fill="#1e293b" stroke="#38bdf8" stroke-width="0.7" />`;
      break;
    case 5: // Llave de aguja
      accessory = `
        <path d="M 7,0 L 16,-8 L 18,-6 L 10,3 L 15,8 L 13,10 Z" fill="#94a3b8" stroke="#334155" stroke-width="0.8" />
        <circle cx="17" cy="-7" r="2.1" fill="none" stroke="#facc15" stroke-width="1" />`;
      break;
    case 6: // Prisma de topografía montado sobre trípode
      accessory = `
        <line x1="-19" y1="2" x2="-24" y2="14" stroke="#64748b" stroke-width="1" />
        <line x1="-19" y1="2" x2="-14" y2="14" stroke="#64748b" stroke-width="1" />
        <line x1="-19" y1="2" x2="-19" y2="14" stroke="#94a3b8" stroke-width="1" />
        <rect x="-24" y="-4" width="10" height="7" rx="1" fill="#166534" stroke="#86efac" stroke-width="0.9" />
        <circle cx="-19" cy="-0.5" r="1.8" fill="#38bdf8" />
        <line x1="-16" y1="-0.5" x2="-4" y2="2" stroke="#ef4444" stroke-width="0.8" class="surveyor-laser-beam" />`;
      break;
    case 7: // Carrete de fibra óptica
      accessory = `
        <circle cx="-13" cy="-8" r="5.1" fill="#0f172a" stroke="#38bdf8" stroke-width="1.1" />
        <circle cx="-13" cy="-8" r="2.8" fill="none" stroke="#67e8f9" stroke-width="1" />
        <path d="M -9,-5 C -3,-2 0,-6 6,-1" fill="none" stroke="#22d3ee" stroke-width="1.2" />`;
      break;
    case 8: // Tronzadora portátil de riel
      accessory = `
        <rect x="6" y="-2" width="7" height="6" rx="1.2" fill="#1e293b" stroke="#f97316" stroke-width="0.9" />
        <circle cx="15" cy="4" r="4.3" fill="#334155" stroke="#cbd5e1" stroke-width="1.1" />
        <circle cx="15" cy="4" r="1.2" fill="#facc15" />
        <circle cx="19" cy="3" r="0.9" fill="#fef08a" class="crew-work-sparks saw-spark-spray" />
        <circle cx="20" cy="6" r="0.8" fill="#f97316" class="crew-work-sparks saw-spark-spray" />`;
      break;
    case 9: // Señalero de zona protegida, bandera amarilla fija
      accessory = `
        <line x1="-13" y1="2" x2="-13" y2="-15" stroke="#475569" stroke-width="1.3" />
        <path d="M -12.5,-15 L -4,-12 L -12.5,-9 Z" fill="#facc15" stroke="#a16207" stroke-width="0.7" />
        <rect x="8" y="-11" width="5" height="8" rx="1" fill="#0f172a" stroke="#facc15" stroke-width="0.8" />
        <circle cx="10.5" cy="-7" r="1.2" fill="#fde68a" />`;
      break;
  }
  const workClass = crew.isWorking ? 'is-working' : '';
  return `<g class="crew-role-accessory crew-tamper-tool ${profile.toolClass} ${workClass}" style="display:block;pointer-events:none;">${accessory}</g>`;
}

function renderVehicleSpritePilot(veh) {
  const atlasKey = vehicleSpriteAtlasKey(veh);
  if (!atlasKey) return null;
  const pilot = window.SPRITE_PILOT;
  const asset = pilot.manifest.assets[atlasKey];
  // Relación de aspecto 256:160 = 1.6 preservada; dimensiones en unidades de mapa.
  const displayW = 96;
  const displayH = 60;
  const groundY = 16;
  const displayX = -(asset.anchor_px.x * displayW / asset.cell.width);
  const displayY = groundY - (asset.anchor_px.y * displayH / asset.cell.height);
  const totalW = asset.cell.width * asset.grid.columns;
  const totalH = asset.cell.height * asset.grid.rows;
  return `
    <svg class="veh-sprite-svg sprite-pilot sprite-pilot-${getVehicleModel(veh).index}" x="${displayX.toFixed(2)}" y="${displayY.toFixed(2)}" width="${displayW}" height="${displayH}" viewBox="0 0 ${asset.cell.width} ${asset.cell.height}" preserveAspectRatio="xMidYMid meet" style="pointer-events:none;">
      <image href="${pilot.basePath}${asset.file}" width="${totalW}" height="${totalH}" />
    </svg>`;
}

function renderVehicleRoleAccessory(veh, modelIndex) {
  const atlasKey = vehicleSpriteAtlasKey(veh);
  if (window.SPRITE_PILOT.atlases[atlasKey]?.asset.bakedAccessories) return '';
  const index = Math.abs(modelIndex % 10);
  if (index === 0) return '';
  let accessory = '';
  switch (index) {
    case 1: // Tolva de balasto
      accessory = `
        <path d="M -38,-9 L -5,-9 L -1,-2 L -38,-2 Z" fill="#475569" stroke="#cbd5e1" stroke-width="0.8" />
        <path d="M -35,-10 Q -28,-20 -21,-11 Q -14,-22 -6,-10 Z" fill="#94a3b8" stroke="#64748b" stroke-width="0.7" />`;
      break;
    case 2: // Rack de radioseñalización
      accessory = `
        <rect x="-30" y="-25" width="22" height="10" rx="1.3" fill="#0f172a" stroke="#38bdf8" stroke-width="1" />
        <rect x="-27" y="-22" width="7" height="4" rx="0.5" fill="#164e63" stroke="#67e8f9" stroke-width="0.6" />
        <line x1="-12" y1="-24" x2="-12" y2="-34" stroke="#94a3b8" stroke-width="1" />
        <circle cx="-12" cy="-35" r="1.2" fill="#22d3ee" />`;
      break;
    case 3: // Elevador de cesta compacto sobre la plataforma
      accessory = `
        <g class="veh-scissor-lift-group">
          <line x1="-31" y1="-7" x2="-22" y2="-25" stroke="#cbd5e1" stroke-width="1.8" />
          <line x1="-22" y1="-7" x2="-31" y2="-25" stroke="#cbd5e1" stroke-width="1.8" />
          <line x1="-31" y1="-25" x2="-22" y2="-36" stroke="#cbd5e1" stroke-width="1.6" />
          <line x1="-22" y1="-25" x2="-31" y2="-36" stroke="#cbd5e1" stroke-width="1.6" />
          <rect x="-36" y="-40" width="20" height="4" rx="1" fill="#22a447" stroke="#bbf7d0" stroke-width="0.8" />
          <line x1="-35" y1="-42" x2="-17" y2="-42" stroke="#facc15" stroke-width="1" />
        </g>`;
      break;
    case 4: // Cisterna de lavado
      accessory = `
        <rect x="-34" y="-24" width="28" height="13" rx="6.5" fill="url(#metal-chrome)" stroke="#64748b" stroke-width="0.9" />
        <line x1="-27" y1="-23" x2="-27" y2="-12" stroke="#334155" stroke-width="1.2" />
        <line x1="-13" y1="-23" x2="-13" y2="-12" stroke="#334155" stroke-width="1.2" />
        <path d="M -5,-10 L 1,-6 L 6,-10 M 0,-6 L 5,-2 L 10,-6" fill="none" stroke="#38bdf8" stroke-width="1.4" class="veh-wash-spray" />`;
      break;
    case 5: // Equipo de rescate/encarrilamiento
      accessory = `
        <rect x="-34" y="-24" width="20" height="10" rx="1.3" fill="#dc2626" stroke="#fca5a5" stroke-width="0.8" />
        <rect x="-30" y="-26" width="8" height="2.5" rx="0.6" fill="#ef4444" class="veh-rescue-strobe-red" />
        <rect x="-20" y="-26" width="8" height="2.5" rx="0.6" fill="#3b82f6" class="veh-rescue-strobe-blue" />
        <circle cx="-5" cy="-8" r="3" fill="#64748b" stroke="#cbd5e1" stroke-width="0.8" />`;
      break;
    case 6: // Sensor óptico y perfilómetro
      accessory = `
        <rect x="-17" y="-25" width="16" height="8" rx="1.2" fill="#0f172a" stroke="#22c55e" stroke-width="1" />
        <circle cx="-9" cy="-21" r="2" fill="#67e8f9" />
        <rect x="-8" y="10" width="16" height="3" rx="0.8" fill="#0f172a" stroke="#22c55e" stroke-width="0.8" />
        <path d="M -6,13 L 6,13 L 10,20 L -10,20 Z" fill="#22c55e" opacity="0.32" class="ultrasonic-radar-beam" />`;
      break;
    case 7: // Pickup de inspección con jaula de carga
      accessory = `
        <path d="M -36,-9 L -8,-9 L -8,-1 L -36,-1 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="0.8" />
        <path d="M -35,-10 L -35,-23 L -9,-23 L -9,-10 M -34,-20 L -10,-20 M -28,-23 L -28,-10 M -17,-23 L -17,-10" fill="none" stroke="#475569" stroke-width="1.3" />
        <circle cx="-22" cy="-13" r="3.7" fill="#1e293b" stroke="#facc15" stroke-width="0.9" />`;
      break;
    case 8: // Cabezal amolador y faldón de chispas
      accessory = `
        <rect x="-29" y="1" width="28" height="4" rx="1" fill="#78350f" stroke="#f97316" stroke-width="0.8" />
        <circle cx="-18" cy="3" r="5" fill="#1e293b" stroke="#cbd5e1" stroke-width="1" />
        <circle cx="-18" cy="3" r="1.5" fill="#facc15" />
        <circle cx="-25" cy="8" r="1.1" fill="#fef08a" class="crew-work-sparks" />
        <circle cx="-11" cy="9" r="1" fill="#f97316" class="crew-work-sparks" />`;
      break;
    case 9: // Grúa hidráulica compacta
      accessory = `
        <g class="veh-role-crane">
          <rect x="-25" y="-13" width="5" height="14" rx="1" fill="#ea580c" stroke="#facc15" stroke-width="0.8" />
          <line x1="-22" y1="-12" x2="-34" y2="-28" stroke="#ea580c" stroke-width="2.7" stroke-linecap="round" />
          <line x1="-34" y1="-28" x2="-43" y2="-25" stroke="#facc15" stroke-width="2" stroke-linecap="round" />
          <line x1="-43" y1="-25" x2="-43" y2="-17" stroke="#cbd5e1" stroke-width="1" />
          <path d="M -45,-17 L -43,-15 L -41,-17" fill="none" stroke="#cbd5e1" stroke-width="1.2" />
        </g>`;
      break;
  }
  return `<g class="veh-role-accessory veh-role-${index}" style="pointer-events:none;">${accessory}</g>`;
}

function spritePilotStateForCrew(crew) {
  if (crew.inSafeZone) return 'safe';
  if (crew.isWorking) return 'work';
  return 'walk';
}

function spritePilotStateForVehicle(veh) {
  const enMarcha = Math.abs(veh.speed ?? 26) > 0.01;
  return enMarcha ? 'drive' : 'idle';
}

function spritePilotFrameCellRect(atlasKey, frameIndex) {
  const asset = window.SPRITE_PILOT.manifest.assets[atlasKey];
  const col = frameIndex % asset.grid.columns;
  const row = Math.floor(frameIndex / asset.grid.columns);
  return {
    x: col * asset.cell.width,
    y: row * asset.cell.height,
    w: asset.cell.width,
    h: asset.cell.height
  };
}

function spritePilotSetFrame(el, atlasKey, frameIndex) {
  const svg = el.querySelector('.crew-sprite-svg') || el.querySelector('.veh-sprite-svg');
  if (!svg) return;
  const rect = spritePilotFrameCellRect(atlasKey, frameIndex);
  const vb = `${rect.x} ${rect.y} ${rect.w} ${rect.h}`;
  if (svg.getAttribute('viewBox') !== vb) svg.setAttribute('viewBox', vb);
}

function advanceSpritePilotFrame(entity, atlasKey, state, dt, isFollower) {
  const pilot = window.SPRITE_PILOT;
  if (!pilot || !pilot.enabled || !pilot.manifest) return null;
  const asset = pilot.manifest.assets[atlasKey];
  if (!asset) return null;
  const stateDef = asset.states[state];
  if (!stateDef || !stateDef.frames || !stateDef.frames.length) return null;

  if (isFollower) {
    return { frame: entity._spriteFrame, state };
  }

  const fps = stateDef.fps || 12;
  const frameCount = stateDef.frames.length;

  if (entity._spriteState !== state) {
    entity._spriteState = state;
    if (stateDef.loop === false) entity._spritePhase = 0;
  }

  if (pilot.prefReduced) {
    const frame = stateDef.frames[0];
    entity._spriteFrame = frame;
    entity._spritePhase = 0;
    return { frame, state };
  }

  if (entity._spritePhase === undefined) entity._spritePhase = 0;
  entity._spritePhase += dt * fps;

  let rawIndex;
  if (stateDef.loop === false) {
    rawIndex = Math.min(Math.floor(entity._spritePhase), frameCount - 1);
  } else {
    rawIndex = Math.floor(entity._spritePhase) % frameCount;
  }
  const frame = stateDef.frames[rawIndex];
  entity._spriteFrame = frame;
  return { frame, state };
}

initSpritePilot();
