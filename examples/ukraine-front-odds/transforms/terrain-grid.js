// GMRT's elevation grid (ESRI ASCII: a header, then rows north to south,
// metres; negative is sea floor) as one JSON object for the map, thinned to
// at most 480 columns. The map shades it (hillshade and height tints).
(() => {
const MAX_COLS = 480;
const text = String(data ?? "");
const head = {}, lines = text.split("\n");
let i = 0;
for (; i < lines.length && /^[a-z_]+\s/i.test(lines[i]); i++) { const [k, v] = lines[i].trim().split(/\s+/); head[k.toLowerCase()] = +v; }
if (!head.ncols) return {error: "No grid in the answer: " + text.slice(0, 120)};
const step = Math.max(1, Math.ceil(head.ncols / MAX_COLS));
const cols = Math.floor(head.ncols / step), z = [];
let rows = 0;
for (let r = 0; i < lines.length && rows < Math.floor(head.nrows / step) * step; i++, rows++) {
  if (rows % step) continue;
  const v = lines[i].trim().split(/\s+/);
  for (let c = 0; c < cols; c++) { const x = +v[c * step]; z.push(x === head.nodata_value || !isFinite(x) ? null : Math.round(x)); }
}
return {cols, rows: z.length / cols, west: head.xllcorner, north: head.yllcorner + head.nrows * head.cellsize,
        cell: head.cellsize * step, units: "m", source: "GMRT (Global Multi-Resolution Topography), CC BY 4.0", z};
})()
