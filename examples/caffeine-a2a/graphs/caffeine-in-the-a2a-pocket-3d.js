// Caffeine in the adenosine A2A receptor (5MZP, 2.1 Å), in three.js.
// Inputs: 0 receptor atoms (both entries), 1 ligand atoms, 2 fingerprint,
// 3 H-bond candidates, 4 π-stacking centroids, 5 pocket Cα pairs (5MZP, 2YDO).
// The backbone is a faint tube coloured by segment (GPCRdb: TM1–TM7, H8,
// loops grey); the pocket's side chains are sticks coloured by contact kind;
// caffeine is ball and stick; dashed lines are H-bond candidates (blue) and
// the stacking centroid line (amber). Buttons add caffeine's second modelled
// orientation and adenosine from 2YDO, fitted onto 5MZP on the pocket's Cα
// atoms (the two crystals have different coordinate frames).
const [rec, lig, fp, hb, st, pairs] = [0, 1, 2, 3, 4, 5].map(i => data[i] || []);
const v = scene3d(fit);
const E = '5MZP';
const kinds = ['H-bond', 'π-stacking', 'hydrophobic', 'within 5 Å'];
const kindHex = { 'H-bond': 0x38bdf8, 'π-stacking': 0xf59e0b, 'hydrophobic': 0x84cc16, 'within 5 Å': 0xa1a1aa };
const elHex = { C: 0x9ca3af, N: 0x3b82f6, O: 0xef4444, S: 0xeab308 };
const segHex = { TM1: 0x4e79a7, TM2: 0xf28e2b, TM3: 0xe15759, TM4: 0x76b7b2, TM5: 0x59a14f, TM6: 0xedc948, TM7: 0xb07aa1, H8: 0xff9da7 };
const up = new THREE.Vector3(0, 1, 0);
const P = a => new THREE.Vector3(a.x, a.y, a.z);
const sphereGeo = r => new THREE.SphereGeometry(r, 16, 12);
const mat = (hex, more = {}) => new THREE.MeshStandardMaterial({ color: hex, roughness: 0.45, ...more });
function stick(a, b, radius, hex, group) {
  const A = P(a), B = P(b), dir = B.clone().sub(A), len = dir.length();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, len, 8), mat(hex));
  m.position.copy(A).add(B).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(up, dir.normalize());
  group.add(m);
  return m;
}
// bonds from distances (no bond records in the input): heavy atoms closer than 1.9 Å
function bondsOf(atoms, max = 1.9) {
  const out = [];
  for (let i = 0; i < atoms.length; i++)
    for (let j = i + 1; j < atoms.length; j++)
      if (P(atoms[i]).distanceTo(P(atoms[j])) < max) out.push([atoms[i], atoms[j]]);
  return out;
}
function dashed(a, b, hex, group) {
  const g = new THREE.BufferGeometry().setFromPoints([P(a), P(b)]);
  const line = new THREE.Line(g, new THREE.LineDashedMaterial({ color: hex, dashSize: 0.25, gapSize: 0.18 }));
  line.computeLineDistances();
  group.add(line);
  return line;
}
// shown or hidden for the camera and for hover alike (layer 0 is the one both see)
const show = (obj, on) => obj.traverse(o => o.layers.set(on ? 0 : 1));
const where = r => [r.segment, r.bw ? `${r.bw}` : null].filter(Boolean).join(' · ');

// --- backbone: Cα tube per run of one segment, faint
const ca = rec.filter(a => a.entry === E && a.atom === 'CA').sort((a, b) => a.seq - b.seq);
const backbone = new THREE.Group();
let run = [];
const flush = () => {
  if (run.length >= 2) {
    const seg = run[run.length - 1].segment, pts = run.map(P);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), pts.length * 4, 0.35, 6, false),
      mat(segHex[seg] ?? 0x52525b, { transparent: true, opacity: 0.28, depthWrite: false }));
    const these = run.slice();
    backbone.add(tube);
    v.hover(tube, hit => {
      const r = these[Math.min(these.length - 1, Math.round((hit.uv ? hit.uv.x : 0) * (these.length - 1)))];
      return `<b>${r.res} ${r.seq}</b> · ${where(r) || 'no GPCRdb segment'}<br>backbone of 5MZP (Cα trace)`;
    });
  }
};
ca.forEach((a, i) => {
  const prev = ca[i - 1];
  const gap = prev && (a.seq - prev.seq > 1 || P(a).distanceTo(P(prev)) > 4.3);
  if (prev && (gap || a.segment !== prev.segment)) { const keep = gap ? [] : [run[run.length - 1]]; flush(); run = keep; }
  run.push(a);
});
flush();
v.scene.add(backbone);

// --- the pocket: residues in contact with caffeine (either orientation), as sticks
const best = d3.rollup(fp.filter(f => f.entry === E), g => g.sort((a, b) => kinds.indexOf(a.kind) - kinds.indexOf(b.kind) || a.d_min - b.d_min)[0], f => f.seq);
const pocket = new THREE.Group();
const byRes = d3.group(rec.filter(a => a.entry === E && best.has(a.seq)), a => a.seq);
byRes.forEach((atoms, seq) => {
  const f = best.get(seq), hex = kindHex[f.kind], res = new THREE.Group();
  atoms.forEach(a => {
    const m = new THREE.Mesh(sphereGeo(0.16), mat(a.el === 'C' ? hex : (elHex[a.el] ?? 0xd946ef)));
    m.position.copy(P(a));
    res.add(m);
  });
  bondsOf(atoms).forEach(([a, b]) => stick(a, b, 0.09, hex, res));
  pocket.add(res);
  const both = fp.filter(x => x.entry === E && x.seq === seq).map(x => `${x.ligand}: ${x.kind}, ${x.d_min.toFixed(2)} Å (${x.closest})`).join('<br>');
  v.hover(res, `<b>${f.label}</b> · ${where(f) || '—'}${f.uniprot ? ' · ' + f.uniprot : ''}<br>${both}`,
    { enter: () => res.children.forEach(o => o.material.emissive.setHex(0x333333)), leave: () => res.children.forEach(o => o.material.emissive.setHex(0)) });
});
v.scene.add(pocket);

// --- ligands: ball and stick; hover for the atom, its part and occupancy
function molecule(atoms, carbon, what) {
  const g = new THREE.Group();
  atoms.forEach(a => {
    const m = new THREE.Mesh(sphereGeo(a.el === 'C' ? 0.3 : 0.33), mat(a.el === 'C' ? carbon : (elHex[a.el] ?? 0xd946ef)));
    m.position.copy(P(a));
    g.add(m);
    v.hover(m, `<b>${a.atom}</b> of ${a.ligand} (${a.part}) · ${what}<br>occupancy ${a.occ} · B ${a.b} Å²`);
  });
  bondsOf(atoms, 1.75).forEach(([a, b]) => stick(a, b, 0.11, 0xd4d4d8, g));
  return g;
}
const cafA = molecule(lig.filter(a => a.ligand === 'caffeine A'), 0xe4e4e7, '5MZP, orientation A');
const cafB = molecule(lig.filter(a => a.ligand === 'caffeine B'), 0xa78bfa, '5MZP, orientation B');
v.scene.add(cafA, cafB);

// --- dashed lines: H-bond candidates and the stacking centroid line, per ligand
function lines(name) {
  const g = new THREE.Group();
  hb.filter(h => h.ligand === name).forEach(h => {
    const l = dashed({ x: h.px, y: h.py, z: h.pz }, { x: h.lx, y: h.ly, z: h.lz }, 0x38bdf8, g);
    v.hover(l, `<b>H-bond candidate</b> ${h.res} ${h.seq} ${h.patom} – ${h.latom} (${name}, ${h.part})<br>${h.d.toFixed(2)} Å (N/O pair; no hydrogens in the model)`);
  });
  st.filter(s => s.ligand === name).forEach(s => {
    const a = { x: s.rx, y: s.ry, z: s.rz }, b = { x: s.cx, y: s.cy, z: s.cz };
    const l = dashed(a, b, 0xf59e0b, g);
    [a, b].forEach(c => { const m = new THREE.Mesh(sphereGeo(0.12), mat(0xf59e0b)); m.position.copy(P(c)); g.add(m); });
    v.hover(l, `<b>π-stacking</b> ${s.res} ${s.seq} ring centroid – ${name} purine centroid<br>${s.d.toFixed(2)} Å (distance only; ring angle not checked)`);
  });
  return g;
}
const linesA = lines('caffeine A'), linesB = lines('caffeine B');
v.scene.add(linesA, linesB);

// --- adenosine from 2YDO, fitted onto 5MZP (Horn's quaternion least squares on
// the pocket's Cα pairs): the rotation is the top eigenvector of a 4×4 matrix
const ok = pairs.length >= 3;
let fitted = null, rmsd = NaN, raw = NaN;
if (ok) {
  const mob = pairs.map(p => new THREE.Vector3(p.x2, p.y2, p.z2)), tgt = pairs.map(p => new THREE.Vector3(p.x, p.y, p.z));
  const cm = mob.reduce((s, p) => s.add(p), new THREE.Vector3()).divideScalar(mob.length);
  const ct = tgt.reduce((s, p) => s.add(p), new THREE.Vector3()).divideScalar(tgt.length);
  const S = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let norm = 0;
  mob.forEach((p, i) => {
    const a = p.clone().sub(cm).toArray(), b = tgt[i].clone().sub(ct).toArray();
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) S[r][c] += a[r] * b[c];
    norm += a[0] ** 2 + a[1] ** 2 + a[2] ** 2 + b[0] ** 2 + b[1] ** 2 + b[2] ** 2;
  });
  const [[xx, xy, xz], [yx, yy, yz], [zx, zy, zz]] = S;
  const N = [[xx + yy + zz, yz - zy, zx - xz, xy - yx], [yz - zy, xx - yy - zz, xy + yx, zx + xz],
             [zx - xz, xy + yx, -xx + yy - zz, yz + zy], [xy - yx, zx + xz, yz + zy, -xx - yy + zz]];
  for (let i = 0; i < 4; i++) N[i][i] += norm; // shift: every eigenvalue positive, the largest stays largest
  let q = [1, 0.1, 0.1, 0.1];
  for (let it = 0; it < 500; it++) {
    const n = N.map(row => row.reduce((s, x, j) => s + x * q[j], 0)), len = Math.hypot(...n);
    q = n.map(x => x / len);
  }
  const rot = new THREE.Quaternion(q[1], q[2], q[3], q[0]).normalize();
  fitted = p => new THREE.Vector3(p.x, p.y, p.z).sub(cm).applyQuaternion(rot).add(ct);
  rmsd = Math.sqrt(d3.mean(pairs, p => fitted({ x: p.x2, y: p.y2, z: p.z2 }).distanceToSquared(new THREE.Vector3(p.x, p.y, p.z))));
  raw = Math.sqrt(d3.mean(pairs, p => new THREE.Vector3(p.x2, p.y2, p.z2).distanceToSquared(new THREE.Vector3(p.x, p.y, p.z))));
}
const adn = new THREE.Group();
if (ok) {
  const moved = a => { const p = fitted(a); return { ...a, x: p.x, y: p.y, z: p.z }; };
  const fitNote = `2YDO fitted on ${pairs.length} pocket Cα, RMSD ${rmsd.toFixed(2)} Å`;
  adn.add(molecule(lig.filter(a => a.ligand === 'adenosine').map(moved), 0x34d399, fitNote));
  // the residues only adenosine reaches (its ribose contacts), from 2YDO, thin
  const only = new Set(fp.filter(f => f.ligand === 'adenosine').map(f => f.seq).filter(s => !best.has(s)));
  d3.group(rec.filter(a => a.entry === '2YDO' && only.has(a.seq)).map(moved), a => a.seq).forEach((atoms, seq) => {
    const f = fp.find(x => x.ligand === 'adenosine' && x.seq === seq), res = new THREE.Group();
    bondsOf(atoms).forEach(([a, b]) => stick(a, b, 0.07, 0x34d399, res));
    atoms.forEach(a => { const m = new THREE.Mesh(sphereGeo(0.12), mat(elHex[a.el] ?? 0x34d399)); m.position.copy(P(a)); res.add(m); });
    adn.add(res);
    v.hover(res, `<b>${f.label}</b> (2YDO) · ${where(f) || '—'}${f.uniprot ? ' · ' + f.uniprot : ''}<br>adenosine: ${f.kind}, ${f.d_min.toFixed(2)} Å (${f.closest}, ${f.part})<br>no contact with caffeine${f.label.startsWith('Ser277') || f.label.startsWith('Thr88') ? ' · Ala in 5MZP (thermostabilising mutation)' : ''}`);
  });
  hb.filter(h => h.ligand === 'adenosine').forEach(h => {
    const a = fitted({ x: h.px, y: h.py, z: h.pz }), b = fitted({ x: h.lx, y: h.ly, z: h.lz });
    const l = dashed(a, b, 0x34d399, adn);
    v.hover(l, `<b>H-bond candidate</b> ${h.res} ${h.seq} ${h.patom} – adenosine ${h.latom} (${h.part})<br>${h.d.toFixed(2)} Å in 2YDO`);
  });
  v.scene.add(adn);
}

// --- toggles: caffeine's orientation B, adenosine; both start hidden
const state = { B: false, adn: false };
show(cafB, false); show(linesB, false); show(adn, false);
const bar = document.createElement('div');
bar.style.cssText = 'position:absolute;left:8px;top:8px;display:flex;gap:6px;font:11px sans-serif';
const button = (text, key, on, title) => {
  const b = document.createElement('button');
  b.textContent = text; b.title = title;
  const paint = () => { b.style.cssText = `padding:2px 8px;border-radius:4px;cursor:pointer;border:1px solid #3f3f46;color:#f4f4f5;background:${state[key] ? '#3f3f46' : 'rgba(9,9,11,.8)'}`; };
  paint();
  b.onclick = () => { state[key] = !state[key]; on(state[key]); paint(); v.render(); };
  bar.appendChild(b);
};
button('Caffeine orientation B (45%)', 'B', s => { show(cafB, s); show(linesB, s); }, 'The second orientation modelled in 5MZP (altloc B, occupancy 0.45)');
if (ok) button(`Adenosine (2YDO, fitted)`, 'adn', s => show(adn, s), `Agonist from 2YDO, superposed on ${pairs.length} pocket Cα atoms (RMSD ${rmsd.toFixed(2)} Å; ${raw.toFixed(0)} Å before the fit)`);
v.el.appendChild(bar);

// --- legend and caption
const legend = document.createElement('div');
legend.style.cssText = 'position:absolute;right:8px;top:8px;font:11px sans-serif;color:#d4d4d8;background:rgba(9,9,11,.75);padding:4px 6px;border-radius:4px;pointer-events:none;line-height:1.5';
legend.innerHTML = kinds.map(k => `<span style="color:#${kindHex[k].toString(16).padStart(6, '0')}">■</span> ${k}`).join('<br>') +
  '<br><span style="color:#e4e4e7">●</span> caffeine A <span style="color:#a78bfa">●</span> B <span style="color:#34d399">●</span> adenosine';
v.el.appendChild(legend);
const note = document.createElement('div');
note.style.cssText = 'position:absolute;left:8px;bottom:6px;right:8px;font:11px sans-serif;color:#71717a;pointer-events:none';
note.textContent = `5MZP (2.1 Å, thermostabilised A2A-StaR2-bRIL) · ${byRes.size} residues within 5 Å of caffeine · contacts are distance cutoffs, not energies` +
  (ok ? ` · adenosine: 2YDO (3.0 Å), fit RMSD ${rmsd.toFixed(2)} Å` : '') + ' · hover residues and lines · drag to orbit';
v.el.appendChild(note);

// the camera frames the pocket (side chains and caffeine), not the whole receptor


v.frame(pocket);
return v.el;
