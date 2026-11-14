/**
 * ==============================================================================
 * IMPORTADOR DE TRABAJOS DEL SPCO (EXCEL → VERIFICACIÓN → VÍA)
 * Copiar desde Excel (con encabezados), procesar, verificar en tabla e importar.
 * Requiere simulator.js cargado antes (usa ZONAS_VIA, appState, renderAll, etc.)
 *
 * El tramo sale de COMENTARIOS DEL PCO (lo escribe el supervisor):
 *   "E20-E21 via 2"        → tramo E20–E21 solo en Vía 2
 *   "PV20 - E24"           → tramo PV20–E24 en ambas vías (no se dice la vía)
 *   "E21-E20"              → tramo E20–E21 en ambas vías
 *   "PTSA ..."             → solo se registra como texto (PTSA en desarrollo)
 *
 * Tipo de trabajo: detecta vehículos por el comentario del PCO o por la columna
 * USO DE VAF / TREN (VAF, dresina, Bivial, Lory, camión, etc.).
 * ==============================================================================
 */

// Posiciones (eje X) de los pozos y estaciones, iguales a los botones de navegación
const SPCO_PUNTOS = {
  PV19: { x: 160, label: 'PV19' },
  E20: { x: 480, label: 'E20 Evitamiento' },
  PV20: { x: 860, label: 'PV20' },
  E21: { x: 1260, label: 'E21 Óvalo Sta. Anita' },
  PV21: { x: 1640, label: 'PV21' },
  E22: { x: 1900, label: 'E22 Colectora Ind.' },
  PV22: { x: 2260, label: 'PV22' },
  E23: { x: 2520, label: 'E23 Hermilio Valdizán' },
  PV23: { x: 2720, label: 'PV23' },
  E24: { x: 3180, label: 'E24 Mercado Sta. Anita' },
  PV24: { x: 3450, label: 'PV24' }
};

const SPCO_ALIAS = {
  EVITAMIENTO: 'E20',
  OVALO: 'E21',
  COLECTORA: 'E22',
  HERMILIO: 'E23',
  MERCADO: 'E24',
  MSA: 'E24'
};

const SPCO_COLUMNAS = {
  empresa: 'EMPRESA CONTRATISTA',
  ot: 'ORDEN DE TRABAJO',
  responsable: 'RESPONSABLE DEL TRABAJO',
  comentario: 'COMENTARIOS DEL PCO',
  zona: 'ZONA ESPECIFICA',
  uso: 'USO DE VAF / TREN',
  radio: 'RADIO TETRA'
};

const SPCO_REGEX_VEHICULO = /\b(VAF|DRESINAS?|UNIMON|UNIMOG|BI[\s-]?VIAL|BIVIA|LOCOMOTOR(?:A|AS|ES)?|VEHICULOS?|CAMION(?:ES|ETA|ETAS)?|GRUAS?|TRACTORES?|EXCAVADORAS?|RETROEXCAVADORAS?|MONTACARGAS|PLATAFORMAS?|VAGONES?|VOLQUETES?|CISTERNAS?|LORRY|LORY)\b/;
const SPCO_REGEX_VEHICULO_USO = /\b(TREN|VAF|DRESINAS?|UNIMON|UNIMOG|BI[\s-]?VIAL|BIVIA|LOCOMOTOR(?:A|AS|ES)?|VEHICULOS?|CAMION(?:ES|ETA|ETAS)?|GRUAS?|TRACTORES?|EXCAVADORAS?|RETROEXCAVADORAS?|MONTACARGAS|PLATAFORMAS?|VAGONES?|VOLQUETES?|CISTERNAS?|LORRY|LORY)\b/;
const SPCO_RAMAL = {
  D1: { xMin: 2920, xMax: 3010, zone: 'Z-RAMAL-D1', label: 'Ramal D1 hacia PTSA' },
  D2: { xMin: 3340, xMax: 3440, zone: 'Z-RAMAL-D2', label: 'Ramal D2 hacia PTSA' }
};

let spcoFilas = [];

function spcoNorm(str) {
  return String(str || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toUpperCase().replace(/\s+/g, ' ').trim();
}

function spcoEsc(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function spcoParseTSV(text) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && i + 1 < text.length && text[i + 1] === '"') {
        currentField += '"';
        i++;
      } else { inQuotes = !inQuotes; }
    } else if (char === '\t' && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && i + 1 < text.length && text[i + 1] === '\n') i++;
      currentRow.push(currentField);
      currentField = '';
      if (currentRow.some(f => f.trim() !== '')) rows.push(currentRow);
      currentRow = [];
    } else { currentField += char; }
  }
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(f => f.trim() !== '')) rows.push(currentRow);
  }
  return rows;
}

function spcoBuscarColumna(headers, nombre) {
  const objetivo = spcoNorm(nombre);
  let idx = headers.findIndex(h => spcoNorm(h) === objetivo);
  if (idx === -1) idx = headers.findIndex(h => spcoNorm(h).indexOf(objetivo) !== -1);
  return idx;
}

// Busca pares de puntos tipo "E20-E21 via 2", "PV20 - E24", "ENTRE COLECTORA Y HERMILIO"
function spcoBuscarTramos(t) {
  const reTok = /\b(PV|E)\s*-?\s*(\d{2})\b|\b(EVITAMIENTO|OVALO|COLECTORA|HERMILIO|MERCADO|MSA)\b/g;
  const toks = [];
  let m;
  while ((m = reTok.exec(t)) !== null) {
    const code = m[3] ? SPCO_ALIAS[m[3]] : m[1] + m[2];
    if (toks.length && toks[toks.length - 1].code === code) continue;
    toks.push({ code, inicio: m.index, fin: m.index + m[0].length });
  }

  const tramos = [];
  const desconocidos = [];
  let i = 0;
  while (i < toks.length - 1) {
    const a = toks[i];
    const b = toks[i + 1];
    const conector = t.slice(a.fin, b.inicio);
    const unido = /^\s*(-|–|A|AL|HACIA|Y|ENTRE|DE)?\s*$/.test(conector) && conector.length <= 12;
    if (!unido) { i++; continue; }

    if (!SPCO_PUNTOS[a.code] || !SPCO_PUNTOS[b.code]) {
      desconocidos.push(!SPCO_PUNTOS[a.code] ? a.code : b.code);
      i += 2;
      continue;
    }
    if (a.code === b.code) { i++; continue; }

    const despues = t.slice(b.fin, b.fin + 18);
    const antes = t.slice(Math.max(0, a.inicio - 10), a.inicio);
    const vm = despues.match(/^\s*\(?\s*V(?:IA)?\s*([12])\b/) || antes.match(/V(?:IA)?\s*([12])\s*$/);
    tramos.push({ pa: a.code, pb: b.code, via: vm ? 'V' + vm[1] : null });
    i += 2;
  }
  return { tramos, desconocidos };
}

function spcoBuscarRamales(t) {
  const ramales = [];
  const re = /\bD\s*[- ]?\s*([12])\b/g;
  let m;
  while ((m = re.exec(t)) !== null) {
    const id = 'D' + m[1];
    if (!ramales.includes(id)) ramales.push(id);
  }
  return ramales;
}

function spcoInterpretarRamal(t, ramales = spcoBuscarRamales(t)) {
  if (!ramales.length) return null;
  const id = ramales[0];
  const ramal = SPCO_RAMAL[id];
  return {
    vias: [id],
    xMin: ramal.xMin,
    xMax: ramal.xMax,
    zones: [ramal.zone],
    label: ramal.label,
    total: ramales.length
  };
}

function spcoInterpretarZona(texto) {
  const t = spcoNorm(texto);
  if (!t) return { error: 'Sin tramo' };

  const ramales = spcoBuscarRamales(t);
  const ramal = spcoInterpretarRamal(t, ramales);
  const ramalExplicito =
    /^\s*D\s*[- ]?\s*[12]\b/.test(t) ||
    /\bRAMALES?\s*[-:]?\s*D\s*[- ]?\s*[12]\b/.test(t) ||
    /\b(?:EN|HACIA|ZONA|TRAMO|VIA)\s+D\s*[- ]?\s*[12]\b/.test(t);
  // Un ramal nombrado explícitamente es más preciso que referencias genéricas
  // a estaciones/pozos que puedan aparecer en el resto del comentario.
  if (ramal && ramalExplicito) return ramal;

  const { tramos, desconocidos } = spcoBuscarTramos(t);
  if (!tramos.length) {
    if (ramal) return ramal;
    return { error: desconocidos.length
      ? `Punto desconocido: ${desconocidos[0]}`
      : 'No encuentro un tramo en el comentario. Ej.: "E20-E21 via 2"' };
  }

  const primero = tramos[0];
  const vias = primero.via ? [primero.via] : ['V1', 'V2'];
  const xMin = Math.min(SPCO_PUNTOS[primero.pa].x, SPCO_PUNTOS[primero.pb].x);
  const xMax = Math.max(SPCO_PUNTOS[primero.pa].x, SPCO_PUNTOS[primero.pb].x);
  const zones = ZONAS_VIA
    .filter(z => !z.isRamal && z.xEnd > xMin && z.xStart < xMax)
    .map(z => z.id);

  return {
    vias,
    xMin,
    xMax,
    zones,
    label: `${SPCO_PUNTOS[primero.pa].label} ➔ ${SPCO_PUNTOS[primero.pb].label}`,
    total: tramos.length
  };
}

function spcoPersonas(textoComentario) {
  const m = String(textoComentario || '').match(/(\d+)\s*PERSONAS?/i);
  return m ? parseInt(m[1], 10) : null;
}

function spcoNombreVehiculo(comentario, uso) {
  const texto = `${spcoNorm(comentario)} ${spcoNorm(uso)}`;
  const nombres = [
    ['Camión Bivial', /\bBI[\s-]?VIAL\b|\bBIVIA\b/],
    ['Lory', /\bLOR{1,2}Y\b/],
    ['Dresina', /\bDRESINAS?\b/],
    ['Unimog', /\bUNIMOG\b/],
    ['Unimon', /\bUNIMON\b/],
    ['Locomotora', /\bLOCOMOTOR(?:A|AS|ES)?\b/],
    ['Camión grúa', /\bCAMION(?:ES)?\s+GRUAS?\b/],
    ['Camioneta', /\bCAMIONETAS?\b/],
    ['Camión', /\bCAMION(?:ES)?\b/],
    ['Grúa', /\bGRUAS?\b/],
    ['Retroexcavadora', /\bRETROEXCAVADORAS?\b/],
    ['Excavadora', /\bEXCAVADORAS?\b/],
    ['Tractor', /\bTRACTORES?\b/],
    ['Montacargas', /\bMONTACARGAS\b/],
    ['Plataforma', /\bPLATAFORMAS?\b/],
    ['Vagón', /\bVAGONES?\b/],
    ['Volquete', /\bVOLQUETES?\b/],
    ['Cisterna', /\bCISTERNAS?\b/],
    ['VAF', /\bVAF\b/]
  ];
  const encontrado = nombres.find(([, regex]) => regex.test(texto));
  return encontrado ? encontrado[0] : '';
}

function spcoConstruirFilas(parsed) {
  const headers = parsed[0];
  const idx = {};
  Object.keys(SPCO_COLUMNAS).forEach(k => { idx[k] = spcoBuscarColumna(headers, SPCO_COLUMNAS[k]); });

  const faltantes = ['comentario', 'ot', 'responsable', 'empresa'].filter(k => idx[k] === -1);
  if (faltantes.length) {
    return { error: 'Faltan columnas en los datos copiados: ' + faltantes.map(k => SPCO_COLUMNAS[k]).join(', ') + '. Copia también los encabezados.' };
  }

  const existentes = [...appState.crews, ...appState.vehicles];
  const otsVistas = new Set();
  const filas = [];
  const celda = (row, k) => (idx[k] === -1 || idx[k] >= row.length ? '' : row[idx[k]].trim());

  for (let i = 1; i < parsed.length; i++) {
    const row = parsed[i];
    const comentario = celda(row, 'comentario');
    const f = {
      n: filas.length + 1,
      empresa: celda(row, 'empresa'),
      ot: celda(row, 'ot'),
      responsable: celda(row, 'responsable'),
      zonaTexto: comentario,
      personas: spcoPersonas(comentario),
      usoRaw: celda(row, 'uso'),
      radio: celda(row, 'radio'),
      estado: 'ok',
      mensaje: '',
      incluir: true
    };
    if (!f.empresa && !f.ot && !comentario) continue;

    // Vehículo: revisar el comentario completo y la columna de uso indicada por SPCO.
    const textoUso = spcoNorm(celda(row, 'uso'));
    f.vehiculoLabel = spcoNombreVehiculo(comentario, textoUso);
    f.tipo = SPCO_REGEX_VEHICULO.test(spcoNorm(comentario)) || SPCO_REGEX_VEHICULO_USO.test(textoUso)
      ? 'vehiculo'
      : 'pie';

    // Permiso de trabajo: código SPV-... (de la columna ORDEN DE TRABAJO o de cualquier celda)
    const buscaPermiso = s => (String(s || '').toUpperCase().match(/SPV[-A-Z0-9]+/) || [])[0] || '';
    f.permiso = buscaPermiso(f.ot) || buscaPermiso(row.join(' '));

    const tCom = spcoNorm(comentario);
    const tZona = spcoNorm(celda(row, 'zona'));
    const textoPTSA = tCom || tZona;
    const enPTSA = /^(?:PTSA\b|PATIO TALLER\b)/.test(textoPTSA);

    let interpComentario = spcoInterpretarZona(tCom);
    const comentarioEnRamal = interpComentario.vias &&
      interpComentario.vias.some(via => via === 'D1' || via === 'D2');
    let interp = enPTSA && !comentarioEnRamal ? { ptsa: true } : interpComentario;
    if (!enPTSA && interp.error && tZona) {
      const alterna = spcoInterpretarZona(tZona);
      if (!alterna.error) interp = alterna;
    }

    const avisos = [];

    if (interp.error) {
      f.estado = 'error';
      f.mensaje = interp.error;
      f.incluir = false;
    } else if (interp.ptsa) {
      f.estado = 'ptsa';
      f.mensaje = 'PTSA en desarrollo: se registra solo como texto';
      f.incluir = false;
    } else {
      Object.assign(f, interp);
      if (interp.total > 1) {
        avisos.push(`Comentario con ${interp.total} tramos; se usa el primero`);
      }
      if (f.permiso && (otsVistas.has(f.permiso) || existentes.some(e => e.ot === f.permiso))) {
        avisos.push('Permiso ya cargado');
      }
      if (f.permiso) otsVistas.add(f.permiso);
      const traslapes = existentes.filter(e => f.vias.includes(e.via) && e.xMax > f.xMin && e.xMin < f.xMax);
      if (traslapes.length) {
        avisos.push('Se traslapa con ' + (traslapes[0].responsible || traslapes[0].vehicleType));
      }
      if (avisos.length) {
        f.estado = 'warn';
        f.mensaje = avisos.join('. ');
      } else {
        f.mensaje = f.vias.length > 1 ? 'Ambas vías (2 fichas)' : 'Vía única';
      }
    }
    filas.push(f);
  }

  if (!filas.length) return { error: 'No se encontraron trabajos. Revisa que los datos tengan encabezados y filas.' };
  return { filas };
}

function spcoAlert(tipo, msg) {
  const el = document.getElementById('spco-alert');
  el.textContent = msg;
  el.className = 'spco-alert spco-alert-' + tipo;
  el.hidden = false;
}

function spcoProcesar() {
  const input = document.getElementById('spco-input').value.trim();
  if (!input) {
    spcoFilas = [];
    spcoRender();
    spcoAlert('error', 'Pega los datos copiados desde Excel antes de procesar.');
    return;
  }
  const parsed = spcoParseTSV(input);
  if (parsed.length < 2) {
    spcoFilas = [];
    spcoRender();
    spcoAlert('error', 'No se encontraron datos. Copia los encabezados junto con las filas.');
    return;
  }
  const resultado = spcoConstruirFilas(parsed);
  if (resultado.error) {
    spcoFilas = [];
    spcoRender();
    spcoAlert('error', resultado.error);
    return;
  }
  spcoFilas = resultado.filas;
  spcoRender();
  spcoAlert('success', 'Revisa la tabla. Las filas marcadas se importarán al simulador.');
}

function spcoEstadoBadge(f) {
  const etiquetas = { ok: 'OK', warn: 'AVISO', error: 'ERROR', ptsa: 'PTSA' };
  return `<span class="spco-badge spco-badge-${f.estado}">${etiquetas[f.estado]}</span>`;
}

function spcoRender() {
  const wrap = document.getElementById('spco-table-wrap');
  const resumen = document.getElementById('spco-summary');
  const btnImport = document.getElementById('spco-import');

  if (!spcoFilas.length) {
    wrap.innerHTML = '';
    resumen.innerHTML = '';
    btnImport.disabled = true;
    return;
  }

  const cuenta = k => spcoFilas.filter(f => f.estado === k).length;
  const importables = spcoFilas.filter(f => f.incluir && (f.estado === 'ok' || f.estado === 'warn')).length;
  resumen.innerHTML =
    `<span class="spco-chip spco-chip-ok">${cuenta('ok')} OK</span>` +
    `<span class="spco-chip spco-chip-warn">${cuenta('warn')} con aviso</span>` +
    `<span class="spco-chip spco-chip-error">${cuenta('error')} con error</span>` +
    `<span class="spco-chip spco-chip-ptsa">${cuenta('ptsa')} PTSA (texto)</span>` +
    `<span class="spco-chip">${importables} para importar</span>`;

  let html = '<div class="spco-table-scroll"><table class="spco-table"><thead><tr>' +
    '<th>Importar</th><th>N°</th><th>Estado</th><th>Empresa</th><th>Permiso</th><th>Responsable</th>' +
    '<th>Comentario PCO</th><th>Tramo</th><th>Tipo</th><th>Personas</th><th>Radio</th><th>Detalle</th>' +
    '</tr></thead><tbody>';

  spcoFilas.forEach((f, i) => {
    const sinTramo = f.estado === 'error' || f.estado === 'ptsa';
    const bloqueada = sinTramo;
    const tramo = sinTramo ? '—' : `${f.label} · ${f.vias.length > 1 ? 'V1 + V2' : f.vias[0]}`;
    const tipo = sinTramo ? '—' : (f.tipo === 'vehiculo' ? '🚜 Vehículo' : '👷 A pie');
    html += `<tr class="spco-row-${f.estado}">` +
      `<td><input type="checkbox" data-spco-idx="${i}" ${f.incluir ? 'checked' : ''} ${bloqueada ? 'disabled' : ''}></td>` +
      `<td>${f.n}</td>` +
      `<td>${spcoEstadoBadge(f)}</td>` +
      `<td>${spcoEsc(f.empresa)}</td>` +
      `<td>${spcoEsc(f.permiso)}</td>` +
      `<td>${spcoEsc(f.responsable)}</td>` +
      `<td class="spco-celda-larga" title="${spcoEsc(f.zonaTexto)}">${spcoEsc(f.zonaTexto)}</td>` +
      `<td>${spcoEsc(tramo)}</td>` +
      `<td>${tipo}</td>` +
      `<td>${sinTramo || f.personas === null ? '—' : f.personas}</td>` +
      `<td>${spcoEsc(f.radio)}</td>` +
      `<td>${spcoEsc(f.mensaje)}</td>` +
      '</tr>';
  });

  html += '</tbody></table></div>';
  wrap.innerHTML = html;
  btnImport.disabled = importables === 0;
}

function spcoImportar() {
  const seleccionadas = spcoFilas.filter(f => f.incluir && (f.estado === 'ok' || f.estado === 'warn'));
  if (!seleccionadas.length) return;

  const hora = new Date().toLocaleTimeString('es-PE', { hour12: false, hour: '2-digit', minute: '2-digit' });
  const sello = Date.now().toString().slice(-6);
  let seq = 0;
  let creadas = 0;

  seleccionadas.forEach(f => {
    f.vias.forEach(via => {
      seq++;
      const base = {
        via,
        zones: f.zones,
        zoneLabel: f.label,
        xMin: f.xMin,
        xMax: f.xMax,
        x: (f.xMin + f.xMax) / 2,
        dir: 1,
        timeIn: hora,
        timeOut: '',
        ot: f.permiso || f.ot,
        notes: `Permiso ${f.permiso || f.ot || 's/n'} · ${f.zonaTexto.slice(0, 120)}`
      };

      if (f.tipo === 'vehiculo') {
        appState.vehicles.push({
          ...base,
          id: `VEH-SP${sello}${seq}`,
          type: 'vehicle',
          vehicleType: `${f.vehiculoLabel || 'VAF'} ${f.permiso || f.ot || seq}`,
          driver: f.responsable || 'Operador SPCO',
          leader: null,
          company: f.empresa || 'Sin empresa',
          radio: f.radio || 'Ch-01 / Tráfico',
          speed: 28
        });
        appState.historyLog.push({
          timestamp: new Date().toISOString(),
          action: 'IMPORTACION_SPCO',
          detail: `VAF ${f.permiso || f.ot} (${f.empresa}) importado en ${f.label} (${via}).`
        });
      } else {
        appState.crews.push({
          ...base,
          id: `CRW-SP${sello}${seq}`,
          type: 'crew',
          responsible: f.responsable || 'Cuadrilla SPCO',
          company: f.empresa || 'Sin empresa',
          count: f.personas,
          radio: f.radio || 'Ch-02',
          speed: 16,
          isWorking: false,
          inSafeZone: false,
          workTimer: 0,
          workCountdown: 6 + Math.random() * 4
        });
        appState.historyLog.push({
          timestamp: new Date().toISOString(),
          action: 'IMPORTACION_SPCO',
          detail: `Cuadrilla ${f.responsable} (Permiso ${f.permiso || f.ot}) importada en ${f.label} (${via}).`
        });
      }
      creadas++;
    });
  });

  spcoFilas.filter(f => f.estado === 'ptsa').forEach(f => {
    appState.historyLog.push({
      timestamp: new Date().toISOString(),
      action: 'SPCO_PTSA_TEXTO',
      detail: `PTSA (solo texto): Permiso ${f.permiso || f.ot} · ${f.responsable} · ${f.zonaTexto.slice(0, 120)}`
    });
  });

  persistState();
  renderAll();
  playSound('coin');
  showToast(`${creadas} ficha(s) importadas desde el SPCO.`, 'success');
  closeModal('modal-import-spco');
}

document.addEventListener('DOMContentLoaded', () => {
  const btnOpen = document.getElementById('btn-open-spco-import');
  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      playSound('click');
      openModal('modal-import-spco');
    });
  }

  const btnProcesar = document.getElementById('spco-process');
  if (btnProcesar) btnProcesar.addEventListener('click', spcoProcesar);

  const btnLimpiar = document.getElementById('spco-clear');
  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', () => {
      document.getElementById('spco-input').value = '';
      spcoFilas = [];
      document.getElementById('spco-alert').hidden = true;
      spcoRender();
    });
  }

  const btnImportar = document.getElementById('spco-import');
  if (btnImportar) btnImportar.addEventListener('click', spcoImportar);

  const wrap = document.getElementById('spco-table-wrap');
  if (wrap) {
    wrap.addEventListener('change', (e) => {
      const idx = e.target.getAttribute && e.target.getAttribute('data-spco-idx');
      if (idx === null || idx === undefined) return;
      spcoFilas[parseInt(idx, 10)].incluir = e.target.checked;
      spcoRender();
    });
  }
});
