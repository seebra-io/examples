// The selected complex in 3D: each chain's backbone (its alpha carbons) as a
// tube, coloured by the protein it is. The subunits encoded on the chosen
// chromosome are thick and bright; the rest thin and muted. Drag to orbit,
// wheel to zoom; hover a chain for its gene and chromosome. Pick another
// complex on the previous slide (its 3D button).
const s = data || {};
const W = Math.max(480, fit?.width ?? 900), H = Math.max(360, fit?.height ?? 600);
const chains = (s.chains || []).filter((c) => c.ca && c.ca.length >= 12);
const box = document.createElement("div");
box.style.cssText = `position:relative;width:${W}px;height:${H}px;font:12px system-ui,sans-serif;color:#e4e4e7`;
if (!chains.length) {
  box.innerHTML = `<div style="padding:24px;color:#a1a1aa">No structure loaded yet${s.pdb ? ` (${s.pdb}: no protein chains read)` : ""}. On the previous slide, click a complex family, then a complex's 3D button.</div>`;
  return box;
}
const v = scene3d({width: W, height: H});
box.append(v.el);
// one colour per protein; ours bright, the others muted
const proteins = [...new Set(chains.map((c) => c.gene))];
const bright = d3.scaleOrdinal(proteins, d3.schemeTableau10);
const muted = (c) => d3.color(bright(c.gene)).darker(1.4).formatHex();
const group = new THREE.Group();
const centre = new THREE.Vector3();
let n = 0;
for (const c of chains) for (let i = 0; i < c.ca.length; i += 3) { centre.x += c.ca[i]; centre.y += c.ca[i + 1]; centre.z += c.ca[i + 2]; n++; }
centre.divideScalar(n);
for (const c of chains) {
  const pts = [];
  for (let i = 0; i < c.ca.length; i += 3) pts.push(new THREE.Vector3(c.ca[i] - centre.x, c.ca[i + 1] - centre.y, c.ca[i + 2] - centre.z));
  // a gap in the chain (unresolved residues: > 4.5 Å between CAs) splits the tube
  const pieces = [[pts[0]]];
  for (let i = 1; i < pts.length; i++) {
    if (pts[i].distanceTo(pts[i - 1]) > 4.5) pieces.push([]);
    pieces[pieces.length - 1].push(pts[i]);
  }
  const material = new THREE.MeshStandardMaterial({color: c.here ? bright(c.gene) : muted(c), roughness: 0.5,
                                                    emissive: c.here ? bright(c.gene) : "#000000", emissiveIntensity: c.here ? 0.25 : 0});
  const chainGroup = new THREE.Group();
  for (const p of pieces) {
    if (p.length < 4) continue;
    const curve = new THREE.CatmullRomCurve3(p);
    chainGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curve, Math.min(4000, p.length * 3), c.here ? 1.1 : 0.55, 6, false), material));
  }
  group.add(chainGroup);
  v.hover(chainGroup, `<b>${c.gene}</b>${c.protein && c.protein !== c.gene ? ` (${c.protein})` : ""}<br>chain ${c.chain} · ${c.residues} residues resolved<br>` +
    (c.chromosome ? `encoded on chromosome ${c.chromosome}${c.here ? " (this board's)" : ""}` : "not a listed subunit of the complex") +
    (c.uniprot ? `<br><span style="color:#a1a1aa">UniProt ${c.uniprot}</span>` : ""));
}
v.scene.add(group);
v.frame(group);

// what it is, and the legend: one line per protein
const info = document.createElement("div");
info.style.cssText = "position:absolute;left:10px;top:8px;max-width:46%;line-height:1.4;pointer-events:auto";
const per = d3.rollups(chains, (cs) => ({n: cs.length, c: cs[0]}), (c) => c.gene).sort((a, b) => b[1].c.here - a[1].c.here || b[1].n - a[1].n);
info.innerHTML = `<div style="font-size:14px;font-weight:600">${s.complex ? s.complex.name : "PDB " + s.pdb.toUpperCase()}</div>
  <div style="color:#a1a1aa">PDB <a target="_blank" rel="noopener" style="color:#60a5fa" href="https://www.rcsb.org/structure/${s.pdb}">${s.pdb.toUpperCase()}</a>${s.title ? ": " + s.title.slice(0, 140) : ""}
  ${s.complex ? ` · <a target="_blank" rel="noopener" style="color:#60a5fa" href="${s.complex.url}">Complex Portal</a>` : ""}</div>
  <div style="margin-top:6px">${per.map(([g, {n, c}]) => `<div><span style="color:${c.here ? bright(g) : muted(c)}">■</span> ${c.here ? `<b>${g}</b>` : g}${n > 1 ? ` ×${n}` : ""}${c.chromosome ? `<span style="color:#71717a"> chr ${c.chromosome}</span>` : ""}</div>`).join("")}</div>
  <div style="margin-top:6px;color:#71717a">Backbones (alpha carbons) of the first model; thick: encoded on this board's chromosome. Gaps: residues not resolved.</div>`;
box.append(info);
return box;