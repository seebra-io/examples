// The chromosome's domains (TADs) and its genes in them.
// inputs: 0 the genes (one chromosome), 1 ENCODE's contact domains for the
// whole genome (Juicer's Arrowhead calls in GM12878, BEDPE: chr1 x1 x2 …).
// Arrowhead finds domains inside domains, so they nest: each domain's parent
// is the smallest one that contains it whole (a domain that only overlaps
// another stays beside it), its depth how many contain it. Each gene sits in
// the smallest domain that holds its middle; one between domains has none.
(() => {
  const [genes = [], calls = []] = data;
  const chromosome = genes[0]?.chromosome ?? "?";
  const chr = "chr" + chromosome;
  const doms = calls
    .filter((r) => String(r.chr1) === chr)
    .map((r) => ({start: Number(r.x1), end: Number(r.x2), score: Number(r.score)}))
    .sort((a, b) => a.start - b.start || b.end - a.end);
  const stack = [];
  doms.forEach((d, i) => {
    d.id = "D" + String(i + 1).padStart(3, "0");
    d.size_kb = Math.round((d.end - d.start) / 1000);
    d.label = `${(d.start / 1e6).toFixed(2)}–${(d.end / 1e6).toFixed(2)} Mb`;
    while (stack.length && stack[stack.length - 1].end <= d.start) stack.pop();
    // the innermost open domain that holds this one whole
    const parent = [...stack].reverse().find((p) => p.start <= d.start && d.end <= p.end);
    d.parent = parent ? parent.id : null;
    d.depth = parent ? parent.depth + 1 : 0;
    stack.push(d);
  });
  const byId = Object.fromEntries(doms.map((d) => [d.id, d]));
  const out = genes.map((g) => {
    const mid = (g.start + g.end) / 2;
    let best = null;
    for (const d of doms) if (d.start <= mid && mid < d.end && (!best || d.end - d.start < best.end - best.start)) best = d;
    // the chain of domains around it, outermost first
    const chain = [];
    for (let d = best; d; d = d.parent ? byId[d.parent] : null) chain.unshift(d.id);
    return {...g, domain: best ? best.id : null, domain_label: best ? best.label : "between domains",
            domain_kb: best ? best.size_kb : null, domain_path: chain.join(" › ")};
  });
  for (const d of doms) {
    const inside = out.filter((g) => g.domain === d.id);
    const counts = {};
    for (const g of inside) if (g.system !== "Not annotated") counts[g.system] = (counts[g.system] || 0) + 1;
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    const annotated = Object.values(counts).reduce((s, n) => s + n, 0);
    d.genes = inside.length;
    d.gene_names = inside.map((g) => g.gene).join(", ");
    d.annotated = annotated;
    d.top_system = top ? top[0] : null;
    d.top_share = top && annotated ? top[1] / annotated : null;
    d.children = doms.filter((c) => c.parent === d.id).length;
  }
  return {chromosome, cell: "GM12878", source: "ENCODE ENCFF203AKP (in situ Hi-C, MboI; Rao et al. 2014), Arrowhead domains, GRCh38",
          genes: out, domains: doms};
})()