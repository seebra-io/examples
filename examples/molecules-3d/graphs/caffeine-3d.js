// Ball and stick from PubChem's 3D conformer (three.js): CPK colours,
// one cylinder per bond order. Input 0: atoms (id, el, sym, x, y, z in Å);
// input 1: bonds (a, b, order, kind, length).
const [atoms, bonds] = [data[0] || [], data[1] || []];
const v = scene3d(fit);

// --- scales: element -> colour and radius (Å, not to scale)
const cpk = { H: [0xf4f4f5, 0.25], C: [0x52525b, 0.4], N: [0x3b82f6, 0.4], O: [0xef4444, 0.4],
              F: [0x22c55e, 0.38], P: [0xf97316, 0.45], S: [0xeab308, 0.45], Cl: [0x16a34a, 0.42] };
const style = a => cpk[a.sym] || [0xd946ef, 0.42];
const byId = new Map(atoms.map(a => [a.id, a]));
const degree = d3.rollup(bonds.flatMap(b => [b.a, b.b]), g => g.length, d => d);
const group = new THREE.Group();

// --- atoms: hover for element, bonds and position
atoms.forEach(a => {
  const [colour, radius] = style(a);
  const m = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 24), new THREE.MeshStandardMaterial({ color: colour, roughness: 0.35 }));
  m.position.set(a.x, a.y, a.z);
  group.add(m);
  v.hover(m, `<b>${a.sym === 'other' ? '#' + a.el : a.sym}</b> atom ${a.id} · ${degree.get(a.id) || 0} bonds<br>(${a.x.toFixed(2)}, ${a.y.toFixed(2)}, ${a.z.toFixed(2)}) Å`,
    { enter: () => m.material.emissive.setHex(0x333333), leave: () => m.material.emissive.setHex(0) });
});

// --- bonds: one thin cylinder per order, side by side; hover for kind and length
const up = new THREE.Vector3(0, 1, 0);
bonds.forEach(b => {
  const p = byId.get(b.a), q = byId.get(b.b);
  if (!p || !q) return;
  const A = new THREE.Vector3(p.x, p.y, p.z), B = new THREE.Vector3(q.x, q.y, q.z);
  const dir = B.clone().sub(A), len = dir.length();
  const side = new THREE.Vector3().crossVectors(dir, up).normalize().multiplyScalar(0.12);
  const n = b.order || 1;
  for (let k = 0; k < n; k++) {
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, len, 10), new THREE.MeshStandardMaterial({ color: 0xa1a1aa }));
    cyl.position.copy(A).add(B).multiplyScalar(0.5).add(side.clone().multiplyScalar(k - (n - 1) / 2));
    cyl.quaternion.setFromUnitVectors(up, dir.clone().normalize());
    group.add(cyl);
    v.hover(cyl, `<b>${b.kind}</b> bond, atoms ${b.a}–${b.b}<br>${b.length} Å`);
  }
});

v.scene.add(group);
v.frame(group);

// --- caption: what this is, and that it is computed
const note = document.createElement('div');
note.style.cssText = 'position:absolute;left:8px;bottom:6px;font:11px sans-serif;color:#71717a;pointer-events:none';
note.textContent = `${atoms.length} atoms · ${bonds.length} bonds · PubChem 3D conformer (computed, not measured) · drag to orbit`;
v.el.appendChild(note);
return v.el;
