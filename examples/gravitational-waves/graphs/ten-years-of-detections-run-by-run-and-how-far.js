// Detections over time, run by run: each step is a merger, the grey bands
// the observing runs. Upgrades between runs pushed the detectors' reach
// out, and since the volume grows as the cube of distance, the rate jumped:
// about 0.2 a week in 2015–17, 1.7 in 2019–20, about 4 in 2023–25. Below:
// how far away each was (luminosity distance), coloured by its chirp mass;
// heavier pairs are heard from further away. Hover for details.
const s = data || {};
const ev = (s.events || []).map((e, i) => ({...e, n: i + 1}));
const runs = s.runs || [];
const year = (d) => { const t = new Date(d); return t.getUTCFullYear() + (t - Date.UTC(t.getUTCFullYear(), 0, 1)) / 31557600000; };
const H = Math.max(420, (fit?.height ?? 560) - 30);
const top = plot({
  height: H * 0.5, marginLeft: 56,
  x: {domain: [2015.5, 2026], label: null, tickFormat: String},
  y: {label: "↑ mergers so far", grid: true},
  marks: [
    Plot.rect(runs, {x1: (r) => year(r.from), x2: (r) => year(r.to), y1: 0, y2: () => ev.length, fill: "currentColor", fillOpacity: 0.06}),
    Plot.text(runs, {x: (r) => (year(r.from) + year(r.to)) / 2, y: () => ev.length, text: (r) => r.published ? `${r.run}\n${r.events} · ${r.per_week.toFixed(1)}/wk` : `${r.run}\nnot yet published`, lineAnchor: "top", dy: 4, fontSize: 10}),
    Plot.line(ev, {x: "t", y: "n", curve: "step-after", stroke: "#60a5fa", strokeWidth: 2}),
    Plot.tip(ev, Plot.pointerX({x: "t", y: "n", title: (e) => `${e.name} (${e.date}, ${e.run})\n#${e.n}: ${e.kind}`})),
  ],
});
const bottom = plot({
  height: H * 0.5, marginLeft: 56,
  x: {domain: [2015.5, 2026], label: null, tickFormat: String},
  y: {type: "log", label: "↑ distance (Mpc, log)", grid: true, tickFormat: String},
  color: {type: "log", scheme: "turbo", legend: true, label: "chirp mass (solar masses)"},
  marks: [
    Plot.dot(ev.filter((e) => e.distance_mpc), {x: "t", y: "distance_mpc", fill: "chirp", r: 3, tip: true,
      channels: {event: "name", "light travel": (e) => e.redshift == null ? "?" : `about ${(e.redshift * 13.4 / (1 + e.redshift) ).toFixed(1)} billion years`, kind: "kind"}}),
  ],
  caption: "1 Mpc ≈ 3.26 million light years. Travel times are a rough low-redshift conversion. Events without published parameters have no distance.",
});
const box = document.createElement("div"); box.append(top, bottom); return box;