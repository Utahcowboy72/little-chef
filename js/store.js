// Saved settings and the bakery gallery. Storage can fail (private mode), so everything is guarded.
const KEY = 'little-chef-settings', BAKERY = 'little-chef-bakery';

function read(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch (e) { return fallback; }
}
function write(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ } }

export const settings = Object.assign(
  { level: 'little', speech: true, sound: true, pitch: 1.6, voice: '' },
  read(KEY, {})
);
export function saveSettings() { write(KEY, settings); }

export function bakery() { return read(BAKERY, []); }
export function addToBakery(treat) {
  const list = bakery();
  list.unshift({ ...treat, when: Date.now() });
  write(BAKERY, list.slice(0, 40));
}
export function clearBakery() { write(BAKERY, []); }
