// Genes against genome size, log–log, for 1,000 reference genomes. Each
// group's least-squares line is drawn over its own range, with its
// exponent b (genes ∝ size^b). Notice the break: bacteria and archaea lie
// on a line of slope about 1 (about one gene per kilobase, whatever the
// size), while in eukaryotes the genome grows a thousandfold and the
// genes barely double: most of a large genome is not genes. That is the
// C-value paradox. Hover a genome; click it for the assembly at NCBI.
const [g, f] = [data[0] || [], data[1] || []];
const groups = ["Bacteria", "Archaea", "Fungi", "Plants (Viridiplantae)", "Animals (Metazoa)"];
const lines = f.flatMap(d => [d.min_mb, d.max_mb].map(x => ({group: d.group, x, y: Math.pow(10, d.log_a + d.b * Math.log10(x))})));
const labels = f.map(d => ({group: d.group, x: d.max_mb, y: Math.pow(10, d.log_a + d.b * Math.log10(d.max_mb)), text: `b = ${d.b}`}));
return plot({
  height: Math.max(440, (fit?.height ?? 520) - 20), marginRight: 70,
  x: {type: "log", label: "genome size (Mb, log) →", grid: true, tickFormat: "~s"},
  y: {type: "log", label: "↑ protein-coding genes (log)", grid: true, tickFormat: "~s"},
  color: {domain: groups, range: ["#0ea5e9", "#a855f7", "#f59e0b", "#22c55e", "#ef4444"], legend: true},
  marks: [
    Plot.dot(g, {x: "genome_mb", y: "protein_coding", fill: "grp", r: 2.5, fillOpacity: 0.6, href: "link", target: "_blank", tip: true,
      channels: {organism: "organism", assembly: "accession", level: "level", "genes per Mb": "genes_per_mb", "GC %": "gc_percent", annotation: "annotation"}}),
    Plot.line(lines, {x: "x", y: "y", z: "group", stroke: "group", strokeWidth: 2.5}),
    Plot.text(labels, {x: "x", y: "y", text: "text", fill: "group", dx: 6, textAnchor: "start", fontWeight: "bold"}),
  ],
  caption: "Lines: genes = a · size^b fitted per group (least squares on logs). Sample: NCBI's first 200 annotated reference genomes per group.",
});