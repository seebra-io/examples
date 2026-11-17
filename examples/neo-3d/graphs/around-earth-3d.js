// Earth at the centre; each object at its real miss distance (log scale, in
// lunar distances), sized by estimated diameter, red when potentially
// hazardous. NeoWs gives no approach direction: the direction is spread by
// approach time and is illustrative only.
const v = scene3d(fit);
const LD = 384400; // km
const r = ld => 2 + Math.log10(1 + ld) * 6; // scene units, log scale
const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 48), new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.7 }));
v.scene.add(earth);
v.hover(earth, '<b>Earth</b><br>radius 6,371 km (not to scale: the distances are logarithmic)');
const ring = (ld, label, color) => {
  const g = new THREE.BufferGeometry().setFromPoints(d3.range(0, 2 * Math.PI + 0.01, 0.02).map(a => new THREE.Vector3(Math.cos(a) * r(ld), 0, Math.sin(a) * r(ld))));
  const line = new THREE.Line(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 }));
  v.scene.add(line);
  v.hover(line, `<b>${label}</b>`);
};
ring(0.0936, 'Geostationary orbit · 35,786 km', 0x52525b);
ring(1, 'The Moon · 1 lunar distance (384,400 km)', 0xa1a1aa);
ring(10, '10 lunar distances · 3.8 million km', 0x3f3f46);
ring(100, '100 lunar distances · 38 million km', 0x27272a);
const maxD = d3.max(data, d => d.diameter_m) || 1;
const byTime = d3.extent(data, d => d.time);
data.forEach((d, i) => {
  // direction: around Earth by approach time, tilted by index (illustrative)
  const a = ((d.time - byTime[0]) / ((byTime[1] - byTime[0]) || 1)) * 2 * Math.PI;
  const tilt = ((i * 0.618) % 1 - 0.5) * 1.2;
  const R = r(d.miss_ld);
  const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.15 + 0.5 * Math.sqrt(d.diameter_m / maxD), 1),
    new THREE.MeshStandardMaterial({ color: d.hazardous ? 0xef4444 : 0xfbbf24, roughness: 0.9, flatShading: true }));
  m.position.set(Math.cos(a) * Math.cos(tilt) * R, Math.sin(tilt) * R, Math.sin(a) * Math.cos(tilt) * R);
  v.scene.add(m);
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), m.position]),
    new THREE.LineBasicMaterial({ color: d.hazardous ? 0x7f1d1d : 0x3f3f46, transparent: true, opacity: 0.35 }));
  v.scene.add(line);
  const rank = data.filter(o => o.miss_ld < d.miss_ld).length + 1;
  v.hover(m, `<b>${d.name}</b>${d.hazardous ? ' · <span style="color:#f87171">potentially hazardous</span>' : ''}<br>` +
    `${d.date} · ${d.miss_ld.toFixed(1)} lunar distances (${Math.round(d.miss_km).toLocaleString()} km), #${rank} closest of ${data.length}<br>` +
    `${d.speed_kms.toFixed(1)} km/s · about ${Math.round(d.diameter_m).toLocaleString()} m across<br><span style="color:#71717a">click: JPL record</span>`,
    { click: () => window.open(d.url, '_blank'),
      enter: () => m.scale.setScalar(1.6), leave: () => m.scale.setScalar(1) });
});
const note = document.createElement('div');
note.style.cssText = 'position:absolute;left:8px;bottom:6px;font:11px sans-serif;color:#71717a;pointer-events:none';
note.textContent = 'Distance: real, log scale · size: estimated diameter · red: potentially hazardous · direction: illustrative (NeoWs gives none) · drag to orbit';
v.el.appendChild(note);
v.camera.position.set(0, r(30), r(120));
v.controls.target.set(0, 0, 0);
return v.el;
