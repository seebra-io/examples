// Methane's budget in one box: every year about 600 million tonnes are
// emitted (wetlands, livestock, rice, landfills, fossil fuel leaks, fires)
// and almost as much destroyed, mostly by the hydroxyl radical OH, which
// gives methane a lifetime of about 9 years. The sink is the stock divided
// by the lifetime; the emissions are the sink plus the growth. The growth
// everyone tracks is the thin gap between two big flows: the record 2021
// was an imbalance of 8%. A 7% drop in OH alone (as models give for 2020's
// cleaner air) would do the same. Hover a year.
const s = data || {};
const b = s.budget || [];
return plot({
  height: Math.max(360, (fit?.height ?? 520) - 30), marginLeft: 60, marginRight: 60,
  x: {label: null, tickFormat: (d) => String(d)},
  y: {label: "↑ million tonnes CH₄ per year (Tg/yr)", grid: true, domain: [480, 640]},
  marks: [
    Plot.areaY(b, {x: "year", y1: "sink", y2: "emissions", fill: "#ef4444", fillOpacity: 0.3, curve: "step"}),
    Plot.line(b, {x: "year", y: "emissions", stroke: "#ef4444", strokeWidth: 2, curve: "step"}),
    Plot.line(b, {x: "year", y: "sink", stroke: "#60a5fa", strokeWidth: 2, curve: "step"}),
    Plot.text(b.slice(-1), {x: "year", y: "emissions", text: () => "emitted", dx: 8, dy: -8, textAnchor: "start", fill: "#ef4444", fontWeight: 600}),
    Plot.text(b.slice(-1), {x: "year", y: "sink", text: () => "destroyed", dx: 8, dy: 10, textAnchor: "start", fill: "#60a5fa", fontWeight: 600}),
    Plot.tip(b, Plot.pointerX({x: "year", y: "emissions", title: (r) => `${r.year}: emitted ≈ ${r.emissions.toFixed(0)} Tg, destroyed ≈ ${r.sink.toFixed(0)} Tg\ngrowth ${r.growth} ppb = ${(r.growth * 2.75).toFixed(0)} Tg, an imbalance of ${(100 * r.imbalance).toFixed(1)}%`})),
  ],
  caption: `One box: emissions = 2.75 Tg/ppb × (growth + stock / ${s.tau} years). The lifetime is uncertain (about 8.5–9.5 years), which shifts both lines together; the gap is measured. The Global Carbon Project's bottom-up and top-down budgets give 575–610 Tg/yr for 2010–2020.`,
});