// Gene density (protein-coding genes per Mb) against genome size. In
// prokaryotes it is nearly constant (about 900 per Mb: genes packed end to
// end); in eukaryotes it falls as the genome grows, to a few genes per Mb
// in the largest plant and animal genomes, where repeats, transposable
// elements and introns fill the space. Hover a genome for its numbers.
const g = Array.isArray(data) ? data : [];
const groups = ["Bacteria", "Archaea", "Fungi", "Plants (Viridiplantae)", "Animals (Metazoa)"];
return plot({
  height: Math.max(380, (fit?.height ?? 440) - 20),
  x: {type: "log", label: "genome size (Mb, log) →", grid: true, tickFormat: "~s"},
  y: {type: "log", label: "↑ protein-coding genes per Mb (log)", grid: true, tickFormat: "~s"},
  color: {domain: groups, range: ["#0ea5e9", "#a855f7", "#f59e0b", "#22c55e", "#ef4444"], legend: true},
  marks: [
    Plot.dot(g, {x: "genome_mb", y: "genes_per_mb", fill: "grp", r: 2.5, fillOpacity: 0.6, href: "link", target: "_blank", tip: true,
      channels: {organism: "organism", "protein-coding genes": "protein_coding", "GC %": "gc_percent"}}),
    Plot.text(g.filter(d => d.genome_mb > 8000 || d.genes_per_mb > 1300 || (d.domain === "eukaryote" && d.genome_mb < 3)), {x: "genome_mb", y: "genes_per_mb", text: "organism", dy: -8, fontSize: 9, fillOpacity: 0.8}),
  ],
});