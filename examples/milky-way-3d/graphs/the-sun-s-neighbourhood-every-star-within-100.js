// The Sun's neighbourhood: every star within 100 light years, in true 3D
// positions (1 scene unit = 1 light year, the Sun at the centre, the Galactic
// plane as the floor, the Galactic centre toward -z as in the galaxy slide).
// data[0]: HYG v4.4 (names, spectral types: coloured by type, sized by
// brightness); data[1]: stars with known planets, NASA Exoplanet Archive,
// live. Gaia DR3's census of the same sphere is the next slide. Hover a star; click one
// for SIMBAD.
// data: [nearby-stars-100ly.json, exoplanet hosts]
const PICK = 0.6;
// ---- glow kit: soft points made in the shader (no textures, no post-processing):
// each point is a Gaussian halo plus a small hard core, added on top of what is
// behind it (additive blending), so overlapping points bloom like a long exposure.
// size is in scene units (it shrinks with distance); maxPx caps a point's pixels.
const T = THREE;
const W = (fit && fit.width) || 600, H = (fit && fit.height) || 400;
const v = scene3d(fit, {background: 0x09090b, fov: 50, pointThreshold: typeof PICK === "number" ? PICK : 0.1});
// a phone or a small view gets fewer particles and fewer pixels
const small = W * H < 360000 || (navigator.hardwareConcurrency || 8) <= 4;
const DETAIL = small ? 0.5 : 1;
v.renderer.setPixelRatio(Math.min(small ? 1.25 : 1.5, window.devicePixelRatio || 1));
v.renderer.setSize(W, H);
const PR = v.renderer.getPixelRatio();
const glowMat = ({opacity = 1, maxPx = 96, hard = 0.35, dark = false} = {}) => new T.ShaderMaterial({
  uniforms: {scale: {value: H * PR / (2 * Math.tan(T.MathUtils.degToRad(v.camera.fov) / 2))}, opacity: {value: opacity}, maxPx: {value: maxPx * PR}, hard: {value: hard}},
  vertexShader: `attribute float size; attribute vec3 tint; varying vec3 vTint; uniform float scale; uniform float maxPx;
    void main() { vTint = tint; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv;
      gl_PointSize = clamp(size * scale / max(-mv.z, 1e-4), 1.5, maxPx); }`,
  fragmentShader: `varying vec3 vTint; uniform float opacity; uniform float hard;
    void main() { vec2 p = gl_PointCoord * 2.0 - 1.0; float r2 = dot(p, p); if (r2 > 1.0) discard;
      float a = exp(-r2 * 5.0) * (1.0 - r2) + hard * (1.0 - smoothstep(0.0, 0.06, r2));
      gl_FragColor = vec4(vTint, a * opacity); }`,
  blending: dark ? T.NormalBlending : T.AdditiveBlending, depthWrite: false, depthTest: !dark, transparent: true,
});
// n points: at(i) -> [x, y, z, size, r, g, b]
const glowPoints = (n, at, opts = {}) => {
  const pos = new Float32Array(n * 3), tint = new Float32Array(n * 3), size = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const p = at(i);
    pos[i * 3] = p[0]; pos[i * 3 + 1] = p[1]; pos[i * 3 + 2] = p[2];
    size[i] = p[3]; tint[i * 3] = p[4]; tint[i * 3 + 1] = p[5]; tint[i * 3 + 2] = p[6];
  }
  const g = new T.BufferGeometry();
  g.setAttribute("position", new T.BufferAttribute(pos, 3));
  g.setAttribute("tint", new T.BufferAttribute(tint, 3));
  g.setAttribute("size", new T.BufferAttribute(size, 1));
  const pts = new T.Points(g, glowMat(opts));
  pts.renderOrder = opts.order || 0;
  pts.frustumCulled = false;
  v.scene.add(pts);
  count.particles += n;
  return pts;
};
const count = {particles: 0};
// hide or show an object; hidden ones leave the raycaster's layer too, so they can't be hovered
const show = (o, on) => { o.visible = on; o.traverse(x => x.layers.set(on ? 0 : 31)); };
// faint stars far behind everything, for depth (r: their distance in scene units)
const starfield = (r, n = 4000) => glowPoints(Math.round(n * DETAIL), () => {
  const u = rnd() * 2 - 1, th = rnd() * 2 * Math.PI, s = Math.sqrt(1 - u * u), d = r * (1 + rnd()), c = mix(rgb(0xbcd4ff), rgb(0xffd9a8), rnd()), k = 0.25 + rnd() * 0.6;
  return [d * s * Math.cos(th), d * u, d * s * Math.sin(th), d * 0.004 * (0.5 + rnd()), c[0] * k, c[1] * k, c[2] * k];
}, {opacity: 0.9, maxPx: 3, hard: 0.6, order: 0});
const rgb = hex => { const c = new T.Color(hex); return [c.r, c.g, c.b]; };
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
// a reproducible random stream (the same galaxy every time)
let seed = 7;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const gauss = () => { let u = 0, w = 0; while (u === 0) u = rnd(); while (w === 0) w = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * w); };
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
const fmt = (x, d = 0) => x == null || !isFinite(x) ? "?" : (+x).toLocaleString("en", {maximumFractionDigits: d, minimumFractionDigits: d});
const dim = s => `<span style="color:#a1a1aa">${s}</span>`;

// ---- HTML overlay: labels that follow the scene, buttons, notes
const ui = document.createElement("div");
ui.style.cssText = "position:absolute;inset:0;pointer-events:none;font:11px system-ui,sans-serif;color:#e4e4e7;overflow:hidden";
v.el.appendChild(ui);
const labels = [];
const label = (text, pos, {color = "#e4e4e7", size = 11, dx = 8, dy = -6, weight = 400, minDist = 0, maxDist = Infinity} = {}) => {
  const d = document.createElement("div");
  d.style.cssText = `position:absolute;white-space:nowrap;text-shadow:0 0 4px #000,0 0 2px #000;color:${color};font-size:${size}px;font-weight:${weight}`;
  d.textContent = text;
  ui.appendChild(d);
  // bold or bigger labels win a collision; the rest shift a line or hide
  const l = {d, pos, dx, dy, minDist, maxDist, on: true, prio: weight + size * 10 - labels.length * 0.01, w: text.length * size * 0.56 + 4, h: size * 1.25};
  labels.push(l);
  return l;
};
const tmp = new T.Vector3();
const drawLabels = () => {
  const placed = [], hit = (x, y, l) => placed.some(p => x < p.x + p.w && x + l.w > p.x && y < p.y + p.h && y + l.h > p.y);
  for (const l of [...labels].sort((a, b) => b.prio - a.prio)) {
    if (!l.on) { l.d.style.display = "none"; continue; }
    tmp.copy(typeof l.pos === "function" ? l.pos() : l.pos);
    const dist = tmp.distanceTo(v.camera.position);
    tmp.project(v.camera);
    const vis = tmp.z < 1 && Math.abs(tmp.x) < 1.1 && Math.abs(tmp.y) < 1.1 && dist >= l.minDist && dist <= l.maxDist;
    let x = (tmp.x + 1) / 2 * W + l.dx, y = (1 - tmp.y) / 2 * H + l.dy, ok = vis;
    if (vis) { const t = [0, l.h, -l.h, 2 * l.h].find(o => !hit(x, y + o, l)); ok = t !== undefined; if (ok) { y += t; placed.push({x, y, w: l.w, h: l.h}); } }
    l.d.style.display = ok ? "" : "none";
    if (ok) { l.d.style.left = x + "px"; l.d.style.top = y + "px"; }
  }
};
v.controls.addEventListener("change", drawLabels);
const panel = (css) => { const p = document.createElement("div"); p.style.cssText = "position:absolute;pointer-events:auto;display:flex;gap:4px;flex-wrap:wrap;" + css; ui.appendChild(p); return p; };
const button = (bar, text, on, title) => {
  const b = document.createElement("button");
  b.textContent = text; if (title) b.title = title;
  b.style.cssText = "font:11px system-ui,sans-serif;color:#e4e4e7;background:rgba(24,24,27,.85);border:1px solid #3f3f46;border-radius:4px;padding:2px 7px;cursor:pointer";
  b.onclick = e => { e.stopPropagation(); on(b); };
  bar.appendChild(b);
  return b;
};
const pressed = (b, on) => { b.style.background = on ? "#3f3f46" : "rgba(24,24,27,.85)"; b.style.borderColor = on ? "#71717a" : "#3f3f46"; };
const note = document.createElement("div");
note.style.cssText = "position:absolute;left:8px;bottom:6px;right:8px;color:#a1a1aa;pointer-events:none;line-height:1.35";
ui.appendChild(note);

// ---- motion: a slow turn until the viewer takes over; paused while off-screen
let userMoved = false;
v.controls.autoRotateSpeed = 0.35;
v.controls.addEventListener("start", () => { userMoved = true; v.controls.autoRotate = false; });
let onScreen = true;
try {
  new IntersectionObserver(es => {
    onScreen = es.some(e => e.isIntersecting);
    v.controls.autoRotate = onScreen && !userMoved;
    if (v.controls.autoRotate) v.render(1000);
  }).observe(v.el);
} catch (_) { /* old browser: turns anyway */ }
const spin = () => { v.controls.autoRotate = onScreen && !userMoved; v.render(1500); };
// fly the camera to a target and a viewpoint, eased over ms
const flyTo = (target, from, ms = 1400) => {
  const t0 = performance.now(), a = v.controls.target.clone(), b = v.camera.position.clone();
  const step = () => {
    const k = Math.min(1, (performance.now() - t0) / ms), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    v.controls.target.lerpVectors(a, target, e);
    v.camera.position.lerpVectors(b, from, e);
    v.controls.update();
    v.render(200);
    if (k < 1) requestAnimationFrame(step);
  };
  step();
};
// frames per second over a second of turning (shown in the corner; the test reads it)
const fps = document.createElement("div");
fps.style.cssText = "position:absolute;right:8px;bottom:6px;color:#52525b;pointer-events:none";
ui.appendChild(fps);
const measure = () => {
  let n = 0; const t0 = performance.now();
  const f = () => { n++; if (performance.now() - t0 < 1000) requestAnimationFrame(f); else { v.el.dataset.fps = String(n); fps.textContent = `${count.particles.toLocaleString()} particles · ${n} fps`; } };
  requestAnimationFrame(f);
};
const [hyg, exoIn] = data;
const LY = 3.26156, rad = d => d * Math.PI / 180;
// rows of a table answer: an array of objects, or {fields, rows}
const rowsOf = d => Array.isArray(d) ? d : d && Array.isArray(d.rows) && d.fields ? d.rows.map(r => Object.fromEntries(d.fields.map((f, k) => [f, r[k]]))) : [];
const stars = rowsOf(hyg);
// Galactic x (toward l = 0), y (l = 90), z (north) to the scene: the centre at -z, rotation +x, north up
const scene = (x, y, z) => new T.Vector3(y * LY, z * LY, -x * LY);
const fromLB = (l, b, pc) => scene(pc * Math.cos(rad(b)) * Math.cos(rad(l)), pc * Math.cos(rad(b)) * Math.sin(rad(l)), pc * Math.sin(rad(b)));
// equatorial (deg) to Galactic (deg), for the exoplanet hosts
const M = [[-0.0548755604, -0.8734370902, -0.4838350155], [0.4941094279, -0.4448296300, 0.7469822445], [-0.8676661490, -0.1980763734, 0.4559837762]];
const toGal = (ra, dec) => { const a = rad(ra), d = rad(dec), e = [Math.cos(d) * Math.cos(a), Math.cos(d) * Math.sin(a), Math.sin(d)]; return M.map(r => r[0] * e[0] + r[1] * e[1] + r[2] * e[2]); };

// colours by spectral class (after Mitchell Charity's blackbody star colours)
const CLS = {O: [0x9bb0ff, "O · hottest, blue"], B: [0xaabfff, "B · blue-white"], A: [0xcad7ff, "A · white"], F: [0xf8f7ff, "F · yellow-white"], G: [0xfff4ea, "G · yellow (the Sun)"],
  K: [0xffd2a1, "K · orange"], M: [0xffb46b, "M · red dwarf"], D: [0x9fd8ff, "white dwarf"], L: [0xff7b5c, "L/T · brown dwarf"], "?": [0x8b8b93, "type not catalogued"]};
const clsOf = sp => { let s = String(sp || "").trim(); if (/^(WD|D[ABCOQZX0-9]|D$)/.test(s)) return "D"; s = s.replace(/^(sd|d)(?=[A-Za-z])/, ""); const c = (s[0] || "?").toUpperCase(); return c === "T" ? "L" : "OBAFGKML".includes(c) ? c : "?"; };
// Gaia has no spectral types: its BP-RP colour, binned roughly onto the classes
const clsOfColour = bprp => bprp == null ? "?" : bprp < -0.1 ? "B" : bprp < 0.35 ? "A" : bprp < 0.75 ? "F" : bprp < 0.98 ? "G" : bprp < 1.8 ? "K" : bprp < 4.5 ? "M" : "L";

// HYG stars: size from luminosity (log), colour from type
const hygStars = stars.filter(s => s.dist_pc > 0).map(s => ({...s, cls: clsOf(s.spect), p: scene(s.x_pc, s.y_pc, s.z_pc), ly: s.dist_pc * LY}));
const sizeOf = lum => 0.4 + 0.6 * Math.max(0, Math.log10(Math.max(1e-4, lum || 1e-3)) + 4);
const hygPts = glowPoints(hygStars.length, i => { const s = hygStars[i], c = rgb(CLS[s.cls][0]), k = 0.7 + 0.3 * Math.min(1, (Math.log10(Math.max(1e-4, s.lum_v || 1e-4)) + 4) / 6); return [s.p.x, s.p.y, s.p.z, sizeOf(s.lum_v), c[0] * k, c[1] * k, c[2] * k]; }, {opacity: 1, maxPx: 60, hard: 0.55, order: 3});
// the Sun
glowPoints(3, i => [0, 0, 0, [0.5, 1.4, 3.2][i], ...rgb([0xffffff, 0xfff1c1, 0xffc94a][i]).map(c => c * [1, 0.7, 0.25][i])], {opacity: 1, maxPx: 90, hard: 0.6, order: 4});
label("● Sun", new T.Vector3(0, 0, 0), {color: "#fde047", size: 12, weight: 700});

const simbad = id => `https://simbad.cds.unistra.fr/simbad/sim-id?Ident=${encodeURIComponent(id)}`;
const starTip = s => `<b>${esc(s.name)}</b> ${dim(esc(s.simbad_id !== s.name ? s.simbad_id : ""))}<br>${fmt(s.ly, 2)} ly (${fmt(s.dist_pc, 2)} pc) · ${esc(s.spect || "type ?")} · ${esc(CLS[s.cls][1])}<br>` +
  `V = ${fmt(s.mag, 2)} (absolute ${fmt(s.absmag, 2)}) · ${s.lum_v != null ? fmt(s.lum_v, s.lum_v < 0.01 ? 4 : 2) + " × the Sun's visual luminosity" : ""}` +
  `${s.host ? `<br><span style="color:#4ade80">● ${s.host.n} known planet${s.host.n > 1 ? "s" : ""} (NASA Exoplanet Archive: ${esc(s.host.name)})</span>` : ""}<br>${dim("HYG v4.4 (Hipparcos, Gaia, Gliese) · click: SIMBAD")}`;
// clicking: the star last hovered
let lastHit = null;
v.hover(hygPts, hit => { lastHit = hygStars[hit && hit.index]; return lastHit ? starTip(lastHit) : ""; }, {click: () => lastHit && window.open(simbad(lastHit.simbad_id || lastHit.name))});

// exoplanet hosts (live): a green ring on the star; matched to HYG by position (within 0.15 pc)
const exo = rowsOf(exoIn).filter(r => r.sy_dist > 0);
const hosts = exo.map(r => { const g = toGal(+r.ra, +r.dec), d = +r.sy_dist; return {name: r.hostname, n: +r.sy_pnum || 1, spect: r.st_spectype, d, p: scene(g[0] * d, g[1] * d, g[2] * d)}; });
for (const h of hosts) { let best = null, bd = 0.5; for (const s of hygStars) { const dd = s.p.distanceTo(h.p); if (dd < bd) { bd = dd; best = s; } } if (best) best.host = h; h.star = best; }
const ringGeo = new T.RingGeometry(0.55, 0.68, 24), ringMat = new T.MeshBasicMaterial({color: 0x4ade80, transparent: true, opacity: 0.8, side: T.DoubleSide, depthWrite: false});
const rings = new T.Group();
for (const h of hosts) { const m = new T.Mesh(ringGeo, ringMat); m.position.copy(h.star ? h.star.p : h.p); m.userData.h = h; rings.add(m); }
rings.renderOrder = 6; v.scene.add(rings);
let lastHost = null;
v.hover(rings, hit => { lastHost = hit && hit.object.userData.h; return lastHost ? `<b>${esc(lastHost.name)}</b> · ${lastHost.n} known planet${lastHost.n > 1 ? "s" : ""}<br>${fmt(lastHost.d * LY, 1)} ly · ${esc(lastHost.spect || (lastHost.star && lastHost.star.spect) || "")}<br>${dim("NASA Exoplanet Archive (pscomppars), live · click: the archive's overview")}` : ""; },
  {click: () => lastHost && window.open(`https://exoplanetarchive.ipac.caltech.edu/overview/${encodeURIComponent(lastHost.name)}`)});
// rings face the camera
const faceRings = () => { for (const m of rings.children) m.quaternion.copy(v.camera.quaternion); };
v.controls.addEventListener("change", faceRings);

// distance shells: rings in the plane at 10, 25, 50 and 100 ly, and the 100 ly sphere
for (const r of [10, 25, 50, 100]) {
  const ring = new T.Line(new T.BufferGeometry().setFromPoints(d3.range(0, 361, 2).map(k => new T.Vector3(r * Math.cos(rad(k)), 0, r * Math.sin(rad(k))))),
    new T.LineBasicMaterial({color: r === 100 ? 0x52525b : 0x3f3f46, transparent: true, opacity: 0.55, depthWrite: false}));
  v.scene.add(ring);
  label(`${r} ly`, new T.Vector3(r * Math.cos(rad(-35)), 0, r * Math.sin(rad(-35))), {color: "#71717a", size: 10});
}
const shell = new T.Mesh(new T.SphereGeometry(100, 48, 24), new T.MeshBasicMaterial({color: 0x6366f1, wireframe: true, transparent: true, opacity: 0.05, depthWrite: false}));
v.scene.add(shell);
// directions: to the Galactic centre and along the rotation
const arrow = (dir, text, color) => { const a = new T.ArrowHelper(dir, new T.Vector3(0, 0, 0), 108, color, 5, 2.5); a.line.material.transparent = true; a.line.material.opacity = 0.6; v.scene.add(a); label(text, dir.clone().multiplyScalar(112), {color: "#" + new T.Color(color).getHexString(), size: 10}); };
arrow(new T.Vector3(0, 0, -1), "→ Galactic centre (l = 0°), 26,700 ly", 0xfbbf24);
arrow(new T.Vector3(1, 0, 0), "→ orbit (l = 90°)", 0x93c5fd);
arrow(new T.Vector3(0, 1, 0), "↑ north Galactic pole", 0x71717a);

// labels for the stars worth knowing: within 12 ly, brighter than V = 1.6, or with a proper name and near
const named = hygStars.filter(s => (s.ly < 9 && /^[A-Z][a-z]/.test(s.name)) || s.mag < 1.3 || (/^[A-Z][a-z]/.test(s.name) && s.ly > 15 && s.mag < 2.6)).slice(0, 40);
for (const s of named) {
  label(s.name, s.p, {color: "#" + new T.Color(CLS[s.cls][0]).getHexString(), size: 10, dx: 6, maxDist: s.ly < 9 ? 60 : 400});
  // a drop line to the plane, for depth
  const ln = new T.Line(new T.BufferGeometry().setFromPoints([s.p, new T.Vector3(s.p.x, 0, s.p.z)]), new T.LineBasicMaterial({color: 0x52525b, transparent: true, opacity: 0.35, depthWrite: false}));
  v.scene.add(ln);
}

// legend: counts per class (HYG), and how the two catalogues compare
const counts = d3.rollup(hygStars, g => g.length, s => s.cls);
const legend = document.createElement("div");
legend.style.cssText = "position:absolute;left:8px;top:32px;line-height:1.5;pointer-events:none";
legend.innerHTML = Object.keys(CLS).filter(k => counts.get(k)).map(k => `<span style="color:#${new T.Color(CLS[k][0]).getHexString()}">●</span> ${esc(CLS[k][1])} ${dim("(" + counts.get(k) + ")")}`).join("<br>") +
  `<br><span style="display:inline-block;width:7px;height:7px;border:1.5px solid #4ade80;border-radius:50%"></span> known planets ${dim("(" + hosts.length + " hosts)")}`;
ui.appendChild(legend);

const bar = panel("left:8px;top:6px;max-width:72%");
const lab = document.createElement("span"); lab.textContent = "Fly to"; lab.style.cssText = "color:#a1a1aa;align-self:center;margin-right:2px"; bar.appendChild(lab);
const find = n => hygStars.find(s => s.name === n);
const flyStar = n => { const s = find(n); if (s) { userMoved = true; v.controls.autoRotate = false; flyTo(s.p.clone(), s.p.clone().add(new T.Vector3(6, 5, 9))); } };
button(bar, "Sun", () => { userMoved = true; flyTo(new T.Vector3(), new T.Vector3(10, 8, 16)); });
for (const n of ["Proxima Centauri", "Sirius", "Vega", "Arcturus"]) if (find(n)) button(bar, n, () => flyStar(n));
button(bar, "All 100 ly", () => { flyTo(new T.Vector3(), new T.Vector3(120, 95, 170)); });
const tog = panel("right:8px;top:6px;justify-content:flex-end;max-width:26%");
const rb = button(tog, "Planets", b => { rb.on = !rings.visible; show(rings, rb.on); pressed(b, rb.on); v.render(); }); pressed(rb, true);
const spinB = button(tog, "Turn", b => { userMoved = !userMoved; spin(); pressed(b, !userMoved); }); pressed(spinB, true);
v.controls.addEventListener("start", () => pressed(spinB, false));

note.style.right = "150px";
note.innerHTML = `${hygStars.length.toLocaleString()} HYG stars within 100 ly, in true 3D positions; HYG misses many faint red dwarfs: Gaia DR3's census is on the next slide. ` +
  `Point size: visual luminosity (log), not the star's size. Distances from Hipparcos or Gaia parallaxes, good to a few per cent or better here.`;

v.camera.near = 0.05; v.camera.far = 5000; v.camera.updateProjectionMatrix();
v.controls.target.set(0, 0, 0); v.camera.position.set(120, 92, 172);
starfield(1500, 3000); v.controls.maxDistance = 600; v.controls.update();
faceRings(); spin(); drawLabels();
setTimeout(measure, 1200);
return v.el;