// The AlphaFold model in 3D: one bead per residue on the backbone, coloured
// by how damaging AlphaMissense predicts its changes to be (or, with the
// button, by AlphaFold's confidence). The red beads pack into the folded
// core; the low-confidence ends float as loose strings, which is what
// "disordered" looks like in a prediction: don't read their shape as real.
// The residue chosen on the map is the white one; rings mark the residues
// with the most ClinVar pathogenic changes. Drag to orbit, wheel to zoom,
// hover a bead.
const s = data || {};
const atoms = s.atoms || [];
const W = Math.max(480, fit?.width ?? 900), H = Math.max(360, fit?.height ?? 600);
const box = document.createElement("div");
box.style.cssText = `position:relative;width:${W}px;height:${H}px;font:12px system-ui,sans-serif;color:#e4e4e7`;
if (!atoms.length) { box.innerHTML = `<div style="padding:24px;color:#a1a1aa">No AlphaFold model read for ${s.uniprot || "this protein"}.</div>`; return box; }
const v = scene3d({width: W, height: H});
box.append(v.el);
const am = d3.scaleSequential([0, 1], (t) => d3.interpolateRdYlBu(1 - t));
const conf = (p) => p >= 90 ? "#0053d6" : p >= 70 ? "#65cbf3" : p >= 50 ? "#ffdb13" : "#ff7d45";
const c = new THREE.Vector3();
atoms.forEach((a) => c.add(new THREE.Vector3(a.x, a.y, a.z))); c.divideScalar(atoms.length);
const pts = atoms.map((a) => new THREE.Vector3(a.x - c.x, a.y - c.y, a.z - c.z));
const group = new THREE.Group();
group.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), pts.length * 4, 0.35, 5, false),
  new THREE.MeshStandardMaterial({color: "#52525b", roughness: 0.8})));
const bead = new THREE.SphereGeometry(1, 12, 10);
const hot = new Set((s.hotspots || []).map((h) => h.pos));
const meshes = atoms.map((a, i) => {
  const mat = new THREE.MeshStandardMaterial({roughness: 0.45});
  const m = new THREE.Mesh(bead, mat);
  const big = a.pos === s.selected;
  m.position.copy(pts[i]); m.scale.setScalar(big ? 2.2 : 0.9 + (a.am_mean ?? 0) * 0.6);
  group.add(m);
  v.hover(m, `<b>${a.aa || ""}${a.pos}</b><br>mean AlphaMissense ${a.am_mean?.toFixed(2) ?? "?"} · pLDDT ${a.plddt?.toFixed(0)}<br>` +
    `${a.clinvar_path} ClinVar pathogenic · ${a.gnomad} carried in gnomAD`);
  if (hot.has(a.pos) || big) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(big ? 3.2 : 2.2, 0.18, 6, 24), new THREE.MeshBasicMaterial({color: big ? "#fafafa" : "#ef4444"}));
    ring.position.copy(pts[i]); group.add(ring);
    ring.onBeforeRender = (r, sc, cam) => ring.quaternion.copy(cam.quaternion);
  }
  return {m, a, big};
});
let mode = "am";
const paint = () => meshes.forEach(({m, a, big}) => {
  const col = big ? "#ffffff" : mode === "am" ? (a.am_mean == null ? "#71717a" : am(a.am_mean)) : conf(a.plddt);
  m.material.color.set(col); m.material.emissive.set(big ? "#ffffff" : "#000000"); m.material.emissiveIntensity = big ? 0.4 : 0;
});
paint();
v.scene.add(group);
v.frame(group);

const info = document.createElement("div");
info.style.cssText = "position:absolute;left:10px;top:8px;max-width:44%;line-height:1.45";
const sel = atoms.find((a) => a.pos === s.selected);
info.innerHTML = `<div style="font-size:14px;font-weight:600">${s.gene || ""} · AlphaFold ${s.entry || ""}</div>
  <div style="color:#a1a1aa"><a target="_blank" rel="noopener" style="color:#60a5fa" href="https://alphafold.ebi.ac.uk/entry/${s.uniprot}">AlphaFold DB</a> · a prediction, one chain alone (no DNA, no partner, no zinc)</div>
  ${sel ? `<div style="margin-top:6px">Chosen: <b>${sel.aa}${sel.pos}</b>, mean AlphaMissense ${sel.am_mean?.toFixed(2) ?? "?"}, pLDDT ${sel.plddt?.toFixed(0)}, ${sel.clinvar_path} ClinVar pathogenic</div>` : `<div style="margin-top:6px;color:#a1a1aa">Click a residue on the map to mark it here.</div>`}
  <div style="margin-top:6px;color:#a1a1aa">Red rings, most ClinVar pathogenic changes: ${(s.hotspots || []).map((h) => `${h.aa}${h.pos} (${h.clinvar_path})`).join(", ")}</div>`;
const btn = document.createElement("button");
btn.textContent = "Colour by AlphaFold confidence";
btn.style.cssText = "margin-top:8px;background:#27272a;color:#e4e4e7;border:1px solid #3f3f46;border-radius:6px;padding:4px 8px;cursor:pointer";
btn.onclick = () => { mode = mode === "am" ? "plddt" : "am"; btn.textContent = mode === "am" ? "Colour by AlphaFold confidence" : "Colour by AlphaMissense"; paint(); };
info.append(btn);
box.append(info);
return box;