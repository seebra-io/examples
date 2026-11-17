// The protein's backbone (Cα trace) as a tube per chain, and its ligands
// (HETATM, e.g. the haem groups) as atoms.
const v = scene3d(fit);
const chains = d3.groups(data.filter(d => d.atom === 'CA' && d.record === 'ATOM'), d => d.chain);
const color = d3.scaleOrdinal(d3.schemeTableau10).domain(chains.map(c => c[0]));
const group = new THREE.Group();
chains.forEach(([chain, cas]) => {
  if (cas.length < 2) return;
  const curve = new THREE.CatmullRomCurve3(cas.map(d => new THREE.Vector3(d.x, d.y, d.z)));
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, cas.length * 4, 0.45, 8, false),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(color(chain)), roughness: 0.5 }));
  group.add(tube);
  v.hover(tube, hit => {
    const i = Math.min(cas.length - 1, Math.round((hit.uv ? hit.uv.x : 0) * (cas.length - 1)));
    const r = cas[i];
    return `<b>Chain ${chain}</b> · ${cas.length} residues<br>residue ${r.resName} ${r.resSeq}`;
  });
});
const het = data.filter(d => d.record === 'HETATM' && d.resName !== 'HOH');
const el = { C: 0x71717a, N: 0x3b82f6, O: 0xef4444, FE: 0xf97316, S: 0xeab308, P: 0xf97316 };
d3.groups(het, d => d.chain + d.resSeq).forEach(([, atoms]) => {
  const lig = new THREE.Group();
  atoms.forEach(a => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(a.element === 'FE' ? 0.9 : 0.45, 12, 12), new THREE.MeshStandardMaterial({ color: el[a.element] || 0xd946ef }));
    m.position.set(a.x, a.y, a.z);
    lig.add(m);
  });
  group.add(lig);
  v.hover(lig, `<b>${atoms[0].resName}</b> ${atoms[0].resSeq} in chain ${atoms[0].chain} · ${atoms.length} atoms`);
});
v.scene.add(group);
v.frame(group);
const note = document.createElement('div');
note.style.cssText = 'position:absolute;left:8px;bottom:6px;font:11px sans-serif;color:#71717a;pointer-events:none';
note.textContent = `${chains.length} chains · ${het.length} ligand atoms (water left out) · coordinates in Å from the PDB entry · drag to orbit`;
v.el.appendChild(note);
return v.el;
