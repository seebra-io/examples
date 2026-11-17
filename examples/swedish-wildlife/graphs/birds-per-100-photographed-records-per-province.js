// Raw bird counts mostly follow how many people photograph nature where
// (left). Dividing by all photographed records there, the exposure, gives a
// share that can be compared between provinces (right), with its 95%
// interval (Jeffreys). Notice: the big provinces lead in counts, not in share.
// Caveats: a share is still not abundance (it also falls when people
// photograph more plants or insects there); GBIF's province names mix
// counties and historical provinces (Skåne and Skane, Uppsala and Uppland),
// and provinces with under 1,000 records are left out.
const W = fit?.width ?? 720, H = fit?.height ?? 420;
const national = data[0]?.national_pct ?? 0; // Sweden's share, %
const counts = plot({
  width: W * 0.45, height: H,
  x: {type: "log", label: "All photographed records (log)", grid: true},
  y: {type: "log", label: "Bird records (log)", grid: true},
  marks: [
    // the national share as a line: on it, birds are exactly proportional to effort
    Plot.line(d3.extent(data, d => d.records).map(r => ({r, b: r * national / 100})), {x: "r", y: "b", stroke: "currentColor", strokeOpacity: 0.4, strokeDasharray: "4 3"}),
    Plot.dot(data, {x: "records", y: "birds", fill: "steelblue", r: 4,
      title: d => `${d.province}\n${d3.format(",")(d.birds)} bird records of ${d3.format(",")(d.records)}`, tip: true}),
  ],
});
const shares = plot({
  width: W * 0.55, height: H, marginLeft: 110,
  x: {label: "Bird records per 100 photographed records (%)", grid: true},
  y: {label: null, domain: data.map(d => d.province)},
  marks: [
    Plot.ruleX([national], {stroke: "currentColor", strokeOpacity: 0.4, strokeDasharray: "4 3"}),
    Plot.ruleY(data, {y: "province", x1: "lo_pct", x2: "hi_pct", stroke: "steelblue", strokeWidth: 3}),
    Plot.dot(data, {y: "province", x: "share_pct", fill: "steelblue", r: 3.5,
      title: d => `${d.province}: ${d.share_pct}% birds (95%: ${d.lo_pct}–${d.hi_pct})\n${d3.format(",")(d.birds)} of ${d3.format(",")(d.records)} records · Sweden ${d.national_pct}%`, tip: true}),
  ],
});
const wrap = document.createElement("div");
wrap.style.cssText = "display:flex;gap:8px;align-items:flex-start";
wrap.append(counts, shares);
return wrap;