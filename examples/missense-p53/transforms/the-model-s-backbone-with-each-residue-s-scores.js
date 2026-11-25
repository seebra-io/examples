// The AlphaFold model's backbone: each residue's alpha carbon (x, y, z in Å)
// with its confidence, mean AlphaMissense score and ClinVar counts, and the
// residue chosen on the map ({{residue}}). data[0]: the model (PDB text);
// data[1]: t_variants.
(() => {
  const [pdb, v] = data;
  const res = new Map((v?.residues || []).map((r) => [r.pos, r]));
  const atoms = [];
  for (const line of String(pdb || "").split("\n")) {
    if (!line.startsWith("ATOM") || line.slice(12, 16).trim() !== "CA") continue;
    const pos = +line.slice(22, 26), r = res.get(pos) || {};
    atoms.push({pos, aa: r.aa, x: +line.slice(30, 38), y: +line.slice(38, 46), z: +line.slice(46, 54),
                plddt: r.plddt ?? +line.slice(60, 66), am_mean: r.am_mean ?? null, clinvar_path: r.clinvar_path || 0, gnomad: r.gnomad || 0});
  }
  const top = [...(v?.residues || [])].sort((a, b) => b.clinvar_path - a.clinvar_path).slice(0, 8).filter((r) => r.clinvar_path > 0);
  return {gene: v?.gene, uniprot: v?.uniprot, entry: v?.alphafold?.entry, selected: +"{{residue}}" || null, atoms,
          hotspots: top.map((r) => ({pos: r.pos, aa: r.aa, clinvar_path: r.clinvar_path}))};
})()