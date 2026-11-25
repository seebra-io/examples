// The selected complex's structure, as one backbone per chain: the alpha
// carbons (CA) of the first model in the PDB entry {{pdb}} (RCSB), and for
// each chain the protein it is (PDBe's chain-to-UniProt mapping), its gene
// and the chromosome that encodes it. data[0]: the PDB file as text;
// data[1]: the mapping; data[2]: the complexes (t_complexes).
(() => {
  const [pdbText, mapping, cx] = data;
  const pdb = "{{pdb}}".toLowerCase(), wanted = "{{complex}}";
  const complex = (cx?.complexes || []).find((c) => c.id === wanted)
    || (cx?.complexes || []).find((c) => c.pdb.includes(pdb)) || null;
  const byUniprot = new Map((complex?.members || []).map((m) => [m.uniprot, m]));
  // chain -> {uniprot, name}
  const chainOf = new Map();
  const entry = mapping && (mapping[pdb] || mapping[pdb.toUpperCase()] || Object.values(mapping)[0]);
  for (const [uniprot, u] of Object.entries(entry?.UniProt || {}))
    for (const m of u.mappings || []) chainOf.set(m.chain_id, {uniprot, name: u.name});
  const chains = new Map();
  const text = typeof pdbText === "string" ? pdbText : "";
  for (const line of text.split("\n")) {
    if (line.startsWith("ENDMDL")) break; // the first model only
    if (!line.startsWith("ATOM") || line.slice(12, 16).trim() !== "CA") continue;
    const id = line[21];
    if (!chains.has(id)) chains.set(id, []);
    chains.get(id).push(+line.slice(30, 38), +line.slice(38, 46), +line.slice(46, 54));
  }
  const title = (text.match(/^TITLE {5}.*$/gm) || []).map((l) => l.slice(10).trim()).join(" ");
  return {
    pdb, title, complex: complex && {id: complex.id, name: complex.name, system: complex.system, url: complex.url},
    chains: [...chains].map(([chain, ca]) => {
      const c = chainOf.get(chain) || {};
      const m = byUniprot.get(c.uniprot) || {};
      return {chain, uniprot: c.uniprot || null, protein: c.name || null, gene: m.gene || c.name || `chain ${chain}`,
              chromosome: m.chromosome || null, here: !!m.here, residues: ca.length / 3, ca};
    }),
  };
})()