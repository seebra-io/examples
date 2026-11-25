// Every merger's two masses (in Suns, source frame; lines: 90% intervals),
// heavier against lighter, on log scales. Neutron stars sit bottom left,
// black-hole pairs fill the rest, most near the diagonal (equal masses).
// The shaded bands are the two gaps stellar physics predicts: between the
// heaviest neutron star and the lightest black hole (about 2.5–5), and the
// pair-instability gap (about 60–130), where a massive star's core should
// blow itself apart and leave nothing. Both have tenants. Hover a merger;
// click it to hear its chirp (it sets the event parameter).
const s = data || {};
const ev = (s.events || []).filter((e) => e.m1 != null);
const col = {"two black holes": "#60a5fa", "neutron star + black hole": "#f59e0b", "two neutron stars": "#ef4444"};
const sel = parameters?.event || s.selected;
const el = plot({
  height: Math.max(420, (fit?.height ?? 560) - 30), marginLeft: 60,
  x: {type: "log", domain: [1, 200], label: "heavier mass m₁ (solar masses) →", ticks: [1, 2, 5, 10, 20, 50, 100, 200], tickFormat: String},
  y: {type: "log", domain: [1, 200], label: "↑ lighter mass m₂", ticks: [1, 2, 5, 10, 20, 50, 100, 200], tickFormat: String, grid: true},
  color: {domain: Object.keys(col), range: Object.values(col), legend: true},
  r: {range: [2, 9]},
  marks: [
    Plot.rect([{x1: 2.5, x2: 5}], {x1: "x1", x2: "x2", y1: 1, y2: 200, fill: "#f59e0b", fillOpacity: 0.07}),
    Plot.rect([{y1: 2.5, y2: 5}], {x1: 1, x2: 200, y1: "y1", y2: "y2", fill: "#f59e0b", fillOpacity: 0.07}),
    Plot.rect([{x1: 60, x2: 130}], {x1: "x1", x2: "x2", y1: 1, y2: 200, fill: "#a78bfa", fillOpacity: 0.09}),
    Plot.rect([{y1: 60, y2: 130}], {x1: 1, x2: 200, y1: "y1", y2: "y2", fill: "#a78bfa", fillOpacity: 0.09}),
    Plot.text([{x: 3.5, y: 150, t: "lower\nmass gap"}, {x: 88, y: 1.4, t: "pair-instability\ngap"}], {x: "x", y: "y", text: "t", fill: (d, i) => i ? "#a78bfa" : "#f59e0b", fontSize: 10, fontWeight: 600}),
    Plot.line([[1, 1], [200, 200]], {stroke: "currentColor", strokeOpacity: 0.3, strokeDasharray: "3,3"}),
    Plot.ruleY(ev, {y: "m2", x1: "m1_lo", x2: "m1_hi", stroke: "kind", strokeOpacity: 0.25}),
    Plot.ruleX(ev, {x: "m1", y1: "m2_lo", y2: "m2_hi", stroke: "kind", strokeOpacity: 0.25}),
    Plot.dot(ev, {x: "m1", y: "m2", fill: "kind", r: "snr", stroke: (e) => e.name === sel ? "#fafafa" : "#09090b", strokeWidth: (e) => e.name === sel ? 2.5 : 0.6, fillOpacity: 0.85, tip: true,
      channels: {event: "name", date: "date", run: "run", "final mass": "final", "radiated": (e) => e.radiated_msun == null ? "?" : `${e.radiated_msun} M☉`, distance: (e) => `${e.distance_mpc} Mpc`, SNR: "snr"}}),
    Plot.text(ev.filter((e) => ["GW150914", "GW170817", "GW190521", "GW190814", "GW230529_181500", "GW231123_135430", "GW250114_082203"].includes(e.name)),
      {x: "m1", y: "m2", text: (e) => e.name.replace(/_\d+$/, ""), dx: 8, dy: -8, textAnchor: "start", fontSize: 10, fill: "#fafafa", stroke: "#09090b", strokeWidth: 3}),
  ],
  caption: `${ev.length} mergers with published parameters (of ${s.summary?.events} in GWOSC's catalogue): ${s.summary?.bbh} black-hole pairs, ${s.summary?.nsbh} neutron star + black hole, ${s.summary?.bns} neutron-star pairs. Dot size: signal-to-noise. Masses below 3 counted as neutron stars.`,
});
el.addEventListener("click", (ev2) => { const d = ev2.target?.__data__; const e = typeof d === "number" ? ev[d] : null; if (e) setParameter("event", e.name); });
el.style.cursor = "pointer";
return el;