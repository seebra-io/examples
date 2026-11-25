// The chromosome's genes in protein complexes: every curated human complex
// (Complex Portal, EBI) with at least one subunit encoded on the chromosome.
// data[0]: the genes (t_genes, with their UniProt ids); data[1]: Complex
// Portal's human complexes (one row each; members as UniProt(stoichiometry));
// data[2]: every human gene with its UniProt ids and chromosome (HPA), to
// name the subunits encoded elsewhere.
// - function: the complex's name and GO terms, placed in the same systems as
//   the genes (first rule that matches);
// - family: the name before ", … variant" (69 SCF ubiquitin ligases are one
//   family of variants that differ in one subunit);
// - structure: its first PDB entry, which a click loads (setParameter).
(() => {
  const [genes = [], complexes = [], everyone = []] = data;
  const RULES = [
    ["Immune system", /immun|antigen|MHC|T[- ]cell|B[- ]cell|interleukin|interferon|complement|inflamm/i],
    ["Cell cycle and DNA", /DNA repair|DNA replication|replicat|cell cycle|mitotic|mitosis|kinetochore|cohesin|condensin|chromosome segregation|meio|telomer/i],
    ["Gene expression", /chromatin|histone|nucleosome|transcription|polycomb|SWI\/SNF|mediator|splic|mRNA|RNA polymerase|RNA processing|ribosom|translation|tRNA|rRNA|exosome|exon junction/i],
    ["Protein turnover", /ubiquitin|proteasom|protein catabolic|SCF|cullin|degradation|chaperon|protein folding|sumo/i],
    ["Transport", /transport|\bchannel|nuclear pore|protein import|export|vesicle|endosom|golgi|traffick|clathrin|COPI|COPII|\bion\b/i],
    ["Metabolism", /metabol|biosynth|mitochondrial respiratory|respiratory chain|ATP synthase|oxidoreductase|dehydrogenase|NADH|cytochrome|glyco|lipid/i],
    ["Signalling", /signal|receptor|kinase|phosphatase|G protein|integrin|growth factor|hormone/i],
    ["Cell structure and movement", /actin|myosin|microtubule|cytoskelet|adhesion|junction|cilium|dynein|kinesin|muscle|collagen|extracellular matrix/i],
    ["Cell death", /apopto|necro|inflammasome|caspase/i],
    ["Development", /develop|differentiat|morphogen/i],
  ];
  const OTHER = "Other processes";
  const systemOf = (text) => (RULES.find(([, re]) => re.test(text)) || [OTHER])[0];

  // UniProt -> {gene, chromosome}; the chromosome's own genes first
  const who = new Map();
  for (const g of everyone) for (const u of g.Uniprot || []) if (!who.has(u)) who.set(u, {gene: g.Gene, chromosome: g.Chromosome});
  const ours = new Map();
  for (const g of genes) for (const u of g.uniprot || []) { ours.set(u, g); who.set(u, {gene: g.gene, chromosome: g.chromosome}); }
  const chromosome = genes[0]?.chromosome;

  const col = (r, ...names) => { for (const n of names) if (r[n] != null && r[n] !== "") return String(r[n]); return ""; };
  const out = [];
  for (const r of complexes) {
    const listed = col(r, "Expanded participant list", "Identifiers (and stoichiometry) of molecules in complex");
    const members = [];
    for (const m of listed.split("|")) {
      const x = /^([A-Z0-9]{6,10})(?:-[\w-]+)?\((\d+)\)$/.exec(m.trim());
      if (!x) continue; // small molecules, RNA (CHEBI:, URS…)
      const w = who.get(x[1]) || {};
      if (members.some((y) => y.uniprot === x[1])) continue;
      members.push({uniprot: x[1], stoichiometry: Number(x[2]), gene: w.gene || x[1], chromosome: w.chromosome || "?",
                    here: ours.has(x[1])});
    }
    const here = members.filter((m) => m.here);
    if (!here.length) continue;
    const name = col(r, "Recommended name");
    // GO:0043515(kinetochore binding)|…: names can hold brackets, ESC/E(Z) complex
  const go = col(r, "Go Annotations").split("|").map((t) => t.replace(/^GO:\d+\(/, "").replace(/\)$/, "")).filter(Boolean);
    const pdb = [...col(r, "Cross references").matchAll(/wwpdb:(\w{4})/gi)].map((m) => m[1].toLowerCase());
    out.push({
      id: col(r, "Complex ac", "#Complex ac"),
      name,
      family: name.replace(/,[^,]*variant.*$/i, "").replace(/\s+(variant|complex)\s*\d*$/i, (s) => s).trim(),
      system: systemOf(`${name} ${go.join(" ")}`),
      go: go.slice(0, 12),
      description: col(r, "Description").slice(0, 600),
      subunits: members.length,
      copies: members.reduce((s, m) => s + (m.stoichiometry || 0), 0),
      members,
      here: here.map((m) => m.gene),
      evidence: col(r, "Evidence Code").replace(/^.*\(|\)$/g, ""),
      pdb,
      structure: pdb[0] || null,
      url: `https://www.ebi.ac.uk/complexportal/complex/${col(r, "Complex ac", "#Complex ac")}`,
    });
  }
  const inSome = new Set(out.flatMap((c) => c.here));
  return {
    chromosome,
    genes: genes.length,
    genes_in_complexes: inSome.size,
    complexes: out.sort((a, b) => b.here.length - a.here.length || a.name.localeCompare(b.name)),
  };
})()