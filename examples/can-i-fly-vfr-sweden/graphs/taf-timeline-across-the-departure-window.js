// The TAFs as a timeline across the departure window: per route airport,
// the prevailing forecast hour by hour (base, FM, BECMG) and, under it, the
// worst TEMPO or PROB group, coloured by flight category; a red outline
// marks an hour below the SERA VMC minima (1500 ft, 5 km). Below them,
// SMHI's model at five points along the route. Boxes: each airport's
// window (when it is used, ± 1 h); lines: now (newest METAR), ETD, ETA;
// diamonds: the METAR now. Hover any hour for the group behind it.
// Notice: where a TEMPO/PROB row is outlined red and the prevailing row
// above it is not, the temporary group decides the flight; a diamond in a
// red hour says the METAR already agrees with it.
// Inputs: 0 taf_hours, 1 legs, 2 enroute, 3 metars.
// a step with no rows can arrive as something other than an array (an
// empty answer, a SIGMET feed with nothing in force): treat it as no rows
const asRows = x => Array.isArray(x) ? x : (x && Array.isArray(x.rows) ? x.rows : []);
let [th = [], legs = [], en = [], mets = []] = Array.isArray(data) ? data : [];
[th, legs, en, mets] = [th, legs, en, mets].map(asRows);
const W = fit?.width ?? 900;
const COL = {VFR: "#16a34a", MVFR: "#2563eb", IFR: "#dc2626", LIFR: "#c026d3"};
const D = t => new Date(t * 1000);
const role = new Map(legs.map(l => [l.icao, l]));
const lab = (l, k) => `${l.icao} ${k}`;
const rows = [];
for (const l of legs) rows.push(lab(l, "TAF prevailing"), lab(l, "TAF TEMPO/PROB"));
const pts = [...new Set(en.map(e => e.point))];
for (const p of pts) rows.push(`model ${p}`);
const mine = th.filter(h => role.has(h.icao));
const prev = mine.map(h => ({...h, y: lab(role.get(h.icao), "TAF prevailing"), cat: h.category, below: h.vmc === 0,
  title: `${h.icao} ${h.hour} · prevailing ${h.category}${h.vmc ? " · VMC" : " · below VMC minima"}\n${h.text}${h.in_change ? "\n(BECMG in progress: before it, " + ["", "LIFR", "IFR", "MVFR", "VFR"][h.before_rank] + ")" : ""}`}));
const temp = mine.filter(h => h.temp_rank != null).map(h => ({...h, y: lab(role.get(h.icao), "TAF TEMPO/PROB"), cat: h.temp_cat, below: h.temp_vmc === 0,
  title: `${h.icao} ${h.hour} · worst temporary group ${h.temp_cat}${h.temp_vmc ? " · VMC" : " · below VMC minima"}\n${h.temp_text}\n(elements it leaves out come from the prevailing group)`}));
const model = en.map(e => ({...e, y: `model ${e.point}`, cat: e.category, below: e.vmc === 0,
  title: `SMHI model, ${e.point} (${e.lat}°N ${e.lon}°E) ${e.hour}: ${e.category}\nceiling ${e.ceiling_ft ?? "none"} ft (${e.cover_okta}/8 oktas) · visibility ${e.vis_m != null ? Math.round(e.vis_m) + " m" : "?"}\nwind ${e.wind_kt} kt, gusts ${e.gust_kt} kt · precipitation ${e.precip_mm_h} mm/h (${e.frozen_pct}% frozen) · thunder ${e.thunder_pct}%`}));
const cells = [...prev, ...temp, ...model];
const dep = legs.find(l => l.role === "departure") || {};
const wins = legs.flatMap(l => ["TAF prevailing", "TAF TEMPO/PROB"].map(k => ({y: lab(l, k), x1: D(l.win_from), x2: D(l.win_to), title: `${l.icao} (${l.role}) used ${l.use_z}: its window ± 1 h`})));
const now = mets.filter(m => role.has(m.icao)).map(m => ({...m, y: lab(role.get(m.icao), "TAF prevailing"),
  title: `METAR ${m.icao} ${m.obs_z}: ${m.category}, ${m.minima}\n${m.raw}`}));
const t0 = d3.min(cells, d => d.t), t1 = d3.max(cells, d => d.t);
return plot({
  width: W, height: rows.length * 24 + 70, marginLeft: 150, marginRight: 20,
  x: {type: "utc", label: "time (UTC) →", domain: [D(t0), D(t1 + 3600)], grid: true},
  y: {domain: rows, label: null},
  color: {domain: Object.keys(COL), range: Object.values(COL), legend: true},
  marks: [
    Plot.barX(cells, {x1: d => D(d.t), x2: d => D(d.t + 3600), y: "y", fill: "cat", fillOpacity: d => d.y.startsWith("model") ? 0.55 : 0.9,
      stroke: d => d.below ? "#ef4444" : null, strokeWidth: 1.5, inset: 0.5, title: "title", tip: true}),
    Plot.barX(wins, {x1: "x1", x2: "x2", y: "y", fill: "none", stroke: "currentColor", strokeWidth: 2, title: "title", tip: true}),
    Plot.dot(now, {x: d => D(d.obs), y: "y", fill: d => COL[d.category], stroke: "currentColor", symbol: "diamond", r: 6, title: "title", tip: true, href: "link", target: "_blank"}),
    Plot.ruleX([{t: dep.now, k: "now (newest METAR)"}, {t: dep.etd, k: `ETD ${dep.etd_z}`}, {t: dep.eta, k: `ETA ${dep.eta_z}`}].filter(d => d.t != null),
      {x: d => D(d.t), stroke: "currentColor", strokeDasharray: d => d.k.startsWith("now") ? "2 3" : null, title: "k", tip: true}),
    Plot.text([{t: dep.etd, k: "ETD"}, {t: dep.eta, k: "ETA"}].filter(d => d.t != null), {x: d => D(d.t), text: "k", frameAnchor: "top", dy: -6, fill: "currentColor"}),
  ],
  caption: "Red outline: below the SERA VMC minima (ceiling 1500 ft, visibility 5 km). A TEMPO is expected for less than half of its period at a time, a PROB30/40 has that chance: for a VFR plan, both count. TAFs of small airports end after 9 h; the model rows run on.",
});
