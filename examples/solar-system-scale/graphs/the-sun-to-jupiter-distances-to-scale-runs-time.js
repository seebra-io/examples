// The Sun to Jupiter with every distance to scale (1 AU = 10 scene units),
// each planet where it is today (JPL's Keplerian elements: data[0]), and 3,000
// numbered asteroids plus the Jupiter trojans (JPL's Small-Body Database) where
// their own orbits put them. Planets and the Sun wear NASA's textures. Sizes:
// at true scale every planet is far smaller than a pixel here, so they are
// enlarged (the buttons say by how much; "True sizes" shows why). ▶ runs time.
// data: [elements, asteroids, trojans, Sun, Mercury, Venus (models), Earth, Mars, Jupiter (textures)]
const [els, astIn, trojIn, sunM, mercM, venM, earthT, marsT, jupT] = data;
const T = THREE;
const AU = 10, KM_AU = 1 / 149597870.7;
const v = scene3d(fit, {background: 0x05050a});
v.scene.add(new T.PointLight(0xffffff, 3, 0, 0));
const esc = s => String(s ?? "").replace(/[&<>]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;"}[c]));
const rad = d => d * Math.PI / 180;
const bodies = (els && els.bodies) || [];
const sunInfo = bodies.find(b => b.kind === "star") || {radius_km: 695700};
const planets = bodies.filter(b => b.kind === "planet");

// Kepler: heliocentric ecliptic position (AU) from a, e, i, Ω, ω, M (degrees)
const kepler = (a, e, i, Om, w, M) => {
  M = rad(((M % 360) + 540) % 360 - 180);
  let E = M + e * Math.sin(M);
  for (let k = 0; k < 8; k++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  const xp = a * (Math.cos(E) - e), yp = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const [ci, si, cO, sO, cw, sw] = [Math.cos(rad(i)), Math.sin(rad(i)), Math.cos(rad(Om)), Math.sin(rad(Om)), Math.cos(rad(w)), Math.sin(rad(w))];
  const x = (cw * cO - sw * sO * ci) * xp + (-sw * cO - cw * sO * ci) * yp;
  const y = (cw * sO + sw * cO * ci) * xp + (-sw * sO + cw * cO * ci) * yp;
  const z = (sw * si) * xp + (cw * si) * yp;
  return new T.Vector3(x * AU, z * AU, -y * AU);   // ecliptic plane = the scene's floor
};
const jdNow = () => Date.now() / 86400000 + 2440587.5;
let jd = jdNow();
const planetAt = (p, jd) => {
  const t = (jd - 2451545) / 36525, g = k => p[k] + (p[k + "_dot"] || 0) * t;
  const Om = g("Omega"), wbar = g("omega_bar"), L = g("L");
  return kepler(g("a"), g("e"), g("i"), Om, wbar - Om, L - wbar);
};

// orbits, from each planet's elements now
for (const p of planets) {
  const pts = [];
  const t = (jd - 2451545) / 36525, g = k => p[k] + (p[k + "_dot"] || 0) * t, Om = g("Omega"), wbar = g("omega_bar");
  for (let k = 0; k <= 256; k++) pts.push(kepler(g("a"), g("e"), g("i"), Om, wbar - Om, k * 360 / 256));
  v.scene.add(new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({color: new T.Color(p.color), transparent: true, opacity: 0.55})));
}
// the belt's edges (2:1 and 4:1 resonances) as faint rings in the ecliptic
for (const r of [2.06, 3.27]) {
  const pts = d3.range(0, 361, 3).map(k => new T.Vector3(r * AU * Math.cos(rad(k)), 0, r * AU * Math.sin(rad(k))));
  const ring = new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineDashedMaterial({color: 0x52525b, dashSize: 0.6, gapSize: 0.6}));
  ring.computeLineDistances();
  v.scene.add(ring);
}

// asteroids: one point each, moved along its own orbit
const rows = d => (d && Array.isArray(d.data) && Array.isArray(d.fields)) ? d.data.map(r => Object.fromEntries(d.fields.map((f, k) => [f, r[k]]))) : [];
const seen = new Set();
const ast = [...rows(astIn), ...rows(trojIn)].filter(r => r.a && !seen.has(r.full_name) && seen.add(r.full_name))
  .map(r => ({name: String(r.full_name).trim(), a: +r.a, e: +r.e, i: +r.i, om: +r.om, w: +r.w, ma: +r.ma, epoch: +r.epoch, cls: r.class}));
const classes = {MBA: ["main belt", 0x9ca3af], IMB: ["inner main belt", 0x9ca3af], OMB: ["outer main belt (Hildas among them)", 0xf59e0b], MCA: ["Mars-crossers", 0xf472b6],
  TJN: ["Jupiter trojans", 0x4ade80], APO: ["near-Earth (Apollo)", 0xef4444], ATE: ["near-Earth (Aten)", 0xef4444], AMO: ["near-Earth (Amor)", 0xef4444], CEN: ["centaurs", 0x60a5fa]};
const pos = new Float32Array(ast.length * 3), col = new Float32Array(ast.length * 3);
ast.forEach((s, k) => { const c = new T.Color((classes[s.cls] || ["", 0x71717a])[1]); col.set([c.r, c.g, c.b], k * 3); });
const geo = new T.BufferGeometry();
geo.setAttribute("position", new T.BufferAttribute(pos, 3));
geo.setAttribute("color", new T.BufferAttribute(col, 3));
const cloud = new T.Points(geo, new T.PointsMaterial({size: 0.12, vertexColors: true, sizeAttenuation: true}));
v.scene.add(cloud);
const placeAsteroids = jd => {
  ast.forEach((s, k) => {
    const n = 0.9856076686 / Math.pow(s.a, 1.5);
    const p = kepler(s.a, s.e, s.i, s.om, s.w, s.ma + n * (jd - (s.epoch || jd)));
    pos[k * 3] = p.x; pos[k * 3 + 1] = p.y; pos[k * 3 + 2] = p.z;
  });
  geo.attributes.position.needsUpdate = true;
  geo.computeBoundingSphere();
};
v.hover(cloud, hit => { const s = ast[hit && hit.index]; return s ? `<b>${esc(s.name)}</b><br>${esc((classes[s.cls] || [s.cls])[0])} · a = ${s.a.toFixed(3)} AU · e = ${s.e.toFixed(3)} · i = ${s.i.toFixed(1)}°` : "an asteroid"; });

// the Sun and the planets: NASA's models (1000 units across) or a textured sphere
const scaleOf = {Sun: 20, planet: 1000};
let mode = "big";
const items = [];
const fitModel = obj => { const s = new T.Box3().setFromObject(obj).getSize(new T.Vector3()); const g = new T.Group(); obj.scale.multiplyScalar(1 / (Math.max(s.x, s.y, s.z) || 1)); g.add(obj); return g; };   // diameter 1
const sphere = tex => { const m = new T.MeshStandardMaterial({color: 0xffffff, roughness: 0.9}); if (tex && tex.data) { const t = new T.TextureLoader().load(tex.data, () => v.render()); t.colorSpace = T.SRGBColorSpace; m.map = t; } const g = new T.Group(); g.add(new T.Mesh(new T.SphereGeometry(0.5, 64, 32), m)); return g; };
const tip = b => b.kind === "star"
  ? `<b>The Sun</b><br>radius ${b.radius_km.toLocaleString()} km = ${(b.radius_km * KM_AU).toFixed(4)} AU<br><span style="color:#a1a1aa">shown ×${mode === "big" ? scaleOf.Sun : 1}</span>`
  : () => { const p = planetAt(b, jd).length() / AU; return `<b>${esc(b.name)}</b><br>a = ${b.a.toFixed(3)} AU · e = ${b.e.toFixed(3)} · i = ${b.i.toFixed(2)}°<br>a year: ${b.period_days.toLocaleString()} days · now ${p.toFixed(3)} AU from the Sun<br>radius ${b.radius_km.toLocaleString()} km<span style="color:#a1a1aa"> · shown ×${mode === "big" ? scaleOf.planet : 1} · texture: ${esc(b.texture)}</span>`; };
const make = async (b, model, tex) => {
  let g;
  try { g = model && model.data ? fitModel(await loadModel(model)) : sphere(tex); } catch (e) { g = sphere(tex); }
  if (b.kind === "star") g.traverse(o => { if (o.isMesh && o.material) { o.material = o.material.clone(); if (o.material.emissive) { o.material.emissive.setHex(0xffcc66); o.material.emissiveIntensity = 1.2; if (o.material.map) o.material.emissiveMap = o.material.map; } } });
  if (b.kind !== "star" && !(model && model.data) && !(tex && tex.data)) g.traverse(o => { if (o.isMesh) o.material.color = new T.Color(b.color); });
  v.scene.add(g);
  const it = {b, g};
  v.hover(g, typeof tip(b) === "function" ? tip(b) : () => tip(b));
  items.push(it);
  return it;
};
const label = document.createElement("div");
label.style.cssText = "position:absolute;inset:0;pointer-events:none;font:11px sans-serif;color:#e4e4e7";
v.el.appendChild(label);
const tags = new Map();
const tagOf = name => { if (!tags.has(name)) { const d = document.createElement("div"); d.style.cssText = "position:absolute;white-space:nowrap;text-shadow:0 0 3px #000"; d.textContent = name; label.appendChild(d); tags.set(name, d); } return tags.get(name); };
const W = v.el.clientWidth || (fit && fit.width) || 600, H = v.el.clientHeight || (fit && fit.height) || 400;
const place = () => {
  for (const it of items) {
    const b = it.b, r = b.radius_km * KM_AU * AU * (mode === "big" ? (b.kind === "star" ? scaleOf.Sun : scaleOf.planet) : 1);
    it.g.scale.setScalar(2 * r);
    it.g.position.copy(b.kind === "star" ? new T.Vector3() : planetAt(b, jd));
  }
  placeAsteroids(jd);
};
const drawTags = () => {
  for (const it of items) {
    const p = it.g.position.clone().project(v.camera), d = tagOf(it.b.name);
    d.style.display = p.z < 1 ? "" : "none";
    d.style.left = ((p.x + 1) / 2 * W + 6) + "px"; d.style.top = ((1 - p.y) / 2 * H - 6) + "px";
  }
  const belt = new T.Vector3(2.7 * AU, 0, 0).project(v.camera), bd = tagOf("main belt (2.06-3.27 AU)");
  bd.style.color = "#a1a1aa"; bd.style.left = ((belt.x + 1) / 2 * W) + "px"; bd.style.top = ((1 - belt.y) / 2 * H) + "px"; bd.style.display = belt.z < 1 ? "" : "none";
};

// controls: sizes, time
const bar = document.createElement("div");
bar.style.cssText = "position:absolute;right:8px;top:6px;display:flex;gap:4px;align-items:center;font:11px sans-serif;color:#d4d4d8";
v.el.appendChild(bar);
const btn = (text, on) => { const b = document.createElement("button"); b.textContent = text; b.style.cssText = "font:11px sans-serif;color:#e4e4e7;background:#18181b;border:1px solid #3f3f46;border-radius:4px;padding:2px 6px;cursor:pointer"; b.onclick = on; bar.appendChild(b); return b; };
const day = document.createElement("span");
const big = btn("Sizes: planets ×1000, Sun ×20", () => { mode = "big"; paint(); });
const real = btn("True sizes", () => { mode = "true"; paint(); });
let playing = false;
const play = btn("▶ 1 month a second", () => { playing = !playing; play.textContent = playing ? "❚❚ pause" : "▶ 1 month a second"; if (playing) loop(); });
btn("Today", () => { jd = jdNow(); paint(); });
bar.appendChild(day);
const note = document.createElement("div");
note.style.cssText = "position:absolute;left:8px;bottom:6px;font:11px sans-serif;color:#a1a1aa;pointer-events:none;max-width:80%";
v.el.appendChild(note);
const legend = document.createElement("div");
legend.style.cssText = "position:absolute;left:8px;top:6px;font:11px sans-serif;color:#d4d4d8;pointer-events:none;line-height:1.5";
const counts = {};
for (const s of ast) counts[s.cls] = (counts[s.cls] || 0) + 1;
legend.innerHTML = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, n]) => `<span style="color:#${((classes[k] || ["", 0x71717a])[1]).toString(16).padStart(6, "0")}">●</span> ${esc((classes[k] || [k])[0])} (${n})`).join("<br>");
v.el.appendChild(legend);
const paint = () => {
  place();
  big.style.background = mode === "big" ? "#3f3f46" : "#18181b"; real.style.background = mode === "true" ? "#3f3f46" : "#18181b";
  day.textContent = new Date((jd - 2440587.5) * 86400000).toISOString().slice(0, 10);
  note.textContent = (mode === "big"
    ? "Distances to scale; the Sun drawn 20 times and the planets 1000 times their size, or they would not show."
    : "Everything to scale: even Jupiter is 0.0005 AU across, under a pixel at this distance; the Sun is 0.009 AU.") +
    ` ${ast.length.toLocaleString()} asteroids from JPL's Small-Body Database (numbered ones, the first found, so biased to the large and bright). Drag to orbit, wheel to zoom, hover a planet or an asteroid.`;
  v.render(); drawTags();
};
let last = 0;
const loop = t => {
  if (!playing || !v.el.isConnected) return;
  if (t && last) jd += (t - last) / 1000 * 30.44;
  last = t || 0;
  paint();
  requestAnimationFrame(loop);
};
// redraw the tags while the view turns
v.el.addEventListener("pointermove", () => requestAnimationFrame(drawTags));
v.el.addEventListener("wheel", () => requestAnimationFrame(drawTags), {passive: true});

const tex = {Earth: earthT, Mars: marsT, Jupiter: jupT}, mod = {Sun: sunM, Mercury: mercM, Venus: venM};
Promise.all([make(sunInfo.name ? sunInfo : {...sunInfo, name: "Sun"}, mod.Sun, null), ...planets.map(p => make(p, mod[p.name], tex[p.name]))]).then(() => {
  place();
  v.camera.position.set(0, 38, 48); v.controls.target.set(0, 0, 0); v.camera.near = 0.01; v.camera.far = 5000; v.camera.updateProjectionMatrix(); v.controls.update();
  paint();
});
paint();
return v.el;