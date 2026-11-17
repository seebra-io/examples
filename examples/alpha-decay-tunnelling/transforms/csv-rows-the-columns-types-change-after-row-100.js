// JavaScript, as one small step, because the runtime's CSV reader guesses each column's type from its first 100 rows, and this file's columns turn decimal (decay_1_%) or text (half_life: STABLE) further down. No field is quoted, so a split is exact.
(() => {
  const lines = String(data).trim().split('\n');
  const head = lines[0].split(',');
  const num = ['z', 'n', 'half_life_sec', 'decay_1_%', 'qa', 'binding'], text = ['symbol', 'half_life', 'unit_hl', 'decay_1'];
  const at = k => head.indexOf(k);
  const f = v => (v === undefined || v === '' ? null : (Number.isFinite(+v) ? +v : null));
  return lines.slice(1).map(l => {
    const c = l.split(',');
    const r = {};
    for (const k of num) r[k === 'decay_1_%' ? 'decay_pct' : k] = f(c[at(k)]);
    for (const k of text) r[k] = c[at(k)] === '' ? null : c[at(k)];
    return r;
  });
})()