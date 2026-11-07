// Artwork for the open kitchen: dishes, stations, tools, and Biscuit the puppy.
import { INK, shade, treatBody, decoSVG, SHAPES } from './art.js';

const EMO = 'class="emo" text-anchor="middle" dominant-baseline="central"';
const emo = (e, x, y, s = 30, r = 0) => `<text x="${x}" y="${y}" font-size="${s}" ${EMO} transform="rotate(${r} ${x} ${y})">${e}</text>`;

// Stable pseudo-random so a dish always looks the same when redrawn.
function seeded(seed) { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }

const plate = (cy = 150, rx = 92, ry = 30) => `<ellipse cx="100" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" stroke="${INK}" stroke-width="4"/>
  <ellipse cx="100" cy="${cy - 2}" rx="${rx - 22}" ry="${ry - 9}" fill="#eef6ff"/>`;

function scatter(list, cx, cy, rx, ry, size, seed = 7) {
  const r = seeded(seed + list.length);
  let g = '';
  list.slice(0, 14).forEach((e, i) => {
    const a = (i / Math.max(1, Math.min(list.length, 14))) * Math.PI * 2 + r() * 0.8;
    const d = list.length === 1 ? 0 : 0.35 + r() * 0.6;
    g += emo(e, (cx + Math.cos(a) * rx * d).toFixed(0), (cy + Math.sin(a) * ry * d).toFixed(0), size, Math.round(r() * 40 - 20));
  });
  return g;
}

export function dishBody(d) {
  const c = d.c || '#f3d9a6';
  switch (d.kind) {
    case 'cupcakes': return treatBody({ recipe: 'cupcake', baked: true, batter: c, frost: d.frost }) + (d.chips && !d.frost ? emo('🍫', 100, 84, 18) : '');
    case 'pancakes': return treatBody({ recipe: 'pancake', baked: true, batter: c, stack: d.stack || 3, frost: d.frost });
    case 'pizza': return treatBody({ recipe: 'pizza', baked: d.baked !== false, frost: d.sauce, cheese: d.cheese });
    case 'cookies': {
      let g = treatBody({ recipe: 'cookie', baked: d.baked !== false, batter: c, shape: d.shape || 'circle', frost: d.frost });
      if (d.chips) g += `<g fill="#4a2a1c">${[[80, 84], [118, 92], [96, 122], [128, 128], [70, 116], [104, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5"/>`).join('')}</g>`;
      return g;
    }
    case 'cake': {
      const side = shade(c, -0.12), f = d.frost;
      let g = plate(172, 96, 22);
      g += `<path d="M30 92 L30 152 Q100 180 170 152 L170 92 Z" fill="${side}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M30 122 Q100 148 170 122" fill="none" stroke="${f || '#fff6e5'}" stroke-width="8"/>
        <ellipse cx="100" cy="92" rx="70" ry="22" fill="${f || shade(c, -0.05)}" stroke="${INK}" stroke-width="4"/>`;
      if (f) g += `<path d="M30 92 Q30 112 38 110 Q44 108 46 100 Q52 116 60 112 Q66 106 68 104 Q74 120 84 114 L86 108 Q96 122 108 112 Q116 104 120 112 Q130 120 136 108 Q144 116 152 108 Q160 112 170 92 Z" fill="${f}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M66 86 Q90 80 116 84" fill="none" stroke="${shade(f, 0.45)}" stroke-width="5" stroke-linecap="round"/>`;
      return g;
    }
    case 'soup': {
      let g = `<path d="M22 96 Q26 176 100 178 Q174 176 178 96 Z" fill="#7fd8be" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M44 136 Q60 160 92 166" fill="none" stroke="#b5ecdc" stroke-width="7" stroke-linecap="round"/>
        <ellipse cx="100" cy="96" rx="80" ry="24" fill="#7fd8be" stroke="${INK}" stroke-width="4"/>
        <ellipse cx="100" cy="98" rx="68" ry="17" fill="${c}"/>
        <ellipse cx="80" cy="94" rx="18" ry="4" fill="#fff" opacity=".35"/>`;
      g += scatter(d.parts || [], 100, 98, 54, 10, 18, 3);
      if (d.hot !== 0) g += `<g fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8" class="steam"><path d="M76 66 Q68 54 76 42 Q84 30 76 18"/><path d="M104 62 Q96 50 104 38 Q112 26 104 14"/><path d="M130 66 Q122 54 130 42"/></g>`;
      return g;
    }
    case 'bowlfood': {
      let g = `<path d="M22 100 Q26 176 100 178 Q174 176 178 100 Z" fill="#ffb3c7" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
        <ellipse cx="100" cy="100" rx="80" ry="22" fill="#ffd1de" stroke="${INK}" stroke-width="4"/>`;
      const p = d.parts && d.parts.length ? d.parts : ['🥗'];
      g += scatter(p.concat(p).slice(0, 10), 100, 86, 60, 22, 30, 5);
      g += `<path d="M22 100 Q26 176 100 178 Q174 176 178 100 Q160 120 100 122 Q40 120 22 100 Z" fill="#ffb3c7" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M44 136 Q60 160 92 166" fill="none" stroke="#ffd9e3" stroke-width="7" stroke-linecap="round"/>`;
      return g;
    }
    case 'noodles': {
      let g = `<path d="M22 96 Q26 176 100 178 Q174 176 178 96 Z" fill="#8fd3ff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
        <ellipse cx="100" cy="96" rx="80" ry="24" fill="#8fd3ff" stroke="${INK}" stroke-width="4"/>`;
      if (d.rice) g += `<ellipse cx="100" cy="92" rx="66" ry="22" fill="#fffaf0" stroke="${INK}" stroke-width="3"/>` + [[70, 88], [90, 80], [112, 86], [130, 94], [84, 100], [108, 100]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="2" fill="#f0e6d2"/>`).join('');
      else {
        g += `<ellipse cx="100" cy="92" rx="66" ry="20" fill="${c}" stroke="${INK}" stroke-width="3"/>`;
        g += `<g fill="none" stroke="${shade(c, -0.18)}" stroke-width="3.5" stroke-linecap="round">` + [0, 1, 2, 3, 4].map((i) => `<path d="M${50 + i * 4} ${84 + i * 4} Q${76 + i * 3} ${74 + i * 4} ${100} ${86 + i * 3} T${150 - i * 4} ${84 + i * 4}"/>`).join('') + '</g>';
      }
      g += scatter(d.parts || [], 100, 90, 48, 10, 18, 9);
      return g;
    }
    case 'drink': {
      const hot = d.hot;
      let g = '';
      if (hot) {
        g += `<path d="M150 90 Q184 92 180 122 Q176 148 146 146" fill="none" stroke="${INK}" stroke-width="12"/><path d="M150 90 Q184 92 180 122 Q176 148 146 146" fill="none" stroke="#ff8fab" stroke-width="5"/>
          <path d="M44 66 L156 66 L148 178 Q100 190 52 178 Z" fill="#ff8fab" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
          <ellipse cx="100" cy="68" rx="56" ry="12" fill="${c}" stroke="${INK}" stroke-width="4"/>
          ${d.n === 'hot chocolate' ? `<rect x="78" y="58" width="14" height="12" rx="3" fill="#fff" stroke="${INK}" stroke-width="2"/><rect x="104" y="60" width="14" height="12" rx="3" fill="#fff" stroke="${INK}" stroke-width="2"/>` : ''}
          <g fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8" class="steam"><path d="M80 44 Q72 32 80 20"/><path d="M110 42 Q102 30 110 18"/></g>
          <circle cx="80" cy="126" r="9" fill="#fff" opacity=".6"/><circle cx="104" cy="140" r="6" fill="#fff" opacity=".6"/>`;
      } else {
        g += `<path d="M52 40 L148 40 L136 182 Q100 190 64 182 Z" fill="#eaf7ff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
          <path d="M57 74 L143 74 L136 180 Q100 188 64 180 Z" fill="${c}"/>
          <ellipse cx="100" cy="74" rx="43" ry="7" fill="${shade(c, 0.25)}"/>
          <path d="M66 86 L72 168" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".5"/>
          <path d="M52 40 L148 40 L136 182 Q100 190 64 182 Z" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
        if (d.straw) g += `<path d="M112 120 L132 14 L150 14" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M112 120 L132 14 L150 14" fill="none" stroke="#ff5a5a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
      return g;
    }
    case 'scrambled': {
      let g = plate();
      g += `<path d="M48 140 Q40 120 62 116 Q66 98 88 104 Q100 88 118 102 Q140 96 144 114 Q164 120 154 140 Q130 156 100 154 Q66 156 48 140 Z" fill="#ffdc5c" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M70 128 Q80 120 92 126 M108 118 Q120 112 132 120 M88 142 Q100 136 114 142" fill="none" stroke="#ffeca0" stroke-width="5" stroke-linecap="round"/>`;
      return g + scatter(d.parts || [], 100, 128, 40, 12, 16, 2);
    }
    case 'friedegg': {
      let g = plate();
      const n = Math.min(3, d.count || 1);
      for (let i = 0; i < n; i++) {
        const x = 100 + (i - (n - 1) / 2) * 52, s = n > 1 ? 0.7 : 1;
        g += `<g transform="translate(${x} 132) scale(${s})"><path d="M-50 0 Q-56 -26 -26 -30 Q-10 -46 14 -34 Q44 -36 48 -10 Q60 14 30 22 Q0 34 -26 22 Q-54 20 -50 0 Z" fill="#fff" stroke="${INK}" stroke-width="4"/>
          <circle cx="0" cy="-6" r="17" fill="#ffb300" stroke="${INK}" stroke-width="3.5"/><circle cx="-6" cy="-12" r="5" fill="#ffe08a"/></g>`;
      }
      return g;
    }
    case 'toast': {
      let g = plate();
      g += `<path d="M58 152 L58 92 Q48 70 70 62 Q100 50 130 62 Q152 70 142 92 L142 152 Z" fill="#c98b4a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M66 146 L66 94 Q58 76 76 70 Q100 60 124 70 Q142 76 134 94 L134 146 Z" fill="#f2c27b"/>`;
      if (d.cheese) g += `<path d="M58 108 L142 108 L142 120 Q136 132 130 120 Q120 140 112 122 Q100 134 92 122 Q80 144 72 122 Q64 130 58 120 Z" fill="#ffc93c" stroke="${INK}" stroke-width="3"/>`;
      else g += `<path d="M84 96 Q100 88 116 96" fill="none" stroke="#e0a46b" stroke-width="5" stroke-linecap="round"/><rect x="90" y="104" width="20" height="14" rx="3" fill="#ffe680" stroke="${INK}" stroke-width="2.5"/>`;
      return g;
    }
    case 'fries': {
      let g = '';
      const r = seeded(4);
      for (let i = 0; i < 11; i++) { const x = 58 + i * 8.5, h = 60 + r() * 30, rot = (r() - 0.5) * 22; g += `<rect x="${x}" y="${120 - h}" width="11" height="${h + 20}" rx="3" fill="#ffd54f" stroke="${INK}" stroke-width="3" transform="rotate(${rot} ${x} 120)"/>`; }
      g += `<path d="M46 96 L154 96 L140 184 L60 184 Z" fill="#ff5a5a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M46 96 Q100 122 154 96" fill="#ff5a5a" stroke="${INK}" stroke-width="4"/>
        <circle cx="100" cy="146" r="16" fill="#ffd23f" stroke="${INK}" stroke-width="3.5"/><path d="M93 146 l5 5 l9 -10" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
      return g;
    }
    case 'sandwich': {
      const L = d.layers || [];
      const top = Math.max(40, 140 - L.length * 14 - (d.closed ? 22 : 0));
      let g = plate(164);
      g += `<path d="M36 156 Q36 138 50 136 L150 136 Q164 138 164 156 Q100 170 36 156 Z" fill="#e0a46b" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
      L.forEach((l, i) => {
        const y = 136 - i * 14;
        if (l.e && !['cheese', 'lettuce', 'tomato', 'bacon', 'cucumber'].includes(l.key)) g += scatter([l.e, l.e, l.e], 100, y - 6, 46, 4, 20, i + 1);
        else g += `<path d="M30 ${y} Q40 ${y - 12} 60 ${y - 10} Q80 ${y - 16} 100 ${y - 10} Q120 ${y - 16} 140 ${y - 10} Q160 ${y - 12} 170 ${y} Q100 ${y + 8} 30 ${y} Z" fill="${l.c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
      });
      if (d.closed) {
        const y = 136 - L.length * 14;
        g += `<path d="M34 ${y} Q30 ${y - 34} 100 ${y - 40} Q170 ${y - 34} 166 ${y} Q100 ${y + 10} 34 ${y} Z" fill="#e9b872" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
          <path d="M70 ${y - 26} Q90 ${y - 32} 110 ${y - 30}" fill="none" stroke="#f7d9a8" stroke-width="5" stroke-linecap="round"/>
          <g fill="#fff3d6"><ellipse cx="80" cy="${y - 18}" rx="3" ry="1.6"/><ellipse cx="118" cy="${y - 22}" rx="3" ry="1.6"/><ellipse cx="100" cy="${y - 12}" rx="3" ry="1.6"/></g>`;
      }
      void top;
      return g;
    }
    case 'raw': return plate() + emo(d.e, 100, 120, 80);
    case 'plate':
    default: {
      let g = plate();
      if (d.c) g += `<ellipse cx="100" cy="140" rx="54" ry="16" fill="${d.c}" opacity=".55"/>`;
      const p = d.parts && d.parts.length ? d.parts : ['🍽️'];
      g += p.length <= 3 ? p.map((e, i) => emo(e, 100 + (i - (p.length - 1) / 2) * 44, 122, 58, i * 12 - 10)).join('') : scatter(p, 100, 126, 56, 14, 34, 11);
      return g;
    }
  }
}

export function dishSVG(d, { deco = true, cls = 'treat-svg' } = {}) {
  return `<svg viewBox="0 0 200 200" class="${cls}" aria-hidden="true">${dishBody(d)}${deco ? decoSVG(d.deco || []) : ''}</svg>`;
}

// Small picture of anything that can sit on the tray.
export function itemIcon(it) {
  if (it.t === 'raw') return `<span class="emo-icon">${it.e}</span>`;
  if (it.t === 'chop') return `<span class="emo-icon chopped"><i>${it.e}</i><i>${it.e}</i><i>${it.e}</i></span>`;
  if (it.t === 'batter' || it.t === 'beaten') return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M8 44 Q12 92 50 94 Q88 92 92 44 Z" fill="#ffb3c7" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="50" cy="44" rx="42" ry="14" fill="${it.c}" stroke="${INK}" stroke-width="5"/><path d="M34 42 Q50 36 66 44" fill="none" stroke="${shade(it.c, -0.2)}" stroke-width="4" stroke-linecap="round"/></svg>`;
  if (it.t === 'dough') return `<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="62" rx="40" ry="28" fill="${it.c}" stroke="${INK}" stroke-width="5"/><path d="M28 50 Q40 42 56 44" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>${it.chips ? '<g fill="#4a2a1c"><circle cx="40" cy="66" r="4"/><circle cx="60" cy="58" r="4"/><circle cx="62" cy="74" r="4"/></g>' : ''}</svg>`;
  if (it.t === 'dish') return dishSVG(it, { cls: 'mini' });
  return '';
}

// ---------- Station icons for the bottom bar ----------
const S = (inner) => `<svg viewBox="0 0 64 64" aria-hidden="true">${inner}</svg>`;
export const STATION_ICONS = {
  fridge: S(`<rect x="14" y="4" width="36" height="56" rx="7" fill="#e8f4ff" stroke="${INK}" stroke-width="4"/><path d="M14 24 L50 24" stroke="${INK}" stroke-width="4"/><rect x="40" y="10" width="4" height="9" rx="2" fill="${INK}"/><rect x="40" y="30" width="4" height="14" rx="2" fill="${INK}"/>`),
  board: S(`<rect x="6" y="18" width="46" height="34" rx="8" fill="#e0a46b" stroke="${INK}" stroke-width="4"/><circle cx="44" cy="26" r="3" fill="${INK}"/><path d="M30 34 L58 8" stroke="#cfd8e3" stroke-width="7" stroke-linecap="round"/><path d="M30 34 L58 8" stroke="${INK}" stroke-width="2" stroke-linecap="round" opacity=".4"/><rect x="24" y="34" width="12" height="7" rx="3" fill="#ff8a65" stroke="${INK}" stroke-width="3" transform="rotate(-42 30 37)"/>`),
  bowl: S(`<path d="M6 28 Q8 58 32 58 Q56 58 58 28 Z" fill="#ff8fab" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><ellipse cx="32" cy="28" rx="26" ry="8" fill="#f3d9a6" stroke="${INK}" stroke-width="4"/><path d="M38 26 L52 4" stroke="#9aa7b5" stroke-width="5" stroke-linecap="round"/>`),
  stove: S(`<path d="M14 26 L50 26 L46 54 Q32 60 18 54 Z" fill="#8fd3ff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><ellipse cx="32" cy="26" rx="18" ry="5" fill="#8fd3ff" stroke="${INK}" stroke-width="4"/><rect x="4" y="22" width="10" height="5" rx="2" fill="${INK}"/><rect x="50" y="22" width="10" height="5" rx="2" fill="${INK}"/><path d="M24 16 Q20 10 24 4 M32 16 Q28 10 32 4 M40 16 Q36 10 40 4" fill="none" stroke="#9aa7b5" stroke-width="3" stroke-linecap="round"/>`),
  oven: S(`<rect x="6" y="6" width="52" height="52" rx="8" fill="#ff8a65" stroke="${INK}" stroke-width="4"/><circle cx="16" cy="15" r="3.5" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cx="27" cy="15" r="3.5" fill="#fff" stroke="${INK}" stroke-width="2"/><rect x="12" y="24" width="40" height="28" rx="5" fill="#ffb84d" stroke="${INK}" stroke-width="3.5"/>`),
  blender: S(`<path d="M18 6 L46 6 L42 40 L22 40 Z" fill="#dff4ff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M20 22 L44 22 L42 40 L22 40 Z" fill="#ff8fa8"/><path d="M18 6 L46 6 L42 40 L22 40 Z" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><rect x="16" y="40" width="32" height="18" rx="5" fill="#7fd8be" stroke="${INK}" stroke-width="4"/><circle cx="32" cy="49" r="4" fill="#fff" stroke="${INK}" stroke-width="2"/>`),
  table: S(`<ellipse cx="32" cy="38" rx="28" ry="12" fill="#fff" stroke="${INK}" stroke-width="4"/><ellipse cx="32" cy="37" rx="18" ry="6" fill="#eef6ff"/><path d="M24 26 Q22 14 32 12 Q42 14 40 26" fill="#c98b5a" stroke="${INK}" stroke-width="3.5"/><circle cx="20" cy="14" r="5" fill="#a86f45" stroke="${INK}" stroke-width="3"/><circle cx="44" cy="14" r="5" fill="#a86f45" stroke="${INK}" stroke-width="3"/>`),
};
export const STATION_NAMES = { fridge: 'fridge', board: 'cutting board', bowl: 'mixing bowl', stove: 'stove', oven: 'oven', blender: 'blender', table: 'table' };

// ---------- Big tools ----------
export const BOARD = `<svg viewBox="0 0 300 200" class="board-svg" aria-hidden="true">
  <rect x="10" y="20" width="280" height="170" rx="28" fill="#c98b4a" stroke="${INK}" stroke-width="5"/>
  <rect x="18" y="14" width="264" height="164" rx="24" fill="#e7b27a" stroke="${INK}" stroke-width="5"/>
  <circle cx="254" cy="40" r="9" fill="#c98b4a" stroke="${INK}" stroke-width="4"/>
  <path d="M40 60 Q120 50 200 64 M50 130 Q140 120 240 136" fill="none" stroke="#d99f63" stroke-width="4" stroke-linecap="round"/>
</svg>`;

export const KNIFE = `<svg viewBox="0 0 60 200" aria-hidden="true">
  <path d="M18 8 Q50 20 46 110 L18 110 Z" fill="#e3e9ef" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M26 24 Q38 40 38 100" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
  <rect x="14" y="108" width="36" height="84" rx="12" fill="#ff8a65" stroke="${INK}" stroke-width="4"/>
  <circle cx="32" cy="130" r="4" fill="#fff"/><circle cx="32" cy="168" r="4" fill="#fff"/>
</svg>`;

export const BIG_BOWL = (c, fill) => `<svg viewBox="0 0 300 200" class="bigbowl-svg" aria-hidden="true">
  <ellipse cx="150" cy="70" rx="132" ry="40" fill="#ffb3c7" stroke="${INK}" stroke-width="5"/>
  <ellipse cx="150" cy="72" rx="122" ry="33" fill="#f7e6ee"/>
  <ellipse class="bowl-fill" cx="150" cy="76" rx="118" ry="30" fill="${c}" opacity="${fill}"/>
  <g class="swirl" opacity="${fill}"><path d="M150 76 m-60 0 a60 16 0 1 0 120 0 a44 12 0 1 0 -88 0 a28 7 0 1 0 56 0" fill="none" stroke="${shade(c, -0.15)}" stroke-width="5" stroke-linecap="round"/></g>
  <path d="M18 72 Q24 186 150 196 Q276 186 282 72 Q262 114 150 114 Q38 114 18 72 Z" fill="#ff8fab" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M52 124 Q76 160 120 170" fill="none" stroke="#ffc2d4" stroke-width="10" stroke-linecap="round"/>
  <g fill="#fff" opacity=".85"><circle cx="190" cy="152" r="7"/><circle cx="222" cy="134" r="6"/><circle cx="160" cy="168" r="5"/></g>
</svg>`;

export const PAN_TOP = `<svg viewBox="0 0 300 200" class="pan-svg" aria-hidden="true">
  <rect x="214" y="88" width="86" height="22" rx="11" fill="#6b3f2a" stroke="${INK}" stroke-width="5"/>
  <circle cx="114" cy="100" r="96" fill="#4a4f57" stroke="${INK}" stroke-width="5"/>
  <circle cx="114" cy="100" r="80" fill="#2f3339"/>
  <path d="M60 60 Q80 40 110 36" fill="none" stroke="#5c636d" stroke-width="7" stroke-linecap="round"/>
</svg>`;

export const POT_TOP = (c) => `<svg viewBox="0 0 300 200" class="pot-svg" aria-hidden="true">
  <rect x="2" y="88" width="40" height="20" rx="10" fill="#4a4f57" stroke="${INK}" stroke-width="5"/>
  <rect x="258" y="88" width="40" height="20" rx="10" fill="#4a4f57" stroke="${INK}" stroke-width="5"/>
  <circle cx="150" cy="100" r="98" fill="#8fd3ff" stroke="${INK}" stroke-width="5"/>
  <circle cx="150" cy="100" r="84" fill="#5aa9d6"/>
  <circle class="pot-fill" cx="150" cy="100" r="80" fill="${c}"/>
  <g class="swirl"><path d="M150 100 m-50 0 a50 50 0 1 0 100 0 a36 36 0 1 0 -72 0 a20 20 0 1 0 40 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".35"/></g>
</svg>`;

export const BURNER = `<svg viewBox="0 0 300 40" aria-hidden="true"><g class="flames">
  ${[40, 85, 130, 175, 220, 260].map((x) => `<path d="M${x} 38 Q${x - 11} 22 ${x} 4 Q${x + 11} 22 ${x} 38 Z" fill="#4b8dff" stroke="#2c5cc4" stroke-width="2"/><path d="M${x} 36 Q${x - 4} 26 ${x} 18 Q${x + 4} 26 ${x} 36 Z" fill="#bfe0ff"/>`).join('')}
</g></svg>`;

export const BLENDER = (c, fill) => `<svg viewBox="0 0 200 300" class="blender-svg" aria-hidden="true">
  <rect x="70" y="6" width="60" height="18" rx="6" fill="#4a4f57" stroke="${INK}" stroke-width="5"/>
  <path d="M40 24 L160 24 L146 210 L54 210 Z" fill="#eaf7ff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <path class="blend-fill" d="M${46 + (1 - fill) * 4} ${210 - fill * 180} L${154 - (1 - fill) * 4} ${210 - fill * 180} L146 208 L54 208 Z" fill="${c}" opacity="${fill ? 1 : 0}"/>
  <path d="M60 50 L66 190" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".6"/>
  <path d="M40 24 L160 24 L146 210 L54 210 Z" fill="none" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M30 210 L170 210 L178 290 L22 290 Z" fill="#7fd8be" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <circle cx="100" cy="252" r="22" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="100" cy="252" r="9" fill="#ff5a5a"/>
</svg>`;

export const TIN_ICONS = {
  cupcake: S(`<rect x="4" y="18" width="56" height="34" rx="8" fill="#b0bac5" stroke="${INK}" stroke-width="4"/>${[16, 32, 48].map((x) => `<circle cx="${x}" cy="35" r="7" fill="#ff8fab" stroke="${INK}" stroke-width="3"/>`).join('')}`),
  cake: S(`<ellipse cx="32" cy="44" rx="26" ry="9" fill="#b0bac5" stroke="${INK}" stroke-width="4"/><path d="M6 30 L6 44 Q32 56 58 44 L58 30" fill="#b0bac5" stroke="${INK}" stroke-width="4"/><ellipse cx="32" cy="30" rx="26" ry="9" fill="#d8dee6" stroke="${INK}" stroke-width="4"/>`),
  cookie: S(`<rect x="4" y="22" width="56" height="28" rx="5" fill="#b0bac5" stroke="${INK}" stroke-width="4"/><circle cx="20" cy="36" r="7" fill="#e2b06a" stroke="${INK}" stroke-width="3"/><circle cx="44" cy="36" r="7" fill="#e2b06a" stroke="${INK}" stroke-width="3"/>`),
  pizza: S(`<circle cx="32" cy="34" r="26" fill="#b0bac5" stroke="${INK}" stroke-width="4"/><circle cx="32" cy="34" r="18" fill="#f1d9a8" stroke="${INK}" stroke-width="3"/><circle cx="26" cy="30" r="4" fill="#e8442e"/><circle cx="38" cy="38" r="4" fill="#e8442e"/>`),
  dish: S(`<rect x="6" y="24" width="52" height="26" rx="10" fill="#ff8a65" stroke="${INK}" stroke-width="4"/><rect x="2" y="26" width="8" height="8" rx="3" fill="#ff8a65" stroke="${INK}" stroke-width="3"/><rect x="54" y="26" width="8" height="8" rx="3" fill="#ff8a65" stroke="${INK}" stroke-width="3"/>`),
};

export const CUTTERS = Object.fromEntries(Object.entries(SHAPES).map(([k, s]) => [k, `<svg viewBox="-100 -100 200 200" aria-hidden="true"><path d="${s.path}" fill="#fff" stroke="#9aa7b5" stroke-width="16" stroke-linejoin="round"/></svg>`]));

// ---------- Biscuit the puppy ----------
export const PUPPY = `<svg viewBox="0 0 160 160" class="puppy-svg" aria-hidden="true">
  <path d="M30 150 Q24 100 80 96 Q136 100 130 150 Z" fill="#e8c39e" stroke="${INK}" stroke-width="4"/>
  <path d="M60 150 Q62 122 80 120 Q98 122 100 150 Z" fill="#fff3e3"/>
  <g class="pup-tail"><path d="M128 132 Q156 120 150 92" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M128 132 Q156 120 150 92" fill="none" stroke="#e8c39e" stroke-width="6" stroke-linecap="round"/></g>
  <g class="pup-head">
    <path d="M30 40 Q10 44 14 84 Q18 104 34 96 Q44 70 42 46 Z" fill="#a86f45" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M130 40 Q150 44 146 84 Q142 104 126 96 Q116 70 118 46 Z" fill="#a86f45" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <ellipse cx="80" cy="62" rx="46" ry="42" fill="#e8c39e" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="102" cy="48" rx="14" ry="12" fill="#a86f45" opacity=".6"/>
    <ellipse cx="80" cy="82" rx="24" ry="18" fill="#fff3e3"/>
    <ellipse cx="62" cy="58" rx="6" ry="7.5" fill="${INK}"/><ellipse cx="98" cy="58" rx="6" ry="7.5" fill="${INK}"/>
    <circle cx="64" cy="55" r="2.2" fill="#fff"/><circle cx="100" cy="55" r="2.2" fill="#fff"/>
    <ellipse cx="80" cy="74" rx="9" ry="6.5" fill="${INK}"/>
    <path class="pup-smile" d="M68 84 Q80 94 92 84" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
    <g class="pup-open"><ellipse cx="80" cy="90" rx="12" ry="10" fill="#8a2f2f" stroke="${INK}" stroke-width="3.5"/><ellipse cx="80" cy="95" rx="7" ry="4" fill="#ff8a95"/></g>
    <path class="pup-tongue" d="M74 88 Q74 104 80 104 Q86 104 86 88 Z" fill="#ff8a95" stroke="${INK}" stroke-width="3"/>
    <circle cx="50" cy="78" r="6" fill="#ff9aa8" opacity=".6"/><circle cx="110" cy="78" r="6" fill="#ff9aa8" opacity=".6"/>
  </g>
</svg>`;

export const TRASH = `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 16 L36 16 L33 42 L15 42 Z" fill="#cfd8e3" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><rect x="8" y="10" width="32" height="6" rx="3" fill="#cfd8e3" stroke="${INK}" stroke-width="3.5"/><rect x="19" y="5" width="10" height="5" rx="2" fill="#cfd8e3" stroke="${INK}" stroke-width="3"/><path d="M20 22 L21 36 M28 22 L27 36" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></svg>`;
export const BOOK = `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 10 Q16 6 24 12 Q32 6 42 10 L42 40 Q32 36 24 42 Q16 36 6 40 Z" fill="#fff" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M24 12 L24 42" stroke="${INK}" stroke-width="3"/><path d="M6 10 Q16 6 24 12 L24 42 Q16 36 6 40 Z" fill="#ff8fab" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="33" cy="22" r="4" fill="#ffd23f"/></svg>`;
export const CAMERA = `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="14" width="38" height="26" rx="6" fill="#8fd3ff" stroke="${INK}" stroke-width="3.5"/><rect x="16" y="8" width="14" height="8" rx="3" fill="#8fd3ff" stroke="${INK}" stroke-width="3.5"/><circle cx="24" cy="27" r="8" fill="#fff" stroke="${INK}" stroke-width="3.5"/><circle cx="24" cy="27" r="3" fill="${INK}"/></svg>`;
