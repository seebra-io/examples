// One row per protein-coding gene on the chromosome, from the Human Protein
// Atlas: where it is (GRCh38), what it does and where its RNA is.
// - function: UniProt's biological-process keywords, each placed in one of
//   a dozen systems below; a gene's system is the one most of its keywords
//   fall in, its process the most specific of those keywords. Molecular
//   function keywords come along for the hover.
// - organs: HPA's tissue specificity (enriched, group enriched, enhanced,
//   low specificity, not detected), the tissues it is specific to with
//   their nTPM, and the nTPM in 19 tissues.
// About 4 in 10 genes have no process keyword: they are "Not annotated"
// (grouped by HPA's protein class), not left out.
(() => {
  // system -> the keywords it holds (UniProt KW-9999 biological process)
  const SYSTEMS = {
    "Gene expression": ["Transcription", "Transcription regulation", "mRNA processing", "mRNA splicing", "mRNA transport",
      "Translation regulation", "rRNA processing", "tRNA processing", "Ribosome biogenesis", "Nonsense-mediated mRNA decay", "RNA-mediated gene silencing"],
    "Immune system": ["Immunity", "Adaptive immunity", "Innate immunity", "Inflammatory response", "Antiviral defense", "Host-virus interaction",
      "Chemotaxis", "Complement pathway", "Antimicrobial"],
    "Transport": ["Transport", "Ion transport", "Protein transport", "Potassium transport", "Sodium transport", "Calcium transport",
      "Chloride transport", "Lipid transport", "Sugar transport", "Amino-acid transport", "Electron transport", "Exocytosis", "Endocytosis",
      "ER-Golgi transport", "Neurotransmitter transport", "Translocation", "Zinc transport", "Iron transport", "Copper transport", "Phosphate transport"],
    "Metabolism": ["Lipid metabolism", "Carbohydrate metabolism", "Fatty acid metabolism", "Steroid metabolism", "Cholesterol metabolism",
      "Glycolysis", "Gluconeogenesis", "Lipid biosynthesis", "Fatty acid biosynthesis", "Steroid biosynthesis", "Amino-acid biosynthesis",
      "Lipid degradation", "Fatty acid degradation", "Glycogen metabolism", "Purine biosynthesis", "Nucleotide metabolism", "One-carbon metabolism",
      "Tricarboxylic acid cycle", "Heme biosynthesis", "Sphingolipid metabolism", "Phospholipid metabolism", "Phospholipid biosynthesis",
      "Glutathione biosynthesis", "Xenobiotic metabolism", "Prostaglandin metabolism", "Leukotriene biosynthesis", "Detoxification"],
    "Cell cycle and DNA": ["Cell cycle", "Cell division", "Mitosis", "Meiosis", "DNA damage", "DNA repair", "DNA replication",
      "Chromosome partition", "DNA recombination", "Growth arrest"],
    "Development": ["Differentiation", "Neurogenesis", "Spermatogenesis", "Angiogenesis", "Osteogenesis", "Chondrogenesis",
      "Myogenesis", "Oogenesis", "Keratinization", "Developmental protein", "Ossification", "Hematopoiesis", "Adipogenesis"],
    "Signalling": ["Wnt signaling pathway", "Notch signaling pathway", "Hedgehog signaling pathway", "Stress response",
      "Unfolded protein response", "Insulin signaling pathway"],
    "Senses": ["Sensory transduction", "Olfaction", "Taste", "Vision", "Hearing"],
    "Protein turnover": ["Ubl conjugation pathway", "Protein biosynthesis", "Proteolysis"],
    "Cell death": ["Apoptosis", "Necrosis", "Autophagy", "Pyroptosis"],
    "Cell structure and movement": ["Cell adhesion", "Cilium biogenesis/degradation", "Cell shape", "Muscle contraction",
      "Biomineralization", "Blood coagulation", "Hemostasis", "Cell motility", "Fertilization"],
  };
  const OTHER = "Other processes", NONE = "Not annotated";
  const systemOf = {};
  for (const [s, kws] of Object.entries(SYSTEMS)) for (const k of kws) systemOf[k] = s;
  // broad keywords: a gene's process is a more specific one when it has it
  const BROAD = new Set(["Transcription", "Transport", "Immunity", "Differentiation", "Cell cycle"]);
  // HPA classes that say little; the first other one names a gene without keywords
  const VAGUE = new Set(["Predicted intracellular proteins", "Predicted membrane proteins", "Predicted secreted proteins",
    "Human disease related genes", "Disease related genes", "Cancer-related genes", "Housekeeping proteins", "Plasma proteins"]);
  const TISSUE = /^Tissue RNA - (.+) \[nTPM\]$/;
  const num = (v) => (v == null || v === "" ? null : Number(v));

  return data.map((g) => {
    const kws = g["Biological process"] || [];
    const count = {};
    for (const k of kws) { const s = systemOf[k] || OTHER; count[s] = (count[s] || 0) + 1; }
    const order = [...Object.keys(SYSTEMS), OTHER];
    const system = kws.length
      ? order.reduce((best, s) => ((count[s] || 0) > (count[best] || 0) ? s : best), order[0])
      : NONE;
    const own = kws.filter((k) => (systemOf[k] || OTHER) === system);
    const process = kws.length
      ? (own.find((k) => !BROAD.has(k)) || own[0])
      : ((g["Protein class"] || []).find((c) => !VAGUE.has(c)) || "No protein class");
    const [start, end] = String(g.Position || "").split("-").map(Number);
    const tissues = {};
    for (const [k, v] of Object.entries(g)) { const m = TISSUE.exec(k); if (m) tissues[m[1]] = num(v); }
    const top = Object.entries(tissues).filter(([, v]) => v != null).sort((a, b) => b[1] - a[1])[0];
    // a map of the tissues it is specific to; read as a table, the map can
    // come with every tissue's key and null for the others: those are left out
    const enriched = Object.entries(g["RNA tissue specific nTPM"] || {}).filter(([, v]) => v != null && v !== "")
      .map(([t, v]) => ({tissue: t, ntpm: num(v)})).sort((a, b) => b.ntpm - a.ntpm);
    return {
      gene: g.Gene,
      ensembl: g.Ensembl,
      uniprot: g.Uniprot || [],
      description: g["Gene description"],
      chromosome: g.Chromosome,
      start, end,
      length_kb: Math.round((end - start) / 100) / 10,
      system,
      process,
      processes: kws,
      functions: g["Molecular function"] || [],
      protein_class: g["Protein class"] || [],
      specificity: g["RNA tissue specificity"],
      distribution: g["RNA tissue distribution"],
      enriched_in: enriched.map((e) => e.tissue).join(", "),
      enriched,
      top_tissue: top ? top[0] : null,
      top_ntpm: top ? top[1] : null,
      tissues,
    };
  }).filter((g) => Number.isFinite(g.start)).sort((a, b) => a.start - b.start);
})()