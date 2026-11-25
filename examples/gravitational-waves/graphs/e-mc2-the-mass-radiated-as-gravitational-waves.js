// E = mc², measured. In each merger the final black hole weighs less than
// the two before it; the difference left as gravitational waves in a
// fraction of a second. GW150914 turned 3 Suns into ripples of spacetime,
// about 5 × 10⁴⁷ J, more power at its peak than all the stars in the
// observable universe shine. Across the catalogue it is about 4–5% of the
// total mass, a little more for equal, spinning pairs. Hover a merger;
// click to hear it.
const s = data || {};
const ev = (s.events || []).filter((e) => e.radiated_msun != null);
const sel = parameters?.event || s.selected;
const el = plot({
  height: Math.max(380, (fit?.height ?? 520) - 30), marginLeft: 60,
  x: {type: "log", label: "total mass before merging (solar masses, log) →", ticks: [3, 5, 10, 20, 50, 100, 200], tickFormat: String},
  y: {type: "log", label: "↑ radiated as gravitational waves (solar masses, log)", grid: true, tickFormat: (v) => String(+v.toPrecision(2))},
  color: {type: "linear", domain: [0.03, 0.07], scheme: "viridis", legend: true, label: "share of the mass radiated"},
  marks: [
    ...[0.03, 0.05, 0.07].map((k) => Plot.line([[2.5, 2.5 * k], [260, 260 * k]], {stroke: "currentColor", strokeOpacity: 0.25, strokeDasharray: "3,3"})),
    Plot.text([0.03, 0.05, 0.07].map((k) => ({x: 250, y: 250 * k, t: `${Math.round(k * 100)}%`})), {x: "x", y: "y", text: "t", dx: -4, dy: -6, fontSize: 10, fillOpacity: 0.6, textAnchor: "end"}),
    Plot.dot(ev, {x: "total", y: "radiated_msun", fill: "radiated_share", r: 4, stroke: (e) => e.name === sel ? "#fafafa" : "none", strokeWidth: 2, tip: true,
      channels: {event: "name", "energy": (e) => `${e.radiated_j.toExponential(1)} J`, "share": (e) => `${(100 * e.radiated_share).toFixed(1)}%`, "final mass": "final"}}),
  ],
  caption: `Radiated = total − final mass (medians; their uncertainties are large for light and quiet events). All ${ev.length} together: ${s.summary?.radiated_total_msun?.toFixed(0)} solar masses. Largest: ${s.summary?.biggest?.name}, ${s.summary?.biggest?.radiated_msun} solar masses.`,
});
el.addEventListener("click", (e2) => { const d = e2.target?.__data__; if (typeof d === "number" && ev[d]) setParameter("event", ev[d].name); });
return el;