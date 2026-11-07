// Sound effects are synthesized (no files to download) and the voice uses the phone's built-in speech.
import { settings } from './store.js';

let ctx = null;
export function unlock() {
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  } catch (e) { /* no audio */ }
  // iOS needs one utterance inside a tap before speech works later.
  if (!unlock.spoke && 'speechSynthesis' in window) {
    unlock.spoke = true;
    try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch (e) { /* ignore */ }
  }
}

function tone(freq, dur, { type = 'sine', vol = 0.25, slide = 0, delay = 0 } = {}) {
  if (!ctx || !settings.sound) return;
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq * slide), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t); o.stop(t + dur + 0.05);
}

function noise(dur, { vol = 0.2, freq = 1200, q = 1, delay = 0 } = {}) {
  if (!ctx || !settings.sound) return;
  const t = ctx.currentTime + delay;
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  src.buffer = buf; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
  g.gain.value = vol;
  src.connect(f).connect(g).connect(ctx.destination);
  src.start(t);
}

export const sfx = {
  tap: () => tone(660, 0.09, { type: 'triangle', vol: 0.18, slide: 1.4 }),
  pop: () => tone(520, 0.14, { vol: 0.3, slide: 2.2 }),
  plop: () => { tone(300, 0.18, { vol: 0.35, slide: 0.45 }); noise(0.08, { vol: 0.08, freq: 900, delay: 0.02 }); },
  swish: () => noise(0.18, { vol: 0.12, freq: 2200, q: 0.7 }),
  drip: () => { tone(900, 0.12, { vol: 0.25, slide: 0.5 }); tone(1400, 0.08, { vol: 0.12, slide: 0.6, delay: 0.06 }); },
  boing: () => tone(220, 0.3, { type: 'triangle', vol: 0.2, slide: 1.6 }),
  ding: () => { [1568, 2093].forEach((f, i) => tone(f, 1.2, { vol: 0.18, delay: i * 0.02 })); tone(3136, 0.6, { vol: 0.05 }); },
  tick: () => tone(1800, 0.04, { type: 'square', vol: 0.04 }),
  sizzle: () => noise(0.6, { vol: 0.06, freq: 5000, q: 0.5 }),
  chomp: () => { noise(0.12, { vol: 0.3, freq: 700, q: 0.8 }); noise(0.1, { vol: 0.25, freq: 500, q: 0.8, delay: 0.14 }); },
  sparkle: () => [0, 1, 2, 3].forEach((i) => tone(1400 + Math.random() * 1400, 0.15, { vol: 0.07, delay: i * 0.05 })),
  yay: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.25, { type: 'triangle', vol: 0.2, delay: i * 0.09 })),
  fanfare: () => {
    [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i === 5 ? 0.6 : 0.18, { type: 'triangle', vol: 0.22, delay: i * 0.12 }));
  },
};

// ---------- Voice ----------
let voices = [];
function loadVoices() { try { voices = speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang)); } catch (e) { voices = []; } }
if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }

export function voiceList() { loadVoices(); return voices; }

function pickVoice() {
  if (!voices.length) loadVoices();
  if (settings.voice) { const v = voices.find((x) => x.name === settings.voice); if (v) return v; }
  // Lighter, friendlier voices tend to sound best at a raised pitch.
  const prefer = [/female/i, /samantha/i, /karen/i, /moira/i, /tessa/i, /aria/i, /jenny/i, /zira/i, /google us english/i, /en-us/i];
  for (const p of prefer) { const v = voices.find((x) => p.test(x.name) || p.test(x.voiceURI)); if (v) return v; }
  return voices.find((v) => /en-US/i.test(v.lang)) || voices[0] || null;
}

let onTalk = () => {};
export function onSpeaking(fn) { onTalk = fn; }

export function say(text, { interrupt = true } = {}) {
  if (!settings.speech || !('speechSynthesis' in window) || !text) return;
  try {
    if (interrupt) speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if (v) { u.voice = v; u.lang = v.lang; }
    u.pitch = settings.pitch; // raised pitch = younger, cartoon voice
    u.rate = 0.95;
    u.volume = 1;
    u.onstart = () => onTalk(true);
    u.onend = u.onerror = () => onTalk(false);
    speechSynthesis.speak(u);
  } catch (e) { /* speech not available */ }
}
