// All artwork is hand-built SVG so it stays crisp, works offline, and looks the same on every phone.
const INK = '#5b3a29';

export function shade(hex, amt) {
  // amt < 0 darkens, > 0 lightens (range -1..1)
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function blend(a, b, w) {
  const x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16);
  const c = (s) => Math.round(((x >> s) & 255) * (1 - w) + ((y >> s) & 255) * w);
  return '#' + ((1 << 24) + (c(16) << 16) + (c(8) << 8) + c(0)).toString(16).slice(1);
}

// ---------- Chef character (an original little bear in a chef hat) ----------
export const CHEF = `
<svg viewBox="0 0 120 130" class="chef-svg" aria-hidden="true">
  <g class="chef-hat">
    <path d="M30 46 Q18 20 40 18 Q46 2 62 8 Q78 0 84 18 Q104 18 92 46 Z" fill="#fff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <rect x="32" y="40" width="58" height="14" rx="5" fill="#fff" stroke="${INK}" stroke-width="4"/>
    <path d="M48 28 Q52 22 58 26" fill="none" stroke="#e9e1d6" stroke-width="3" stroke-linecap="round"/>
  </g>
  <circle cx="26" cy="64" r="12" fill="#c98b5a" stroke="${INK}" stroke-width="4"/>
  <circle cx="96" cy="64" r="12" fill="#c98b5a" stroke="${INK}" stroke-width="4"/>
  <circle cx="26" cy="64" r="5" fill="#f2b8a0"/>
  <circle cx="96" cy="64" r="5" fill="#f2b8a0"/>
  <ellipse cx="61" cy="84" rx="40" ry="36" fill="#d9a06b" stroke="${INK}" stroke-width="4"/>
  <ellipse cx="61" cy="98" rx="20" ry="14" fill="#f3d3b0"/>
  <g class="chef-eyes">
    <ellipse cx="46" cy="80" rx="5" ry="6.5" fill="${INK}"/>
    <ellipse cx="76" cy="80" rx="5" ry="6.5" fill="${INK}"/>
    <circle cx="48" cy="78" r="2" fill="#fff"/>
    <circle cx="78" cy="78" r="2" fill="#fff"/>
  </g>
  <circle cx="35" cy="94" r="6" fill="#ff9aa8" opacity=".7"/>
  <circle cx="87" cy="94" r="6" fill="#ff9aa8" opacity=".7"/>
  <ellipse cx="61" cy="92" rx="6" ry="4.5" fill="${INK}"/>
  <path class="chef-mouth-closed" d="M52 101 Q61 109 70 101" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
  <ellipse class="chef-mouth-open" cx="61" cy="104" rx="7" ry="6" fill="#a8423c" stroke="${INK}" stroke-width="3"/>
</svg>`;

// ---------- Pantry ingredients (viewBox 0 0 100 100) ----------
const W = (inner) => `<svg viewBox="0 0 100 100" aria-hidden="true">${inner}</svg>`;
export const INGREDIENTS = {
  egg: {
    name: 'egg', plural: 'eggs', blob: ['#fffaf0', '#ffc93c'],
    svg: W(`<ellipse cx="50" cy="56" rx="28" ry="36" fill="#fffaf0" stroke="${INK}" stroke-width="4"/>
      <path d="M36 40 Q40 30 48 28" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
      <circle cx="40" cy="62" r="3" fill="#f0e2cc"/><circle cx="60" cy="72" r="2.5" fill="#f0e2cc"/>`),
  },
  flour: {
    name: 'scoop of flour', plural: 'scoops of flour', blob: ['#ffffff', '#f4eee2'],
    svg: W(`<path d="M24 34 L76 34 L84 92 L16 92 Z" fill="#f6efe2" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M28 34 Q50 14 72 34" fill="#f6efe2" stroke="${INK}" stroke-width="4"/>
      <rect x="40" y="28" width="20" height="8" rx="3" fill="#ff8a65" stroke="${INK}" stroke-width="3"/>
      <circle cx="50" cy="64" r="15" fill="#ffd166" stroke="${INK}" stroke-width="3"/>
      <path d="M50 74 L50 54 M50 58 l-6 -5 M50 58 l6 -5 M50 65 l-6 -5 M50 65 l6 -5" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" fill="none"/>`),
  },
  milk: {
    name: 'cup of milk', plural: 'cups of milk', blob: ['#f4fbff', '#eef6ff'],
    svg: W(`<path d="M28 40 L50 18 L72 40 L72 92 L28 92 Z" fill="#fff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M28 40 L72 40" stroke="${INK}" stroke-width="4"/>
      <rect x="28" y="54" width="44" height="18" fill="#6fb7ff" stroke="${INK}" stroke-width="3"/>
      <circle cx="40" cy="82" r="4" fill="${INK}"/><circle cx="58" cy="84" r="3" fill="${INK}"/>
      <rect x="44" y="12" width="12" height="8" rx="2" fill="#6fb7ff" stroke="${INK}" stroke-width="3"/>`),
  },
  sugar: {
    name: 'spoon of sugar', plural: 'spoons of sugar', blob: ['#ffe3f0', '#ffe9f3'],
    svg: W(`<path d="M18 54 Q50 96 82 54 Z" fill="#ff9ccf" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <rect x="28" y="34" width="18" height="18" rx="3" fill="#fff" stroke="${INK}" stroke-width="3.5" transform="rotate(-8 37 43)"/>
      <rect x="50" y="30" width="18" height="18" rx="3" fill="#fff" stroke="${INK}" stroke-width="3.5" transform="rotate(10 59 39)"/>
      <rect x="39" y="16" width="18" height="18" rx="3" fill="#fff" stroke="${INK}" stroke-width="3.5" transform="rotate(4 48 25)"/>
      <path d="M78 22 l3 6 l6 3 l-6 3 l-3 6 l-3 -6 l-6 -3 l6 -3 Z" fill="#ffd166"/>`),
  },
  butter: {
    name: 'piece of butter', plural: 'pieces of butter', blob: ['#ffe680', '#ffd84d'],
    svg: W(`<path d="M10 72 L90 72 L80 86 L20 86 Z" fill="#9ad3f0" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <rect x="20" y="40" width="60" height="32" rx="6" fill="#ffe680" stroke="${INK}" stroke-width="4"/>
      <path d="M28 48 L54 48" stroke="#fff6c2" stroke-width="5" stroke-linecap="round"/>`),
  },
  water: {
    name: 'cup of water', plural: 'cups of water', blob: ['#bfe6ff', '#9fd8ff'],
    svg: W(`<path d="M26 22 L74 22 L68 90 L32 90 Z" fill="#eaf7ff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M30 46 L70 46 L66 86 L34 86 Z" fill="#7cc8ff"/>
      <path d="M38 54 L40 78" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
      <path d="M26 22 L74 22 L68 90 L32 90 Z" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`),
  },
  oil: {
    name: 'splash of oil', plural: 'splashes of oil', blob: ['#ffe27a', '#f2c94c'],
    svg: W(`<rect x="42" y="8" width="16" height="12" rx="3" fill="#e05a47" stroke="${INK}" stroke-width="3.5"/>
      <path d="M44 20 L56 20 L56 34 Q76 44 74 64 L74 88 Q74 94 68 94 L32 94 Q26 94 26 88 L26 64 Q24 44 44 34 Z" fill="#f2d16b" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <ellipse cx="50" cy="70" rx="13" ry="10" fill="#9bc45a" stroke="${INK}" stroke-width="3"/>
      <path d="M34 50 L34 80" stroke="#fff3c4" stroke-width="5" stroke-linecap="round"/>`),
  },
};

// ---------- Toppings / stickers (drawn around 0,0, about 28px wide) ----------
export const STICKERS = {
  strawberry: { name: 'strawberry', plural: 'strawberries', svg: `
    <path d="M0 14 Q-14 4 -12 -6 Q-8 -12 0 -9 Q8 -12 12 -6 Q14 4 0 14 Z" fill="#ff4d5e" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M-8 -9 L-3 -6 L0 -12 L3 -6 L8 -9 L4 -4 L-4 -4 Z" fill="#5cc46a" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
    <g fill="#ffe680"><circle cx="-5" cy="0" r="1.3"/><circle cx="4" cy="1" r="1.3"/><circle cx="0" cy="6" r="1.3"/><circle cx="-2" cy="-3" r="1.2"/><circle cx="6" cy="-4" r="1.1"/></g>` },
  blueberry: { name: 'blueberry', plural: 'blueberries', svg: `
    <circle r="9" fill="#4b62d6" stroke="${INK}" stroke-width="2.5"/>
    <path d="M-3 -5 L0 -2 L3 -5" fill="none" stroke="#2c3a8c" stroke-width="2" stroke-linecap="round"/>
    <circle cx="-4" cy="2" r="2" fill="#8fa2ff"/>` },
  cherry: { name: 'cherry', plural: 'cherries', svg: `
    <path d="M0 -2 Q2 -14 10 -16" fill="none" stroke="#3f8f3f" stroke-width="3" stroke-linecap="round"/>
    <circle cx="0" cy="5" r="10" fill="#e8283c" stroke="${INK}" stroke-width="2.5"/>
    <circle cx="-4" cy="1" r="3" fill="#ff8a95"/>` },
  banana: { name: 'banana slice', plural: 'banana slices', svg: `
    <circle r="11" fill="#fff3b0" stroke="${INK}" stroke-width="2.5"/>
    <circle r="7" fill="none" stroke="#f2dc7a" stroke-width="2"/>
    <g fill="#8a6a3c"><circle cx="0" cy="-3" r="1.4"/><circle cx="2.8" cy="1.6" r="1.4"/><circle cx="-2.8" cy="1.6" r="1.4"/></g>` },
  chip: { name: 'chocolate chip', plural: 'chocolate chips', svg: `
    <path d="M0 -10 Q3 -2 10 6 Q0 10 -10 6 Q-3 -2 0 -10 Z" fill="#6b3f2a" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M-3 0 Q-1 -4 0 -6" stroke="#a87458" stroke-width="2" fill="none" stroke-linecap="round"/>` },
  heart: { name: 'candy heart', plural: 'candy hearts', svg: `
    <path d="M0 11 Q-14 0 -11 -7 Q-7 -13 0 -6 Q7 -13 11 -7 Q14 0 0 11 Z" fill="#ff7eb6" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M-6 -5 Q-4 -7 -2 -5" stroke="#ffd1e6" stroke-width="2.5" fill="none" stroke-linecap="round"/>` },
  star: { name: 'candy star', plural: 'candy stars', svg: `
    <path d="M0 -12 L3.5 -4 L12 -3.5 L5.5 2.5 L7.5 11 L0 6.5 L-7.5 11 L-5.5 2.5 L-12 -3.5 L-3.5 -4 Z" fill="#ffd23f" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="-2" cy="-2" r="2" fill="#fff6c2"/>` },
  pepperoni: { name: 'pepperoni', plural: 'pepperonis', svg: `
    <circle r="12" fill="#d8432f" stroke="${INK}" stroke-width="2.5"/>
    <g fill="#a92d20"><circle cx="-4" cy="-3" r="2.2"/><circle cx="4" cy="2" r="2"/><circle cx="-1" cy="6" r="1.6"/><circle cx="5" cy="-6" r="1.4"/></g>` },
  mushroom: { name: 'mushroom', plural: 'mushrooms', svg: `
    <path d="M-12 0 Q-12 -12 0 -12 Q12 -12 12 0 Z" fill="#e9d2b5" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M-5 0 L-6 10 Q0 13 6 10 L5 0 Z" fill="#fff5e6" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` },
  olive: { name: 'olive', plural: 'olives', svg: `
    <circle r="9" fill="#3a3a3a" stroke="${INK}" stroke-width="2.5"/>
    <circle r="3.5" fill="#f2b8a0"/>` },
  pepper: { name: 'green pepper', plural: 'green peppers', svg: `
    <path d="M-12 4 Q-12 -10 0 -11 Q12 -10 12 4 Q6 -4 0 -4 Q-6 -4 -12 4 Z" fill="#4caf50" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` },
  pineapple: { name: 'pineapple', plural: 'pineapples', svg: `
    <path d="M-11 8 L0 -12 L11 8 Z" fill="#ffd23f" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M-4 2 L0 -4 L4 2" fill="none" stroke="#e8a92a" stroke-width="2"/>` },
};

export const sticker = (id, size = 64) =>
  `<svg viewBox="-16 -16 32 32" width="${size}" height="${size}" aria-hidden="true">${STICKERS[id].svg}</svg>`;

// ---------- Cookie shapes (around 0,0, radius about 72) ----------
function starPath(R, r) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rad = i % 2 ? r : R;
    d += (i ? 'L' : 'M') + (Math.cos(a) * rad).toFixed(1) + ' ' + (Math.sin(a) * rad).toFixed(1) + ' ';
  }
  return d + 'Z';
}
export const SHAPES = {
  circle: { name: 'circle', path: 'M-70 0 A70 70 0 1 0 70 0 A70 70 0 1 0 -70 0 Z' },
  star: { name: 'star', path: starPath(82, 40) },
  heart: { name: 'heart', path: 'M0 68 C-40 40 -80 10 -72 -26 C-66 -58 -24 -64 0 -32 C24 -64 66 -58 72 -26 C80 10 40 40 0 68 Z' },
  flower: { name: 'flower', path: (() => {
    const p = (a, r) => (Math.cos(a) * r).toFixed(1) + ' ' + (Math.sin(a) * r).toFixed(1);
    let d = '';
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      d += (i ? ' L' : 'M') + p(a - 0.6, 42) + ' A30 30 0 1 1 ' + p(a + 0.6, 42);
    }
    return d + ' Z';
  })() },
};

// ---------- The treat itself ----------
export function treatSVG(s, extra = '') {
  return `<svg viewBox="0 0 200 200" class="treat-svg" aria-hidden="true">${treatBody(s)}${decoSVG(s.deco || [])}${extra}</svg>`;
}

export function treatBody(s) {
  const b = s.batter || '#f7d9a0';
  switch (s.recipe) {
    case 'cupcake': return cupcake(s, b);
    case 'pancake': return pancakes(s, b);
    case 'pizza': return pizza(s);
    case 'cookie': return cookie(s, b);
  }
  return '';
}

function cupcake(s, b) {
  const liner = `<path d="M46 118 L154 118 L140 186 L60 186 Z" fill="#7fd8be" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M64 120 L72 184 M82 120 L86 184 M100 120 L100 184 M118 120 L114 184 M136 120 L128 184" stroke="#5bbfa3" stroke-width="5"/>
    <path d="M46 118 L154 118 L140 186 L60 186 Z" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  let cake;
  if (!s.baked) {
    cake = `<ellipse cx="100" cy="118" rx="54" ry="10" fill="${b}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="86" cy="116" rx="14" ry="3" fill="#fff" opacity=".6"/>`;
  } else {
    const c = shade(b, -0.12);
    cake = `<path d="M42 120 Q40 66 100 64 Q160 66 158 120 Z" fill="${c}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M62 92 Q72 76 92 74" fill="none" stroke="${shade(c, 0.35)}" stroke-width="6" stroke-linecap="round"/>`;
  }
  let frost = '';
  if (s.frost) {
    const f = s.frost, hl = shade(f, 0.45);
    frost = `<g stroke="${INK}" stroke-width="4" stroke-linejoin="round">
      <path d="M36 120 Q30 100 50 96 Q40 80 64 76 Q60 56 88 56 Q88 36 108 34 Q104 22 100 14 Q132 22 128 46 Q150 52 140 72 Q166 76 154 96 Q172 102 164 120 Q100 132 36 120 Z" fill="${f}"/></g>
      <path d="M52 108 Q76 112 100 110 M66 88 Q88 92 112 88 M84 66 Q100 70 116 66" fill="none" stroke="${hl}" stroke-width="5" stroke-linecap="round"/>`;
  }
  return liner + cake + frost;
}

function pancakes(s, b) {
  const n = Math.max(1, s.stack || 1);
  const top = shade(b, -0.08), edge = shade(b, -0.3);
  const gap = Math.min(18, 80 / n);
  let g = `<ellipse cx="100" cy="178" rx="92" ry="18" fill="#fff" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="100" cy="176" rx="70" ry="11" fill="#eef6ff"/>`;
  for (let i = 0; i < n; i++) {
    const y = 166 - i * gap;
    g += `<path d="M28 ${y - 4} L28 ${y + 4} Q100 ${y + 26} 172 ${y + 4} L172 ${y - 4} Z" fill="${edge}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <ellipse cx="100" cy="${y - 4}" rx="72" ry="17" fill="${top}" stroke="${INK}" stroke-width="3.5"/>`;
  }
  const ty = 166 - (n - 1) * gap - 4;
  g += `<path d="M64 ${ty - 4} Q80 ${ty - 10} 100 ${ty - 9}" fill="none" stroke="${shade(top, 0.35)}" stroke-width="4" stroke-linecap="round"/>`;
  if (s.frost) {
    const f = s.frost;
    g += `<path d="M44 ${ty} Q50 ${ty - 14} 100 ${ty - 14} Q150 ${ty - 14} 156 ${ty} Q160 ${ty + 6} 152 ${ty + 8} L152 ${ty + 26} Q146 ${ty + 32} 142 ${ty + 26} L140 ${ty + 12}
      Q120 ${ty + 16} 106 ${ty + 14} L104 ${ty + 34} Q98 ${ty + 40} 94 ${ty + 34} L92 ${ty + 14} Q70 ${ty + 14} 60 ${ty + 10} L58 ${ty + 20} Q52 ${ty + 26} 48 ${ty + 18} Q40 ${ty + 6} 44 ${ty} Z"
      fill="${f}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round" opacity=".95"/>
      <path d="M72 ${ty - 4} Q90 ${ty - 8} 108 ${ty - 6}" fill="none" stroke="${shade(f, 0.45)}" stroke-width="4" stroke-linecap="round"/>`;
  }
  return g;
}

function pizza(s) {
  const crust = s.baked ? '#dc9a52' : '#f1d9a8';
  let g = `<circle cx="100" cy="100" r="88" fill="${crust}" stroke="${INK}" stroke-width="4"/>
    <circle cx="100" cy="100" r="74" fill="${s.baked ? '#e8b46e' : '#f6e4bd'}"/>`;
  if (s.frost) g += `<path d="M100 30 Q140 28 162 62 Q178 100 160 136 Q136 172 96 170 Q56 170 38 136 Q22 100 40 64 Q60 30 100 30 Z" fill="${s.baked ? shade(s.frost, -0.1) : s.frost}"/>`;
  if (s.cheese) {
    g += `<path d="M100 40 Q124 34 146 56 Q164 78 156 104 Q160 134 132 152 Q104 166 80 156 Q48 148 44 118 Q34 92 52 68 Q70 42 100 40 Z" fill="${s.baked ? '#ffd76a' : '#fff1a8'}" opacity=".95"/>`;
    if (s.baked) g += `<g fill="#e3a43c"><circle cx="80" cy="70" r="5"/><circle cx="128" cy="86" r="6"/><circle cx="96" cy="130" r="5"/><circle cx="140" cy="128" r="4"/><circle cx="64" cy="108" r="4"/></g>`;
    else g += `<g stroke="#ffe066" stroke-width="3" stroke-linecap="round"><path d="M70 80 l8 4"/><path d="M110 70 l6 -6"/><path d="M130 110 l8 2"/><path d="M90 120 l-6 6"/><path d="M60 110 l6 -4"/><path d="M118 140 l6 4"/></g>`;
  }
  return g;
}

function cookie(s, b) {
  const shape = SHAPES[s.shape || 'circle'];
  const fill = s.baked ? shade(b, -0.1) : b;
  let g = `<g transform="translate(100 104)">`;
  if (s.baked) g += `<path d="${shape.path}" transform="translate(0 4)" fill="${shade(b, -0.4)}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  g += `<path d="${shape.path}" fill="${fill}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  if (s.frost) g += `<path d="${shape.path}" transform="scale(.82)" fill="${s.frost}" stroke="${shade(s.frost, -0.25)}" stroke-width="3" stroke-linejoin="round"/>`;
  else if (s.baked) g += `<g fill="${shade(b, -0.3)}"><circle cx="-20" cy="-14" r="3"/><circle cx="18" cy="8" r="3"/><circle cx="-6" cy="22" r="2.5"/></g>`;
  return g + '</g>';
}

export function decoSVG(list) {
  let g = '';
  for (const d of list) {
    if (d.t === 's') g += `<rect x="${(d.x - 1.8).toFixed(1)}" y="${(d.y - 5).toFixed(1)}" width="3.6" height="10" rx="1.8" fill="${d.c}" transform="rotate(${d.r} ${d.x} ${d.y})"/>`;
    else if (d.t === 'k') g += `<g transform="translate(${d.x} ${d.y}) rotate(${d.r}) scale(.9)">${STICKERS[d.id].svg}</g>`;
    else if (d.t === 'e') g += `<text x="${d.x}" y="${d.y}" font-size="${d.s || 22}" text-anchor="middle" dominant-baseline="central" transform="rotate(${d.r || 0} ${d.x} ${d.y})" class="emo">${d.e}</text>`;
    else if (d.t === 'l') g += `<g transform="translate(${d.x} ${d.y}) rotate(${d.r})"><circle r="12" fill="${d.c}" stroke="${INK}" stroke-width="2.5"/>
      <text y="5.5" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="16" fill="#fff" stroke="${INK}" stroke-width=".8">${d.ch}</text></g>`;
  }
  return g;
}

// ---------- Kitchen props ----------
export function bowlSVG(blobs, batter, mixAmt) {
  let inside = '';
  for (const bl of blobs) {
    inside += `<circle cx="${bl.x}" cy="${bl.y}" r="${bl.r}" fill="${bl.c[0]}" stroke="${INK}" stroke-width="2"/>`;
    if (bl.c[1] && bl.yolk) inside += `<circle cx="${bl.x}" cy="${bl.y}" r="${bl.r * 0.5}" fill="${bl.c[1]}"/>`;
  }
  return `<svg viewBox="0 0 240 170" class="bowl-svg" aria-hidden="true">
    <defs><clipPath id="bowlIn"><ellipse cx="120" cy="56" rx="98" ry="28"/></clipPath></defs>
    <ellipse cx="120" cy="56" rx="106" ry="34" fill="#ffb3c7" stroke="${INK}" stroke-width="5"/>
    <ellipse cx="120" cy="58" rx="98" ry="28" fill="#f7e6ee"/>
    <g clip-path="url(#bowlIn)">
      <g class="bowl-blobs">${inside}</g>
      <g class="batter" style="opacity:${mixAmt}">
        <ellipse cx="120" cy="60" rx="100" ry="30" fill="${batter}"/>
        <g class="swirl"><path d="M120 60 m-50 0 a50 14 0 1 0 100 0 a36 10 0 1 0 -72 0 a22 6 0 1 0 44 0" fill="none" stroke="${shade(batter, -0.15)}" stroke-width="4" stroke-linecap="round"/></g>
      </g>
    </g>
    <path d="M14 58 Q20 150 120 160 Q220 150 226 58 Q210 92 120 92 Q30 92 14 58 Z" fill="#ff8fab" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M40 98 Q60 128 96 136" fill="none" stroke="#ffc2d4" stroke-width="8" stroke-linecap="round"/>
    <g fill="#fff" opacity=".85"><circle cx="150" cy="122" r="6"/><circle cx="176" cy="108" r="5"/><circle cx="126" cy="134" r="4"/></g>
  </svg>`;
}

export const WHISK = `<svg viewBox="0 0 60 140" aria-hidden="true">
  <rect x="24" y="86" width="12" height="52" rx="6" fill="#ff8a65" stroke="${INK}" stroke-width="4"/>
  <path d="M30 88 Q4 60 18 20 Q30 0 42 20 Q56 60 30 88 Z" fill="none" stroke="#9aa7b5" stroke-width="4"/>
  <path d="M30 88 Q16 56 24 18 M30 88 Q44 56 36 18 M30 88 L30 8" fill="none" stroke="#b9c4cf" stroke-width="3.5"/>
</svg>`;

export const OVEN = `<svg viewBox="0 0 240 230" class="oven-svg" aria-hidden="true">
  <rect x="10" y="10" width="220" height="210" rx="22" fill="#ff8a65" stroke="${INK}" stroke-width="5"/>
  <rect x="10" y="10" width="220" height="44" rx="22" fill="#ffb199" stroke="${INK}" stroke-width="5"/>
  <circle cx="48" cy="32" r="11" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M48 32 L48 24" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="84" cy="32" r="11" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M84 32 L90 27" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
  <rect class="oven-timer" x="130" y="20" width="80" height="24" rx="8" fill="#3b2a24" stroke="${INK}" stroke-width="3"/>
  <rect x="40" y="70" width="160" height="16" rx="8" fill="#e9e1d6" stroke="${INK}" stroke-width="4"/>
  <rect x="30" y="96" width="180" height="110" rx="16" fill="#3b2a24" stroke="${INK}" stroke-width="5"/>
  <rect class="oven-glow" x="40" y="106" width="160" height="90" rx="10" fill="#ffb84d"/>
  <path d="M52 116 L76 116" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".5"/>
</svg>`;

export const PAN = `<svg viewBox="0 0 260 120" class="pan-svg" aria-hidden="true">
  <rect x="176" y="48" width="84" height="18" rx="9" fill="#6b3f2a" stroke="${INK}" stroke-width="4"/>
  <ellipse cx="96" cy="60" rx="92" ry="44" fill="#4a4f57" stroke="${INK}" stroke-width="5"/>
  <ellipse cx="96" cy="56" rx="78" ry="34" fill="#2f3339"/>
</svg>`;

export const STOVE_FLAME = `<svg viewBox="0 0 200 40" aria-hidden="true"><g class="flames">
  ${[30, 62, 94, 126, 158].map((x) => `<path d="M${x} 38 Q${x - 10} 22 ${x} 4 Q${x + 10} 22 ${x} 38 Z" fill="#4b8dff" stroke="#2c5cc4" stroke-width="2"/><path d="M${x} 36 Q${x - 4} 26 ${x} 18 Q${x + 4} 26 ${x} 36 Z" fill="#bfe0ff"/>`).join('')}
</g></svg>`;

export const DOUGH = (flat, c = '#f3dfb8') => {
  const rx = 50 + flat * 46, ry = 40 - flat * 24;
  return `<svg viewBox="0 0 220 140" class="dough-svg" aria-hidden="true">
    <ellipse cx="110" cy="124" rx="104" ry="12" fill="#c98b5a" opacity=".35"/>
    <ellipse cx="110" cy="${110 - ry}" rx="${rx}" ry="${ry}" fill="${c}" stroke="${INK}" stroke-width="4"/>
    <path d="M${110 - rx * 0.5} ${110 - ry * 1.5} Q${110 - rx * 0.2} ${110 - ry * 1.85} ${110 + rx * 0.1} ${110 - ry * 1.8}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>
  </svg>`;
};

export const ICONS = {
  home: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 24 L24 9 L40 24 L40 40 L8 40 Z" fill="#ffd166" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><rect x="19" y="27" width="10" height="13" rx="3" fill="#ff8a65" stroke="${INK}" stroke-width="3.5"/></svg>`,
  check: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 25 L20 35 L39 13" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  undo: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 12 L8 22 L18 32" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 22 L28 22 Q40 22 40 32 Q40 40 30 40 L22 40" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/></svg>`,
  again: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M38 24 A14 14 0 1 1 30 11.5" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M27 4 L33 12 L24 16" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  gear: `<svg viewBox="0 0 48 48" aria-hidden="true"><g transform="translate(24 24)"><path d="${starPath(18, 13)}" fill="#cfd8e3" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><circle r="6" fill="#fff" stroke="${INK}" stroke-width="3.5"/></g></svg>`,
  speaker: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 18 L16 18 L26 9 L26 39 L16 30 L8 30 Z" fill="#fff" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M32 17 Q37 24 32 31 M36 12 Q45 24 36 36" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/></svg>`,
  bakery: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 20 L10 8 L38 8 L42 20 Z" fill="#ff8fab" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M6 20 Q10 26 15 20 Q19 26 24 20 Q29 26 33 20 Q38 26 42 20" fill="#fff" stroke="${INK}" stroke-width="3.5"/><rect x="9" y="24" width="30" height="18" fill="#fff6e5" stroke="${INK}" stroke-width="3.5"/><rect x="20" y="30" width="8" height="12" fill="#7fd8be" stroke="${INK}" stroke-width="3"/></svg>`,
  sprinkles: `<svg viewBox="0 0 48 48" aria-hidden="true"><g stroke="${INK}" stroke-width="1.5"><rect x="8" y="10" width="5" height="14" rx="2.5" fill="#ff5a5a" transform="rotate(-30 10 17)"/><rect x="22" y="6" width="5" height="14" rx="2.5" fill="#ffd23f" transform="rotate(20 24 13)"/><rect x="34" y="14" width="5" height="14" rx="2.5" fill="#4b8dff" transform="rotate(-10 36 21)"/><rect x="14" y="28" width="5" height="14" rx="2.5" fill="#5cc46a" transform="rotate(40 16 35)"/><rect x="28" y="28" width="5" height="14" rx="2.5" fill="#c06ccf" transform="rotate(-50 30 35)"/></g></svg>`,
  cheese: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 36 L40 14 L42 36 Z" fill="#ffd76a" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="30" cy="28" r="3" fill="#e3a43c"/><circle cx="18" cy="32" r="2.5" fill="#e3a43c"/></svg>`,
  abc: `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="15" cy="18" r="11" fill="#ff7eb6" stroke="${INK}" stroke-width="3"/><circle cx="33" cy="30" r="11" fill="#4b8dff" stroke="${INK}" stroke-width="3"/><text x="15" y="23" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="14" fill="#fff">A</text><text x="33" y="35" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="14" fill="#fff">B</text></svg>`,
  drop: (c) => `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4 Q40 24 38 32 Q36 44 24 44 Q12 44 10 32 Q8 24 24 4 Z" fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M17 30 Q17 36 22 38" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".7"/></svg>`,
  bottle: (c) => `<svg viewBox="0 0 60 90" aria-hidden="true"><rect x="22" y="4" width="16" height="14" rx="4" fill="#fff" stroke="${INK}" stroke-width="3.5"/><path d="M20 18 L40 18 L40 26 Q52 32 52 46 L52 80 Q52 86 46 86 L14 86 Q8 86 8 80 L8 46 Q8 32 20 26 Z" fill="${c}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M16 44 L16 74" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/></svg>`,
};

export { INK };
