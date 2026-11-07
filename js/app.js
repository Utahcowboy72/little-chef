import { CHEF, ICONS, OVEN, STICKERS, shade } from './art.js';
import { ING, GROUPS, RECIPES, TINS, raw, chopped, dish, mixBowl, cookPan, cookPot, bakeOven, blendIt, mixColor, colorName } from './food.js';
import {
  dishSVG, itemIcon, STATION_ICONS, STATION_NAMES, BOARD, KNIFE, BIG_BOWL, PAN_TOP, POT_TOP, BURNER, BLENDER, TIN_ICONS, CUTTERS, PUPPY, TRASH, BOOK, CAMERA,
} from './kart.js';
import { sfx, say, unlock, onSpeaking, voiceList } from './audio.js';
import { settings, saveSettings, bakery, addToBakery, clearBakery } from './store.js';

const VERSION = 'v2';
const app = document.getElementById('app');

// ---------- Small helpers ----------
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const big = () => settings.level === 'big';
const $ = (sel, root = app) => root.querySelector(sel);
const $$ = (sel, root = app) => [...root.querySelectorAll(sel)];
const article = (w) => (/^[aeiou]/i.test(w) ? 'an ' : 'a ') + w;
const CANDY = ['#ff5a5a', '#ff9a3c', '#ffd23f', '#5cc46a', '#4b8dff', '#c06ccf', '#ff7eb6'];
const DROPS = [{ n: 'red', c: '#ff3b3b' }, { n: 'yellow', c: '#ffd93b' }, { n: 'blue', c: '#3b7bff' }, { n: 'white', c: '#ffffff' }];
const MIXNAME = { 'red+yellow': 'orange', 'blue+red': 'purple', 'blue+yellow': 'green', 'red+white': 'pink', 'blue+white': 'light blue', 'white+yellow': 'light yellow' };
const STATIONS = ['fridge', 'board', 'bowl', 'stove', 'oven', 'blender', 'table'];
const TRAY_MAX = 12;
const WHISK_SVG = `<svg viewBox="0 0 60 140" aria-hidden="true"><rect x="24" y="86" width="12" height="52" rx="6" fill="#ff8a65" stroke="#5b3a29" stroke-width="4"/><path d="M30 88 Q4 60 18 20 Q30 0 42 20 Q56 60 30 88 Z" fill="none" stroke="#9aa7b5" stroke-width="4"/><path d="M30 88 Q16 56 24 18 M30 88 Q44 56 36 18 M30 88 L30 8" fill="none" stroke="#b9c4cf" stroke-width="3.5"/></svg>`;

let token = 0;
function later(fn, ms) { const t = token; setTimeout(() => { if (t === token) fn(); }, ms); }
const wait = (ms) => new Promise((res) => later(res, ms));

function blendC(a, b, w) {
  const x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16);
  const c = (s) => Math.round(((x >> s) & 255) * (1 - w) + ((y >> s) & 255) * w);
  return '#' + ((1 << 24) + (c(16) << 16) + (c(8) << 8) + c(0)).toString(16).slice(1);
}

function fly(fromEl, toEl, html, { size = 72, dur = 600, toY = 0.45 } = {}) {
  return new Promise((res) => {
    if (!fromEl || !toEl || !fromEl.isConnected || !toEl.isConnected) { res(); return; }
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
      { transform: `translate(${dx * 0.5}px, ${Math.min(dy * 0.5, 0) - 70}px) scale(1.1) rotate(20deg)`, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(.6) rotate(40deg)`, opacity: 0.9 },
    ], { duration: dur, easing: 'cubic-bezier(.4,.1,.6,1)' });
    anim.onfinish = () => { el.remove(); res(); };
  });
}

function confetti(n = 40) {
  const box = document.createElement('div'); box.className = 'confetti';
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + '%';
    p.style.background = CANDY[i % CANDY.length];
    p.style.animationDelay = Math.random() * 0.5 + 's';
    p.style.animationDuration = 1.6 + Math.random() * 1.2 + 's';
    p.style.setProperty('--spin', rnd(-720, 720) + 'deg');
    p.style.setProperty('--drift', rnd(-60, 60) + 'px');
    if (i % 3 === 0) p.style.borderRadius = '50%';
    box.appendChild(p);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 3400);
}
function hearts(el, n = 6) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  for (let i = 0; i < n; i++) {
    const h = document.createElement('div'); h.className = 'heart-pop'; h.textContent = ['❤️', '💛', '💖', '⭐'][i % 4];
    h.style.left = r.left + r.width * (0.2 + Math.random() * 0.6) + 'px'; h.style.top = r.top + r.height * 0.3 + 'px';
    h.style.animationDelay = i * 0.12 + 's'; h.style.setProperty('--dx', rnd(-50, 50) + 'px');
    document.body.appendChild(h); setTimeout(() => h.remove(), 2200);
  }
}
function pulse(el, cls = 'pop') { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
onSpeaking((on) => $$('.chef').forEach((c) => c.classList.toggle('talking', on)));

// ---------- Kitchen state (kept between visits) ----------
const SAVE = 'little-chef-kitchen';
function freshKitchen() {
  return {
    tray: [], goal: null, served: 0,
    bowl: { items: [], drops: [] },
    board: { item: null, chops: 0 },
    stove: { tool: 'pan', pan: [], pot: [] },
    oven: { tin: null, items: [], shape: 'circle', sauce: '#e8442e', cheese: false, toppings: [], ready: null },
    blender: { items: [] },
    table: { dish: null },
  };
}
let K;
try { K = Object.assign(freshKitchen(), JSON.parse(localStorage.getItem(SAVE)) || {}); } catch (e) { K = freshKitchen(); }
function persist() { try { localStorage.setItem(SAVE, JSON.stringify(K)); } catch (e) { /* ignore */ } }

let station = 'fridge', lastSay = '', trashMode = false, pickCount = 0;

function talk(text, speech = text) {
  const t = $('.bubble-text');
  text = text.charAt(0).toUpperCase() + text.slice(1);
  if (t) { t.innerHTML = text; pulse($('.bubble')); }
  lastSay = speech.replace(/<[^>]+>/g, '');
  say(lastSay);
}
const plural = (key, n) => (n === 1 ? ING[key].n : ING[key].p);
function afterMake() {
  const g = goalState();
  if (g) later(() => talk(goalHint() || `Now go to the <b>${STATION_NAMES[g.cur.st]}</b>!`), 1500);
}

// ---------- Home ----------
function home() {
  token++;
  app.innerHTML = `
  <div class="home">
    <div class="bunting" aria-hidden="true">${'<i></i>'.repeat(12)}</div>
    <h1 class="title"><span>Little</span> <span>Chef</span></h1>
    <div class="home-scene">
      <button class="home-chef chef" aria-label="Chef Bun">${CHEF}</button>
      <button class="home-pup" aria-label="Biscuit the puppy">${PUPPY}</button>
    </div>
    <button class="play-btn">Let's cook!</button>
    <div class="home-row">
      <button class="round-btn book-btn" aria-label="Recipe book">${BOOK}<span>Recipes</span></button>
      <button class="round-btn album-btn" aria-label="Photo album">${CAMERA}<span>Photos</span></button>
    </div>
    <div class="home-bottom">
      <button class="round-btn parent-btn" aria-label="Grown-ups: hold to open settings">${ICONS.gear}<span>Grown-ups<br><small>hold</small></span><b class="hold-ring"></b></button>
    </div>
    <div class="version">${VERSION}</div>
  </div>`;
  $('.play-btn').addEventListener('click', () => { unlock(); sfx.pop(); openKitchen(K.tray.length ? null : 'fridge'); });
  $('.book-btn').addEventListener('click', () => { unlock(); sfx.tap(); recipeBook(); });
  $('.album-btn').addEventListener('click', () => { unlock(); sfx.tap(); album(); });
  $('.home-chef').addEventListener('click', () => { unlock(); sfx.boing(); pulse($('.home-chef'), 'wiggle'); say(`Hi${settings.name ? ' ' + settings.name : ''}! I'm Chef Bun, and this is Biscuit! Let's cook something yummy!`); });
  $('.home-pup').addEventListener('click', () => { unlock(); sfx.boing(); pulse($('.home-pup'), 'wiggle'); say('Woof woof! Biscuit is hungry!'); });
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

// ---------- Kitchen shell ----------
function openKitchen(st) {
  token++;
  app.innerHTML = `
  <div class="kitchen">
    <header class="topbar">
      <button class="icon-btn home-btn" aria-label="Home">${ICONS.home}</button>
      <div class="guide"></div>
      <button class="icon-btn book-btn" aria-label="Recipe book">${BOOK}</button>
    </header>
    <div class="talk">
      <button class="chef" aria-label="Chef Bun, tap to hear again">${CHEF}</button>
      <div class="bubble"><div class="bubble-text"></div></div>
    </div>
    <main class="scene"></main>
    <div class="tray-wrap">
      <div class="tray-items"></div>
      <button class="trash-btn" aria-label="Trash">${TRASH}</button>
    </div>
    <nav class="stations">${STATIONS.map((s) => `<button class="st-btn" data-s="${s}" aria-label="${STATION_NAMES[s]}">${STATION_ICONS[s]}</button>`).join('')}</nav>
  </div>`;
  $('.home-btn').addEventListener('click', () => { sfx.tap(); persist(); home(); });
  $('.book-btn').addEventListener('click', () => { sfx.tap(); recipeBook(); });
  $('.talk .chef').addEventListener('click', () => { sfx.tap(); say(lastSay); });
  $('.trash-btn').addEventListener('click', () => {
    sfx.tap(); trashMode = !trashMode;
    $('.trash-btn').classList.toggle('on', trashMode);
    $('.tray-items').classList.toggle('trashing', trashMode);
    if (trashMode) say('Tap something to throw it away.');
  });
  $$('.st-btn').forEach((b) => b.addEventListener('click', () => { sfx.tap(); go(b.dataset.s); }));
  go(st || nextGoalStation() || station);
}

function go(st) {
  station = st;
  trashMode = false;
  $('.trash-btn')?.classList.remove('on');
  $$('.st-btn').forEach((b) => b.classList.toggle('sel', b.dataset.s === st));
  const scene = $('.scene');
  scene.className = 'scene st-' + st;
  scene.innerHTML = '';
  token++;
  VIEWS[st]();
  renderTray();
  renderGuide();
  const hint = goalHint();
  if (hint) talk(hint);
}

// ---------- Tray ----------
function renderTray() {
  const box = $('.tray-items'); if (!box) return;
  box.classList.toggle('trashing', trashMode);
  box.innerHTML = K.tray.length ? K.tray.map((it) => `<button class="tray-item" data-id="${it.id}" aria-label="${it.n}">${itemIcon(it)}</button>`).join('')
    : `<span class="tray-empty">Your tray is empty</span>`;
  $$('.tray-item').forEach((b) => b.addEventListener('click', () => {
    const it = K.tray.find((x) => x.id === +b.dataset.id); if (!it) return;
    if (trashMode) {
      sfx.swish(); takeFromTray(it); trashMode = false; $('.trash-btn').classList.remove('on');
      say('Bye bye ' + it.n + '!'); renderTray(); renderGuide(); return;
    }
    const h = VIEWS[station].use;
    if (h) h(it, b); else { sfx.tap(); say(it.n); }
  }));
  persist();
}
function takeFromTray(it) { K.tray = K.tray.filter((x) => x.id !== it.id); persist(); }
async function giveToTray(it, fromEl) {
  if (K.tray.length >= TRAY_MAX) { sfx.boing(); talk('Your tray is full! Use something, or tap the trash can.'); return false; }
  K.tray.push(it);
  if (fromEl) await fly(fromEl, $('.tray-wrap'), itemIcon(it), { size: 64, toY: 0.5 });
  renderTray(); renderGuide();
  pulse($(`.tray-item[data-id="${it.id}"]`), 'win');
  return true;
}

// ---------- Recipe guidance ----------
function trayHas(fn) { return K.tray.some(fn) || !!(K.table.dish && fn(K.table.dish)); }
function productMade(p) {
  if (p === 'batter' || p === 'dough' || p === 'beaten') return trayHas((i) => i.t === p);
  if (p === 'chop') return trayHas((i) => i.t === 'chop');
  return trayHas((i) => i.t === 'dish' && i.kind === p);
}
function goalState() {
  const R = RECIPES.find((r) => r.k === K.goal); if (!R) return null;
  const made = R.steps.map(([, p]) => productMade(p));
  const lastDone = made.lastIndexOf(true);
  const inUse = (k) => [K.bowl.items, K.blender.items, K.stove.pan, K.stove.pot, K.oven.items].some((l) => l.some((i) => i.key === k)) || (K.board.item && K.board.item.key === k);
  const haveAll = R.need.every((k) => trayHas((i) => i.key === k) || inUse(k));
  let cur;
  if (made[made.length - 1]) cur = { st: 'table' };
  else if (lastDone < 0 && !haveAll) cur = { st: 'fridge' };
  else { const i = lastDone + 1; cur = { st: R.steps[i][0], tool: R.steps[i][2], idx: i }; }
  return { R, made, cur, haveAll };
}
function nextGoalStation() { const g = goalState(); return g ? g.cur.st : null; }
function goalHint() {
  const g = goalState(); if (!g || g.cur.st !== station) return null;
  const R = g.R, names = R.need.map((k) => ING[k].p).join(', ').replace(/, ([^,]*)$/, ' and $1');
  switch (station) {
    case 'fridge': { const miss = R.need.filter((k) => !trayHas((i) => i.key === k)); return miss.length ? `For ${R.n.toLowerCase()} we need <b>${miss.map((k) => ING[k].p).join(', ')}</b>!` : null; }
    case 'board': return `Chop the ${R.need.filter((k) => ING[k].chop).map((k) => ING[k].p).join(' and ')}! Tap them on your tray.`;
    case 'bowl': return R.steps[g.cur.idx][1] === 'bowlfood' ? 'Put the fruit in the bowl and stir!' : `Put the ${names} in the bowl and stir!`;
    case 'stove': return g.cur.tool === 'pot' ? 'Use the <b>pot</b>! Put the food in and stir.' : 'Use the <b>pan</b>! Put it in and cook.';
    case 'oven': return K.oven.tin ? null : `Pick the <b>${TINS[g.cur.tool].n}</b>, then bake!`;
    case 'blender': return `Put the ${names} in the blender and blend!`;
    case 'table': return R.k === 'sandwich' && !productMade('sandwich') ? 'Put bread on the plate, then stack yummy things on top!' : 'Put it on the plate, decorate it, and feed Biscuit!';
  }
  return null;
}
function renderGuide() {
  const box = $('.guide'); if (!box) return;
  $$('.st-btn').forEach((b) => b.classList.remove('goal'));
  const g = goalState();
  if (!g) { box.innerHTML = ''; return; }
  const needs = g.R.need.map((k) => `<span class="need ${trayHas((i) => i.key === k) || g.made.some(Boolean) ? 'got' : ''}">${ING[k].e}</span>`).join('');
  box.innerHTML = `<button class="guide-card" aria-label="${g.R.n}">${dishSVG(g.R.show, { cls: 'mini' })}</button><div class="needs">${needs}</div>`;
  $('.guide-card').addEventListener('click', () => { sfx.tap(); talk(goalHint() || `Let's make ${g.R.n.toLowerCase()}! Go to the <b>${STATION_NAMES[g.cur.st]}</b>!`); });
  $(`.st-btn[data-s="${g.cur.st}"]`)?.classList.add('goal');
}

// ---------- Counting & letters, lightly ----------
function countSay(list, key) {
  const n = list.filter((i) => i.key === key).length;
  return n > 1 ? `${n} ${plural(key, n)}!` : `${ING[key].n}!`;
}
function letterFlash(word) {
  const L = word[0].toUpperCase();
  const el = document.createElement('div'); el.className = 'letter-flash'; el.textContent = L;
  el.style.setProperty('--c', CANDY[L.charCodeAt(0) % CANDY.length]);
  $('.scene')?.appendChild(el); setTimeout(() => el.remove(), 1600);
  return `${L} is for ${word}!`;
}

// ---------- Stations ----------
const VIEWS = {};

// --- Fridge & pantry ---
VIEWS.fridge = function () {
  const scene = $('.scene');
  let group = VIEWS.fridge.group || 'fruit';
  scene.innerHTML = `<div class="fridge">
    <div class="shelf-tabs">${GROUPS.map((g) => `<button class="shelf-tab" data-g="${g.k}" aria-label="${g.n}"><span class="emo-icon">${g.e}</span></button>`).join('')}</div>
    <div class="shelf-grid"></div></div>`;
  const grid = $('.shelf-grid');
  const draw = () => {
    $$('.shelf-tab').forEach((b) => b.classList.toggle('sel', b.dataset.g === group));
    const g = goalState();
    const wantGroups = g ? new Set(g.R.need.filter((k) => !trayHas((i) => i.key === k)).map((k) => ING[k].g)) : new Set();
    $$('.shelf-tab').forEach((b) => b.classList.toggle('want', wantGroups.has(b.dataset.g) && b.dataset.g !== group));
    grid.innerHTML = Object.entries(ING).filter(([, v]) => v.g === group)
      .map(([k, v]) => `<button class="food-btn ${g && g.R.need.includes(k) && !trayHas((i) => i.key === k) ? 'want' : ''}" data-k="${k}" aria-label="${v.n}"><span class="emo-icon">${v.e}</span></button>`).join('');
    $$('.food-btn').forEach((b) => b.addEventListener('click', async () => {
      const k = b.dataset.k;
      sfx.pop(); pulse(b);
      const ok = await giveToTray(raw(k), b);
      if (!ok) return;
      pickCount++;
      const n = K.tray.filter((i) => i.key === k).length;
      let line = n > 1 ? `${n} ${plural(k, n)}!` : `${ING[k].n}!`;
      if (n === 1 && pickCount % 3 === 1) line += ' ' + letterFlash(ING[k].n);
      talk(line);
      draw();
      const g2 = goalState();
      if (g2 && g2.cur.st !== 'fridge' && !g2.made.some(Boolean)) later(() => talk(`You found everything! Now go to the <b>${STATION_NAMES[g2.cur.st]}</b>!`), 1500);
    }));
  };
  $$('.shelf-tab').forEach((b) => b.addEventListener('click', () => {
    group = VIEWS.fridge.group = b.dataset.g; sfx.tap(); draw();
    say(GROUPS.find((g) => g.k === group).n + '!');
  }));
  draw();
  if (!goalHint()) talk('What should we cook? Pick some food!');
};
VIEWS.fridge.use = (it) => { sfx.tap(); say(it.n); };

// --- Cutting board ---
VIEWS.board = function () {
  const scene = $('.scene');
  scene.innerHTML = `<div class="board-area"><div class="board-bg">${BOARD}</div><div class="board-food"></div><div class="knife">${KNIFE}</div></div>`;
  drawBoard();
  const area = $('.board-area');
  area.addEventListener('pointerdown', (e) => {
    const B = K.board; if (!B.item) { sfx.boing(); talk('Tap food on your tray to put it on the board.'); return; }
    if (B.busy) return;
    const r = area.getBoundingClientRect();
    const knife = $('.knife');
    knife.style.left = Math.max(15, Math.min(85, ((e.clientX - r.left) / r.width) * 100)) + '%';
    pulse(knife, 'chop');
    sfx.chomp();
    B.chops++;
    const need = big() ? 5 : 3;
    say(String(B.chops));
    drawBoard();
    if (B.chops >= need) {
      B.busy = true;
      const piece = chopped(B.item);
      later(async () => {
        B.item = null; B.chops = 0; B.busy = false;
        drawBoard();
        await giveToTray(piece, $('.board-area'));
        sfx.yay(); talk(`Chopped ${ING[piece.key].n}!`);
        afterMake();
      }, 400);
    }
    persist();
  });
  if (!goalHint()) talk(K.board.item ? 'Tap the board to chop!' : 'Put food on the board, then chop chop chop!');
};
function drawBoard() {
  const B = K.board, box = $('.board-food'); if (!box) return;
  if (!B.item) { box.innerHTML = ''; return; }
  const n = B.chops + 1;
  let h = '';
  for (let i = 0; i < n; i++) {
    const x = n === 1 ? 50 : 22 + (i * 56) / (n - 1);
    h += `<span class="piece" style="left:${x}%;--rot:${(i % 2 ? 1 : -1) * i * 9}deg;--sc:${Math.max(0.45, 1 - B.chops * 0.14)}">${B.item.e}</span>`;
  }
  box.innerHTML = h;
}
VIEWS.board.use = async (it, el) => {
  if (K.board.item) { sfx.boing(); talk('Chop this one first!'); return; }
  if (it.t === 'chop') { sfx.boing(); talk("That's already chopped!"); return; }
  if (it.t !== 'raw' || !ING[it.key].chop) { sfx.boing(); talk(`We can't chop ${it.n}! Silly!`); return; }
  takeFromTray(it); renderTray();
  await fly(el, $('.board-area'), itemIcon(it), { size: 80 });
  K.board.item = it; K.board.chops = 0; drawBoard(); sfx.plop();
  talk(`Tap the board to chop the ${it.n}!`);
  persist();
};

// --- Mixing bowl ---
VIEWS.bowl = function () {
  const scene = $('.scene');
  scene.innerHTML = `<div class="mix-area"><div class="bowl-box">${BIG_BOWL('#f3d9a6', 0)}<div class="bowl-food"></div></div><div class="whisk">${WHISK_SVG}</div></div>
    <div class="side-tools"><div class="drops">${DROPS.map((d, i) => `<button class="drop-btn" data-i="${i}" aria-label="${d.n} color">${ICONS.drop(d.c)}</button>`).join('')}</div>
    <button class="icon-btn empty-btn" aria-label="Empty the bowl">${TRASH}</button></div>
    <div class="meter"><b></b></div>`;
  drawBowl();
  const st = stirrer($('.mix-area'), () => K.bowl.items.length > 0, (p) => {
    const res = mixBowl(K.bowl.items, K.bowl.drops.map((d) => d.c));
    if (res.need) return { block: res.need };
    const fill = $('.bowl-fill'), sw = $('.swirl'), food = $('.bowl-food');
    if (fill) { fill.setAttribute('fill', res.item.c || '#f3d9a6'); fill.setAttribute('opacity', Math.min(1, p)); }
    if (sw) sw.setAttribute('opacity', Math.min(1, p));
    if (food) food.style.opacity = 1 - Math.min(1, p) * 0.85;
    return null;
  }, async () => {
    const res = mixBowl(K.bowl.items, K.bowl.drops.map((d) => d.c));
    K.bowl.items = []; K.bowl.drops = [];
    sfx.yay(); confetti(18);
    talk(res.say);
    await wait(500);
    await giveToTray(res.item, $('.bowl-box'));
    drawBowl(); st.reset();
    afterMake();
  });
  $$('.drop-btn').forEach((b) => b.addEventListener('click', async () => {
    const d = DROPS[+b.dataset.i];
    if (!K.bowl.items.length) { sfx.boing(); talk('Put some food in the bowl first!'); return; }
    sfx.tap(); pulse(b, 'squeeze');
    if (K.bowl.drops.length >= 2) K.bowl.drops = [];
    K.bowl.drops.push(d);
    await fly(b, $('.bowl-box'), ICONS.drop(d.c), { size: 40, dur: 450, toY: 0.35 });
    sfx.drip(); drawBowl();
    const ds = K.bowl.drops;
    if (ds.length === 2 && ds[0].n !== ds[1].n) talk(`${ds[0].n} and ${ds[1].n} make ${MIXNAME[[ds[0].n, ds[1].n].sort().join('+')]}!`);
    else talk(`${d.n}!`);
    persist();
  }));
  $('.empty-btn').addEventListener('click', () => {
    if (!K.bowl.items.length) return;
    sfx.swish(); K.bowl.items.forEach((i) => { if (K.tray.length < TRAY_MAX) K.tray.push(i); });
    K.bowl.items = []; K.bowl.drops = []; drawBowl(); st.reset(); renderTray(); talk('Back on your tray!');
  });
  if (!goalHint()) talk(K.bowl.items.length ? 'Swirl your finger to stir!' : 'Put food in the bowl, then stir it up!');
};
function drawBowl() {
  const box = $('.bowl-food'); if (!box) return;
  const items = K.bowl.items;
  box.style.opacity = 1;
  box.innerHTML = items.map((it, i) => {
    const a = i * 2.4, d = items.length === 1 ? 0 : 0.3 + ((i * 37) % 60) / 100;
    const x = 50 + Math.cos(a) * d * 34, y = 36 + Math.sin(a) * d * 9;
    const inner = it.t === 'raw' || it.t === 'chop' ? (it.key === 'egg' ? '🍳' : it.e) : `<span class="mini-blob" style="background:${it.c}"></span>`;
    return `<span class="bowl-bit" style="left:${x}%;top:${y}%">${inner}</span>`;
  }).join('');
  const fill = $('.bowl-fill');
  if (fill) {
    const tinted = K.bowl.drops.length && items.length;
    fill.setAttribute('fill', tinted ? mixColor(items, '#f3d9a6', K.bowl.drops.map((d) => d.c)) : '#f3d9a6');
    fill.setAttribute('opacity', tinted ? 0.55 : 0);
  }
}
VIEWS.bowl.use = async (it, el) => {
  if (it.t === 'dish') { sfx.boing(); talk(`The ${it.n} is all done! Take it to the table.`); return; }
  if (K.bowl.items.length >= 10) { sfx.boing(); talk('The bowl is full! Stir it up!'); return; }
  takeFromTray(it); renderTray();
  await fly(el, $('.bowl-box'), itemIcon(it), { size: 64, toY: 0.35 });
  K.bowl.items.push(it);
  if (it.key === 'egg') { sfx.chomp(); const n = K.bowl.items.filter((i) => i.key === 'egg').length; talk('Crack!' + (n > 1 ? ` ${n} eggs!` : '')); }
  else { sfx.plop(); talk(it.key ? countSay(K.bowl.items, it.key) : it.n + '!'); }
  drawBowl(); persist();
};

// A finger-swirl gesture shared by the bowl and the pot. Taps count a little too.
function stirrer(area, ready, onProgress, onDone) {
  const whisk = $('.whisk', area) || $('.whisk');
  let prog = 0, last = null, lastSwish = 0, halfSaid = false, done = false, blocked = false;
  const meter = $('.meter b');
  const bump = (amt) => {
    if (done) return;
    if (!ready()) { if (!blocked) { blocked = true; sfx.boing(); talk('Put some food in first!'); later(() => { blocked = false; }, 1500); } return; }
    const r = onProgress(prog + amt);
    if (r && r.block) { if (!blocked) { blocked = true; sfx.boing(); talk(r.block); later(() => { blocked = false; }, 2000); } return; }
    prog += amt;
    if (meter) meter.style.width = Math.min(100, prog * 100) + '%';
    const sw = $('.swirl', area); if (sw) sw.style.transform = `rotate(${prog * 900}deg)`;
    if (prog > 0.5 && !halfSaid) { halfSaid = true; say('Stir, stir, stir!'); }
    if (prog >= 1) { done = true; onDone(); }
  };
  const move = (e) => {
    const r = area.getBoundingClientRect();
    if (whisk) { whisk.style.left = e.clientX - r.left + 'px'; whisk.style.top = e.clientY - r.top + 'px'; whisk.classList.add('active'); }
    if (last) {
      const d = Math.hypot(e.clientX - last.x, e.clientY - last.y);
      const now = performance.now();
      if (d > 2 && now - lastSwish > 260) { lastSwish = now; sfx.swish(); }
      bump(d / (r.width * 3));
    }
    last = { x: e.clientX, y: e.clientY };
  };
  area.addEventListener('pointerdown', (e) => { area.setPointerCapture?.(e.pointerId); last = null; move(e); bump(0.05); });
  area.addEventListener('pointermove', (e) => { if (e.buttons || e.pointerType === 'touch') move(e); });
  area.addEventListener('pointerup', () => { last = null; whisk?.classList.remove('active'); });
  return { reset: () => { prog = 0; done = false; halfSaid = false; if (meter) meter.style.width = '0%'; } };
}

// --- Stove: pan and pot ---
let panCooks = 0, panBusy = false;
VIEWS.stove = function () {
  const scene = $('.scene'), S = K.stove;
  scene.innerHTML = `<div class="tool-pick"><button class="pick" data-t="pan">🍳 Pan</button><button class="pick" data-t="pot">🍲 Pot</button></div>
    <div class="cook-area"></div><div class="burner">${BURNER}</div><div class="meter"><b></b></div>`;
  const drawTool = () => {
    $$('.pick').forEach((b) => b.classList.toggle('sel', b.dataset.t === S.tool));
    const area = $('.cook-area');
    const g = goalState();
    if (g && g.cur.st === 'stove' && g.cur.tool) $$('.pick').forEach((b) => b.classList.toggle('want', b.dataset.t === g.cur.tool && S.tool !== g.cur.tool));
    if (S.tool === 'pan') {
      area.innerHTML = `<button class="pan-box" aria-label="Frying pan">${PAN_TOP}<div class="pan-food"></div></button>`;
      drawPan();
      $('.pan-box').addEventListener('click', panTap);
      $('.meter').style.visibility = 'hidden';
    } else {
      area.innerHTML = `<div class="pot-box">${POT_TOP(potColor())}<div class="pot-food"></div><div class="whisk spoon">${WHISK_SVG}</div></div>`;
      drawPot();
      $('.meter').style.visibility = 'visible';
      $('.meter b').style.width = '0%';
      const st = stirrer($('.pot-box'), () => S.pot.length > 0, (p) => { const f = $('.pot-food'); if (f) f.style.opacity = 1 - Math.min(0.7, p * 0.7); return null; }, async () => {
        const res = cookPot(S.pot);
        S.pot = [];
        sfx.yay(); confetti(16); talk(res.say);
        await wait(600);
        await giveToTray(res.item, $('.pot-box'));
        drawPot(); st.reset();
        afterMake();
      });
    }
    persist();
  };
  $$('.pick').forEach((b) => b.addEventListener('click', () => { S.tool = b.dataset.t; sfx.tap(); say(S.tool === 'pan' ? 'The pan!' : 'The pot!'); drawTool(); }));
  drawTool();
  if (!goalHint()) talk(S.tool === 'pan' ? 'Put food in the pan, then tap the pan to cook!' : 'Put food in the pot, then stir!');
};
function potColor() { return K.stove.pot.length ? blendC('#9fd8ff', mixColor(K.stove.pot, '#f5e6c8'), Math.min(1, 0.4 + K.stove.pot.length * 0.2)) : '#9fd8ff'; }
function drawPan() {
  const box = $('.pan-food'); if (!box) return;
  const P = K.stove.pan;
  if (!P.length) { box.innerHTML = ''; return; }
  const first = P[0];
  if (first.t === 'batter') box.innerHTML = `<span class="pan-cake ${panCooks ? 'golden' : ''}" style="--b:${first.c};--d:${shade(first.c, -0.25)}"></span>`;
  else if (first.t === 'beaten') box.innerHTML = `<span class="pan-cake eggy"></span>`;
  else box.innerHTML = P.map((it, i) => `<span class="pan-bit" style="left:${38 + Math.cos(i * 2.2) * (P.length > 1 ? 16 : 0)}%;top:${50 + Math.sin(i * 2.2) * (P.length > 1 ? 18 : 0)}%">${it.key === 'egg' ? '🍳' : it.e || '🍳'}</span>`).join('');
}
async function panTap() {
  const P = K.stove.pan;
  if (panBusy) return;
  if (!P.length) { sfx.boing(); talk('Put some food in the pan first!'); return; }
  panCooks++;
  const need = big() ? 5 : 3;
  pulse($('.pan-food'), 'flip'); sfx.sizzle(); sfx.swish();
  say(P[0].t === 'batter' && panCooks === 1 ? 'Flip!' : String(panCooks));
  drawPan();
  if (panCooks >= need) {
    panBusy = true; panCooks = 0;
    const res = cookPan(P);
    K.stove.pan = [];
    await wait(400);
    sfx.yay(); confetti(16); talk(res.say);
    await giveToTray(res.item, $('.pan-box'));
    drawPan(); panBusy = false;
    afterMake();
  }
  persist();
}
function drawPot() {
  const box = $('.pot-food'); if (!box) return;
  box.style.opacity = 1;
  box.innerHTML = K.stove.pot.map((it, i) => `<span class="pot-bit" style="left:${50 + Math.cos(i * 2.4) * (10 + (i % 3) * 9)}%;top:${50 + Math.sin(i * 2.4) * (12 + (i % 3) * 9)}%">${it.e || '🥣'}</span>`).join('');
  const fill = $('.pot-fill'); if (fill) fill.setAttribute('fill', potColor());
}
VIEWS.stove.use = async (it, el) => {
  const S = K.stove;
  if (it.t === 'dish' && it.kind !== 'raw') { sfx.boing(); talk(`The ${it.n} is all cooked! Take it to the table.`); return; }
  const list = S.tool === 'pan' ? S.pan : S.pot;
  if (list.length >= 8) { sfx.boing(); talk("It's full! Time to cook!"); return; }
  if (S.tool === 'pan' && list.length && (list[0].t === 'batter' || it.t === 'batter')) { sfx.boing(); talk('Cook this one first! Tap the pan.'); return; }
  takeFromTray(it); renderTray();
  await fly(el, $(S.tool === 'pan' ? '.pan-box' : '.pot-box'), itemIcon(it), { size: 60, toY: 0.5 });
  list.push(it);
  if (it.key === 'egg') sfx.chomp(); else { sfx.plop(); sfx.sizzle(); }
  if (S.tool === 'pan') {
    drawPan();
    talk(it.t === 'batter' ? 'Sizzle! Tap the pan to flip it!' : (it.key ? countSay(list, it.key) : it.n + '!') + ' Tap the pan to cook!');
  } else {
    drawPot();
    const c = colorName(potColor());
    talk((it.key ? countSay(list, it.key) : it.n + '!') + (list.length > 1 ? ` It's turning ${c}!` : ' Now stir!'));
  }
  persist();
};

// --- Oven ---
let baking = false;
VIEWS.oven = function () {
  const scene = $('.scene'), O = K.oven;
  baking = false;
  if (O.ready) {
    scene.innerHTML = `<div class="oven-row"><button class="oven-btn on ding" aria-label="Oven">${OVEN}</button></div>`;
    $('.oven-btn').addEventListener('click', openOven);
    talk('Something is ready! Tap the oven!');
    return;
  }
  if (!O.tin) {
    scene.innerHTML = `<div class="oven-mini">${OVEN}</div><p class="pick-label">Pick a pan!</p>
      <div class="tins">${Object.keys(TINS).map((k) => `<button class="tin-btn" data-k="${k}" aria-label="${TINS[k].n}">${TIN_ICONS[k]}</button>`).join('')}</div>`;
    const g = goalState();
    if (g && g.cur.st === 'oven' && g.cur.tool) $(`.tin-btn[data-k="${g.cur.tool}"]`)?.classList.add('want');
    $$('.tin-btn').forEach((b) => b.addEventListener('click', () => {
      O.tin = b.dataset.k; O.items = []; O.toppings = []; O.cheese = false; sfx.pop();
      say(`The ${TINS[O.tin].n}!`); persist(); VIEWS.oven();
      if (!goalHint()) talk(`Put something in the ${TINS[O.tin].n}!`);
    }));
    if (!goalHint()) talk('Pick a pan for the oven!');
    return;
  }
  scene.innerHTML = `<div class="oven-row"><button class="oven-btn" aria-label="Oven">${OVEN}<b class="oven-count"></b></button>
      <div class="tin-area"><div class="tin-view"></div><button class="text-chip change-tin">Other pan</button></div></div>
    <div class="oven-extras"></div>`;
  drawTin();
  $('.change-tin').addEventListener('click', () => {
    sfx.tap(); O.items.forEach((i) => { if (K.tray.length < TRAY_MAX) K.tray.push(i); });
    O.tin = null; O.items = []; O.toppings = []; renderTray(); VIEWS.oven();
  });
  $('.oven-btn').addEventListener('click', bake);
};
const PIZZA_TOPS = [
  { k: 'pepperoni', n: 'pepperoni', p: 'pepperonis' }, { e: '🍄', n: 'mushroom', p: 'mushrooms' }, { e: '🫑', n: 'green pepper', p: 'green peppers' },
  { e: '🫒', n: 'olive', p: 'olives' }, { e: '🍍', n: 'pineapple', p: 'pineapples' }, { e: '🍅', n: 'tomato', p: 'tomatoes' },
  { e: '🥓', n: 'bacon', p: 'bacon' }, { e: '🌽', n: 'corn', p: 'corn' }, { e: '🧅', n: 'onion', p: 'onions' }, { e: '🌿', n: 'basil', p: 'basil' },
];
const topIcon = (t) => (t.k ? `<svg viewBox="-16 -16 32 32">${STICKERS[t.k].svg}</svg>` : `<span class="emo-icon">${t.e}</span>`);
function addTopping(t, x, y) {
  const O = K.oven;
  O.toppings.push(t.k ? { t: 'k', id: t.k, x, y, r: rnd(-20, 20) } : { t: 'e', e: t.e, x, y, s: 24, r: rnd(-30, 30) });
  const n = O.toppings.filter((q) => (t.k ? q.id === t.k : q.e === t.e)).length;
  sfx.pop(); say(n === 1 ? t.n + '!' : `${n} ${t.p}!`);
  const view = $('.tin-view'), d = previewDish();
  if (view && d) view.innerHTML = dishSVG(d);
  persist();
}
function previewDish() {
  const O = K.oven;
  if (!O.items.length) return null;
  const res = bakeOven(O.tin, O.items, { shape: O.shape, sauce: O.sauce, cheese: O.cheese, toppings: O.toppings });
  if (res.need) return null;
  const d = { ...res.item };
  if (['pizza', 'cookie', 'cupcake'].includes(O.tin)) d.baked = false;
  if (O.tin === 'cupcake') d.kind = 'rawcup';
  return d;
}
function drawTin() {
  const O = K.oven, view = $('.tin-view'), extras = $('.oven-extras'); if (!view) return;
  view.style.visibility = 'visible';
  const d = previewDish();
  if (d && d.kind === 'rawcup') view.innerHTML = `<div class="raw-tin">${TIN_ICONS.cupcake}<span class="raw-batter" style="background:${d.c}"></span></div>`;
  else if (d && d.kind === 'cake') view.innerHTML = `<div class="raw-tin">${TIN_ICONS.cake}<span class="raw-batter round" style="background:${d.c}"></span></div>`;
  else view.innerHTML = d ? dishSVG(d) : `<div class="empty-tin">${TIN_ICONS[O.tin]}${O.items.map((i) => `<span class="emo-icon">${i.e || ''}</span>`).join('')}</div>`;
  let h = '';
  if (O.tin === 'cookie' && d) h = Object.keys(CUTTERS).map((k) => `<button class="cutter ${O.shape === k ? 'sel' : ''}" data-k="${k}" aria-label="${k}">${CUTTERS[k]}</button>`).join('');
  if (O.tin === 'pizza' && d) h = [['#e8442e', 'red sauce'], ['#fff3dc', 'white sauce'], ['#6fbf4a', 'green sauce']].map(([c, n]) => `<button class="sauce-btn ${O.sauce === c ? 'sel' : ''}" data-c="${c}" aria-label="${n}">${ICONS.drop(c)}</button>`).join('')
    + `<button class="sauce-btn cheese ${O.cheese ? 'sel' : ''}" aria-label="cheese">${ICONS.cheese}</button>`;
  if (O.tin === 'pizza' && d) h = `<div class="sauces">${h}</div><div class="opts pizza-tops">${PIZZA_TOPS.map((t, i) => `<button class="opt ${O.top === i ? 'sel' : ''}" data-i="${i}" aria-label="${t.n}">${topIcon(t)}</button>`).join('')}</div>`;
  extras.innerHTML = h;
  $('.oven-row')?.classList.toggle('pizza-mode', O.tin === 'pizza' && !!d);
  $$('.pizza-tops .opt').forEach((b) => b.addEventListener('click', () => {
    O.top = +b.dataset.i; sfx.tap();
    $$('.pizza-tops .opt').forEach((x) => x.classList.toggle('sel', x === b));
    addTopping(PIZZA_TOPS[O.top], rnd(62, 138), rnd(62, 138));
  }));
  if (O.tin === 'pizza' && d) {
    view.onpointerdown = (e) => {
      const svg = $('svg', view); if (!svg) return;
      e.preventDefault();
      const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      const q = pt.matrixTransform(svg.getScreenCTM().inverse());
      if (Math.hypot(q.x - 100, q.y - 100) > 80) return;
      addTopping(PIZZA_TOPS[O.top || 0], Math.round(q.x), Math.round(q.y));
    };
  } else view.onpointerdown = null;
  $$('.cutter').forEach((b) => b.addEventListener('click', () => { O.shape = b.dataset.k; sfx.pop(); say(article(b.dataset.k) + '!'); drawTin(); persist(); }));
  $$('.sauce-btn').forEach((b) => b.addEventListener('click', () => {
    if (b.classList.contains('cheese')) { O.cheese = !O.cheese; sfx.sparkle(); say(O.cheese ? 'Cheese!' : 'No cheese!'); }
    else { O.sauce = b.dataset.c; sfx.drip(); say(b.getAttribute('aria-label') + '!'); }
    drawTin(); persist();
  }));
}
VIEWS.oven.use = async (it, el) => {
  const O = K.oven;
  if (O.ready || baking) { sfx.boing(); return; }
  if (!O.tin) { sfx.boing(); talk('Pick a pan first!'); return; }
  // Pizza: once the dough is in, anything else becomes a topping.
  if (O.tin === 'pizza' && O.items.length && (it.t === 'raw' || it.t === 'chop')) {
    takeFromTray(it); renderTray();
    await fly(el, $('.tin-view'), itemIcon(it), { size: 50 });
    const n = it.t === 'chop' ? 3 : 1;
    for (let i = 0; i < n; i++) O.toppings.push({ t: 'e', e: it.e, x: rnd(60, 140), y: rnd(60, 140), s: it.t === 'chop' ? 20 : 28, r: rnd(-30, 30) });
    if (it.key === 'cheese') O.cheese = true;
    sfx.pop(); talk(`${ING[it.key].n} on the pizza!`); drawTin(); persist(); return;
  }
  if (O.items.length && O.tin !== 'dish') { sfx.boing(); talk('This pan is full! Tap the oven to bake.'); return; }
  const test = bakeOven(O.tin, [...O.items, it], { shape: O.shape });
  if (test.need) { sfx.boing(); talk(test.need); return; }
  takeFromTray(it); renderTray();
  await fly(el, $('.tin-view'), itemIcon(it), { size: 64 });
  O.items.push(it); sfx.plop();
  talk(O.tin === 'pizza' ? 'Pick a sauce and cheese, then tap toppings onto your pizza! Tap the oven when it is ready.' : O.tin === 'cookie' ? 'Pick a cookie cutter, then tap the oven!' : 'Tap the oven to bake!');
  drawTin(); persist();
};
async function bake() {
  const O = K.oven;
  if (baking) return;
  if (!O.items.length) { sfx.boing(); talk(`Put something in the ${TINS[O.tin].n} first!`); return; }
  baking = true;
  const oven = $('.oven-btn'), count = $('.oven-count');
  sfx.swish();
  await fly($('.tin-view'), oven, $('.tin-view').innerHTML, { size: 110, toY: 0.62 });
  if (!$('.tin-view')) return;
  $('.tin-view').style.visibility = 'hidden'; $('.oven-extras').innerHTML = '';
  oven.classList.add('on');
  const nums = big() ? [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5];
  talk(big() ? 'Count down with me!' : 'Count with me!');
  await wait(1300);
  for (const n of nums) { count.textContent = n; pulse(count); sfx.tick(); say(String(n)); await wait(big() ? 800 : 1000); }
  count.textContent = '';
  O.ready = bakeOven(O.tin, O.items, { shape: O.shape, sauce: O.sauce, cheese: O.cheese, toppings: O.toppings });
  O.items = []; O.toppings = [];
  sfx.ding(); oven.classList.add('ding');
  talk('<b>Ding!</b> Tap the oven to open it!', 'Ding! Tap the oven to open it!');
  baking = false; persist();
  oven.removeEventListener('click', bake);
  oven.addEventListener('click', openOven);
}
async function openOven() {
  const O = K.oven; if (!O.ready) return;
  const res = O.ready; O.ready = null; O.tin = null;
  const oven = $('.oven-btn'); oven.classList.remove('on', 'ding');
  sfx.sparkle(); sfx.yay(); confetti(24); talk(res.say);
  await giveToTray(res.item, oven);
  persist();
  later(() => { if (station === 'oven') VIEWS.oven(); afterMake(); }, 1400);
}

// --- Blender ---
VIEWS.blender = function () {
  const scene = $('.scene'), B = K.blender;
  scene.innerHTML = `<div class="blender-area"><div class="blender-box"></div>
    <button class="blend-btn" aria-label="Blend">Blend!</button></div>`;
  drawBlender(0);
  let presses = 0, spinning = false;
  $('.blend-btn').addEventListener('click', async () => {
    if (!B.items.length) { sfx.boing(); talk('Put some fruit in the blender first!'); return; }
    if (spinning) return;
    presses++;
    pulse($('.blender-box'), 'shake'); sfx.swish(); sfx.boing();
    say(String(presses));
    drawBlender(presses / 3);
    if (presses >= 3) {
      spinning = true;
      const res = blendIt(B.items);
      B.items = [];
      await wait(500);
      sfx.yay(); confetti(16); talk(res.say);
      await giveToTray(res.item, $('.blender-box'));
      presses = 0; spinning = false;
      drawBlender(0);
      afterMake();
    }
    persist();
  });
  if (!goalHint()) talk('Put fruit in the blender, then press Blend!');
};
function drawBlender(p) {
  const box = $('.blender-box'); if (!box) return;
  const items = K.blender.items;
  const c = items.length ? mixColor(items, '#fff6ee') : '#ffffff';
  box.innerHTML = BLENDER(c, p * 0.85) + `<div class="blend-food" style="opacity:${1 - p}">${items.map((it, i) => `<span class="blend-bit" style="left:${34 + (i % 3) * 16}%;bottom:${34 + Math.floor(i / 3) * 12}%">${it.e || '🥤'}</span>`).join('')}</div>`;
}
VIEWS.blender.use = async (it, el) => {
  if (it.t === 'dish' && it.kind !== 'drink') { sfx.boing(); talk('Hmm, not in the blender! Try fruit!'); return; }
  if (K.blender.items.length >= 8) { sfx.boing(); talk('The blender is full! Press Blend!'); return; }
  takeFromTray(it); renderTray();
  await fly(el, $('.blender-box'), itemIcon(it), { size: 56, toY: 0.4 });
  K.blender.items.push(it); sfx.plop();
  talk(it.key ? countSay(K.blender.items, it.key) : it.n + '!');
  drawBlender(0); persist();
};

// --- Table: plate it, decorate, feed Biscuit ---
const SWEET_TOPS = ['🍓', '🫐', '🍒', '🍌', '🍫', '🍬', '⭐', '❤️', '🌸'];
const SAVORY_TOPS = ['🧀', '🍅', '🫒', '🍄', '🌿', '🥓', '🌽', '🫑', '🧅'];
const SWEET_KINDS = ['cupcakes', 'cake', 'cookies', 'pancakes', 'drink', 'bowlfood'];
let TOPPINGS = SWEET_TOPS;
const SPRINKLES = [['#ff5a5a', '#ffd23f', '#5cc46a', '#4b8dff', '#c06ccf', '#ff9a3c'], ['#ff7eb6', '#ffc2dd', '#ffffff'], ['#6b3f2a', '#8a5a3c'], ['#ffd23f', '#ffb000', '#fff3b0']];
const FROSTS = [['pink', '#ff9ccf'], ['white', '#fffaf3'], ['chocolate', '#8a5a3c'], ['blue', '#8fd3ff'], ['purple', '#c9a0ff'], ['green', '#9be89b'], ['yellow', '#ffe680'], ['orange', '#ffb36b']];
const CAN_FROST = ['cupcakes', 'cake', 'cookies', 'pancakes'];
let tool = { tab: 'top', opt: 0, li: 0 }, feeding = false;

VIEWS.table = function () {
  const scene = $('.scene');
  feeding = false;
  scene.innerHTML = `<div class="table-area"><button class="pup" aria-label="Biscuit">${PUPPY}</button><div class="plate-box"></div></div><div class="deco-bar"></div>`;
  drawTable();
  $('.pup').addEventListener('click', () => {
    if (feeding) return;
    if (K.table.dish && !(K.table.dish.kind === 'sandwich' && !K.table.dish.closed)) { feedBiscuit(); return; }
    sfx.boing(); pulse($('.pup'), 'wiggle'); say('Woof! Biscuit is hungry!');
  });
  if (!goalHint()) talk(K.table.dish ? 'Decorate it, then feed Biscuit!' : 'Put some food on the plate for Biscuit!');
};
function drawTable() {
  const d = K.table.dish, box = $('.plate-box'), bar = $('.deco-bar'); if (!box) return;
  box.innerHTML = d ? dishSVG(d) : dishSVG({ kind: 'plate', parts: [' '] });
  bar.innerHTML = '';
  box.onpointerdown = null;
  if (!d) return;
  if (d.kind === 'sandwich' && !d.closed) {
    bar.innerHTML = `<p class="pick-label">Tap food on your tray to stack it!</p><div class="deco-tabs"><button class="feed-btn" aria-label="Feed Biscuit">🦴 Feed</button></div>`;
    $('.feed-btn').addEventListener('click', feedBiscuit);
    return;
  }
  TOPPINGS = SWEET_KINDS.includes(d.kind) ? SWEET_TOPS : SAVORY_TOPS;
  const tabs = (CAN_FROST.includes(d.kind) ? ['frost'] : []).concat(['top', 'spr', 'abc']);
  if (!tabs.includes(tool.tab)) { tool.tab = tabs[0]; tool.opt = tool.tab === 'frost' ? -1 : 0; }
  const tabIcon = { frost: ICONS.drop('#ff9ccf'), top: `<span class="emo-icon">${TOPPINGS[0]}</span>`, spr: ICONS.sprinkles, abc: ICONS.abc };
  const name = (settings.name || '').toUpperCase().replace(/[^A-Z]/g, '');
  const letters = [...new Set(name.split(''))].concat('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter((c) => !name.includes(c)));
  let opts = '';
  if (tool.tab === 'frost') opts = FROSTS.map(([n, c], i) => `<button class="opt ${tool.opt === i ? 'sel' : ''}" data-i="${i}" aria-label="${n}">${ICONS.drop(c)}</button>`).join('');
  if (tool.tab === 'top') opts = TOPPINGS.map((e, i) => `<button class="opt ${tool.opt === i ? 'sel' : ''}" data-i="${i}"><span class="emo-icon">${e}</span></button>`).join('');
  if (tool.tab === 'spr') opts = SPRINKLES.map((s, i) => `<button class="opt ${tool.opt === i ? 'sel' : ''}" data-i="${i}"><span class="sprinkle-swatch">${s.slice(0, 4).map((c, j) => `<i style="background:${c};transform:rotate(${j * 50 - 60}deg)"></i>`).join('')}</span></button>`).join('');
  if (tool.tab === 'abc') opts = letters.map((c, i) => `<button class="opt letter-opt ${tool.opt === i ? 'sel' : ''}" data-i="${i}" data-c="${c}" style="--c:${CANDY[i % CANDY.length]}">${c}</button>`).join('');
  bar.innerHTML = `<div class="deco-tabs">${tabs.map((t) => `<button class="tab ${tool.tab === t ? 'sel' : ''}" data-t="${t}">${tabIcon[t]}</button>`).join('')}
      <button class="feed-btn" aria-label="Feed Biscuit">🦴 Feed</button></div>
    <div class="opts">${opts}</div>`;
  $$('.deco-tabs .tab').forEach((b) => b.addEventListener('click', () => { tool.tab = b.dataset.t; tool.opt = tool.tab === 'frost' ? -1 : 0; sfx.tap(); say({ frost: 'Frosting!', top: 'Toppings! Tap your food!', spr: 'Sprinkles! Tap your food!', abc: 'Letters!' }[tool.tab]); drawTable(); }));
  $$('.opts .opt').forEach((b) => b.addEventListener('click', () => {
    tool.opt = +b.dataset.i; sfx.tap();
    if (tool.tab === 'frost') { const [n, c] = FROSTS[tool.opt]; d.frost = c; sfx.drip(); say(n + '!'); }
    else if (tool.tab === 'abc') say(b.dataset.c);
    else if (tool.tab === 'top') { const nm = Object.values(ING).find((v) => v.e === TOPPINGS[tool.opt]); say(nm ? nm.n : 'Yum!'); }
    $$('.opts .opt').forEach((x) => x.classList.toggle('sel', x === b));
    box.innerHTML = dishSVG(d); persist();
  }));
  $('.feed-btn').addEventListener('click', feedBiscuit);
  box.onpointerdown = (e) => {
    if (!K.table.dish || feeding) return;
    const svg = $('svg', box); if (!svg) return;
    e.preventDefault();
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    const x = Math.max(10, Math.min(190, p.x)), y = Math.max(10, Math.min(190, p.y));
    if (tool.tab === 'frost') { if (tool.opt < 0) { sfx.boing(); say('Pick a color!'); return; } d.frost = FROSTS[tool.opt][1]; sfx.drip(); }
    else if (tool.tab === 'top') {
      d.deco.push({ t: 'e', e: TOPPINGS[tool.opt], x: Math.round(x), y: Math.round(y), s: 24, r: rnd(-25, 25) }); sfx.pop();
      say(String(d.deco.filter((q) => q.e === TOPPINGS[tool.opt]).length));
    } else if (tool.tab === 'spr') {
      const set = SPRINKLES[tool.opt];
      for (let i = 0; i < 8; i++) { const a = Math.random() * 6.28, r = 4 + Math.random() * 16; d.deco.push({ t: 's', x: +(x + Math.cos(a) * r).toFixed(1), y: +(y + Math.sin(a) * r).toFixed(1), c: set[i % set.length], r: rnd(0, 179) }); }
      sfx.sparkle();
    } else if (tool.tab === 'abc') {
      const c = $$('.opts .opt')[tool.opt]?.dataset.c || 'A';
      d.deco.push({ t: 'l', ch: c, x: Math.round(x), y: Math.round(y), c: CANDY[tool.li++ % CANDY.length], r: rnd(-15, 15) }); sfx.pop(); say(c);
    }
    box.innerHTML = dishSVG(d); persist();
  };
}
VIEWS.table.use = async (it, el) => {
  const T = K.table;
  if (feeding) return;
  if (T.dish && T.dish.kind === 'sandwich' && !T.dish.closed) {
    if (it.t !== 'raw' && it.t !== 'chop') { sfx.boing(); talk('That won\'t fit in a sandwich! Try cheese or veggies.'); return; }
    takeFromTray(it); renderTray();
    await fly(el, $('.plate-box'), itemIcon(it), { size: 56 });
    if (it.key === 'bread') { T.dish.closed = true; sfx.yay(); talk(`A sandwich with ${T.dish.layers.length} ${T.dish.layers.length === 1 ? 'layer' : 'layers'}! Now feed Biscuit!`); }
    else { T.dish.layers.push({ c: it.c, e: it.e, key: it.key }); sfx.plop(); talk(`${ING[it.key].n}! That's ${T.dish.layers.length}!`); }
    drawTable(); renderGuide(); persist(); return;
  }
  if (T.dish) { sfx.boing(); talk('The plate is full! Feed Biscuit first.'); return; }
  if (it.t === 'batter' || it.t === 'dough' || it.t === 'beaten') { sfx.boing(); talk(`We need to cook the ${it.n} first! Try the stove or the oven.`); return; }
  takeFromTray(it); renderTray();
  await fly(el, $('.plate-box'), itemIcon(it), { size: 80 });
  if (it.key === 'bread' && it.t === 'raw') { T.dish = dish('sandwich', { n: 'sandwich', layers: [] }); sfx.plop(); talk('Bread! Now stack yummy things on top!'); }
  else if (it.t === 'dish') { T.dish = it; sfx.plop(); talk(`${it.n}! Decorate it, or feed Biscuit!`); }
  else { T.dish = dish('plate', { n: it.n, parts: it.t === 'chop' ? [it.e, it.e, it.e, it.e] : [it.e] }); sfx.plop(); talk(`${it.n}! Feed Biscuit?`); }
  T.dish.deco = T.dish.deco || [];
  tool = { tab: CAN_FROST.includes(T.dish.kind) ? 'frost' : 'top', opt: CAN_FROST.includes(T.dish.kind) ? -1 : 0, li: 0 };
  drawTable(); renderGuide(); persist();
};
async function feedBiscuit() {
  const d = K.table.dish; if (!d || feeding) return;
  if (d.kind === 'sandwich' && !d.closed) { if (!d.layers.length) { sfx.boing(); return; } d.closed = true; }
  feeding = true;
  const box = $('.plate-box'), pup = $('.pup');
  const R = K.goal ? RECIPES.find((r) => r.k === K.goal) : null;
  const finishedGoal = R && R.steps[R.steps.length - 1][1] === d.kind;
  sfx.pop(); talk('Here you go, Biscuit!');
  await fly(box, pup, dishSVG(d), { size: 120, dur: 700, toY: 0.6 });
  if (!$('.plate-box')) return;
  box.innerHTML = dishSVG({ kind: 'plate', parts: [' '] });
  $('.deco-bar').innerHTML = '';
  pup.classList.add('eating');
  for (let i = 0; i < 3; i++) { sfx.chomp(); await wait(380); }
  pup.classList.remove('eating'); pup.classList.add('happy');
  hearts(pup, 7); sfx.fanfare(); confetti(30);
  talk('<b>Yummy!</b> Biscuit loves it!', `Mmm! Biscuit loves your ${describe(d)}! Woof woof!`);
  addToBakery(d);
  K.table.dish = null; K.served++;
  if (finishedGoal) {
    K.goal = null;
    later(() => talk(`You made ${R.n.toLowerCase()}! Great cooking! Pick another recipe, or cook anything you like!`), 2800);
  }
  persist();
  later(() => { pup.classList.remove('happy'); feeding = false; drawTable(); renderGuide(); }, 2200);
}
function describe(d) {
  let s = d.n || 'food';
  if (d.frost && CAN_FROST.includes(d.kind)) { const f = FROSTS.find(([, c]) => c === d.frost); if (f) s += ` with ${f[0]} ${d.kind === 'pancakes' ? 'syrup' : 'frosting'}`; }
  const tops = {};
  for (const q of d.deco || []) if (q.t === 'e') tops[q.e] = (tops[q.e] || 0) + 1;
  const best = Object.entries(tops).sort((a, b) => b[1] - a[1])[0];
  if (best && best[1] > 1) { const nm = Object.values(ING).find((v) => v.e === best[0]); s += ` and ${best[1]} ${nm ? nm.p : 'treats'}`; }
  return s;
}

// ---------- Recipe book ----------
function recipeBook() {
  const o = document.createElement('div'); o.className = 'overlay';
  o.innerHTML = `<div class="dialog book">
    <h2>Recipes</h2>
    <div class="book-grid">${RECIPES.map((r) => `<button class="book-card ${K.goal === r.k ? 'sel' : ''}" data-k="${r.k}">${dishSVG(r.show, { cls: 'mini' })}<span class="book-name">${r.n}</span><span class="book-need">${r.need.map((k) => ING[k].e).join('')}</span></button>`).join('')}</div>
    <button class="text-btn free">Just play! No recipe</button>
  </div>`;
  document.body.appendChild(o);
  say('Pick a recipe! Or just play!');
  o.addEventListener('click', (e) => { if (e.target === o) o.remove(); });
  $$('.book-card', o).forEach((b) => b.addEventListener('click', () => {
    const R = RECIPES.find((r) => r.k === b.dataset.k);
    K.goal = R.k; persist(); sfx.yay(); o.remove();
    say(`${R.n}! Let's go!`);
    if (!$('.kitchen')) openKitchen(nextGoalStation()); else go(nextGoalStation());
  }));
  $('.free', o).addEventListener('click', () => { K.goal = null; persist(); sfx.tap(); o.remove(); if (!$('.kitchen')) openKitchen('fridge'); else { renderGuide(); talk('Cook anything you like!'); } });
}

// ---------- Photo album ----------
function album() {
  token++;
  const list = bakery().filter((t) => t.kind);
  app.innerHTML = `
  <div class="bakery">
    <header class="topbar"><button class="icon-btn home-btn" aria-label="Home">${ICONS.home}</button><h2>Photos</h2><span class="spacer"></span></header>
    <div class="shelf">${list.length ? list.map((t, i) => `<button class="shelf-item" data-i="${i}">${dishSVG(t, { cls: 'mini' })}</button>`).join('') :
      `<div class="empty"><div class="pup-small">${PUPPY}</div><p>No photos yet.<br>Cook something for Biscuit!</p></div>`}</div>
  </div>`;
  $('.home-btn').addEventListener('click', () => { sfx.tap(); home(); });
  say(list.length ? `You cooked ${list.length} ${list.length === 1 ? 'thing' : 'things'}! Tap one!` : 'No photos yet. Cook something for Biscuit!');
  $$('.shelf-item').forEach((b) => b.addEventListener('click', () => {
    const t = list[+b.dataset.i];
    sfx.pop();
    const o = document.createElement('div'); o.className = 'overlay';
    o.innerHTML = `<div class="dialog view"><div class="treat-wrap">${dishSVG(t)}</div><button class="big-btn close" aria-label="Close">${ICONS.check}</button></div>`;
    document.body.appendChild(o);
    say(`You made ${describe(t)}!`);
    o.addEventListener('click', () => { o.remove(); sfx.tap(); });
  }));
}

// ---------- Grown-ups ----------
function parentPanel() {
  const o = document.createElement('div'); o.className = 'overlay';
  const voices = voiceList();
  o.innerHTML = `<div class="dialog parents">
    <h2>Grown-ups</h2>
    <label class="row col">Child's first name (for letter candies)
      <input type="text" class="name-in" maxlength="12" value="${(settings.name || '').replace(/[^A-Za-z -]/g, '')}" autocomplete="off"></label>
    <label class="row">Age
      <span class="seg"><button data-l="little" class="${settings.level === 'little' ? 'sel' : ''}">3–4</button><button data-l="big" class="${settings.level === 'big' ? 'sel' : ''}">5–6</button></span></label>
    <p class="note">5–6 chops and cooks a little longer and counts down from 10 at the oven.</p>
    <label class="row">Talking <input type="checkbox" class="sw-speech" ${settings.speech ? 'checked' : ''}></label>
    <label class="row">Sounds <input type="checkbox" class="sw-sound" ${settings.sound ? 'checked' : ''}></label>
    <label class="row col">Voice
      <select class="voice-sel"><option value="">Automatic</option>${voices.map((v) => `<option ${v.name === settings.voice ? 'selected' : ''}>${v.name.replace(/[<>&]/g, '')}</option>`).join('')}</select></label>
    <label class="row col">Voice pitch (higher sounds younger)
      <input type="range" class="pitch" min="1" max="2" step="0.1" value="${settings.pitch}"></label>
    <button class="text-btn test">Test voice</button>
    <button class="text-btn clean">Clean up the kitchen</button>
    <button class="text-btn danger clear">Delete all photos</button>
    <button class="text-btn primary close">Done</button>
    <p class="note">Little Chef ${VERSION}. No ads, no accounts, works offline.</p>
  </div>`;
  document.body.appendChild(o);
  const q = (s) => o.querySelector(s);
  q('.name-in').addEventListener('input', (e) => { settings.name = e.target.value.replace(/[^A-Za-z -]/g, '').slice(0, 12); saveSettings(); });
  o.querySelectorAll('.seg button').forEach((b) => b.addEventListener('click', (e) => {
    e.preventDefault(); settings.level = b.dataset.l; saveSettings();
    o.querySelectorAll('.seg button').forEach((x) => x.classList.toggle('sel', x === b));
  }));
  q('.sw-speech').addEventListener('change', (e) => { settings.speech = e.target.checked; saveSettings(); });
  q('.sw-sound').addEventListener('change', (e) => { settings.sound = e.target.checked; saveSettings(); });
  q('.voice-sel').addEventListener('change', (e) => { settings.voice = e.target.value; saveSettings(); say('Hi! I am Chef Bun!'); });
  q('.pitch').addEventListener('change', (e) => { settings.pitch = +e.target.value; saveSettings(); say('Hi! I am Chef Bun!'); });
  q('.test').addEventListener('click', () => say(`Hi${settings.name ? ' ' + settings.name : ''}! I am Chef Bun! Let's make pancakes!`));
  q('.clean').addEventListener('click', () => { K = freshKitchen(); persist(); q('.clean').textContent = 'Kitchen is clean'; });
  q('.clear').addEventListener('click', () => { if (confirm('Delete every saved photo?')) { clearBakery(); q('.clear').textContent = 'Photos deleted'; } });
  q('.close').addEventListener('click', () => o.remove());
}

// ---------- Start ----------
home();
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
window.__lc = { K: () => K, go: (s) => go(s) }; // used by automated tests
