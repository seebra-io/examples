// Each container's request (x) against its usage (y), CPU and memory side by side, log-log.
// On the solid line usage equals the request; below the dashed one it asks for 4× what it uses.
const rows = (Array.isArray(data) ? data : []).filter(d => d.used > 0 && d.requested > 0);
const w = fit?.width ?? 800, h = fit?.height ?? 400;
const f = d3.format(".3~s"), pct = d3.format(".0%");
const cls = r => r > 1 ? "above its request" : r < 0.25 ? "under 1/4 of its request" : "within";
const one = (res) => {
  const rs = rows.filter(d => d.resource === res);
  const [lo, hi] = d3.extent(rs.flatMap(d => [d.requested, d.used]));
  const guide = lo ? [{g: "usage = request", k: 1}, {g: "usage = request / 4", k: 0.25}].flatMap(({g, k}) => [{g, x: lo, y: lo * k}, {g, x: hi, y: hi * k}]) : [];
  return plot({
    width: Math.max(280, w / 2 - 8), height: h - 40,
    x: {type: "log", label: `requested ${res} →`, grid: true},
    y: {type: "log", label: `↑ used ${res}`, grid: true},
    color: {domain: ["above its request", "within", "under 1/4 of its request"], range: ["#ef4444", "#22c55e", "#38bdf8"], legend: true},
    marks: [
      Plot.line(guide, {x: "x", y: "y", z: "g", stroke: "currentColor", strokeOpacity: 0.4, strokeDasharray: d => d.g === "usage = request" ? null : "4 3"}),
      Plot.dot(rs, {x: "requested", y: "used", fill: d => cls(d.ratio), r: 3.5, fillOpacity: 0.85, tip: true,
        title: d => `${d.namespace}/${d.pod} · ${d.container} (${d.qos})\nrequests ${f(d.requested)}, uses ${f(d.used)} ${res}: ${pct(d.ratio)} of its request\n` +
          (d.ratio > 1 ? "under-provisioned: throttled (CPU) or at risk of eviction (memory) when the node is busy" : d.ratio < 0.25 ? "over-provisioned: the idle request blocks the node for other pods" : "")}),
    ],
  });
};
const div = document.createElement("div");
div.style.display = "flex"; div.style.flexWrap = "wrap"; div.style.gap = "16px";
if (rows.some(d => d.resource.startsWith("CPU"))) div.append(one("CPU (cores)"));
if (rows.some(d => d.resource.startsWith("memory"))) div.append(one("memory (MiB)"));
return div;