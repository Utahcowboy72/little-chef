// Everything the kitchen knows about food: ingredients, colors, and what turns into what.
import { blend } from './art.js';

// g = group: fruit, veg, fridge, pantry. c = the color it gives food. chop = can go on the cutting board.
export const ING = {
  strawberry: { n: 'strawberry', p: 'strawberries', e: '🍓', c: '#ff4d6d', g: 'fruit', chop: 1 },
  banana: { n: 'banana', p: 'bananas', e: '🍌', c: '#ffe066', g: 'fruit', chop: 1 },
  blueberry: { n: 'blueberry', p: 'blueberries', e: '🫐', c: '#5b6ee0', g: 'fruit' },
  apple: { n: 'apple', p: 'apples', e: '🍎', c: '#e8283c', g: 'fruit', chop: 1 },
  orange: { n: 'orange', p: 'oranges', e: '🍊', c: '#ff9a3c', g: 'fruit', chop: 1 },
  grapes: { n: 'grapes', p: 'grapes', e: '🍇', c: '#9b59d0', g: 'fruit' },
  watermelon: { n: 'watermelon', p: 'watermelons', e: '🍉', c: '#ff6f7f', g: 'fruit', chop: 1 },
  cherry: { n: 'cherry', p: 'cherries', e: '🍒', c: '#d81e3a', g: 'fruit' },
  pineapple: { n: 'pineapple', p: 'pineapples', e: '🍍', c: '#ffd23f', g: 'fruit', chop: 1 },
  kiwi: { n: 'kiwi', p: 'kiwis', e: '🥝', c: '#7cc242', g: 'fruit', chop: 1 },
  lemon: { n: 'lemon', p: 'lemons', e: '🍋', c: '#fff176', g: 'fruit', chop: 1 },
  peach: { n: 'peach', p: 'peaches', e: '🍑', c: '#ffb38a', g: 'fruit', chop: 1 },

  carrot: { n: 'carrot', p: 'carrots', e: '🥕', c: '#ff8a3c', g: 'veg', chop: 1 },
  tomato: { n: 'tomato', p: 'tomatoes', e: '🍅', c: '#e8442e', g: 'veg', chop: 1 },
  broccoli: { n: 'broccoli', p: 'broccoli', e: '🥦', c: '#4caf50', g: 'veg', chop: 1 },
  corn: { n: 'corn', p: 'corn', e: '🌽', c: '#ffd23f', g: 'veg', chop: 1 },
  pepper: { n: 'green pepper', p: 'green peppers', e: '🫑', c: '#43a047', g: 'veg', chop: 1 },
  mushroom: { n: 'mushroom', p: 'mushrooms', e: '🍄', c: '#c98b5a', g: 'veg', chop: 1 },
  potato: { n: 'potato', p: 'potatoes', e: '🥔', c: '#d9a96b', g: 'veg', chop: 1 },
  cucumber: { n: 'cucumber', p: 'cucumbers', e: '🥒', c: '#66bb6a', g: 'veg', chop: 1 },
  lettuce: { n: 'lettuce', p: 'lettuce', e: '🥬', c: '#7cc242', g: 'veg', chop: 1 },
  onion: { n: 'onion', p: 'onions', e: '🧅', c: '#e8d3a8', g: 'veg', chop: 1 },

  egg: { n: 'egg', p: 'eggs', e: '🥚', c: '#ffd84d', g: 'fridge', base: 1 },
  milk: { n: 'milk', p: 'milk', e: '🥛', c: '#ffffff', g: 'fridge', base: 1, liquid: 1 },
  cheese: { n: 'cheese', p: 'cheese', e: '🧀', c: '#ffd76a', g: 'fridge', chop: 1 },
  butter: { n: 'butter', p: 'butter', e: '🧈', c: '#ffe680', g: 'fridge', base: 1 },
  bacon: { n: 'bacon', p: 'bacon', e: '🥓', c: '#d9534f', g: 'fridge', chop: 1 },
  chicken: { n: 'chicken', p: 'chicken', e: '🍗', c: '#c98b5a', g: 'fridge', chop: 1 },
  ice: { n: 'ice', p: 'ice', e: '🧊', c: '#dff4ff', g: 'fridge', base: 1 },

  flour: { n: 'flour', p: 'flour', e: '🌾', c: '#f6efe2', g: 'pantry', base: 1 },
  sugar: { n: 'sugar', p: 'sugar', e: '🍬', c: '#ffffff', g: 'pantry', base: 1 },
  water: { n: 'water', p: 'water', e: '💧', c: '#bfe6ff', g: 'pantry', base: 1, liquid: 1 },
  bread: { n: 'bread', p: 'bread', e: '🍞', c: '#e0a46b', g: 'pantry', chop: 1 },
  pasta: { n: 'pasta', p: 'pasta', e: '🍝', c: '#ffd76a', g: 'pantry' },
  rice: { n: 'rice', p: 'rice', e: '🍚', c: '#ffffff', g: 'pantry' },
  chocolate: { n: 'chocolate', p: 'chocolate', e: '🍫', c: '#6b3f2a', g: 'pantry', chop: 1 },
  honey: { n: 'honey', p: 'honey', e: '🍯', c: '#f2b632', g: 'pantry' },
};

export const GROUPS = [
  { k: 'fruit', n: 'fruit', e: '🍎' },
  { k: 'veg', n: 'veggies', e: '🥕' },
  { k: 'fridge', n: 'fridge', e: '🥚' },
  { k: 'pantry', n: 'pantry', e: '🍞' },
];

// ---------- Colors ----------
const NAMED = [
  ['red', '#e8442e'], ['pink', '#ff9ccf'], ['pink', '#f0508a'], ['orange', '#ff9a3c'], ['yellow', '#ffd93b'], ['green', '#5cc46a'],
  ['blue', '#4b8dff'], ['purple', '#9b59d0'], ['brown', '#8a5a3c'], ['white', '#fbf6ee'], ['golden', '#e9c27a'],
];
export function colorName(hex) {
  const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  let best = 'yummy', bd = 1e9;
  for (const [name, h] of NAMED) {
    const m = parseInt(h.slice(1), 16), d = (r - (m >> 16)) ** 2 + (g - ((m >> 8) & 255)) ** 2 + (b - (m & 255)) ** 2;
    if (d < bd) { bd = d; best = name; }
  }
  return best;
}

function avg(colors) {
  if (!colors.length) return null;
  let r = 0, g = 0, b = 0;
  for (const h of colors) { const n = parseInt(h.slice(1), 16); r += n >> 16; g += (n >> 8) & 255; b += n & 255; }
  const k = colors.length;
  return '#' + ((1 << 24) + (Math.round(r / k) << 16) + (Math.round(g / k) << 8) + Math.round(b / k)).toString(16).slice(1);
}

// Color of a mix: the colorful things win, the plain base (flour, milk...) lightens it.
export function mixColor(items, base = '#f3dfb8', drops = []) {
  const colorful = [], plain = [];
  for (const it of items) {
    if (it.t === 'raw' || it.t === 'chop') (ING[it.key].base || ['flour', 'rice', 'sugar', 'pasta'].includes(it.key) ? plain : colorful).push(it.c);
    else colorful.push(it.c);
  }
  const dropC = drops.length ? avg(drops) : null;
  let c = avg(colorful.length ? colorful : [base]);
  if (dropC) c = colorful.length ? blend(c, dropC, 0.65) : blend(base, dropC, 0.7);
  if (plain.length && (colorful.length || dropC)) c = blend(c, base, 0.25);
  return c;
}

// ---------- Item makers ----------
let uid = Date.now() % 1e9;
export const raw = (key) => ({ id: uid++, t: 'raw', key, n: ING[key].n, e: ING[key].e, c: ING[key].c });
export const chopped = (it) => ({ id: uid++, t: 'chop', key: it.key, n: 'chopped ' + ING[it.key].n, e: ING[it.key].e, c: ING[it.key].c });
export const dish = (kind, props = {}) => ({ id: uid++, t: 'dish', kind, deco: [], ...props });

const has = (items, key) => items.some((i) => i.key === key);
const ofGroup = (items, g) => items.filter((i) => (i.t === 'raw' || i.t === 'chop') && ING[i.key].g === g);
const parts = (items) => items.filter((i) => i.e).map((i) => i.e);
const isFood = (i) => i.t === 'raw' || i.t === 'chop';

// ---------- What things turn into ----------
// Each rule returns { item, say } or { need: 'hint for the chef' }.

export function mixBowl(items, drops) {
  if (!items.length) return { need: 'Put some food in the bowl first!' };
  const flour = has(items, 'flour');
  const wet = has(items, 'egg') || has(items, 'milk');
  const dry = has(items, 'water') || has(items, 'butter');
  const extras = items.filter((i) => !['flour', 'egg', 'milk', 'water', 'butter', 'sugar'].includes(i.key));
  if (flour && wet) {
    const c = mixColor(items, '#f3d9a6', drops);
    return { item: { id: uid++, t: 'batter', n: colorName(c) + ' batter', c, chips: has(items, 'chocolate'), e: '' }, say: `${colorName(c)} batter!` };
  }
  if (flour && dry) {
    const c = mixColor(items, '#f3dfb8', drops);
    return { item: { id: uid++, t: 'dough', n: 'dough', c, chips: has(items, 'chocolate'), e: '' }, say: drops.length || extras.length ? `${colorName(c)} dough!` : 'Dough! Squishy!' };
  }
  if (flour && items.length === 1) return { need: 'Flour needs a friend! Add eggs, milk, or water.' };
  if (has(items, 'egg') && items.every((i) => ['egg', 'milk', 'cheese', 'butter'].includes(i.key))) {
    return { item: { id: uid++, t: 'beaten', n: 'beaten eggs', c: '#ffd84d', e: '' }, say: 'Beaten eggs! Ready for the pan!' };
  }
  if (has(items, 'milk') && has(items, 'chocolate') && items.every((i) => ['milk', 'chocolate', 'sugar', 'ice'].includes(i.key))) {
    return { item: dish('drink', { n: 'chocolate milk', c: '#a0705a' }), say: 'Chocolate milk!' };
  }
  const fruit = ofGroup(items, 'fruit'), veg = ofGroup(items, 'veg');
  if (fruit.length && fruit.length >= items.filter(isFood).length - (has(items, 'honey') ? 1 : 0) && !veg.length) {
    return { item: dish('bowlfood', { n: 'fruit salad', c: mixColor(fruit), parts: parts(fruit) }), say: 'Fruit salad! So colorful!' };
  }
  if (veg.length && !flour) {
    return { item: dish('bowlfood', { n: 'salad', c: '#7cc242', parts: parts(items.filter(isFood)) }), say: 'A crunchy salad!' };
  }
  const c = mixColor(items, '#f3dfb8', drops);
  return { item: { id: uid++, t: 'batter', n: 'silly batter', c, silly: 1, e: '' }, say: `Silly ${colorName(c)} batter! Let's see what it makes!` };
}

export function cookPan(items) {
  if (!items.length) return { need: 'Put some food in the pan!' };
  const one = items[0];
  if (one.t === 'batter') return { item: dish('pancakes', { n: one.silly ? 'silly pancakes' : 'pancakes', c: one.c, stack: 3 }), say: `${colorName(one.c)} pancakes!` };
  if (one.t === 'dough') return { item: dish('plate', { n: 'flatbread', c: '#e9b872', parts: ['🫓'] }), say: 'Flat bread!' };
  if (has(items, 'egg') && items.every((i) => i.key === 'egg')) return { item: dish('friedegg', { n: 'fried egg', count: items.length }), say: items.length > 1 ? `${items.length} fried eggs!` : 'A fried egg! Sunny side up!' };
  if (one.t === 'beaten' || items.some((i) => i.t === 'beaten')) return { item: dish('scrambled', { n: 'scrambled eggs', parts: parts(items.filter(isFood)) }), say: 'Fluffy scrambled eggs!' };
  if (has(items, 'bread') && has(items, 'cheese')) return { item: dish('toast', { n: 'grilled cheese', cheese: 1 }), say: 'Grilled cheese! Ooey gooey!' };
  if (has(items, 'bread')) return { item: dish('toast', { n: 'toast' }), say: 'Toast! Crunch crunch!' };
  if (has(items, 'potato') && items.every((i) => i.key === 'potato')) return { item: dish('fries', { n: 'french fries' }), say: 'French fries!' };
  if (has(items, 'bacon') && items.length === 1) return { item: dish('plate', { n: 'crispy bacon', parts: ['🥓', '🥓', '🥓'] }), say: 'Crispy bacon! Sizzle!' };
  if (has(items, 'chicken') && items.length === 1) return { item: dish('plate', { n: 'fried chicken', parts: ['🍗', '🍗'] }), say: 'Fried chicken!' };
  const food = items.filter(isFood);
  if (ofGroup(items, 'veg').length) return { item: dish('plate', { n: 'stir fry', c: mixColor(food), parts: parts(food) }), say: 'Sizzly stir fry!' };
  if (ofGroup(items, 'fruit').length) return { item: dish('plate', { n: 'warm fruit', c: mixColor(food), parts: parts(food) }), say: 'Warm and sweet fruit!' };
  return { item: dish('plate', { n: 'pan surprise', c: mixColor(items), parts: parts(items) }), say: 'A pan surprise! Ooh!' };
}

export function cookPot(items) {
  if (!items.length) return { need: 'Put some food in the pot!' };
  const food = items.filter(isFood);
  if (has(items, 'pasta')) {
    const mac = has(items, 'cheese');
    return { item: dish('noodles', { n: mac ? 'mac and cheese' : 'noodles', c: mac ? '#ffc93c' : '#ffe08a', parts: parts(food.filter((i) => !['pasta', 'cheese', 'water', 'milk', 'butter'].includes(i.key))) }), say: mac ? 'Mac and cheese! Yum!' : 'Slurpy noodles!' };
  }
  if (has(items, 'rice')) return { item: dish('noodles', { n: 'rice', c: '#fffaf0', rice: 1, parts: parts(food.filter((i) => i.key !== 'rice')) }), say: 'A bowl of rice!' };
  if (has(items, 'milk') && has(items, 'chocolate')) return { item: dish('drink', { n: 'hot chocolate', c: '#7a4a32', hot: 1 }), say: 'Hot chocolate! Blow on it!' };
  if (items.every((i) => i.key === 'milk')) return { item: dish('drink', { n: 'warm milk', c: '#fffaf3', hot: 1 }), say: 'Warm milk!' };
  if (items.every((i) => i.key === 'egg')) return { item: dish('plate', { n: 'boiled eggs', parts: items.map(() => '🥚') }), say: `${items.length} boiled ${items.length > 1 ? 'eggs' : 'egg'}!` };
  const c = mixColor(food.length ? food : items, '#f5e6c8');
  return { item: dish('soup', { n: `${colorName(c)} soup`, c, parts: parts(food) }), say: `${colorName(c)} soup! Mmm!` };
}

export const TINS = {
  cupcake: { n: 'cupcake tin' },
  cake: { n: 'cake pan' },
  cookie: { n: 'cookie tray' },
  pizza: { n: 'pizza pan' },
  dish: { n: 'baking dish' },
};

export function bakeOven(tin, items, extra = {}) {
  const first = items[0];
  if (!first) return { need: 'Put something in the tin!' };
  const batterish = first.t === 'batter' || first.t === 'dough';
  if (tin === 'cupcake') {
    if (!batterish) return { need: 'Cupcakes need batter! Mix flour and eggs in the bowl.' };
    return { item: dish('cupcakes', { n: 'cupcakes', c: first.c, chips: first.chips }), say: `${colorName(first.c)} cupcakes!` };
  }
  if (tin === 'cake') {
    if (!batterish) return { need: 'A cake needs batter! Mix flour, eggs and milk in the bowl.' };
    return { item: dish('cake', { n: 'cake', c: first.c }), say: `A ${colorName(first.c)} cake!` };
  }
  if (tin === 'cookie') {
    if (!batterish) return { need: 'Cookies need dough! Mix flour and butter in the bowl.' };
    return { item: dish('cookies', { n: 'cookies', c: first.c, shape: extra.shape || 'circle', chips: first.chips }), say: `${colorName(first.c)} cookies!` };
  }
  if (tin === 'pizza') {
    if (first.t !== 'dough' && first.t !== 'batter') return { need: 'Pizza needs dough! Mix flour and water in the bowl.' };
    return { item: dish('pizza', { n: 'pizza', sauce: extra.sauce, cheese: extra.cheese, deco: extra.toppings || [] }), say: 'Hot pizza!' };
  }
  // baking dish: anything goes
  if (items.every((i) => i.key === 'potato')) return { item: dish('plate', { n: 'baked potato', parts: items.map(() => '🥔') }), say: 'Baked potatoes!' };
  if (items.every((i) => i.key === 'chicken')) return { item: dish('plate', { n: 'roast chicken', parts: items.map(() => '🍗') }), say: 'Roast chicken!' };
  if (first.t === 'batter') return { item: dish('cake', { n: 'cake', c: first.c }), say: 'A cake!' };
  if (first.t === 'dough') return { item: dish('plate', { n: 'bread', parts: ['🍞', '🥖'] }), say: 'Fresh bread!' };
  const food = items.filter(isFood);
  if (ofGroup(items, 'veg').length) return { item: dish('plate', { n: 'roasted veggies', c: mixColor(food), parts: parts(food) }), say: 'Roasted veggies!' };
  return { item: dish('plate', { n: 'oven surprise', c: mixColor(items), parts: parts(items) }), say: 'An oven surprise!' };
}

export function blendIt(items) {
  if (!items.length) return { need: 'Put some fruit in the blender!' };
  const c = mixColor(items, '#fff6ee');
  const name = has(items, 'chocolate') && has(items, 'milk') ? 'chocolate shake' : `${colorName(c)} smoothie`;
  return { item: dish('drink', { n: name, c, straw: 1 }), say: `A ${name}!` };
}

// ---------- Picture recipes (gentle guidance) ----------
// steps: which station, and what must exist to count that step done.
export const RECIPES = [
  { k: 'pancakes', n: 'Pancakes', need: ['flour', 'egg', 'milk'], steps: [['bowl', 'batter'], ['stove', 'pancakes', 'pan']], show: { kind: 'pancakes', c: '#f2c27b', stack: 3, frost: '#c8792b' } },
  { k: 'cupcakes', n: 'Cupcakes', need: ['flour', 'egg', 'sugar'], steps: [['bowl', 'batter'], ['oven', 'cupcakes', 'cupcake']], show: { kind: 'cupcakes', c: '#f7d9a0', frost: '#ff9ccf' } },
  { k: 'cake', n: 'Birthday Cake', need: ['flour', 'egg', 'milk', 'sugar'], steps: [['bowl', 'batter'], ['oven', 'cake', 'cake']], show: { kind: 'cake', c: '#f7d9a0', frost: '#c9a0ff' } },
  { k: 'cookies', n: 'Cookies', need: ['flour', 'butter', 'chocolate'], steps: [['bowl', 'dough'], ['oven', 'cookies', 'cookie']], show: { kind: 'cookies', c: '#e2b06a', shape: 'circle', chips: 1 } },
  { k: 'pizza', n: 'Pizza', need: ['flour', 'water', 'cheese', 'tomato'], steps: [['bowl', 'dough'], ['oven', 'pizza', 'pizza']], show: { kind: 'pizza', sauce: '#e8442e', cheese: 1, deco: [{ t: 'e', e: '🍅', x: 80, y: 80, s: 26 }, { t: 'e', e: '🍄', x: 124, y: 96, s: 24 }, { t: 'e', e: '🫑', x: 96, y: 128, s: 24 }] } },
  { k: 'soup', n: 'Veggie Soup', need: ['carrot', 'potato', 'broccoli'], steps: [['board', 'chop'], ['stove', 'soup', 'pot']], show: { kind: 'soup', c: '#f2a65a', parts: ['🥕', '🥔', '🥦'] } },
  { k: 'smoothie', n: 'Smoothie', need: ['strawberry', 'banana', 'milk'], steps: [['blender', 'drink']], show: { kind: 'drink', c: '#ff8fa8', straw: 1 } },
  { k: 'fruitsalad', n: 'Fruit Salad', need: ['apple', 'grapes', 'orange'], steps: [['board', 'chop'], ['bowl', 'bowlfood']], show: { kind: 'bowlfood', c: '#ff9a3c', parts: ['🍎', '🍇', '🍊', '🍓'] } },
  { k: 'eggs', n: 'Scrambled Eggs', need: ['egg', 'milk'], steps: [['bowl', 'beaten'], ['stove', 'scrambled', 'pan']], show: { kind: 'scrambled', parts: [] } },
  { k: 'grilled', n: 'Grilled Cheese', need: ['bread', 'cheese', 'butter'], steps: [['stove', 'toast', 'pan']], show: { kind: 'toast', cheese: 1 } },
  { k: 'sandwich', n: 'Sandwich', need: ['bread', 'cheese', 'lettuce', 'tomato'], steps: [['board', 'chop'], ['table', 'sandwich']], show: { kind: 'sandwich', layers: [{ c: '#7cc242' }, { c: '#e8442e' }, { c: '#ffd76a' }] } },
  { k: 'cocoa', n: 'Hot Chocolate', need: ['milk', 'chocolate'], steps: [['stove', 'drink', 'pot']], show: { kind: 'drink', c: '#7a4a32', hot: 1 } },
  { k: 'fries', n: 'French Fries', need: ['potato'], steps: [['board', 'chop'], ['stove', 'fries', 'pan']], show: { kind: 'fries' } },
  { k: 'mac', n: 'Mac & Cheese', need: ['pasta', 'cheese', 'milk'], steps: [['stove', 'noodles', 'pot']], show: { kind: 'noodles', c: '#ffc93c' } },
];
