// Methane's short memory: because the air clears a ninth of it every year,
// it answers emissions within a decade, unlike CO2, which lingers for
// centuries. From today's emissions, three futures: held (it levels off
// near the steady state, emissions × lifetime), cut by 30% by 2030 (the
// size of the Global Methane Pledge) and rising 1% a year. The right axis
// is the warming push (radiative forcing) methane exerts. Hover a year.
const s = data || {};
const sc = s.scenarios || [];
const col = {"held at today's": "#a1a1aa", "cut 30% by 2030, then held": "#22c55e", "rising 1% a year": "#ef4444"};
const hist = (s.budget || []).map((r) => ({year: r.year, ppb: r.ppb}));
const end = Object.keys(col).map((k) => sc.filter((r) => r.scenario === k).at(-1)).filter(Boolean);
return plot({
  height: Math.max(360, (fit?.height ?? 520) - 30), marginLeft: 60, marginRight: 200,
  x: {domain: [1984, 2060], label: null, tickFormat: (d) => String(d)},
  y: {label: "↑ CH₄ (ppb)", grid: true, domain: [1300, 2600]},
  color: {domain: Object.keys(col), range: Object.values(col), legend: true, label: "emissions from now on"},
  marks: [
    Plot.line(hist, {x: "year", y: "ppb", stroke: "#fafafa", strokeWidth: 2.2}),
    Plot.line(sc, {x: "year", y: "ppb", stroke: "scenario", strokeWidth: 2, strokeDasharray: "6,3"}),
    Plot.ruleY([s.steady_ppb], {stroke: "#a1a1aa", strokeOpacity: 0.4, strokeDasharray: "2,3"}),
    Plot.text(end, {x: "year", y: "ppb", text: (r) => `${r.ppb.toFixed(0)} ppb in ${r.year}\n${r.forcing.toFixed(2)} W/m² from methane`, dx: 8, textAnchor: "start", fill: (r) => col[r.scenario], fontSize: 11, fontWeight: 600}),
    Plot.tip(sc, Plot.pointer({x: "year", y: "ppb", title: (r) => `${r.scenario}, ${r.year}: ${r.ppb.toFixed(0)} ppb, ${r.forcing.toFixed(3)} W/m²`})),
  ],
  caption: `Same box as the budget, stepped monthly from ${s.budget?.at(-1)?.year}'s inferred emissions, lifetime ${s.tau} years and held fixed. In reality OH falls as methane rises, which lengthens the response (about 12 years) and makes rises steeper; methane also makes ozone and stratospheric water, about half again its direct forcing (not counted).`,
});