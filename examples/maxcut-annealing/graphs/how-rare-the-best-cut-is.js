// How rare the best cut is: every split of the nodes, counted by how many
// links it cuts (log scale: each step down is ten times rarer). A random split
// lands in the middle; the best cut is at the right edge. The orange rings are
// where simulated annealing ended with its longest schedule (500 sweeps):
// the bigger the ring, the more of its runs ended there.
// data: [exact landscape, annealing runs]
const [land, runs] = data;
const longest = d3.max(runs, d => d.sweeps);
const last = runs.filter(d => d.sweeps === longest);
const at = new Map(land.map(d => [d.cut, d.share]));
const sa = d3.rollups(last, v => v.length / last.length, d => d.cut).map(([cut, runs]) => ({cut, runs, share: at.get(cut)}));
const best = land[0].max_cut, top = land.find(d => d.optimal);
const floor = d3.min(land, d => d.share) / 3;
return plot({
  marginLeft: 95, height: 360,
  caption: `The best cut (${best}) is ${top.splits.toLocaleString()} of ${d3.sum(land, d => d.splits).toLocaleString()} splits: 1 in ${Math.round(1 / top.share).toLocaleString()}`,
  x: {label: "Links cut →", tickFormat: "d"},
  y: {type: "log", label: "↑ Share of all splits", domain: [floor, 1],
      ticks: d3.range(-7, 1).map(e => 10 ** e).filter(v => v >= floor),
      tickFormat: v => v >= 0.01 ? `${Math.round(v * 100)}%` : `1 in ${Math.round(1 / v).toLocaleString()}`},
  r: {range: [6, 18]},
  marks: [
    Plot.ruleX(land, {x: "cut", y1: floor, y2: "share", stroke: d => d.optimal ? "#4ade80" : "currentColor", strokeOpacity: 0.6, strokeWidth: 3}),
    Plot.dot(land, {x: "cut", y: "share", r: 4, fill: d => d.optimal ? "#4ade80" : "currentColor", tip: true,
      channels: {"Links cut": "cut", Splits: "splits"}}),
    Plot.dot(sa, {x: "cut", y: "share", r: "runs", fill: "none", stroke: "#f59e0b", strokeWidth: 2.5, tip: true,
      title: d => `Simulated annealing, ${longest} sweeps: ${Math.round(d.runs * 100)}% of its runs ended at ${d.cut}`}),
    Plot.text([top], {x: "cut", y: "share", text: () => "best", dy: -26, fill: "#4ade80"})
  ]
});