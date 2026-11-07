import { CHEF, INGREDIENTS, STICKERS, SHAPES, ICONS, OVEN, PAN, STOVE_FLAME, WHISK, DOUGH, sticker, treatSVG, bowlSVG, blend, shade } from './art.js';
import { sfx, say, unlock, onSpeaking, voiceList } from './audio.js';
import { settings, saveSettings, bakery, addToBakery, clearBakery } from './store.js';

const VERSION = 'v1';
const app = document.getElementById('app');

// ---------- Data ----------
const FROST = [
  { n: 'pink', c: '#ff9ccf' }, { n: 'white', c: '#fffaf3' }, { n: 'chocolate', c: '#8a5a3c' }, { n: 'blue', c: '#8fd3ff' },
  { n: 'purple', c: '#c9a0ff' }, { n: 'green', c: '#9be89b' }, { n: 'yellow', c: '#ffe680' }, { n: 'orange', c: '#ffb36b' },
];
const SYRUP = [
  { n: 'maple syrup', c: '#c8792b' }, { n: 'chocolate syrup', c: '#6b3f2a' }, { n: 'strawberry syrup', c: '#ff6f91' },
  { n: 'blueberry syrup', c: '#7a5cd6' }, { n: 'honey', c: '#f2b632' },
];
const SAUCE = [{ n: 'red sauce', c: '#e8442e' }, { n: 'white sauce', c: '#fff3dc' }, { n: 'green sauce', c: '#6fbf4a' }];
const SPRINKLES = [
  { n: 'rainbow sprinkles', c: ['#ff5a5a', '#ffd23f', '#5cc46a', '#4b8dff', '#c06ccf', '#ff9a3c'] },
  { n: 'pink sprinkles', c: ['#ff7eb6', '#ffc2dd', '#ffffff'] },
  { n: 'chocolate sprinkles', c: ['#6b3f2a', '#8a5a3c', '#4a2a1c'] },
  { n: 'gold sprinkles', c: ['#ffd23f', '#ffb000', '#fff3b0'] },
];
const PAINTS = [
  { k: 'red', n: 'red', c: '#ff5a5a' }, { k: 'yellow', n: 'yellow', c: '#ffd93b' },
  { k: 'blue', n: 'blue', c: '#4b8dff' }, { k: 'white', n: 'white', c: '#ffffff' },
];
const MIXES = {
  'red+yellow': ['orange', '#ff9a3c'], 'blue+red': ['purple', '#9b59d0'], 'blue+yellow': ['green', '#5cc46a'],
  'red+white': ['pink', '#ff9ccf'], 'blue+white': ['light blue', '#8fd3ff'], 'white+yellow': ['light yellow', '#fff07a'],
};
const CANDY = ['#ff5a5a', '#ff9a3c', '#ffd23f', '#5cc46a', '#4b8dff', '#c06ccf', '#ff7eb6'];

const RECIPES = {
  cupcake: {
    single: 'cupcake', plural: 'cupcakes', name: 'Cupcakes', letter: 'C', base: '#f7d9a0', tile: '#ffb3c7',
    ingredients: ['flour', 'egg', 'milk', 'sugar'], steps: ['letter', 'add', 'mix', 'color', 'bake', 'decorate', 'done'],
    frostName: 'frosting', frost: FROST, sprinkles: true, stickers: ['strawberry', 'cherry', 'blueberry', 'heart', 'star', 'chip'],
    sample: { recipe: 'cupcake', baked: true, batter: '#f7d9a0', frost: '#ff9ccf', deco: [{ t: 'k', id: 'cherry', x: 104, y: 22, r: 0 }, { t: 's', x: 70, y: 100, c: '#4b8dff', r: 30 }, { t: 's', x: 120, y: 90, c: '#ffd23f', r: -40 }, { t: 's', x: 140, y: 108, c: '#5cc46a', r: 70 }, { t: 's', x: 92, y: 78, c: '#c06ccf', r: 10 }] },
  },
  pancake: {
    single: 'pancake', plural: 'pancakes', name: 'Pancakes', letter: 'P', base: '#f2c27b', tile: '#ffd166',
    ingredients: ['flour', 'egg', 'milk', 'butter'], steps: ['letter', 'add', 'mix', 'color', 'pan', 'decorate', 'done'],
    frostName: 'syrup', frost: SYRUP, sprinkles: true, stickers: ['strawberry', 'blueberry', 'banana', 'chip', 'cherry', 'heart'],
    sample: { recipe: 'pancake', baked: true, batter: '#f2c27b', stack: 3, frost: '#c8792b', deco: [{ t: 'k', id: 'blueberry', x: 84, y: 112, r: 0 }, { t: 'k', id: 'strawberry', x: 112, y: 108, r: 10 }] },
  },
  pizza: {
    single: 'pizza', plural: 'pizzas', name: 'Pizza', letter: 'P', base: '#f3dfb8', tile: '#ff9a7a',
    ingredients: ['flour', 'water', 'oil'], steps: ['letter', 'add', 'mix', 'knead', 'decorate', 'bake', 'done'],
    frostName: 'sauce', frost: SAUCE, cheese: true, sprinkles: false, stickers: ['pepperoni', 'mushroom', 'olive', 'pepper', 'pineapple', 'heart'],
    sample: { recipe: 'pizza', baked: true, frost: '#e8442e', cheese: true, deco: [{ t: 'k', id: 'pepperoni', x: 76, y: 76, r: 0 }, { t: 'k', id: 'pepperoni', x: 128, y: 92, r: 0 }, { t: 'k', id: 'olive', x: 100, y: 128, r: 0 }, { t: 'k', id: 'mushroom', x: 132, y: 136, r: 10 }, { t: 'k', id: 'pepperoni', x: 70, y: 124, r: 0 }] },
  },
  cookie: {
    single: 'cookie', plural: 'cookies', name: 'Cookies', letter: 'C', base: '#f0c987', tile: '#9be0c9',
    ingredients: ['flour', 'sugar', 'butter', 'egg'], steps: ['letter', 'add', 'mix', 'color', 'shape', 'bake', 'decorate', 'done'],
    frostName: 'icing', frost: FROST, sprinkles: true, stickers: ['chip', 'heart', 'star', 'cherry', 'blueberry', 'strawberry'],
    sample: { recipe: 'cookie', baked: true, batter: '#f0c987', shape: 'star', frost: '#8fd3ff', deco: [{ t: 'l', ch: 'A', x: 100, y: 104, c: '#ff7eb6', r: 0 }] },
  },
};

const STEP_ICON = { letter: 'ABC', add: '🥚', mix: '🥄', color: '🎨', shape: '⭐', knead: '✋', pan: '🍳', bake: '🔥', decorate: '✨', done: '😋' };

// ---------- Helpers ----------
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const big = () => settings.level === 'big';
const $ = (sel, root = app) => root.querySelector(sel);
const article = (w) => (/^[aeiou]/i.test(w) ? 'an ' : 'a ') + w;

let token = 0; // bumps on every screen change so stale timers do nothing
function later(fn, ms) { const t = token; setTimeout(() => { if (t === token) fn(); }, ms); }
const wait = (ms) => new Promise((res) => later(res, ms));

function svgPoint(svg, e) {
  const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
  const p = pt.matrixTransform(svg.getScreenCTM().inverse());
  return { x: Math.max(8, Math.min(192, p.x)), y: Math.max(8, Math.min(192, p.y)) };
}

function fly(fromEl, toEl, html, { size = 72, dur = 650, toY = 0.35 } = {}) {
  return new Promise((res) => {
    const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'flyer'; el.innerHTML = html;
    el.style.width = el.style.height = size + 'px';
    el.style.left = a.left + a.width / 2 - size / 2 + 'px';
    el.style.top = a.top + a.height / 2 - size / 2 + 'px';
    document.body.appendChild(el);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height * toY - (a.top + a.height / 2);
    const anim = el.animate([
      { transform: 'translate(0,0) scale(1) rotate(0)' },
      { transform: `translate(${dx * 0.5}px, ${Math.min(dy * 0.5, 0) - 90}px) scale(1.15) rotate(25deg)`, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(.45) rotate(50deg)`, opacity: 0.85 },
    ], { duration: dur, easing: 'cubic-bezier(.4,.1,.6,1)' });
    anim.onfinish = () => { el.remove(); res(); };
  });
}

function confetti(n = 50) {
  const box = document.createElement('div'); box.className = 'confetti';
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + '%';
    p.style.background = CANDY[i % CANDY.length];
    p.style.animationDelay = Math.random() * 0.6 + 's';
    p.style.animationDuration = 1.8 + Math.random() * 1.4 + 's';
    p.style.setProperty('--spin', rnd(-720, 720) + 'deg');
    p.style.setProperty('--drift', rnd(-60, 60) + 'px');
    if (i % 3 === 0) p.style.borderRadius = '50%';
    box.appendChild(p);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 3800);
}

function pulse(el, cls = 'pop') { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

onSpeaking((on) => document.querySelectorAll('.chef').forEach((c) => c.classList.toggle('talking', on)));

// ---------- Home ----------
function home() {
  token++;
  app.innerHTML = `
  <div class="home">
    <div class="bunting" aria-hidden="true">${'<i></i>'.repeat(12)}</div>
    <h1 class="title"><span>Little</span> <span>Chef</span></h1>
    <div class="home-chef chef">${CHEF}</div>
    <div class="recipes">
      ${Object.entries(RECIPES).map(([k, r]) => `
        <button class="recipe-tile" data-k="${k}" style="--tile:${r.tile}" aria-label="${r.name}">
          <div class="tile-art">${treatSVG(r.sample)}</div>
          <div class="tile-name">${r.name}</div>
        </button>`).join('')}
    </div>
    <div class="home-bottom">
      <button class="round-btn bakery-btn" aria-label="My bakery">${ICONS.bakery}<span>My Bakery</span></button>
      <button class="round-btn parent-btn" aria-label="Grown-ups: hold to open settings">${ICONS.gear}<span>Grown-ups<br><small>hold</small></span><b class="hold-ring"></b></button>
    </div>
    <div class="version">${VERSION}</div>
  </div>`;
  app.querySelectorAll('.recipe-tile').forEach((b) => b.addEventListener('click', () => {
    unlock(); sfx.pop();
    startGame(b.dataset.k);
  }));
  $('.bakery-btn').addEventListener('click', () => { unlock(); sfx.tap(); showBakery(); });
  $('.home-chef').addEventListener('click', () => { unlock(); sfx.boing(); pulse($('.home-chef'), 'wiggle'); say('Hi! I am Chef Bun! What should we cook today?'); });
  holdToOpen($('.parent-btn'), parentPanel);
}

function holdToOpen(btn, fn) {
  let timer = null;
  const start = (e) => { e.preventDefault(); btn.classList.add('holding'); timer = setTimeout(() => { btn.classList.remove('holding'); unlock(); fn(); }, 1500); };
  const stop = () => { clearTimeout(timer); btn.classList.remove('holding'); };
  btn.addEventListener('pointerdown', start);
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, stop));
  btn.addEventListener('contextmenu', (e) => e.preventDefault());
}

// ---------- Game shell ----------
let G = null;

function startGame(key) {
  const R = { ...RECIPES[key], key };
  G = { key, R, step: 0, treat: { recipe: key, batter: R.base, deco: [], baked: false }, blobs: [], lastSay: '', colorName: '' };
  token++;
  app.innerHTML = `
  <div class="game" style="--accent:${R.tile}">
    <header class="topbar">
      <button class="icon-btn home-btn" aria-label="Home">${ICONS.home}</button>
      <div class="steps">${R.steps.map((s) => `<i data-s="${s}">${STEP_ICON[s]}</i>`).join('')}</div>
      <button class="icon-btn repeat-btn" aria-label="Say it again">${ICONS.speaker}</button>
    </header>
    <div class="talk">
      <button class="chef" aria-label="Chef Bun, tap to hear again">${CHEF}</button>
      <div class="bubble"><div class="bubble-text"></div><div class="bubble-visual"></div></div>
    </div>
    <main class="scene"></main>
    <footer class="tray"></footer>
  </div>`;
  $('.home-btn').addEventListener('click', confirmHome);
  const again = () => { sfx.tap(); say(G.lastSay); };
  $('.repeat-btn').addEventListener('click', again);
  $('.talk .chef').addEventListener('click', again);
  runStep();
}

function runStep() {
  token++;
  const type = G.R.steps[G.step];
  app.querySelectorAll('.steps i').forEach((el, i) => { el.classList.toggle('done', i < G.step); el.classList.toggle('now', i === G.step); });
  $('.scene').className = 'scene scene-' + type;
  $('.scene').innerHTML = ''; $('.tray').innerHTML = ''; $('.tray').className = 'tray';
  STEPS[type]();
}
function next() { G.step++; runStep(); }

function talk(html, speech, visual = '') {
  $('.bubble-text').innerHTML = html;
  $('.bubble-visual').innerHTML = visual;
  pulse($('.bubble'));
  G.lastSay = speech;
  say(speech);
}

function countVisual(n, iconHTML, lit = 0) {
  let s = `<div class="count"><b class="numeral">${n}</b><div class="slots">`;
  for (let i = 0; i < n; i++) s += `<span class="slot ${i < lit ? 'lit' : ''}">${iconHTML}</span>`;
  return s + '</div></div>';
}
function lightSlot(i) {
  const s = app.querySelectorAll('.bubble-visual .slot')[i];
  if (s) { s.classList.add('lit'); pulse(s); }
  pulse($('.bubble-visual .numeral'));
}

function checkButton(label = 'All done') {
  const b = document.createElement('button');
  b.className = 'go-btn'; b.setAttribute('aria-label', label); b.innerHTML = ICONS.check;
  return b;
}

function confirmHome() {
  sfx.tap();
  const o = document.createElement('div');
  o.className = 'overlay';
  o.innerHTML = `<div class="dialog"><div class="dialog-q">${ICONS.home}<span>Go home?</span></div>
    <div class="dialog-btns"><button class="yes" aria-label="Yes, go home">${ICONS.check}</button><button class="no" aria-label="No, keep cooking">✕</button></div></div>`;
  document.body.appendChild(o);
  say('Go home?');
  o.querySelector('.yes').addEventListener('click', () => { o.remove(); sfx.tap(); speechSynthesis?.cancel?.(); home(); });
  o.querySelector('.no').addEventListener('click', () => { o.remove(); sfx.tap(); say(G.lastSay); });
}

// ---------- Steps ----------
const STEPS = {
  letter() {
    const L = G.R.letter;
    const pool = 'ABCDEFGHIJKLMNOPRSTUW'.split('').filter((c) => c !== L);
    const opts = shuffle([L, ...shuffle(pool).slice(0, big() ? 3 : 2)]);
    talk(`Let's make <b>${G.R.name}</b>!<br><b class="big-letter">${L}</b> is for ${G.R.single}.`,
      `Let's make ${G.R.plural}! ${G.R.single} starts with the letter ${L}. Can you find the ${L}?`,
      `<div class="letter-hint"><span class="mini-treat">${treatSVG(G.R.sample)}</span></div>`);
    const scene = $('.scene');
    scene.innerHTML = `<div class="letters">${opts.map((c, i) => `<button class="letter-cookie" data-c="${c}" style="--c:${CANDY[(i * 2 + 1) % CANDY.length]}">${c}</button>`).join('')}</div>`;
    let wrong = 0, done = false;
    scene.querySelectorAll('.letter-cookie').forEach((b) => b.addEventListener('click', () => {
      if (done) return;
      const c = b.dataset.c;
      if (c === L) {
        done = true; sfx.yay(); pulse(b, 'win'); confetti(24);
        say(`${L}! Yes! ${L} is for ${G.R.single}!`);
        later(next, 2600);
      } else {
        wrong++; sfx.boing(); pulse(b, 'wiggle');
        say(`That is ${c}. Find the ${L}!`);
        if (wrong >= (big() ? 3 : 2)) scene.querySelector(`[data-c="${L}"]`).classList.add('hint');
      }
    }));
  },

  add() {
    const scene = $('.scene'), tray = $('.tray');
    scene.innerHTML = `<div class="bowl-wrap">${bowlSVG(G.blobs, G.R.base, 0)}</div>`;
    tray.classList.add('pantry');
    tray.innerHTML = G.R.ingredients.map((k) => `<button class="pantry-item" data-k="${k}" aria-label="${INGREDIENTS[k].name}">${INGREDIENTS[k].svg}</button>`).join('');
    const list = G.R.ingredients.slice();
    let idx = 0, need = 0, have = 0, busy = false;

    const setup = () => {
      const k = list[idx], ing = INGREDIENTS[k];
      need = k === 'egg' ? rnd(1, big() ? 4 : 3) : rnd(1, big() ? 5 : 3);
      have = 0; busy = false;
      tray.querySelectorAll('.pantry-item').forEach((b) => b.classList.toggle('want', b.dataset.k === k));
      const word = need === 1 ? ing.name : ing.plural;
      talk(`Put in <b>${need}</b> ${word}!`, `Put in ${need} ${word}!`, countVisual(need, ing.svg));
    };
    const addBlob = (k) => {
      const ing = INGREDIENTS[k];
      const a = Math.random() * Math.PI * 2, d = Math.sqrt(Math.random());
      G.blobs.push({ x: Math.round(120 + Math.cos(a) * d * 70), y: Math.round(60 + Math.sin(a) * d * 16), r: k === 'flour' ? 16 : k === 'egg' ? 11 : 12, c: ing.blob, yolk: k === 'egg' });
      $('.bowl-wrap').innerHTML = bowlSVG(G.blobs, G.R.base, 0);
      pulse($('.bowl-wrap'), 'squish');
    };

    tray.querySelectorAll('.pantry-item').forEach((b) => b.addEventListener('click', async () => {
      if (busy) return;
      const k = b.dataset.k;
      if (k !== list[idx]) {
        sfx.boing(); pulse(b, 'wiggle');
        const ing = INGREDIENTS[list[idx]];
        say(`That's the ${INGREDIENTS[k].name.replace(/^(scoop|cup|spoon|piece|splash) of /, '')}. We need ${need === 1 ? ing.name : ing.plural}!`);
        return;
      }
      if (have >= need) return;
      const n = ++have;
      sfx.tap();
      if (n === need) busy = true;
      await fly(b, $('.bowl-wrap'), INGREDIENTS[k].svg);
      sfx.plop(); addBlob(k); lightSlot(n - 1);
      say(String(n));
      if (n === need) {
        await wait(700);
        const ing = INGREDIENTS[k];
        sfx.yay(); say(`${need} ${need === 1 ? ing.name : ing.plural}! Good job!`);
        await wait(1900);
        idx++;
        if (idx < list.length) setup(); else next();
      }
    }));
    setup();
  },

  mix() {
    const scene = $('.scene');
    scene.innerHTML = `<div class="mix-area"><div class="bowl-wrap big">${bowlSVG(G.blobs, G.R.base, 0)}</div>
      <div class="whisk">${WHISK}</div></div>
      <div class="meter"><b></b></div>`;
    talk(`Stir it up!<br>Swirl your finger in the bowl.`, `Now stir it up! Swirl your finger around and around in the bowl!`);
    const area = $('.mix-area'), whisk = $('.whisk'), meter = $('.meter b');
    let prog = 0, last = null, angle = 0, lastSwish = 0, halfSaid = false, done = false;
    const update = () => {
      const bat = $('.batter'), blobs = $('.bowl-blobs');
      if (bat) bat.style.opacity = Math.min(1, prog);
      if (blobs) blobs.style.opacity = 1 - Math.min(1, prog) * 0.9;
      const sw = $('.swirl'); if (sw) sw.style.transform = `rotate(${angle}deg)`;
      meter.style.width = Math.min(100, prog * 100) + '%';
      if (prog > 0.5 && !halfSaid) { halfSaid = true; say('Stir, stir, stir!'); }
      if (prog >= 1 && !done) {
        done = true; sfx.yay(); confetti(20);
        say('All mixed! It looks yummy!');
        G.treat.batter = G.R.base;
        later(next, 2000);
      }
    };
    const move = (e) => {
      const r = area.getBoundingClientRect();
      whisk.style.left = e.clientX - r.left + 'px';
      whisk.style.top = e.clientY - r.top + 'px';
      whisk.classList.add('active');
      if (done) return;
      if (last) {
        const d = Math.hypot(e.clientX - last.x, e.clientY - last.y);
        prog += d / (r.width * 3.2);
        angle += d * 0.8;
        const now = performance.now();
        if (d > 2 && now - lastSwish > 260) { lastSwish = now; sfx.swish(); }
        update();
      }
      last = { x: e.clientX, y: e.clientY };
    };
    area.addEventListener('pointerdown', (e) => {
      area.setPointerCapture?.(e.pointerId); last = null; move(e);
      if (!done) { prog += 0.04; angle += 20; update(); } // little taps count too
    });
    area.addEventListener('pointermove', (e) => { if (e.buttons || e.pointerType === 'touch') move(e); });
    area.addEventListener('pointerup', () => { last = null; whisk.classList.remove('active'); });
  },

  color() {
    const scene = $('.scene'), tray = $('.tray');
    let drops = [];
    G.colorName = '';
    const batterNow = () => G.treat.batter;
    scene.innerHTML = `<div class="bowl-wrap big">${bowlSVG([], batterNow(), 1)}</div>`;
    tray.classList.add('paints');
    tray.innerHTML = PAINTS.map((p) => `<button class="paint" data-k="${p.k}" aria-label="${p.n}">${ICONS.bottle(p.c)}</button>`).join('') +
      `<div class="tray-actions"><button class="icon-btn undo-btn" aria-label="Start over">${ICONS.again}</button></div>`;
    const go = checkButton(); go.classList.add('hidden'); tray.querySelector('.tray-actions').appendChild(go);
    talk(`Pick a color!<br>Try mixing <b>two</b> colors.`, `Let's color the batter! Tap a color. Then try mixing two colors together!`);

    const equation = () => {
      if (!drops.length) return '';
      const parts = drops.map((d) => `<span class="eq-drop">${ICONS.drop(d.c)}</span>`).join('<b class="eq">+</b>');
      return `<div class="equation">${parts}<b class="eq">=</b><span class="eq-drop">${ICONS.drop(resultColor().c)}</span></div>`;
    };
    function resultColor() {
      if (drops.length === 1 || drops[0].k === drops[1].k) return { n: drops[0].n, c: drops[0].c };
      const key = [drops[0].k, drops[1].k].sort().join('+');
      const m = MIXES[key]; return { n: m[0], c: m[1] };
    }
    const refresh = () => {
      const res = resultColor();
      G.colorName = res.n;
      G.treat.batter = res.n === 'white' ? shade(G.R.base, 0.45) : blend(G.R.base, res.c, 0.62);
      $('.bowl-wrap').innerHTML = bowlSVG([], G.treat.batter, 1);
      pulse($('.bowl-wrap'), 'spin');
      $('.bubble-visual').innerHTML = equation();
    };
    tray.querySelectorAll('.paint').forEach((b) => b.addEventListener('click', async () => {
      const p = PAINTS.find((x) => x.k === b.dataset.k);
      sfx.tap(); pulse(b, 'squeeze');
      if (drops.length >= 2) drops = [];
      drops.push(p);
      await fly(b, $('.bowl-wrap'), ICONS.drop(p.c), { size: 44, dur: 500, toY: 0.3 });
      sfx.drip(); refresh();
      go.classList.remove('hidden');
      if (drops.length === 1) G.lastSay = `${p.n}!`;
      else if (drops[0].k === drops[1].k) G.lastSay = `More ${p.n}!`;
      else G.lastSay = `${drops[0].n} and ${drops[1].n} make ${resultColor().n}!`;
      say(G.lastSay);
    }));
    tray.querySelector('.undo-btn').addEventListener('click', () => {
      sfx.tap(); drops = []; G.treat.batter = G.R.base; G.colorName = '';
      $('.bowl-wrap').innerHTML = bowlSVG([], G.R.base, 1);
      $('.bubble-visual').innerHTML = '';
      go.classList.add('hidden'); say('Start over!');
    });
    go.addEventListener('click', () => { sfx.yay(); say(`${article(G.colorName)} ${G.R.single}! Pretty!`); later(next, 1500); go.disabled = true; });
  },

  shape() {
    const scene = $('.scene'), tray = $('.tray');
    G.treat.shape = G.treat.shape || 'circle';
    const draw = () => { scene.innerHTML = `<div class="treat-wrap">${treatSVG(G.treat)}</div>`; pulse($('.treat-wrap'), 'squish'); };
    draw();
    tray.classList.add('cutters');
    tray.innerHTML = Object.entries(SHAPES).map(([k, s]) => `<button class="cutter" data-k="${k}" aria-label="${s.name}">
      <svg viewBox="-100 -100 200 200"><path d="${s.path}" fill="#fff" stroke="#9aa7b5" stroke-width="14" stroke-linejoin="round"/></svg></button>`).join('') +
      `<div class="tray-actions"></div>`;
    const go = checkButton(); tray.querySelector('.tray-actions').appendChild(go);
    talk('Pick a cookie cutter!', 'Pick a cookie cutter! Circle, star, heart, or flower?');
    tray.querySelectorAll('.cutter').forEach((b) => b.addEventListener('click', () => {
      G.treat.shape = b.dataset.k; sfx.pop(); pulse(b);
      tray.querySelectorAll('.cutter').forEach((x) => x.classList.toggle('sel', x === b));
      draw(); say(`${article(SHAPES[b.dataset.k].name)}!`);
    }));
    go.addEventListener('click', () => { go.disabled = true; sfx.yay(); say(`${article(SHAPES[G.treat.shape].name)} cookie! Into the oven!`); later(next, 1600); });
  },

  knead() {
    const scene = $('.scene');
    const need = big() ? rnd(5, 8) : rnd(3, 5);
    let have = 0;
    scene.innerHTML = `<button class="dough-btn" aria-label="Dough">${DOUGH(0)}</button>`;
    const hand = `<svg viewBox="0 0 48 48"><circle cx="24" cy="26" r="16" fill="#f3d3b0" stroke="#5b3a29" stroke-width="3.5"/><path d="M14 20 L14 10 M20 17 L20 6 M27 17 L27 6 M33 20 L34 10" stroke="#5b3a29" stroke-width="3.5" stroke-linecap="round"/></svg>`;
    talk(`Squish the dough <b>${need}</b> times!`, `Now squish the dough! Tap it ${need} times!`, countVisual(need, hand));
    const btn = $('.dough-btn');
    btn.addEventListener('click', () => {
      if (have >= need) return;
      have++;
      sfx.plop(); lightSlot(have - 1); say(String(have));
      btn.innerHTML = DOUGH(have / need);
      pulse(btn, 'squish');
      if (have === need) {
        later(() => { sfx.yay(); say('Flat and round! Now it is a pizza!'); }, 600);
        later(next, 2600);
      }
    });
  },

  pan() {
    const scene = $('.scene');
    const total = big() ? 3 : 2;
    let made = 0;
    G.treat.stack = 0; G.treat.baked = true;
    scene.innerHTML = `
      <div class="stove">
        <button class="pan-btn" aria-label="Frying pan">${PAN}<div class="pancake"><i class="pc-face"></i><i class="pc-bubbles"></i></div></button>
        <div class="flame">${STOVE_FLAME}</div>
      </div>
      <div class="plate-wrap"><div class="plate"></div><b class="stack-count">0</b></div>`;
    const pc = $('.pancake'), panBtn = $('.pan-btn');
    const pcIcon = `<svg viewBox="0 0 48 48"><ellipse cx="24" cy="28" rx="20" ry="9" fill="${shade(G.treat.batter, -0.08)}" stroke="#5b3a29" stroke-width="3"/></svg>`;
    let phase = 'pour';
    const plate = () => { $('.plate').innerHTML = G.treat.stack ? treatSVG({ ...G.treat, frost: null, deco: [] }) : `<svg viewBox="0 0 200 200"><ellipse cx="100" cy="178" rx="92" ry="18" fill="#fff" stroke="#5b3a29" stroke-width="4"/><ellipse cx="100" cy="176" rx="70" ry="11" fill="#eef6ff"/></svg>`; $('.stack-count').textContent = G.treat.stack; };
    const begin = () => {
      phase = 'pour';
      pc.className = 'pancake'; pc.style.setProperty('--b', G.treat.batter); pc.style.setProperty('--d', shade(G.treat.batter, -0.15));
      talk(made ? 'Make another one!<br>Tap the pan.' : `Let's make <b>${total}</b> pancakes!<br>Tap the pan to pour.`,
        made ? 'Make another one! Tap the pan to pour the batter.' : `Let's make ${total} pancakes! Tap the pan to pour the batter.`,
        countVisual(total, pcIcon, made));
      panBtn.classList.add('hint');
    };
    panBtn.addEventListener('click', async () => {
      if (phase === 'pour') {
        phase = 'cooking'; panBtn.classList.remove('hint');
        sfx.drip(); pc.classList.add('raw'); sfx.sizzle();
        G.lastSay = 'Wait for the bubbles!';
        for (let i = 1; i <= 3; i++) { await wait(950); say(String(i)); sfx.sizzle(); pc.classList.add('b' + i); }
        await wait(700);
        phase = 'flip'; panBtn.classList.add('hint');
        talk('Bubbles! <b>Flip it!</b>', 'Bubbles! Flip it! Tap the pan!');
      } else if (phase === 'flip') {
        phase = 'cooking2'; panBtn.classList.remove('hint');
        sfx.swish(); pc.classList.add('flip');
        await wait(600);
        pc.classList.add('golden'); sfx.sizzle();
        for (let i = 1; i <= 2; i++) { await wait(900); say(String(i)); }
        await wait(500);
        await fly(panBtn, $('.plate'), pcIcon, { size: 90, dur: 600, toY: 0.5 });
        pc.className = 'pancake';
        made++; G.treat.stack = made; plate(); pulse($('.plate'), 'squish'); sfx.plop(); lightSlot(made - 1);
        say(made === 1 ? '1 pancake!' : `${made} pancakes!`);
        await wait(1500);
        if (made < total) begin();
        else { sfx.yay(); confetti(20); say(`A stack of ${total} pancakes! Let's decorate!`); later(next, 2400); }
      }
    });
    plate(); begin();
  },

  bake() {
    const scene = $('.scene');
    scene.innerHTML = `
      <div class="oven-area">
        <button class="oven-btn" aria-label="Oven">${OVEN}<div class="oven-treat"></div><b class="oven-count"></b></button>
        <div class="tray-treat">${treatSVG(G.treat)}</div>
      </div>`;
    const oven = $('.oven-btn'), ovenTreat = $('.oven-treat'), trayTreat = $('.tray-treat'), count = $('.oven-count');
    let phase = 'in';
    talk(`Into the oven!<br>Tap the oven.`, `Into the oven it goes! Tap the oven!`);
    oven.classList.add('hint');
    oven.addEventListener('click', async () => {
      if (phase === 'in') {
        phase = 'baking'; oven.classList.remove('hint');
        sfx.swish();
        await fly(trayTreat, ovenTreat, treatSVG(G.treat), { size: 120, dur: 700, toY: 0.5 });
        trayTreat.style.visibility = 'hidden';
        ovenTreat.innerHTML = treatSVG(G.treat);
        oven.classList.add('on');
        const nums = big() ? [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5];
        talk(big() ? 'Count down with me!' : 'Count with me!', big() ? 'Let us count down from 10!' : 'Let us count to 5!');
        await wait(1700);
        for (const n of nums) { count.textContent = n; pulse(count); sfx.tick(); say(String(n)); await wait(big() ? 850 : 1050); }
        count.textContent = '';
        G.treat.baked = true;
        ovenTreat.innerHTML = treatSVG(G.treat);
        sfx.ding(); oven.classList.add('ding'); oven.classList.add('hint');
        phase = 'out';
        talk('<b>Ding!</b> It\'s ready!<br>Tap to open.', 'Ding! It is ready! Tap the oven to take it out!');
      } else if (phase === 'out') {
        phase = 'done'; oven.classList.remove('hint', 'on', 'ding');
        ovenTreat.innerHTML = '';
        trayTreat.innerHTML = treatSVG(G.treat); trayTreat.style.visibility = 'visible';
        pulse(trayTreat, 'win'); sfx.sparkle(); sfx.yay(); confetti(24);
        say(G.R.key === 'pizza' ? 'Hot pizza! Yum!' : `Wow! It smells so good!`);
        later(next, 2200);
      }
    });
  },

  decorate() {
    const R = G.R, T = G.treat, scene = $('.scene'), tray = $('.tray');
    const history = [];
    const snap = () => history.push(JSON.stringify({ deco: T.deco, frost: T.frost, cheese: T.cheese }));
    scene.innerHTML = `<div class="treat-wrap deco">${treatSVG(T)}</div>`;
    const draw = () => { $('.treat-wrap').innerHTML = treatSVG(T); };

    const tabs = [{ k: 'frost', label: R.frostName, icon: ICONS.drop(R.frost[0].c) }];
    if (R.cheese) tabs.push({ k: 'cheese', label: 'cheese', icon: ICONS.cheese });
    if (R.sprinkles) tabs.push({ k: 'sprinkles', label: 'sprinkles', icon: ICONS.sprinkles });
    tabs.push({ k: 'stickers', label: R.key === 'pizza' ? 'toppings' : 'yummy treats', icon: sticker(R.stickers[0], 40) });
    tabs.push({ k: 'letters', label: 'letters', icon: ICONS.abc });
    const tool = { tab: 'frost', opt: 0, letterColor: 0 };

    // A little counting challenge woven into decorating.
    const chId = R.stickers[0];
    const ch = { id: chId, need: big() ? rnd(3, 6) : rnd(2, 4), have: 0, done: false };
    const chWord = (n) => (n === 1 ? STICKERS[chId].name : STICKERS[chId].plural);

    tray.classList.add('deco-tray');
    tray.innerHTML = `<div class="tabs">${tabs.map((t) => `<button class="tab" data-k="${t.k}" aria-label="${t.label}">${t.icon}</button>`).join('')}
      <span class="tabs-gap"></span><div class="tray-actions"><button class="icon-btn undo-btn" aria-label="Undo">${ICONS.undo}</button></div></div>
      <div class="opts"></div>`;
    const go = checkButton(); tray.querySelector('.tray-actions').appendChild(go);

    const opts = tray.querySelector('.opts');
    const renderOpts = () => {
      tray.querySelectorAll('.tab').forEach((b) => b.classList.toggle('sel', b.dataset.k === tool.tab));
      let h = '';
      if (tool.tab === 'frost') h = R.frost.map((f, i) => `<button class="opt" data-i="${i}" aria-label="${f.n}">${ICONS.drop(f.c)}</button>`).join('');
      else if (tool.tab === 'cheese') h = `<button class="opt wide" data-i="0" aria-label="Cheese">${ICONS.cheese}</button>`;
      else if (tool.tab === 'sprinkles') h = SPRINKLES.map((s, i) => `<button class="opt" data-i="${i}" aria-label="${s.n}"><span class="sprinkle-swatch">${s.c.slice(0, 4).map((c, j) => `<i style="background:${c};transform:rotate(${j * 50 - 60}deg)"></i>`).join('')}</span></button>`).join('');
      else if (tool.tab === 'stickers') h = R.stickers.map((id, i) => `<button class="opt" data-i="${i}" aria-label="${STICKERS[id].name}">${sticker(id, 44)}</button>`).join('');
      else if (tool.tab === 'letters') h = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((c, i) => `<button class="opt letter-opt" data-i="${i}" style="--c:${CANDY[i % CANDY.length]}">${c}</button>`).join('');
      opts.innerHTML = h;
      opts.scrollLeft = 0;
      markOpt();
      opts.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => pickOpt(+b.dataset.i, b)));
    };
    const markOpt = () => opts.querySelectorAll('.opt').forEach((b) => b.classList.toggle('sel', +b.dataset.i === tool.opt && tool.tab !== 'cheese'));
    const pickOpt = (i, b) => {
      tool.opt = i; markOpt(); pulse(b);
      if (tool.tab === 'frost') {
        snap(); T.frost = R.frost[i].c; draw(); pulse($('.treat-wrap'), 'squish'); sfx.drip(); say(R.frost[i].n + '!');
      } else if (tool.tab === 'cheese') {
        snap(); T.cheese = !T.cheese; draw(); sfx.sparkle(); say(T.cheese ? 'Cheese!' : 'No cheese!');
      } else if (tool.tab === 'sprinkles') { sfx.tap(); say(SPRINKLES[i].n + '! Tap your ' + R.single + '!'); }
      else if (tool.tab === 'stickers') { sfx.tap(); say(STICKERS[R.stickers[i]].name + '!'); }
      else if (tool.tab === 'letters') { sfx.tap(); say(String.fromCharCode(65 + i)); }
    };
    tray.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => {
      tool.tab = b.dataset.k; tool.opt = tool.tab === 'stickers' && !ch.done ? 0 : (tool.tab === 'frost' ? -1 : 0);
      sfx.tap(); renderOpts();
      const t = tabs.find((x) => x.k === tool.tab);
      say(t.label + '!');
    }));
    tool.opt = -1;
    renderOpts();

    $('.treat-wrap').addEventListener('pointerdown', (e) => {
      const svg = $('.treat-wrap svg'); if (!svg) return;
      e.preventDefault();
      const p = svgPoint(svg, e);
      if (tool.tab === 'frost') {
        if (tool.opt < 0) { sfx.boing(); say(`Pick a ${R.frostName} color first!`); return; }
        snap(); T.frost = R.frost[tool.opt].c; sfx.drip();
      } else if (tool.tab === 'cheese') {
        snap(); T.cheese = true; sfx.sparkle();
      } else if (tool.tab === 'sprinkles') {
        snap();
        const set = SPRINKLES[tool.opt].c;
        for (let i = 0; i < 8; i++) {
          const a = Math.random() * Math.PI * 2, d = 4 + Math.random() * 16;
          T.deco.push({ t: 's', x: +(p.x + Math.cos(a) * d).toFixed(1), y: +(p.y + Math.sin(a) * d).toFixed(1), c: set[i % set.length], r: rnd(0, 179) });
        }
        sfx.sparkle();
      } else if (tool.tab === 'stickers') {
        snap();
        const id = R.stickers[tool.opt];
        T.deco.push({ t: 'k', id, x: Math.round(p.x), y: Math.round(p.y), r: rnd(-20, 20) });
        sfx.pop();
        if (id === ch.id && !ch.done) {
          ch.have++; lightSlot(ch.have - 1); say(String(ch.have));
          if (ch.have >= ch.need) {
            ch.done = true;
            later(() => { sfx.yay(); confetti(20); say(`${ch.need} ${chWord(ch.need)}! You did it!`); }, 700);
          }
        } else say(STICKERS[id].name);
      } else if (tool.tab === 'letters') {
        snap();
        const ch2 = String.fromCharCode(65 + tool.opt);
        T.deco.push({ t: 'l', ch: ch2, x: Math.round(p.x), y: Math.round(p.y), c: CANDY[tool.letterColor++ % CANDY.length], r: rnd(-15, 15) });
        sfx.pop(); say(ch2);
      }
      draw();
    });

    tray.querySelector('.undo-btn').addEventListener('click', () => {
      sfx.tap();
      const h = history.pop(); if (!h) { sfx.boing(); return; }
      const v = JSON.parse(h);
      // If an undo takes back a challenge sticker, count it back down.
      const lost = T.deco.length - v.deco.length;
      for (let i = 0; i < lost; i++) {
        const d = T.deco[T.deco.length - 1 - i];
        if (d.t === 'k' && d.id === ch.id && !ch.done && ch.have > 0) {
          ch.have--; const s = app.querySelectorAll('.bubble-visual .slot')[ch.have]; if (s) s.classList.remove('lit');
        }
      }
      Object.assign(T, v); draw();
    });
    go.addEventListener('click', () => { go.disabled = true; sfx.yay(); next(); });

    const what = R.key === 'pizza' ? 'Add sauce, cheese and toppings!' : `Decorate your ${R.single}!`;
    talk(`${what}<br>Can you add <b>${ch.need}</b> ${chWord(ch.need)}?`,
      `${what} Can you put ${ch.need} ${chWord(ch.need)} on it?`, countVisual(ch.need, sticker(chId, 40)));
  },

  done() {
    const R = G.R, T = G.treat, scene = $('.scene'), tray = $('.tray');
    addToBakery({ ...T, colorName: G.colorName });
    const desc = describe(T, G.colorName);
    scene.innerHTML = `<div class="treat-wrap final">${treatSVG(T)}</div><div class="sparkles" aria-hidden="true">${'<i></i>'.repeat(8)}</div>`;
    tray.classList.add('end-tray');
    tray.innerHTML = `<button class="big-btn again-btn" aria-label="Cook again">${ICONS.again}</button>
      <button class="big-btn bakery-btn" aria-label="My bakery">${ICONS.bakery}</button>
      <button class="big-btn home2-btn" aria-label="Home">${ICONS.home}</button>`;
    sfx.fanfare(); confetti(70);
    talk(`<b>Yummy!</b> You made it!<br>Tap to take a bite!`, `Hooray! You made ${desc}! It is in your bakery. Tap it to take a bite!`);
    const wrap = $('.treat-wrap');
    const bites = [];
    let gone = false;
    wrap.addEventListener('pointerdown', (e) => {
      if (gone) return;
      e.preventDefault();
      const r = wrap.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top, s = r.width / 200;
      bites.push([[x, y, 26 * s], [x + 18 * s, y - 14 * s, 16 * s], [x - 18 * s, y + 12 * s, 16 * s], [x - 10 * s, y - 20 * s, 14 * s], [x + 14 * s, y + 18 * s, 14 * s]]);
      const layers = bites.flat().map(([cx, cy, cr]) => `radial-gradient(circle at ${cx.toFixed(0)}px ${cy.toFixed(0)}px, transparent ${cr.toFixed(0)}px, #000 ${(cr + 1).toFixed(0)}px)`).join(',');
      wrap.style.webkitMaskImage = wrap.style.maskImage = layers;
      wrap.style.webkitMaskComposite = 'source-in';
      wrap.style.maskComposite = 'intersect';
      sfx.chomp(); pulse(wrap, 'squish');
      const crumbs = document.createElement('div'); crumbs.className = 'crumbs'; crumbs.style.left = x + 'px'; crumbs.style.top = y + 'px';
      crumbs.innerHTML = '<i></i><i></i><i></i><i></i><i></i>';
      crumbs.style.setProperty('--crumb', shade(T.batter || '#f3dfb8', -0.2));
      wrap.parentElement.appendChild(crumbs); setTimeout(() => crumbs.remove(), 900);
      const words = ['Yum!', 'Crunch!', 'Mmm!', 'So good!', 'Nom nom!'];
      if (bites.length >= 6) {
        gone = true;
        later(() => { wrap.classList.add('gone'); sfx.fanfare(); say('All gone! Should we make another one?'); confetti(30); }, 400);
      } else say(words[(bites.length - 1) % words.length]);
    });
    tray.querySelector('.again-btn').addEventListener('click', () => { sfx.pop(); startGame(G.key); });
    tray.querySelector('.bakery-btn').addEventListener('click', () => { sfx.tap(); showBakery(); });
    tray.querySelector('.home2-btn').addEventListener('click', () => { sfx.tap(); home(); });
  },
};

function describe(t, colorName) {
  const R = RECIPES[t.recipe];
  let s;
  if (t.recipe === 'pancake') s = `${t.stack} ${colorName ? colorName + ' ' : ''}pancakes`;
  else if (t.recipe === 'pizza') s = 'a yummy pizza';
  else if (t.recipe === 'cookie') s = article(`${colorName ? colorName + ' ' : ''}${SHAPES[t.shape || 'circle'].name} cookie`);
  else s = article(`${colorName ? colorName + ' ' : ''}${R.single}`);
  const counts = {};
  for (const d of t.deco || []) if (d.t === 'k') counts[d.id] = (counts[d.id] || 0) + 1;
  const parts = Object.entries(counts).slice(0, 2).map(([id, n]) => `${n} ${n === 1 ? STICKERS[id].name : STICKERS[id].plural}`);
  const letters = (t.deco || []).filter((d) => d.t === 'l').map((d) => d.ch);
  if (letters.length) parts.push(`the letter${letters.length > 1 ? 's' : ''} ${letters.slice(0, 5).join(', ')}`);
  if (parts.length) s += ' with ' + parts.join(' and ');
  return s;
}

// ---------- Bakery ----------
function showBakery() {
  token++;
  const list = bakery();
  app.innerHTML = `
  <div class="bakery">
    <header class="topbar"><button class="icon-btn home-btn" aria-label="Home">${ICONS.home}</button><h2>My Bakery</h2><span class="spacer"></span></header>
    <div class="shelf">${list.length ? list.map((t, i) => `<button class="shelf-item" data-i="${i}">${treatSVG(t)}</button>`).join('') :
      `<div class="empty"><div class="chef">${CHEF}</div><p>Nothing here yet.<br>Let's cook something!</p></div>`}</div>
  </div>`;
  $('.home-btn').addEventListener('click', () => { sfx.tap(); home(); });
  say(list.length ? `Your bakery has ${list.length} ${list.length === 1 ? 'treat' : 'treats'}! Tap one!` : 'Your bakery is empty. Let us cook something!');
  app.querySelectorAll('.shelf-item').forEach((b) => b.addEventListener('click', () => {
    const t = list[+b.dataset.i];
    sfx.pop();
    const o = document.createElement('div'); o.className = 'overlay';
    o.innerHTML = `<div class="dialog view"><div class="treat-wrap">${treatSVG(t)}</div><button class="big-btn close" aria-label="Close">${ICONS.check}</button></div>`;
    document.body.appendChild(o);
    say(`You made ${describe(t, t.colorName)}!`);
    o.addEventListener('click', () => { o.remove(); sfx.tap(); });
  }));
}

// ---------- Grown-ups panel ----------
function parentPanel() {
  const o = document.createElement('div'); o.className = 'overlay';
  const voices = voiceList();
  o.innerHTML = `<div class="dialog parents">
    <h2>Grown-ups</h2>
    <label class="row">Age
      <span class="seg"><button data-l="little" class="${settings.level === 'little' ? 'sel' : ''}">3–4</button><button data-l="big" class="${settings.level === 'big' ? 'sel' : ''}">5–6</button></span></label>
    <p class="note">5–6 uses bigger numbers, more letter choices, and a count-down from 10.</p>
    <label class="row">Talking <input type="checkbox" class="sw-speech" ${settings.speech ? 'checked' : ''}></label>
    <label class="row">Sounds <input type="checkbox" class="sw-sound" ${settings.sound ? 'checked' : ''}></label>
    <label class="row col">Voice
      <select class="voice-sel"><option value="">Automatic</option>${voices.map((v) => `<option ${v.name === settings.voice ? 'selected' : ''}>${v.name.replace(/[<>&]/g, '')}</option>`).join('')}</select></label>
    <label class="row col">Voice pitch (higher sounds younger)
      <input type="range" class="pitch" min="1" max="2" step="0.1" value="${settings.pitch}"></label>
    <button class="text-btn test">Test voice</button>
    <button class="text-btn danger clear">Empty the bakery</button>
    <button class="text-btn primary close">Done</button>
    <p class="note">Little Chef ${VERSION}. No ads, no accounts, works offline.</p>
  </div>`;
  document.body.appendChild(o);
  const q = (s) => o.querySelector(s);
  o.querySelectorAll('.seg button').forEach((b) => b.addEventListener('click', (e) => {
    e.preventDefault(); settings.level = b.dataset.l; saveSettings();
    o.querySelectorAll('.seg button').forEach((x) => x.classList.toggle('sel', x === b));
  }));
  q('.sw-speech').addEventListener('change', (e) => { settings.speech = e.target.checked; saveSettings(); });
  q('.sw-sound').addEventListener('change', (e) => { settings.sound = e.target.checked; saveSettings(); });
  q('.voice-sel').addEventListener('change', (e) => { settings.voice = e.target.value; saveSettings(); say('Hi! I am Chef Bun!'); });
  q('.pitch').addEventListener('change', (e) => { settings.pitch = +e.target.value; saveSettings(); say('Hi! I am Chef Bun!'); });
  q('.test').addEventListener('click', () => say('Hi! I am Chef Bun! Let us make cupcakes!'));
  q('.clear').addEventListener('click', () => { if (confirm('Delete every saved treat in the bakery?')) { clearBakery(); q('.clear').textContent = 'Bakery emptied'; } });
  q('.close').addEventListener('click', () => o.remove());
}

// ---------- Start ----------
home();
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
