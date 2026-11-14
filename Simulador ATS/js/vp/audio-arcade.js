/* Classic global script: mantiene el ámbito global compartido entre archivos. */
function getAudioContext() {
  if (!appState.audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      appState.audioCtx = new AudioContext();
    }
  }
  if (appState.audioCtx && appState.audioCtx.state === 'suspended') {
    appState.audioCtx.resume();
  }
  return appState.audioCtx;
}

// ------------------------------------------------------------------------------
// 3. SINTETIZADOR DE AUDIO RETRO DE VIDEOJUEGOS FAMOSOS (WEB AUDIO API)
// Variado, dinámico y no monótono: Zelda, Pokémon, Dragon Ball Z, Pac-Man, Mario
// ------------------------------------------------------------------------------
let soundCycleCounter = 0;

function playSound(type) {
  if (!appState.audioEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    soundCycleCounter++;
    
    // ========================================================================
    // A. COLOCACIÓN / ASIGNACIÓN EXITOSA (ROTACIÓN ENTRE POKÉBALL, DRAGON BALL Y MARIO)
    // ========================================================================
    if (type === 'coin' || type === 'drop' || type === 'place') {
      const variant = soundCycleCounter % 3;
      
      if (variant === 0) {
        // POKÉMON: Captura con Pokéball (3 rebotes rápidos + ¡Campana Ding!)
        [0.0, 0.08, 0.16].forEach(t => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1150, now + t);
          gain.gain.setValueAtTime(0.08, now + t);
          gain.gain.linearRampToValueAtTime(0.001, now + t + 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + t);
          osc.stop(now + t + 0.04);
        });
        const oscDing = ctx.createOscillator();
        const gainDing = ctx.createGain();
        oscDing.type = 'triangle';
        oscDing.frequency.setValueAtTime(1760, now + 0.23); // A6
        gainDing.gain.setValueAtTime(0.12, now + 0.23);
        gainDing.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        oscDing.connect(gainDing);
        gainDing.connect(ctx.destination);
        oscDing.start(now + 0.23);
        oscDing.stop(now + 0.65);
      }
      else if (variant === 1) {
        // DRAGON BALL Z: Teletransportación Instantánea (Shunkan Ido)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(1980, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.22);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      }
      else {
        // SUPER MARIO BROS: Moneda clásica (B5 -> E6)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
        gain.gain.setValueAtTime(0.11, now);
        gain.gain.setValueAtTime(0.11, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.38);
      }
    } 

    // ========================================================================
    // B. TAREA GUARDADA / CONCLUIDA (ZELDA SECRET & CENTRO POKÉMON)
    // ========================================================================
    else if (type === '1up' || type === 'finish' || type === 'safe' || type === 'saved') {
      const variant = soundCycleCounter % 2;
      
      if (variant === 0) {
        // THE LEGEND OF ZELDA: Sonido de Secreto / Puzzle Resuelto (8 notas legendarias)
        const zeldaNotes = [
          { freq: 783.99, time: 0.00, dur: 0.08 }, // G5
          { freq: 739.99, time: 0.08, dur: 0.08 }, // F#5
          { freq: 622.25, time: 0.16, dur: 0.08 }, // D#5
          { freq: 440.00, time: 0.24, dur: 0.08 }, // A4
          { freq: 415.30, time: 0.32, dur: 0.08 }, // G#4
          { freq: 659.25, time: 0.40, dur: 0.08 }, // E5
          { freq: 830.61, time: 0.48, dur: 0.08 }, // G#5
          { freq: 1046.50, time: 0.56, dur: 0.32 } // C6 sostenido
        ];
        zeldaNotes.forEach(n => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(n.freq, now + n.time);
          gain.gain.setValueAtTime(0.12, now + n.time);
          gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + n.time);
          osc.stop(now + n.time + n.dur);
        });
      } else {
        // POKÉMON: Melodía de Curación de la Enfermera Joy (Centro Pokémon Game Boy)
        const pokeNotes = [
          { freq: 739.99, time: 0.00, dur: 0.11 }, // F#5
          { freq: 739.99, time: 0.12, dur: 0.11 }, // F#5
          { freq: 739.99, time: 0.24, dur: 0.11 }, // F#5
          { freq: 987.77, time: 0.36, dur: 0.22 }, // B5
          { freq: 830.61, time: 0.58, dur: 0.16 }, // G#5
          { freq: 739.99, time: 0.74, dur: 0.38 }  // F#5
        ];
        pokeNotes.forEach(n => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(n.freq, now + n.time);
          gain.gain.setValueAtTime(0.1, now + n.time);
          gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + n.time);
          osc.stop(now + n.time + n.dur);
        });
      }
    }

    // ========================================================================
    // C. PINTAR TRAMOS CON CLIC DERECHO (PAC-MAN WAKA-WAKA ALTERNANTE)
    // ========================================================================
    else if (type === 'laser' || type === 'paint' || type === 'waka') {
      const isAlt = (soundCycleCounter % 2) === 0;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      if (isAlt) {
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.04);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.09);
      } else {
        osc.frequency.setValueAtTime(340, now);
        osc.frequency.exponentialRampToValueAtTime(620, now + 0.04);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.09);
      }
      gain.gain.setValueAtTime(0.13, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    }

    // ========================================================================
    // D. ERRORES Y MANIOBRAS PROHIBIDAS (POKÉMON BATTLE ALERT & ZELDA WRONG)
    // ========================================================================
    else if (type === 'forbidden' || type === 'hazard' || type === 'alert' || type === 'error') {
      const variant = soundCycleCounter % 2;
      
      if (variant === 0) {
        // POKÉMON: Alarma de Encuentro Salvaje / Batalla crítica de Game Boy
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(840, now);
        osc.frequency.linearRampToValueAtTime(160, now + 0.12);
        osc.frequency.setValueAtTime(840, now + 0.13);
        osc.frequency.linearRampToValueAtTime(160, now + 0.25);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else {
        // THE LEGEND OF ZELDA: Sonido de Error / Ocarina Desafinada (Buzzer disonante)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'square';
        osc2.type = 'square';
        osc1.frequency.setValueAtTime(196, now); // G3
        osc2.frequency.setValueAtTime(185, now); // F#3 (disonante)
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.3);
        osc2.stop(now + 0.3);
      }
    }

    // ========================================================================
    // E. SALTO, CONMUTACIÓN O DESPEGUE DE FICHA (MARIO JUMP & PAC-MAN FRUTA)
    // ========================================================================
    else if (type === 'jump' || type === 'switch' || type === 'warp') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.13);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.13);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    }
    else if (type === 'horn') {
      // Bocina de dresina ferroviaria bi-tono (Honk-Honk)
      [220, 277].forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.linearRampToValueAtTime(freq * 0.98, now + 0.28);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      });
      [220, 277].forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + 0.22);
        osc.frequency.linearRampToValueAtTime(freq * 0.98, now + 0.52);
        gain.gain.setValueAtTime(0.15, now + 0.22);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + 0.22);
        osc.stop(now + 0.58);
      });
    }
    else if (type === 'boing') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.2);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    }
    else if (type === 'xmas') {
      const jingle = [
        { f: 659.25, t: 0.00 }, { f: 659.25, t: 0.12 }, { f: 659.25, t: 0.24 },
        { f: 659.25, t: 0.40 }, { f: 659.25, t: 0.52 }, { f: 659.25, t: 0.64 },
        { f: 659.25, t: 0.80 }, { f: 783.99, t: 0.92 }, { f: 523.25, t: 1.04 },
        { f: 587.33, t: 1.16 }, { f: 659.25, t: 1.28 }
      ];
      jingle.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.12, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + 0.16);
      });
    }
    else if (type === 'whoosh') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.25);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.7);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.75);
    }
    else if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.03);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    }
  } catch (e) {
    console.warn('Audio no disponible', e);
  }
}

// ==============================================================================
// 22. SINTETIZADOR CHIPTUNE MELÓDICO WEB AUDIO API Y HUEVOS DE PASCUA ANIME / RETRO
// ==============================================================================
let activeSongTimeouts = [];
let activeSongAudioNodes = [];
let activeSongName = null;

function stopCurrentSong() {
  activeSongTimeouts.forEach(t => clearTimeout(t));
  activeSongTimeouts = [];
  
  activeSongAudioNodes.forEach(node => {
    try {
      if (node.stop) node.stop();
      if (node.disconnect) node.disconnect();
    } catch(e) {}
  });
  activeSongAudioNodes = [];
  activeSongName = null;
  
  // Limpiar auras de todos los tokens
  document.querySelectorAll('.saiyan-aura, .starman-rainbow, .pikachu-storm, .zelda-triforce, .eva-berserk').forEach(el => {
    el.classList.remove('saiyan-aura', 'starman-rainbow', 'pikachu-storm', 'zelda-triforce', 'eva-berserk');
  });

  // Limpiar indicadores visuales de reproducción en la Sala Arcade
  document.querySelectorAll('.arcade-btn-play').forEach(btn => btn.classList.remove('active-song'));
}

function applyAuraToAllTokens(auraClass) {
  document.querySelectorAll('.crew-token, .vehicle-token, .multicrew-badge').forEach(el => {
    el.classList.add(auraClass);
  });
}

function playChiptuneSong(songKey) {
  stopCurrentSong();
  
  // Si el audio está silenciado, activarlo automáticamente para escuchar el secreto
  if (!appState.audioEnabled) {
    appState.audioEnabled = true;
    const btn = document.getElementById('btn-sound-toggle');
    const icon = document.getElementById('sound-icon');
    const text = document.getElementById('sound-text');
    if (btn && icon && text) {
      btn.classList.add('sound-on');
      icon.textContent = '🔊';
      text.textContent = 'Audio ATS';
    }
  }

  const ctx = getAudioContext();
  if (!ctx) return;
  activeSongName = songKey;
  const now = ctx.currentTime + 0.05;

  // Diccionario de Frecuencias de Notas Musicales (Hz)
  const N = {
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
    C4: 261.63, Cs4: 277.18, D4: 293.66, Ds4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.00, Gs4: 415.30, A4: 440.00, As4: 466.16, B4: 493.88,
    C5: 523.25, Cs5: 554.37, D5: 587.33, Ds5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99, Gs5: 830.61, A5: 880.00, As5: 932.33, B5: 987.77,
    C6: 1046.50, D6: 1174.66, E6: 1318.51, G6: 1567.98
  };

  // Helper para sintetizar una nota con tipo de onda, vibrato y envolvente ADSR
  function playNote(freq, startOffset, dur, type = 'square', vol = 0.12, vibrato = false) {
    if (!freq) return;
    const tStart = now + startOffset;
    const tEnd = tStart + dur;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, tStart);

    if (vibrato) {
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(6.0, tStart);
      lfoGain.gain.setValueAtTime(freq * 0.02, tStart);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(tStart);
      lfo.stop(tEnd);
      activeSongAudioNodes.push(lfo, lfoGain);
    }

    gain.gain.setValueAtTime(0.001, tStart);
    gain.gain.linearRampToValueAtTime(vol, tStart + 0.015);
    gain.gain.setValueAtTime(vol, tEnd - 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, tEnd);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(tStart);
    osc.stop(tEnd);

    activeSongAudioNodes.push(osc, gain);
  }

  // Helper para bajo y percusión chiptune
  function playBass(freq, startOffset, dur, vol = 0.14) {
    playNote(freq, startOffset, dur, 'triangle', vol);
  }

  // ==========================================================================
  // 1. DRAGON BALL Z — "CHA-LA HEAD-CHA-LA" (CORO COMPLETO)
  // ==========================================================================
  if (songKey === 'dbz') {
    applyAuraToAllTokens('saiyan-aura');
    showToast('🔥 ¡MODO SUPER SAIYAN ACTIVADO! Cha-La Head-Cha-La sonando a todo volumen...', 'warning');

    const melody = [
      // "Cha-la! Head-cha-la!"
      { f: N.G4, t: 0.00, d: 0.22 }, { f: N.G4, t: 0.24, d: 0.20 }, { f: N.A4, t: 0.46, d: 0.22 },
      { f: N.B4, t: 0.70, d: 0.45, v: true }, { f: N.D5, t: 1.20, d: 0.45, v: true },
      // "Egao urutora Z de"
      { f: N.C5, t: 1.70, d: 0.22 }, { f: N.B4, t: 1.94, d: 0.22 }, { f: N.A4, t: 2.18, d: 0.45 },
      { f: N.G4, t: 2.68, d: 0.22 }, { f: N.A4, t: 2.92, d: 0.22 }, { f: N.B4, t: 3.16, d: 0.45, v: true },
      { f: N.G4, t: 3.66, d: 0.45 },
      // "Kyou mo ai-yai-yai-yai-yai!"
      { f: N.E4, t: 4.15, d: 0.20 }, { f: N.G4, t: 4.38, d: 0.20 }, { f: N.A4, t: 4.60, d: 0.20 },
      { f: N.B4, t: 4.82, d: 0.20 }, { f: N.C5, t: 5.04, d: 0.45 }, { f: N.B4, t: 5.52, d: 0.20 },
      { f: N.A4, t: 5.74, d: 0.20 }, { f: N.G4, t: 5.96, d: 0.85, v: true },
      // Fanfarria heroica de cierre DBZ
      { f: N.D4, t: 6.90, d: 0.15 }, { f: N.G4, t: 7.08, d: 0.15 }, { f: N.B4, t: 7.26, d: 0.15 },
      { f: N.D5, t: 7.44, d: 0.15 }, { f: N.G5, t: 7.62, d: 0.95, v: true }
    ];

    melody.forEach(m => {
      playNote(m.f, m.t, m.d, 'square', 0.13, m.v);
      playBass(m.f / 2, m.t, m.d, 0.12);
    });

    // Programar fin de canción a los 8.8s
    activeSongTimeouts.push(setTimeout(() => {
      stopCurrentSong();
    }, 8800));
  }

  // ==========================================================================
  // 2. SUPER MARIO BROS — OVERWORLD THEME & INVENCIBILIDAD STARMAN
  // ==========================================================================
  else if (songKey === 'mario') {
    applyAuraToAllTokens('starman-rainbow');
    showToast('⭐ ¡MODO STARMAN ACTIVADO! Super Mario Bros — ¡Invencibilidad total en cantones!', 'success');

    const melody = [
      // Intro clásica
      { f: N.E5, t: 0.00, d: 0.12 }, { f: N.E5, t: 0.16, d: 0.12 }, { f: N.E5, t: 0.40, d: 0.12 },
      { f: N.C5, t: 0.56, d: 0.12 }, { f: N.E5, t: 0.72, d: 0.18 }, { f: N.G5, t: 1.00, d: 0.25 },
      { f: N.G4, t: 1.35, d: 0.28 },
      // Frase A principal
      { f: N.C5, t: 1.80, d: 0.22 }, { f: N.G4, t: 2.10, d: 0.22 }, { f: N.E4, t: 2.40, d: 0.22 },
      { f: N.A4, t: 2.70, d: 0.22 }, { f: N.B4, t: 2.95, d: 0.22 }, { f: N.As4, t: 3.20, d: 0.18 },
      { f: N.A4, t: 3.42, d: 0.22 }, { f: N.G4, t: 3.70, d: 0.18 }, { f: N.E5, t: 3.92, d: 0.22 },
      { f: N.G5, t: 4.18, d: 0.22 }, { f: N.A5, t: 4.44, d: 0.32 }, { f: N.F5, t: 4.80, d: 0.18 },
      { f: N.G5, t: 5.02, d: 0.22 }, { f: N.E5, t: 5.30, d: 0.22 }, { f: N.C5, t: 5.56, d: 0.18 },
      { f: N.D5, t: 5.78, d: 0.18 }, { f: N.B4, t: 6.00, d: 0.40 },
      // Fanfarria 1-Up final
      { f: N.E5, t: 6.60, d: 0.10 }, { f: N.G5, t: 6.72, d: 0.10 }, { f: N.E6, t: 6.84, d: 0.12 },
      { f: N.C6, t: 6.98, d: 0.12 }, { f: N.D6, t: 7.12, d: 0.12 }, { f: N.G6, t: 7.26, d: 0.45 }
    ];

    melody.forEach(m => {
      playNote(m.f, m.t, m.d, 'square', 0.12);
      playBass(m.f / 2, m.t, m.d, 0.11);
    });

    activeSongTimeouts.push(setTimeout(() => {
      stopCurrentSong();
    }, 8200));
  }

  // ==========================================================================
  // 3. POKÉMON — WILD BATTLE THEME (GAME BOY DMG RED/BLUE)
  // ==========================================================================
  else if (songKey === 'pokemon') {
    applyAuraToAllTokens('pikachu-storm');
    showToast('⚡ ¡UN POKÉMON SALVAJE APARECIÓ! Tormenta eléctrica en la catenaria 1500V...', 'info');

    // Descenso cromático de encuentro inicial Game Boy
    const chromatic = [
      { f: N.B5, t: 0.00 }, { f: N.As5, t: 0.05 }, { f: N.A5, t: 0.10 }, { f: N.Gs5, t: 0.15 },
      { f: N.G5, t: 0.20 }, { f: N.Fs5, t: 0.25 }, { f: N.F5, t: 0.30 }, { f: N.E5, t: 0.35 }
    ];
    chromatic.forEach(c => playNote(c.f, c.t, 0.045, 'sawtooth', 0.13));

    // Tema principal de combate
    const melody = [
      { f: N.E4, t: 0.50, d: 0.16 }, { f: N.G4, t: 0.68, d: 0.16 }, { f: N.B4, t: 0.86, d: 0.16 },
      { f: N.E5, t: 1.04, d: 0.28 }, { f: N.D5, t: 1.35, d: 0.16 }, { f: N.B4, t: 1.53, d: 0.16 },
      { f: N.G4, t: 1.71, d: 0.16 }, { f: N.A4, t: 1.90, d: 0.28 },
      { f: N.B4, t: 2.22, d: 0.16 }, { f: N.A4, t: 2.40, d: 0.16 }, { f: N.G4, t: 2.58, d: 0.16 },
      { f: N.E4, t: 2.76, d: 0.32 }, { f: N.Fs4, t: 3.12, d: 0.16 }, { f: N.G4, t: 3.30, d: 0.16 },
      { f: N.A4, t: 3.48, d: 0.16 }, { f: N.B4, t: 3.66, d: 0.55 },
      // Segunda frase enérgica
      { f: N.E5, t: 4.30, d: 0.18 }, { f: N.D5, t: 4.52, d: 0.18 }, { f: N.E5, t: 4.74, d: 0.18 },
      { f: N.G5, t: 4.96, d: 0.30 }, { f: N.Fs5, t: 5.30, d: 0.18 }, { f: N.E5, t: 5.52, d: 0.18 },
      { f: N.D5, t: 5.74, d: 0.25 }, { f: N.B4, t: 6.02, d: 0.65 }
    ];

    melody.forEach(m => {
      playNote(m.f, m.t, m.d, 'square', 0.13);
      playBass(m.f / 2, m.t, m.d, 0.12);
    });

    activeSongTimeouts.push(setTimeout(() => {
      stopCurrentSong();
    }, 7200));
  }

  // ==========================================================================
  // 4. THE LEGEND OF ZELDA — "SONG OF STORMS" (VALS EN RE MENOR)
  // ==========================================================================
  else if (songKey === 'zelda') {
    applyAuraToAllTokens('zelda-triforce');
    showToast('🗡️ ¡CANCIÓN DE LAS TORMENTAS! El poder sagrado de la Trifuerza protege la vía...', 'success');

    const melody = [
      // Compás 1 & 2: D - F - High D
      { f: N.D4, t: 0.00, d: 0.18 }, { f: N.F4, t: 0.20, d: 0.18 }, { f: N.D5, t: 0.42, d: 0.46, v: true },
      { f: N.D4, t: 0.95, d: 0.18 }, { f: N.F4, t: 1.15, d: 0.18 }, { f: N.D5, t: 1.37, d: 0.46, v: true },
      // Compás 3 & 4: E - F - E - F - E - C - A
      { f: N.E5, t: 1.90, d: 0.28 }, { f: N.F5, t: 2.22, d: 0.14 }, { f: N.E5, t: 2.38, d: 0.14 },
      { f: N.F5, t: 2.54, d: 0.14 }, { f: N.E5, t: 2.70, d: 0.14 }, { f: N.C5, t: 2.86, d: 0.28 },
      { f: N.A4, t: 3.18, d: 0.65, v: true },
      // Compás 5 & 6: A - D - F - G - A
      { f: N.A4, t: 3.90, d: 0.24 }, { f: N.D4, t: 4.18, d: 0.24 }, { f: N.F4, t: 4.46, d: 0.18 },
      { f: N.G4, t: 4.66, d: 0.18 }, { f: N.A4, t: 4.88, d: 0.65, v: true },
      // Compás 7 & 8: A - D - F - G - E
      { f: N.A4, t: 5.60, d: 0.24 }, { f: N.D4, t: 5.88, d: 0.24 }, { f: N.F4, t: 6.16, d: 0.18 },
      { f: N.G4, t: 6.36, d: 0.18 }, { f: N.E4, t: 6.58, d: 0.90, v: true }
    ];

    melody.forEach(m => {
      // Onda triangular flauta ocarina con suave vibrato
      playNote(m.f, m.t, m.d, 'triangle', 0.16, m.v);
      playBass(m.f / 2, m.t, m.d, 0.09);
    });

    activeSongTimeouts.push(setTimeout(() => {
      stopCurrentSong();
    }, 7800));
  }

  // ==========================================================================
  // 5. NEON GENESIS EVANGELION — "A CRUEL ANGEL'S THESIS" (MODO BERSERK)
  // ==========================================================================
  else if (songKey === 'evangelion') {
    applyAuraToAllTokens('eva-berserk');
    showToast('🤖 ¡MODO BERSERK ACTIVADO! Unidad EVA-01 sincronizada con Vía Principal...', 'danger');

    const melody = [
      // "Zankoku na tenshi no you ni..."
      { f: N.C4, t: 0.00, d: 0.24 }, { f: N.D4, t: 0.26, d: 0.24 }, { f: N.Ds4, t: 0.52, d: 0.42 },
      { f: N.F4, t: 0.98, d: 0.24 }, { f: N.G4, t: 1.24, d: 0.42, v: true }, { f: N.Ds4, t: 1.70, d: 0.24 },
      { f: N.F4, t: 1.96, d: 0.42 }, { f: N.Ds4, t: 2.42, d: 0.24 }, { f: N.D4, t: 2.68, d: 0.24 },
      { f: N.C4, t: 2.94, d: 0.45 },
      // "Shounen yo shinwa ni nare!"
      { f: N.D4, t: 3.44, d: 0.24 }, { f: N.Ds4, t: 3.70, d: 0.24 }, { f: N.F4, t: 3.96, d: 0.24 },
      { f: N.G4, t: 4.22, d: 0.42 }, { f: N.C5, t: 4.68, d: 0.55, v: true }, { f: N.As4, t: 5.26, d: 0.24 },
      { f: N.G4, t: 5.52, d: 0.24 }, { f: N.F4, t: 5.78, d: 0.24 }, { f: N.G4, t: 6.04, d: 0.95, v: true }
    ];

    melody.forEach(m => {
      // Sintetizador Sawtooth cortante estilo brass anime de los 90s
      playNote(m.f, m.t, m.d, 'sawtooth', 0.12, m.v);
      playBass(m.f / 2, m.t, m.d, 0.14);
    });

    activeSongTimeouts.push(setTimeout(() => {
      stopCurrentSong();
    }, 7500));
  }

  // ==========================================================================
  // 6. NAVIDAD L2 — VILLANCICO CHIPTUNE CAMPANILLAS (DOMINIO PÚBLICO)
  // ==========================================================================
  else if (songKey === 'xmas') {
    showToast('🎅 ¡MODO NAVIDAD EN LÍNEA 2! Campanillas chiptune en andenes.', 'success');
    const melody = [
      { f: N.E5, t: 0.00, d: 0.18 }, { f: N.E5, t: 0.22, d: 0.18 }, { f: N.E5, t: 0.44, d: 0.36 },
      { f: N.E5, t: 0.84, d: 0.18 }, { f: N.E5, t: 1.06, d: 0.18 }, { f: N.E5, t: 1.28, d: 0.36 },
      { f: N.E5, t: 1.68, d: 0.18 }, { f: N.G5, t: 1.90, d: 0.18 }, { f: N.C5, t: 2.12, d: 0.24 },
      { f: N.D5, t: 2.40, d: 0.24 }, { f: N.E5, t: 2.68, d: 0.55 }
    ];
    melody.forEach(m => {
      playNote(m.f, m.t, m.d, 'triangle', 0.13);
      playBass(m.f / 2, m.t, m.d, 0.10);
    });
    activeSongTimeouts.push(setTimeout(() => stopCurrentSong(), 3600));
  }

  // ==========================================================================
  // 7. PAC-MAN — INTERLUDIO ARCADE MAZE (WAKA-WAKA ORIGINAL)
  // ==========================================================================
  else if (songKey === 'pacman') {
    showToast('ᗧ••• ¡WAKA-WAKA! Modo arcade laberinto activado.', 'warning');
    const now0 = ctx.currentTime + 0.05;
    for (let i = 0; i < 12; i++) {
      const t = i * 0.16;
      const f = i % 2 === 0 ? 280 : 360;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(f, now0 + t);
      gain.gain.setValueAtTime(0.10, now0 + t);
      gain.gain.exponentialRampToValueAtTime(0.001, now0 + t + 0.10);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now0 + t);
      osc.stop(now0 + t + 0.10);
      activeSongAudioNodes.push(osc, gain);
    }
    activeSongTimeouts.push(setTimeout(() => stopCurrentSong(), 2200));
  }

  // ==========================================================================
  // 8. SONIC THE HEDGEHOG — CHIME DE ANILLOS + RIFF SPEED ZONE ORIGINAL
  // ==========================================================================
  else if (songKey === 'sonic') {
    showToast('💨 ¡VELOCIDAD SUPERSÓNICA! Anillos y estela azul activados.', 'info');
    const melody = [
      { f: N.B5, t: 0.00, d: 0.12 }, { f: N.E6, t: 0.14, d: 0.18 },
      { f: N.B5, t: 0.36, d: 0.12 }, { f: N.E6, t: 0.50, d: 0.18 },
      { f: N.G5, t: 0.80, d: 0.12 }, { f: N.B5, t: 0.94, d: 0.12 }, { f: N.D6, t: 1.08, d: 0.30 },
      { f: N.E6, t: 1.44, d: 0.12 }, { f: N.G6, t: 1.58, d: 0.40 }
    ];
    melody.forEach(m => {
      playNote(m.f, m.t, m.d, 'square', 0.12);
      playBass(m.f / 2, m.t, m.d, 0.10);
    });
    activeSongTimeouts.push(setTimeout(() => stopCurrentSong(), 2400));
  }
}

// ==============================================================================
// 23. HOTSPOTS DE PASCUA, CONTADOR Y SALA ARCADE
// ==============================================================================
const EASTER_HOTSPOTS = [
  { key: 'pokemon', label: 'Pokémon', icon: '⚡', x: 895, y: 32, song: 'pokemon', aura: 'pikachu-storm', official: 'https://www.youtube.com/@PokemonOficialES' },
  { key: 'dbz', label: 'Dragon Ball Z', icon: '🔥', x: 1040, y: 170, song: 'dbz', aura: 'saiyan-aura', official: 'https://www.youtube.com/@DragonBallOficial' },
  { key: 'xmas', label: 'Navidad L2', icon: '🎄', x: 1260, y: 86, song: 'xmas', aura: null, official: 'https://open.spotify.com/search/villancicos%20clasicos' },
  { key: 'mario', label: 'Super Mario', icon: '⭐', x: 44, y: 172, song: 'mario', aura: 'starman-rainbow', official: 'https://www.youtube.com/@NintendoAmerica' },
  { key: 'zelda', label: 'Zelda', icon: '🗡️', x: 3514, y: 172, song: 'zelda', aura: 'zelda-triforce', official: 'https://www.youtube.com/@NintendoAmerica' },
  { key: 'pacman', label: 'Pac-Man', icon: '•••', x: 1900, y: 402, song: 'pacman', aura: null, official: 'https://www.youtube.com/@BandaiNamcoAm' },
  { key: 'sonic', label: 'Sonic', icon: '💨', x: 2120, y: 170, song: 'sonic', aura: null, official: 'https://www.youtube.com/@SEGA' },
  { key: 'eva', label: 'Tetris / EVA', icon: '⬡', x: 3304, y: -42, song: 'evangelion', aura: 'eva-berserk', official: 'https://open.spotify.com/search/evangelion%20cruel%20angel%20thesis' }
];

const EASTER_STORAGE_KEY = 'ATS_REPLICA_EASTER_HOTSPOTS_V1';
const EASTER_BUTTON_REVEALED_KEY = 'ATS_REPLICA_EASTER_BUTTON_REVEALED_V1';

function revealEasterEggButton() {
  const btn = document.getElementById('btn-open-easter-eggs');
  if (!btn) return;
  btn.classList.add('revealed');
  try {
    localStorage.setItem(EASTER_BUTTON_REVEALED_KEY, '1');
  } catch (err) {
    // El botón sigue visible durante esta sesión aunque el almacenamiento esté bloqueado.
  }
}

function getDiscoveredHotspots() {
  try {
    const raw = localStorage.getItem(EASTER_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (e) {
    return {};
  }
}

function saveDiscoveredHotspots(map) {
  try {
    localStorage.setItem(EASTER_STORAGE_KEY, JSON.stringify(map));
  } catch (e) { /* noop */ }
}

function updateEasterCounter() {
  const discovered = getDiscoveredHotspots();
  const count = Object.values(discovered).filter(Boolean).length;
  const text = `${count}/8`;
  const headerCounter = document.getElementById('easter-counter');
  const modalCounter = document.getElementById('arcade-counter');
  if (headerCounter) headerCounter.textContent = text;
  if (modalCounter) modalCounter.textContent = text;
  EASTER_HOTSPOTS.forEach(h => {
    const card = document.querySelector(`.arcade-card[data-hotspot="${h.key}"]`);
    if (!card) return;
    const status = card.querySelector('.arcade-status');
    if (discovered[h.key]) {
      card.classList.add('discovered');
      if (status) status.textContent = '✓ Descubierto';
    } else {
      card.classList.remove('discovered');
      if (status) status.textContent = '🔒 Pista de ubicación';
    }
  });
  return count;
}

function renderEasterHotspots() {
  const layer = document.getElementById('easter-hotspots-layer');
  if (!layer) return;
  layer.innerHTML = '';
  EASTER_HOTSPOTS.forEach(h => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'easter-hotspot');
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.setAttribute('aria-label', `Secreto ${h.label}`);
    g.setAttribute('transform', `translate(${h.x}, ${h.y})`);
    g.setAttribute('data-hotspot', h.key);

    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('class', 'hotspot-ring');
    ring.setAttribute('r', '9');
    layer.appendChild(g);
    g.appendChild(ring);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('class', 'hotspot-label');
    label.setAttribute('y', '22');
    label.textContent = h.label;
    g.appendChild(label);

    g.addEventListener('click', (e) => {
      e.stopPropagation();
      discoverHotspot(h.key);
    });
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        discoverHotspot(h.key);
      }
    });
  });
}

function discoverHotspot(key) {
  const hotspot = EASTER_HOTSPOTS.find(h => h.key === key);
  if (!hotspot) return;
  const discovered = getDiscoveredHotspots();
  const wasNew = !discovered[key];
  discovered[key] = true;
  saveDiscoveredHotspots(discovered);
  updateEasterCounter();

  if (hotspot.song) {
    playChiptuneSong(hotspot.song);
  }
  if (hotspot.aura) {
    applyAuraToAllTokens(hotspot.aura);
    setTimeout(() => {
      document.querySelectorAll(`.${hotspot.aura}`).forEach(el => el.classList.remove(hotspot.aura));
    }, 6000);
  }

  if (key === 'xmas') {
    document.querySelectorAll('.crew-token').forEach(el => {
      el.classList.add('santa-pompon');
      setTimeout(() => el.classList.remove('santa-pompon'), 6000);
    });
  } else if (key === 'pacman') {
    document.querySelectorAll('.vehicle-token').forEach(el => {
      el.classList.add('pacman-mouth');
      setTimeout(() => el.classList.remove('pacman-mouth'), 6000);
    });
  } else if (key === 'sonic') {
    document.querySelectorAll('.vehicle-token').forEach(el => {
      el.style.filter = 'drop-shadow(0 0 8px #38bdf8)';
      setTimeout(() => el.style.filter = '', 4000);
    });
  }

  if (wasNew) {
    const btn = document.getElementById('btn-open-easter-eggs');
    if (btn) {
      btn.classList.remove('discovered-flash');
      void btn.offsetWidth;
      btn.classList.add('discovered-flash');
      setTimeout(() => btn.classList.remove('discovered-flash'), 1200);
    }
    showToast(`🎮 ¡Secreto descubierto! ${hotspot.label}`, 'success');
  }
}

function initEasterEggs() {
  renderEasterHotspots();
  updateEasterCounter();

  // Botón para abrir la Sala Arcade
  const btnOpen = document.getElementById('btn-open-easter-eggs');
  const modal = document.getElementById('modal-easter-eggs');
  try {
    if (localStorage.getItem(EASTER_BUTTON_REVEALED_KEY) === '1') {
      revealEasterEggButton();
    }
  } catch (err) {
    // En almacenamiento privado, se revela al escribir GAMER en esta sesión.
  }
  if (btnOpen && modal) {
    btnOpen.addEventListener('click', () => {
      modal.classList.add('active');
      playSound('coin');
    });
  }

  // Botones de reproducción en el modal
  document.querySelectorAll('[data-song]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const song = e.currentTarget.getAttribute('data-song');
      playChiptuneSong(song);
      document.querySelectorAll('.arcade-btn-play').forEach(b => b.classList.remove('active-song'));
      e.currentTarget.classList.add('active-song');
    });
  });

  const btnStopAll = document.getElementById('btn-stop-all-audio');
  if (btnStopAll) {
    btnStopAll.addEventListener('click', () => {
      stopCurrentSong();
      document.querySelectorAll('.arcade-btn-play').forEach(b => b.classList.remove('active-song'));
      showToast('Toda la música fue detenida.', 'info');
    });
  }

  // Listener del Código Konami y Palabras Clave por Teclado
  const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiProgress = 0;
  let typedBuffer = '';

  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    const expected = konamiPattern[konamiProgress].toLowerCase();
    if (key === expected) {
      konamiProgress++;
      if (konamiProgress === konamiPattern.length) {
        konamiProgress = 0;
        playChiptuneSong('dbz');
        showToast('🎮 ¡CÓDIGO KONAMI DESBLOQUEADO! MODO SUPER SAIYAN DESATADO.', 'warning');
      }
    } else {
      konamiProgress = 0;
    }

    if (e.key.length === 1 && /[a-z0-9]/i.test(e.key)) {
      typedBuffer += e.key.toLowerCase();
      if (typedBuffer.length > 15) typedBuffer = typedBuffer.slice(-15);

      if (typedBuffer.endsWith('gamer')) {
        revealEasterEggButton();
        playSound('1up');
        showToast('👾 ¡MODO GAMER ACTIVADO! Explora el plano para descubrir secretos.', 'warning');
        typedBuffer = '';
      } else if (typedBuffer.endsWith('navidad') || typedBuffer.endsWith('xmas')) {
        discoverHotspot('xmas');
        typedBuffer = '';
      } else if (typedBuffer.endsWith('pacman')) {
        discoverHotspot('pacman');
        typedBuffer = '';
      } else if (typedBuffer.endsWith('sonic')) {
        discoverHotspot('sonic');
        typedBuffer = '';
      } else if (typedBuffer.endsWith('dbz') || typedBuffer.endsWith('goku')) {
        playChiptuneSong('dbz');
        typedBuffer = '';
      } else if (typedBuffer.endsWith('mario') || typedBuffer.endsWith('star')) {
        playChiptuneSong('mario');
        typedBuffer = '';
      } else if (typedBuffer.endsWith('poke') || typedBuffer.endsWith('pika')) {
        playChiptuneSong('pokemon');
        typedBuffer = '';
      } else if (typedBuffer.endsWith('zelda') || typedBuffer.endsWith('link')) {
        playChiptuneSong('zelda');
        typedBuffer = '';
      } else if (typedBuffer.endsWith('eva') || typedBuffer.endsWith('shinji')) {
        playChiptuneSong('evangelion');
        typedBuffer = '';
      }
    }
  });

  // Clics secretos en la interfaz
  const brandBadge = document.querySelector('.brand-badge');
  if (brandBadge) {
    let clickCount = 0;
    let clickTimer = null;
    brandBadge.style.cursor = 'pointer';
    brandBadge.addEventListener('click', () => {
      clickCount++;
      clearTimeout(clickTimer);
      if (clickCount >= 3) {
        clickCount = 0;
        playChiptuneSong('mario');
      } else {
        clickTimer = setTimeout(() => { clickCount = 0; }, 700);
      }
    });
  }

  const vitalityBadge = document.querySelector('.system-vitality-badge');
  if (vitalityBadge) {
    let clickCount = 0;
    let clickTimer = null;
    vitalityBadge.style.cursor = 'pointer';
    vitalityBadge.addEventListener('click', () => {
      clickCount++;
      clearTimeout(clickTimer);
      if (clickCount >= 5) {
        clickCount = 0;
        playChiptuneSong('dbz');
      } else {
        clickTimer = setTimeout(() => { clickCount = 0; }, 800);
      }
    });
  }

  const clockDisplay = document.getElementById('clock-display');
  if (clockDisplay) {
    let clickCount = 0;
    let clickTimer = null;
    clockDisplay.style.cursor = 'pointer';
    clockDisplay.addEventListener('click', () => {
      clickCount++;
      clearTimeout(clickTimer);
      if (clickCount >= 5) {
        clickCount = 0;
        playChiptuneSong('evangelion');
      } else {
        clickTimer = setTimeout(() => { clickCount = 0; }, 800);
      }
    });
  }
}
