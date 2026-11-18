// The Local Group in 3D, to scale: 1 scene unit = 10 kpc, the Milky Way's
// centre at the origin and its disc as the floor (Galactic coordinates, the
// Galactic centre toward -z from the Sun, rotation +x). Each galaxy glows by
// its V luminosity (McConnachie 2012, January 2021 update: data[0].local_group);
// the thin line through each is its distance error, along our line of sight,
// which is where the uncertainty lies. Hover a galaxy; click for NED.
// data: [local-universe.json]
const PICK = 1.2;
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
const U = data[0] || data, rad = d => d * Math.PI / 180, KPC = 0.1;
const SUN_X = 8.178;   // the Sun from the Galactic centre, kpc (GRAVITY 2019)
// heliocentric (l, b, kpc) to galactocentric scene units
const pos = (l, b, kpc) => { const x = kpc * Math.cos(rad(b)) * Math.cos(rad(l)) - SUN_X, y = kpc * Math.cos(rad(b)) * Math.sin(rad(l)), z = kpc * Math.sin(rad(b)); return new T.Vector3(y * KPC, z * KPC, -x * KPC); };
const gals = U.local_group.filter(g => g.dist_kpc).map(g => ({...g, p: g.name === "Milky Way" ? new T.Vector3() : pos(g.l, g.b, g.dist_kpc)}));
const mwG = gals.find(g => g.name === "Milky Way"), m31 = gals.find(g => g.name.startsWith("Andromeda (M31)"));
// which big galaxy each is nearest to (3D, as drawn): a satellite of it, or neither (beyond 300 kpc)
for (const g of gals) {
  const dm = g.p.length() / KPC, da = g.p.distanceTo(m31.p) / KPC;
  g.near = g.big ? null : dm < da ? (dm < 300 ? `${fmt(dm)} kpc from the Milky Way's centre: a satellite` : `${fmt(dm)} kpc from the Milky Way, beyond its halo`) : (da < 300 ? `${fmt(da)} kpc from M31: an M31 satellite` : `${fmt(da)} kpc from M31, ${fmt(dm)} kpc from the Milky Way`);
}
const L = g => g.lum_v_lsun || (g.name === "Milky Way" ? 2.0e10 : 1e5);
const lg = g => Math.log10(Math.max(1e3, L(g)));
// glowing cores: a white centre and a coloured halo, both growing with luminosity
const colOf = g => g.big ? rgb(0xffe7b8) : g.feh != null && g.feh < -1.8 ? rgb(0xb8c7ff) : rgb(0xffd6a0);
const cores = glowPoints(gals.length * 3, i => {
  const g = gals[Math.floor(i / 3)], k = i % 3, s = lg(g) - 3, c = colOf(g);
  const size = [0.1 + s * 0.07, 0.45 + s * 0.32, 1.3 + s * 0.95][k] * (g.big ? 1.5 : 1), b = [1, 0.6, 0.2][k] * (0.5 + s / 7);
  return [g.p.x, g.p.y, g.p.z, size, c[0] * b, c[1] * b, c[2] * b];
}, {opacity: 1, maxPx: 260, hard: 0.5, order: 4});
// the two big spirals: a disc of stars (the Milky Way's is the floor; M31's tilt is schematic)
const disc = (centre, n, Rd, tilt, tint) => glowPoints(n, () => {
  let R; do { R = -Rd * Math.log(rnd() * rnd()); } while (R > Rd * 6);
  const th = rnd() * 2 * Math.PI + R * 0.9, arm = Math.cos(2 * th - R * 1.4), rr = R * (1 + 0.08 * arm);
  const p = new T.Vector3(rr * Math.cos(th) * KPC, gauss() * 0.03, rr * Math.sin(th) * KPC).applyEuler(tilt).add(centre), c = mix(tint, [1, 1, 1], Math.exp(-R / 2) * 0.7), k = 0.25 + 0.5 * Math.exp(-R / 5);
  return [p.x, p.y, p.z, 0.05 + rnd() * 0.08, c[0] * k, c[1] * k, c[2] * k];
}, {opacity: 0.9, maxPx: 5, order: 3});
disc(new T.Vector3(), Math.round(14000 * DETAIL), 2.6, new T.Euler(0, 0, 0), rgb(0xcfe0ff));
disc(m31.p, Math.round(14000 * DETAIL), 5.3, new T.Euler(rad(60), 0, rad(30)), rgb(0xffe2b8));
// distance errors along the line of sight from the Sun
const sunP = pos(0, 0, 0), segs = [];
for (const g of gals) if (g.dist_kpc_lo && g.dist_kpc_hi && !g.big || g.name.startsWith("Andromeda")) {
  segs.push(pos(g.l, g.b, g.dist_kpc_lo), pos(g.l, g.b, g.dist_kpc_hi));
}
const errs = new T.LineSegments(new T.BufferGeometry().setFromPoints(segs), new T.LineBasicMaterial({color: 0xf472b6, transparent: true, opacity: 0.3, depthWrite: false}));
v.scene.add(errs);
// rings around the Milky Way: 100, 300 and 1000 kpc
for (const r of [100, 300, 1000]) {
  const ring = new T.Line(new T.BufferGeometry().setFromPoints(d3.range(0, 361, 2).map(k => new T.Vector3(r * KPC * Math.cos(rad(k)), 0, r * KPC * Math.sin(rad(k))))),
    new T.LineDashedMaterial({color: 0x3f3f46, dashSize: 1, gapSize: 1.2, transparent: true, opacity: 0.8, depthWrite: false}));
  ring.computeLineDistances(); v.scene.add(ring);
  label(`${r} kpc · ${fmt(r * 3.2616 / 1000, r < 1000 ? 2 : 1)} Mly`, new T.Vector3(r * KPC * Math.cos(rad(-70)), 0, r * KPC * Math.sin(rad(-70))), {color: "#71717a", size: 10});
}
const line = new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(), m31.p]), new T.LineDashedMaterial({color: 0xfde68a, dashSize: 0.8, gapSize: 0.8, transparent: true, opacity: 0.45}));
line.computeLineDistances(); v.scene.add(line);

const ned = g => `https://ned.ipac.caltech.edu/byname?objname=${encodeURIComponent(g.name.replace(/ \(M31\)$/, "").replace(/^Andromeda$/, "M31"))}`;
const tip = g => `<b>${esc(g.name)}</b>${g.flag_star ? dim(" (marked * in the catalogue)") : ""}<br>` +
  (g.name === "Milky Way" ? `our galaxy · the Sun is ${SUN_X} kpc from its centre (GRAVITY 2019)` :
    `${fmt(g.dist_kpc)} kpc from the Sun${g.dist_kpc_lo ? ` (${fmt(g.dist_kpc_lo)}–${fmt(g.dist_kpc_hi)} kpc: (m−M)₀ = ${g.dmod} ± ${g.dmod_err_plus})` : ""} · ${fmt(g.dist_kpc * 3.2616 / 1000, 2)} million ly`) +
  `${g.abs_v != null ? `<br>M_V = ${g.abs_v} · ${L(g).toExponential(1)} times the Sun in V${g.extinction_note ? dim(" · " + esc(g.extinction_note)) : ""}` : ""}` +
  `${g.vh_kms != null ? `<br>v = ${fmt(g.vh_kms)} km/s heliocentric${g.feh != null ? ` · [Fe/H] = ${g.feh}` : ""}` : ""}` +
  `${g.near ? "<br>" + esc(g.near) : ""}<br>${dim(esc(g.source) + " · click: NED")}`;
let last = null;
v.hover(cores, hit => { last = gals[Math.floor((hit && hit.index) / 3)]; return last ? tip(last) : ""; }, {click: () => last && window.open(ned(last))});
const named = new Set(["Milky Way", "Andromeda (M31)", "Triangulum", "LMC", "SMC", "M32", "NGC205", "NGC185", "NGC147", "IC10", "NGC6822", "IC1613", "WLM", "SagittariusdSph", "Fornax", "LeoI", "Leo1", "Sculptor", "Draco", "UrsaMinor", "Carina", "Sextans(1)", "LeoA", "Phoenix", "Tucana", "NGC3109", "SextansA", "SextansB", "AntliaB", "Antlia", "LeoT", "Crater2"]);
const pretty = n => n.replace("SagittariusdSph", "Sagittarius dSph").replace("LMC", "Large Magellanic Cloud").replace("SMC", "Small Magellanic Cloud").replace(/^Leo1$/, "Leo I").replace("Sextans(1)", "Sextans").replace("UrsaMinor", "Ursa Minor").replace("Crater2", "Crater II").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^(NGC|IC)(\d)/, "$1 $2").replace("Triangulum", "Triangulum (M33)");
for (const g of gals) if (named.has(g.name)) label(pretty(g.name), g.p, {color: g.big || g.name === "Triangulum" ? "#fde68a" : "#d4d4d8", size: g.big ? 12 : 10, weight: g.big ? 700 : 400, maxDist: g.big || g.name === "Triangulum" ? 1e4 : 60});

const bar = panel("left:8px;top:6px;max-width:72%");
const lab = document.createElement("span"); lab.textContent = "Fly to"; lab.style.cssText = "color:#a1a1aa;align-self:center;margin-right:2px"; bar.appendChild(lab);
const to = (p, d) => { userMoved = true; v.controls.autoRotate = false; flyTo(p.clone(), p.clone().add(new T.Vector3(d * 0.6, d * 0.5, d))); };
button(bar, "Milky Way", () => to(new T.Vector3(), 9));
button(bar, "Andromeda", () => to(m31.p, 9));
button(bar, "Magellanic Clouds", () => to(gals.find(g => g.name === "LMC").p, 3));
button(bar, "Whole group", () => { userMoved = true; flyTo(m31.p.clone().multiplyScalar(0.5), new T.Vector3(60, 70, 110)); });
const tog = panel("right:8px;top:6px;justify-content:flex-end;max-width:26%");
const eb = button(tog, "Distance errors", b => { show(errs, !errs.visible); pressed(b, errs.visible); v.render(); }); pressed(eb, true);
const spinB = button(tog, "Turn", b => { userMoved = !userMoved; spin(); pressed(b, !userMoved); }); pressed(spinB, true);
v.controls.addEventListener("start", () => pressed(spinB, false));
note.style.right = "150px";
note.innerHTML = `${gals.length} galaxies of McConnachie's catalogue (2021 update) within about 3 Mpc, to scale; glow by V luminosity. Pink lines: each distance's error, all along our line of sight. The discs show where the two spirals lie, not their real look; M31's tilt is schematic.`;
v.camera.near = 0.05; v.camera.far = 5000; v.camera.updateProjectionMatrix();
v.controls.target.copy(m31.p.clone().multiplyScalar(0.45)); v.camera.position.set(72, 70, 120);
starfield(1200); v.controls.maxDistance = 900; v.controls.update();
spin(); drawLabels();
setTimeout(measure, 1200);
return v.el;