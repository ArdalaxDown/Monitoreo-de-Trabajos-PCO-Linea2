/* Classic global script: mantiene el ámbito global compartido entre archivos. */


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