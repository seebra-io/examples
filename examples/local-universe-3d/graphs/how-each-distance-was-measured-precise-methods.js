// How each UNGC galaxy's distance was measured, against the distance: the
// precise methods (TRGB, Cepheids) reach only so far; beyond a few Mpc the
// catalogue leans on Tully–Fisher, group membership and the Hubble flow. Each
// dot is a galaxy (hover: name, distance, method); the bar under each row
// spans the typical error the paper gives for that method at 10 Mpc.
// data: [UNGC rows]
const rows = (Array.isArray(data) ? data : []).filter(d => d.dist_mpc > 0 && d.method);
const order = d3.groupSort(rows, g => -g.length, d => d.method_name);
const ERR = {"tip of the red giant branch": 0.05, "Cepheid variables": 0.075, "supernova": 0.075, "Tully–Fisher (rotation vs luminosity)": 0.225, "fundamental plane": 0.225, "brightest stars": 0.25};
const errRows = order.filter(m => ERR[m]).map(m => ({method_name: m, lo: 10 * (1 - ERR[m]), hi: 10 * (1 + ERR[m]), pct: ERR[m]}));
return plot({
  marginLeft: 250, marginBottom: 40, marginTop: 24, marginRight: 60,
  x: {type: "log", label: "distance (Mpc, log) →", grid: true, domain: [0.005, 30], ticks: [0.01, 0.03, 0.1, 0.3, 1, 3, 10, 30], tickFormat: d => d < 1 ? `${Math.round(d * 1000)} kpc` : `${d} Mpc`},
  y: {domain: order, label: null},
  color: {legend: false},
  marks: [
    Plot.ruleY(order, {stroke: "#27272a"}),
    Plot.link(errRows, {x1: "lo", x2: "hi", y1: "method_name", y2: "method_name", stroke: "#f472b6", strokeWidth: 6, strokeOpacity: 0.35,
      title: d => `typical error ${Math.round(d.pct * 100)}%: at 10 Mpc, ${d.lo.toFixed(1)}–${d.hi.toFixed(1)} Mpc (Karachentsev et al. 2013)`}),
    Plot.dot(rows, {x: "dist_mpc", y: "method_name", r: 2.6, fill: d => d.method === "h" || d.method === "h'" || d.method === "txt" ? "#f87171" : d.method === "mem" ? "#fbbf24" : "#93c5fd", fillOpacity: 0.55,
      channels: {galaxy: "name", type: "type", error: "typical_error"}, tip: {format: {x: d => d.toFixed(2) + " Mpc", y: true, galaxy: true, type: true, error: true, fill: false}}}),
    Plot.text(order, {x: 30, y: d => d, text: d => `${rows.filter(r => r.method_name === d).length} galax${rows.filter(r => r.method_name === d).length === 1 ? "y" : "ies"}`, dx: 6, textAnchor: "start", fill: "#71717a"}),
  ],
  caption: "Blue: a measured distance. Amber: borrowed from the galaxy's group. Red: from its velocity (Hubble flow) or how resolved it looks, not a measurement. Pink bars: the method's typical error at 10 Mpc.",
});