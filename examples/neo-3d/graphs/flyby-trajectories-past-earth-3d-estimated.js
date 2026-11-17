// The coming month's close approaches as paths past Earth, 4 days either
// side of each, estimated from JPL's orbits (the flybys step). Linear in
// lunar distances (LD); Earth is drawn 5x larger than it is. The paths
// brighten with time, so they run from dim to bright; the dot is the
// estimated closest point, sized by the object's size. Grey ring: the
// Moon's orbit (1 LD). Hover a path for its record, click for its JPL page;
// drag to orbit, scroll to zoom.
// Inputs: 0 flybys, 1 approaches, 2 check.
const v = scene3d(fit);
const [paths = [], approaches = [], checks = []] = Array.isArray(data) ? data : [];
const NEAR_LD = 5;                                   // red when JPL's distance is within this
const EARTH_R = 6371 / 384400 * 5;                   // 5x Earth's radius, in LD
const COLOR = {near: 0xef4444, far: 0xfbbf24, untrusted: 0x71717a};
const info = new Map(approaches.map(a => [a.name, a]));
const trust = new Map(checks.map(c => [c.name, c]));
const toScene = p => new THREE.Vector3(p.x, p.z, -p.y); // ecliptic plane horizontal, north up
const group = new THREE.Group();
v.scene.add(group);

// --- Earth, the Moon's orbit, the direction of the Sun
const earth = new THREE.Mesh(new THREE.SphereGeometry(EARTH_R, 32, 32), new THREE.MeshStandardMaterial({color: 0x2563eb, roughness: 0.7}));
group.add(earth);
v.hover(earth, "<b>Earth</b> (drawn 5× its size)<br>geocentric ecliptic J2000: the horizontal plane is the ecliptic");
const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(d3.range(0, 2 * Math.PI + 0.01, 0.02).map(a => new THREE.Vector3(Math.cos(a), 0, Math.sin(a)))),
  new THREE.LineBasicMaterial({color: 0xa1a1aa, transparent: true, opacity: 0.5}));
group.add(ring);
v.hover(ring, "<b>The Moon's orbit</b> · 1 LD = 384,400 km (drawn in the ecliptic; it is tilted 5°)");
// the Sun's direction now, from Earth's approximate elements (as in flybys)
const T = (Date.now() / 86400000 + 2440587.5 - 2451545) / 36525;
const L = (100.46457166 + 35999.37244981 * T) * Math.PI / 180;
const sun = new THREE.ArrowHelper(new THREE.Vector3(-Math.cos(L), 0, Math.sin(L)).normalize(), new THREE.Vector3(), 4, 0xfde047, 0.4, 0.2);
group.add(sun);
v.hover(sun.line, "<b>Towards the Sun</b> (today)");

// --- one path per object: dim at -4 days, bright at +4 days
const byName = d3.group(paths, d => d.name);
for (const [name, rows] of byName) {
  rows.sort((a, b) => a.hours - b.hours);
  const a = info.get(name) || {}, c = trust.get(name) || {};
  const ok = c.trust !== undefined ? c.trust === "yes" : true;
  const base = new THREE.Color(!ok ? COLOR.untrusted : (a.dist_ld ?? 99) < NEAR_LD ? COLOR.near : COLOR.far);
  const geo = new THREE.BufferGeometry().setFromPoints(rows.map(toScene));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(rows.flatMap((r, i) => base.clone().multiplyScalar(0.25 + 0.75 * i / (rows.length - 1)).toArray()), 3));
  const line = new THREE.Line(geo, new THREE.LineBasicMaterial({vertexColors: true, transparent: true, opacity: ok ? 0.9 : 0.5}));
  group.add(line);
  const closest = rows.reduce((m, r) => r.r_ld < m.r_ld ? r : m, rows[0]);
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.06 + 0.05 * Math.log10(1 + (a.size_m || 1)), 16, 16), new THREE.MeshStandardMaterial({color: base}));
  dot.position.copy(toScene(closest));
  group.add(dot);
  const html = `<b>${name}</b> · closest ${a.date} TDB<br>` +
    `JPL: ${a.dist_ld} LD (3σ ${a.dist_min_ld}–${a.dist_max_ld}), ${Math.round(a.dist_ld * 384400).toLocaleString()} km, time ±${a.time_sigma}<br>` +
    `estimate here: ${c.estimate_ld ?? "?"} LD at ${c.hour_of_closest ?? "?"} h (${c.off_pct ?? "?"}% off)${ok ? "" : ' · <span style="color:#f87171">not to be trusted</span>'}<br>` +
    `${a.v_rel_kms} km/s relative · ~${a.size_m} m (${a.diameter_km != null ? "measured" : "from H " + a.h_mag + ", albedo 0.14"})<br>` +
    `<span style="color:#a1a1aa">click: its JPL record</span>`;
  for (const o of [line, dot]) v.hover(o, html, {click: () => window.open(a.url, "_blank")});
}
v.frame(group);
return v.el;
