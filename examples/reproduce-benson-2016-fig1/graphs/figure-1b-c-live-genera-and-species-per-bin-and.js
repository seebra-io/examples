// Benson et al. 2016, Fig 1B–C rebuilt from today's PBDB, with the sampling
// correction of their Fig 5 underneath. data[0] bins, data[1] the GLM fits,
// data[2] the subsampled (SQS) bins. Time runs left to right, oldest first.
// Hover a bin for its numbers; click it for the records behind the point.
const [bins, fits, sqs] = data;
const ORIGINAL = "https://journals.plos.org/plosbiology/article/figure?id=10.1371/journal.pbio.1002359.g001";
const PERIODS = [{ name: "Triassic", from: 251.9, to: 201.4 }, { name: "Jurassic", from: 201.4, to: 145 },
                 { name: "Cretaceous", from: 145, to: 66 }, { name: "Paleocene", from: 66, to: 56 }];
const X = { domain: [252, 56], label: "Million years ago (Ma)", grid: true };
const W = fit.width;
const HEAD = 46, FOOT = 92;
const H = Math.max(110, Math.floor((fit.height - HEAD - FOOT) / 3));
const fmt = (v) => v == null ? "–" : Number(v).toLocaleString("en");
const sqsOf = new Map(sqs.map((d) => [d.bin, d]));
const tipTitle = (d) => {
  const s = sqsOf.get(d.bin) || {};
  return `${d.bin} · ${d.interval} · ${d.max_ma}–${d.min_ma} Ma\n${fmt(d.genera)} genera, ${fmt(d.species)} species found\n` +
         `${fmt(d.occurrences)} occurrences · ${fmt(s.collections)} collections\n` +
         `SQS (q = 0.4): ${s.sqs_genera == null ? "quorum not reached" : `${s.sqs_genera} genera (${s.sqs_lo}–${s.sqs_hi})${s.reliable ? "" : ", unreliable"}`}\nClick for the records behind it`;
};
const bands = () => [
  Plot.rectX(PERIODS, { x1: "from", x2: "to", fill: "currentColor", fillOpacity: (d, i) => i % 2 ? 0.03 : 0.07 }),
  Plot.ruleX([201.4, 145, 66], { strokeOpacity: 0.25 })
];
let picked = null;
const detail = document.createElement("div");

function panel(measure, label, figure) {
  const rows = bins.filter((d) => d[measure] != null);
  const lines = fits.filter((f) => f.measure === measure)
    .flatMap((f) => f.line.map((p) => ({ ...p, fit: `GLM, ${f.fit} (p ${f.p < 0.001 ? "< 0.001" : f.p.toFixed(3)})` })));
  const p = plot({
    width: W, height: H, x: X, y: { label, grid: true, zero: true },
    color: { legend: true, domain: [...new Set(lines.map((l) => l.fit))], range: ["#e15759", "#4e79a7"] },
    marks: [
      ...bands(),
      Plot.text(PERIODS, { x: (d) => (d.from + d.to) / 2, frameAnchor: "top", text: "name", dy: 4, fillOpacity: 0.6 }),
      Plot.line(lines, { x: "mid_ma", y: "value", z: "fit", stroke: "fit", strokeDasharray: "5,4", strokeWidth: 1.5 }),
      Plot.lineY(rows, { x: "mid_ma", y: measure, strokeWidth: 1.5 }),
      Plot.dot(rows, { x: "mid_ma", y: measure, r: 3, fill: "currentColor" }),
      Plot.text(rows, { x: "mid_ma", y: measure, text: "bin", dy: -9, fontSize: 9, fillOpacity: 0.7 }),
      Plot.text([figure], { frameAnchor: "top-left", text: (d) => d, dx: 4, dy: 4, fontWeight: 600 }),
      Plot.tip(rows, Plot.pointerX({ x: "mid_ma", y: measure, title: tipTitle }))
    ]
  });
  p.addEventListener("input", () => { if (p.value) picked = p.value; });
  p.addEventListener("click", () => picked && show(picked.bin));
  p.style.cursor = "pointer";
  return p;
}

function sqsPanel() {
  const rows = sqs.filter((d) => d.sqs_genera != null);
  const p = plot({
    width: W, height: H, x: X, y: { label: "Genera, subsampled (SQS, q = 0.4)", grid: true, zero: true },
    color: { legend: true, domain: ["reliable", "unreliable (coverage < 0.6)"], range: ["currentColor", "#e15759"] },
    marks: [
      ...bands(),
      Plot.ruleX(rows, { x: "mid_ma", y1: "sqs_lo", y2: "sqs_hi", strokeOpacity: 0.5 }),
      Plot.lineY(rows.filter((d) => d.reliable), { x: "mid_ma", y: "sqs_genera", strokeWidth: 1.5 }),
      Plot.dot(rows, { x: "mid_ma", y: "sqs_genera", r: 3.5, fill: (d) => d.reliable ? "reliable" : "unreliable (coverage < 0.6)" }),
      Plot.text(["Sampling-corrected (as Fig 5, simplified)"], { frameAnchor: "top-left", text: (d) => d, dx: 4, dy: 4, fontWeight: 600 }),
      Plot.tip(rows, Plot.pointerX({ x: "mid_ma", y: "sqs_genera", title: (d) => tipTitle(bins.find((b) => b.bin === d.bin) || d) }))
    ]
  });
  p.addEventListener("input", () => { if (p.value) picked = p.value; });
  p.addEventListener("click", () => picked && show(picked.bin));
  p.style.cursor = "pointer";
  return p;
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const link = (href, text) => `<a href="${esc(href)}" style="color:#4e9bd6">${esc(text)}</a>`;
function show(bin) {
  const b = bins.find((d) => d.bin === bin), s = sqsOf.get(bin) || {};
  if (!b) return;
  const genera = String(s.top_genera || "").split(", ").filter(Boolean).map((g) => {
    const name = g.replace(/\s*\(\d+\)$/, "");
    return link(`https://paleobiodb.org/classic/checkTaxonInfo?taxon_name=${encodeURIComponent(name)}`, g);
  }).join(", ");
  detail.innerHTML =
    `<b>${esc(b.bin)} · ${esc(b.interval)} · ${b.max_ma}–${b.min_ma} Ma</b>: ${fmt(b.genera)} genera and ${fmt(b.species)} species found in ` +
    `${fmt(b.occurrences)} occurrences (${fmt(s.collections)} collections); coverage u = ${s.coverage_u ?? "–"}. ` +
    `Drill down: ${link(b.records_url, "the records behind this point (PBDB, CSV)")} · ` +
    `${link(b.records_url.replace("/occs/list.csv", "/occs/list.json"), "as JSON")}` +
    (genera ? `<br>Most often found: ${genera}` : "");
}

const box = document.createElement("div");
box.style.cssText = "font:12px sans-serif;display:flex;flex-direction:column;gap:2px";
const head = document.createElement("div");
head.style.cssText = `height:${HEAD}px;line-height:1.35`;
head.innerHTML = `<b>Global counts of non-marine tetrapods through time</b>, live from the Paleobiology Database ` +
  `(${new Date().toISOString().slice(0, 10)}), rebuilt after Benson et al. 2016, ${link(ORIGINAL, "Figure 1 (the original, at PLOS Biology)")}.<br>` +
  `<span style="opacity:.7">PBDB's 10-Myr bins, not the paper's exact ones; dashed: Poisson GLMs of count on age for the Mesozoic, as in the paper. Hover a bin; click it for its records.</span>`;
detail.style.cssText = `min-height:${FOOT - 10}px;padding:6px 8px;border:1px solid rgba(127,127,127,.35);border-radius:4px;line-height:1.4`;
detail.innerHTML = "<span style=\"opacity:.7\">Click a bin in any panel: its numbers, the PBDB records behind the point, and the genera found most often.</span>";
box.append(head, panel("genera", "Genera found per bin", "B  Genera (as Fig 1B)"), panel("species", "Species found per bin", "C  Species (as Fig 1C)"), sqsPanel(), detail);
return box;