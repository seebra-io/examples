// The Milky Way in 3D, 1 scene unit = 1 kpc, the Galactic centre at the origin,
// the disc in the floor, the Sun at R0 from it. The arms are the log-periodic
// spirals Reid et al. (2019) fitted to maser parallaxes (data[0].arms): bright
// where the masers are (each arm's measured azimuth range), fainter where
// the fit is carried on by us (extrapolated). The bar, bulge, disc, gas and dust
// are drawn from published scale lengths and angles (data[0].galaxy): a
// picture, not a map. The objects are real (data[0].objects), at their
// measured distances. Hover anything for what it is and where the number
// comes from; the buttons fly the camera.
// data: [milky-way.json]
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
const mw = data[0] || data;
const G = mw.galaxy, R0 = G.R0_kpc, ZSUN = G.z_sun_pc / 1000, rad = d => d * Math.PI / 180;
// Galactic (l, b, distance) to the scene: the Sun at (0, z_sun, R0), l = 0 toward
// the centre (-z), l = 90 the direction of rotation (+x), b up
const fromSun = (l, b, kpc) => new T.Vector3(kpc * Math.cos(rad(b)) * Math.sin(rad(l)), ZSUN + kpc * Math.sin(rad(b)), R0 - kpc * Math.cos(rad(b)) * Math.cos(rad(l)));
const SUN = new T.Vector3(0, ZSUN, R0);
// Reid 2019: ln(R / R_kink) = -(beta - beta_kink) tan(psi); beta = 0 toward the Sun,
// growing with rotation; x = R sin(beta), y (toward the Sun) = R cos(beta)
const armR = (a, beta) => a.R_kink * Math.exp(-rad(beta - a.beta_kink) * Math.tan(rad(beta < a.beta_kink ? a.psi_lt : a.psi_gt)));
const armXY = (R, beta) => [R * Math.sin(rad(beta)), R * Math.cos(rad(beta))];
const width = (a, R) => Math.max(0.1, a.width_kpc + G.arm_width_slope_pc_per_kpc / 1000 * (R - a.R_kink));
const sigmaZ = R => (G.arm_sigma_z_pc + Math.max(0, R - 7) * G.arm_sigma_z_slope_pc_per_kpc) / 1000;
const EXT = G.extrapolate_deg;
// each arm's span: measured (Reid's beta range), then carried on both ways
const spans = mw.arms.map(a => {
  let lo = a.beta_min, hi = a.beta_max;
  for (let b = a.beta_min; b > a.beta_min - EXT && armR(a, b) < G.disc_edge_kpc && armR(a, b) > 2.6; b--) lo = b;
  for (let b = a.beta_max; b < a.beta_max + EXT && armR(a, b) > 2.6 && armR(a, b) < G.disc_edge_kpc; b++) hi = b;
  return {a, lo, hi, measured: a.beta_max - a.beta_min, total: hi - lo};
});
const totalSpan = d3.sum(spans, s => s.total * (s.a.R_kink + 4));
const pickSpan = () => { let x = rnd() * totalSpan; for (const s of spans) { x -= s.total * (s.a.R_kink + 4); if (x <= 0) return s; } return spans[spans.length - 1]; };

const C = {young: rgb(0xbcd4ff), white: rgb(0xfff4e8), warm: rgb(0xffd9a8), gold: rgb(0xffb347), ember: rgb(0xff8a4c), pink: rgb(0xff5d8f), haze: rgb(0x6d7cff), dust: [0.03, 0.02, 0.015]};
const groups = {measured: [], model: []};

// 1. arm stars: young and blue-white, gathered on the arms, wider with radius
const NARM = Math.round(48000 * DETAIL);
const armSamples = [];
for (let i = 0; i < NARM; i++) {
  const s = pickSpan(), a = s.a, beta = s.lo + rnd() * (s.hi - s.lo), R = armR(a, beta);
  const w = width(a, R), off = gauss() * w * 1.1, [x, y] = armXY(R + off, beta + gauss() * 1.2);
  const measured = beta >= a.beta_min && beta <= a.beta_max;
  armSamples.push({x, y: gauss() * sigmaZ(R), z: y, measured, a, R, beta});
}
const armLayer = (measured) => {
  const xs = armSamples.filter(s => s.measured === measured);
  return glowPoints(xs.length, i => {
    const s = xs[i], t = rnd(), c = t < 0.7 ? mix(C.young, C.white, rnd() * 0.6) : t < 0.93 ? C.white : C.warm;
    const k = (measured ? 0.7 : 0.45) * (0.5 + rnd() * 0.5);
    return [s.x, s.y, s.z, 0.05 + rnd() * 0.1, c[0] * k, c[1] * k, c[2] * k];
  }, {opacity: 0.9, maxPx: 6, order: 2});
};
groups.measured.push(armLayer(true));
groups.model.push(armLayer(false));

// 2. the disc: an exponential disc (scale length, thin and thick scale heights)
const NDISC = Math.round(42000 * DETAIL);
glowPoints(NDISC, () => {
  let R; do { R = -G.disc_scale_length_kpc * Math.log(rnd() * rnd()); } while (R > G.disc_edge_kpc || R < 0.4);
  const th = rnd() * 2 * Math.PI, hz = rnd() < 0.9 ? G.thin_scale_height_kpc : G.thick_scale_height_kpc;
  const z = -hz * Math.log(rnd()) * (rnd() < 0.5 ? -1 : 1), c = mix(C.warm, C.white, rnd());
  const k = 0.3 + 0.55 * Math.exp(-R / 4);
  return [R * Math.cos(th), z * 0.6, R * Math.sin(th), 0.05 + rnd() * 0.07, c[0] * k, c[1] * k, c[2] * k];
}, {opacity: 0.85, maxPx: 5, order: 1});

// 3. the bar and the bulge: old, yellow-orange stars; the near end of the bar at positive l
const ang = rad(G.bar_angle_deg), ca = Math.cos(ang), sa = Math.sin(ang);
const NBAR = Math.round(30000 * DETAIL);
glowPoints(NBAR, i => {
  let x, y, z;
  if (i % 3 === 0) { const r = Math.abs(gauss()) * G.bulge_sigma_kpc; const u = rnd() * 2 - 1, th = rnd() * 2 * Math.PI, s = Math.sqrt(1 - u * u); x = r * s * Math.cos(th) * 1.3; z = r * s * Math.sin(th); y = r * u * 0.75; }
  else { const along = gauss() * G.bar_half_length_kpc * 0.42; x = 0; z = along; y = gauss() * G.bar_sigma_z_kpc; x = gauss() * G.bar_sigma_width_kpc * (1 - Math.min(0.7, Math.abs(along) / G.bar_half_length_kpc * 0.6)); }
  // the bar's long axis points toward the Sun's side, turned bar_angle toward +x (positive l)
  const X = x * ca + z * sa, Z = -x * sa + z * ca;
  const r0 = Math.hypot(X, y, Z), c = mix(C.gold, C.white, Math.exp(-r0 / 0.6) * 0.8);
  const k = 0.6 + 0.4 * Math.exp(-r0 / 1.5);
  return [X, y, Z, 0.07 + rnd() * 0.12, c[0] * k, c[1] * k, c[2] * k];
}, {opacity: 0.9, maxPx: 7, order: 4});

// 4. glowing centre: a few large soft layers, white inside to orange outside
const core = glowPoints(5, i => {
  const s = [0.7, 1.6, 3.4, 6.5, 11][i], c = [rgb(0xffffff), rgb(0xfff1d6), rgb(0xffc46b), rgb(0xff9a3c), rgb(0xff7a2a)][i], k = [1, 0.9, 0.6, 0.32, 0.15][i];
  return [0, 0, 0, s, c[0] * k, c[1] * k, c[2] * k];
}, {opacity: 1, maxPx: 900, hard: 0, order: 6});

// 5. star-forming regions (H II): pink beads on the arms' crests
const NHII = Math.round(1800 * DETAIL);
const hii = [];
for (let i = 0; i < NHII; i++) {
  const s = pickSpan(), a = s.a, beta = s.lo + rnd() * (s.hi - s.lo), R = armR(a, beta), [x, y] = armXY(R + gauss() * width(a, R) * 0.35, beta);
  hii.push({x, y: gauss() * 0.03, z: y, measured: beta >= a.beta_min && beta <= a.beta_max});
}
for (const m of [true, false]) {
  const xs = hii.filter(h => h.measured === m);
  (m ? groups.measured : groups.model).push(glowPoints(xs.length, i => {
    const h = xs[i], c = rnd() < 0.8 ? C.pink : C.young, k = (m ? 0.55 : 0.35) * (0.4 + rnd() * 0.6);
    return [h.x, h.y, h.z, 0.12 + rnd() * 0.3, c[0] * k, c[1] * k, c[2] * k];
  }, {opacity: 0.8, maxPx: 40, hard: 0.1, order: 5}));
}

// 6. gas haze: big faint clouds over the disc, denser on the arms
const NGAS = Math.round(1600 * DETAIL);
glowPoints(NGAS, i => {
  let x, z;
  if (i % 2) { const s = pickSpan(), a = s.a, beta = s.lo + rnd() * (s.hi - s.lo), R = armR(a, beta); [x, z] = armXY(R + gauss() * width(a, R), beta); }
  else { const R = Math.min(12.5, -3.2 * Math.log(rnd() * rnd())), th = rnd() * 2 * Math.PI; x = R * Math.cos(th); z = R * Math.sin(th); }
  const r = Math.hypot(x, z), c = rnd() < 0.5 ? C.haze : rnd() < 0.5 ? C.pink : C.warm, k = (0.05 + rnd() * 0.05) * Math.min(1, 1.6 * Math.exp(-r / 9));
  return [x, gauss() * 0.08, z, 1.2 + rnd() * 1.8, c[0] * k, c[1] * k, c[2] * k];
}, {opacity: 1, maxPx: 200, hard: 0, order: 5});

// 7. dust lanes: dark clouds along each arm's inner edge (toward the centre),
// laid over the light (normal blending), so the arms get their dark lanes
const NDUST = Math.round(14000 * DETAIL);
glowPoints(NDUST, () => {
  let s, a, beta, R; do { s = pickSpan(); a = s.a; beta = s.lo + rnd() * (s.hi - s.lo); R = armR(a, beta); } while (R < 3.6);
  const w = width(a, R);
  const [x, z] = armXY(R - w * (0.5 + 0.35 * gauss()), beta + gauss() * 0.3);
  return [x, gauss() * 0.04, z, 0.12 + rnd() * 0.22, C.dust[0], C.dust[1], C.dust[2]];
}, {opacity: 0.3, maxPx: 22, hard: 0, dark: true, order: 2.5});

// 8. a starfield far behind, for depth
starfield(220, 5000);

// arm centrelines: faint where measured, dotted where carried on; hover one
const armTip = (a, measured) => () => `<b>${esc(a.name)} arm</b> ${dim(measured ? "· where masers were measured" : "· extrapolated by us beyond the fit")}<br>` +
  `log-periodic spiral: kink at R = ${a.R_kink} kpc, β = ${a.beta_kink}°; pitch ${a.psi_lt}° inside, ${a.psi_gt}° outside the kink<br>` +
  `width at the kink ${a.width_kpc} kpc · measured over β ${a.beta_min}° to ${a.beta_max}°<br>${dim("Reid et al. 2019, ApJ 885, 131, Table 2 · " + esc(a.note || ""))}`;
for (const s of spans) {
  const a = s.a, line = (lo, hi, measured) => {
    const pts = d3.range(lo, hi + 0.5, 1).map(b => { const R = armR(a, b), [x, z] = armXY(R, b); return new T.Vector3(x, 0.02, z); });
    if (pts.length < 2) return;
    const m = measured ? new T.LineBasicMaterial({color: new T.Color(a.color), transparent: true, opacity: 0.45, depthWrite: false})
      : new T.LineDashedMaterial({color: new T.Color(a.color), transparent: true, opacity: 0.3, dashSize: 0.25, gapSize: 0.25, depthWrite: false});
    const ln = new T.Line(new T.BufferGeometry().setFromPoints(pts), m);
    if (!measured) ln.computeLineDistances();
    ln.renderOrder = 9;
    v.scene.add(ln);
    v.hover(ln, armTip(a, measured));
    (measured ? groups.measured : groups.model).push(ln);
    return pts;
  };
  const mid = line(a.beta_min, a.beta_max, true);
  line(s.lo, a.beta_min, false); line(a.beta_max, s.hi, false);
  if (mid) label(a.name, mid[Math.floor(mid.length * 0.62)], {color: a.color, size: 11, weight: 600, maxDist: 70});
}

// rings around the centre every 5 kpc, and the Sun's circle
for (const r of [5, 10, 15]) {
  const ring = new T.Line(new T.BufferGeometry().setFromPoints(d3.range(0, 361, 2).map(k => new T.Vector3(r * Math.cos(rad(k)), 0, r * Math.sin(rad(k))))),
    new T.LineDashedMaterial({color: 0x3f3f46, dashSize: 0.3, gapSize: 0.5, transparent: true, opacity: 0.6, depthWrite: false}));
  ring.computeLineDistances(); v.scene.add(ring);
  label(`${r} kpc · ${fmt(r * 3.2616, 1)} thousand ly`, new T.Vector3(r * Math.cos(rad(-60)), 0, r * Math.sin(rad(-60))), {color: "#71717a", size: 10, maxDist: 60});
}
const toSun = new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(0, 0, 0), SUN]), new T.LineDashedMaterial({color: 0xfde68a, dashSize: 0.2, gapSize: 0.2, transparent: true, opacity: 0.5}));
toSun.computeLineDistances(); v.scene.add(toSun);
v.hover(toSun, `<b>The Sun to the Galactic centre: ${R0} kpc</b> (${fmt(R0 * 3261.6)} ly)<br>GRAVITY Collaboration 2019 (A&A 625, L10), from the star S2's orbit around Sgr A*<br>${dim("GRAVITY 2021 gives " + G.R0_2021_kpc + " kpc; Reid 2019's masers 8.15 ± 0.15 kpc. The arms are drawn in Reid's frame; the 0.03 kpc difference is a tenth of an arm's width.")}`);

// the Sun: a small bright star with a halo, and a ring so it can be found
const sun = glowPoints(3, i => [SUN.x, SUN.y, SUN.z, [0.08, 0.3, 0.9][i], ...[rgb(0xffffff), rgb(0xffe58a), rgb(0xffc94a)][i].map(c => c * [1, 0.9, 0.35][i])], {opacity: 1, maxPx: 120, hard: 0.6, order: 12});
const sunRing = new T.Mesh(new T.RingGeometry(0.42, 0.47, 64), new T.MeshBasicMaterial({color: 0xfde047, transparent: true, opacity: 0.75, side: T.DoubleSide, depthWrite: false}));
sunRing.rotation.x = -Math.PI / 2; sunRing.position.copy(SUN); sunRing.renderOrder = 13; v.scene.add(sunRing);
v.hover(sunRing, `<b>The Sun</b> · you are here<br>${R0} kpc from the centre (GRAVITY 2019), ${G.z_sun_pc} pc above the disc's mid-plane (Bennett & Bovy 2019)<br>between the Sagittarius–Carina and Perseus arms, at the inner edge of the Local arm<br>${dim("orbits the centre in about 230 million years · next: the slide “The Sun's neighbourhood”")}`);
label("● Sun", SUN, {color: "#fde047", size: 12, weight: 700});

// real objects at their measured distances (data[0].objects); click: SIMBAD
const kinds = {"black hole": 0xffffff, nebula: 0xff6fa5, "open cluster": 0x9cc8ff, "globular cluster": 0xffd27a, "supernova remnant": 0x7dd3fc, "X-ray binary": 0xc4b5fd, "star cluster": 0x9cc8ff};
const objs = mw.objects.filter(o => o.dist_pc);
for (const o of objs) {
  const p = o.name === "Sgr A*" ? new T.Vector3(0, 0, 0) : fromSun(o.l, o.b, o.dist_pc / 1000), c = rgb(kinds[o.kind] || 0xe4e4e7);
  const pt = glowPoints(2, i => [p.x, p.y, p.z, [0.06, 0.22][i], c[0] * [1, 0.6][i], c[1] * [1, 0.6][i], c[2] * [1, 0.6][i]], {opacity: 1, maxPx: 40, hard: 0.8, order: 11});
  const hit = new T.Mesh(new T.SphereGeometry(o.name === "Sgr A*" ? 0.35 : 0.18, 12, 8), new T.MeshBasicMaterial({visible: false}));
  hit.position.copy(p); v.scene.add(hit);
  v.hover(hit, () => `<b>${esc(o.name)}</b> · ${esc(o.kind)}<br>${fmt(o.dist_pc)} pc${o.dist_err_pc ? " ± " + fmt(o.dist_err_pc) : ""} from the Sun (${fmt(o.dist_pc * 3.2616)} ly) · l ${fmt(o.l, 2)}°, b ${fmt(o.b, 2)}°<br>` +
    `${esc(o.method || "")}${o.fact ? "<br>" + esc(o.fact) : ""}<br>${dim("source: " + esc(o.source) + " · click: SIMBAD")}`, {click: () => window.open(`https://simbad.cds.unistra.fr/simbad/sim-id?Ident=${encodeURIComponent(o.simbad || o.name)}`)});
  label(o.name, p, {color: "#" + new T.Color(...c).getHexString(), size: 10, maxDist: o.name === "Sgr A*" ? 80 : 18});
}
const tipCore = `<b>The Galactic centre</b><br>the bar (half-length ${G.bar_half_length_kpc} kpc, ${G.bar_angle_deg}° from the Sun–centre line, near end at positive l) and the boxy bulge<br>${dim("Bland-Hawthorn & Gerhard 2016, ARA&A 54, 529 · drawn as a particle model, not as measured stars")}`;
v.hover(core, tipCore);

// ---- views
const views = {
  "Above": [new T.Vector3(0, 0, 0), new T.Vector3(0.01, 29, 3)],
  "Tilted": [new T.Vector3(0, -1.2, 1.5), new T.Vector3(12, 10.5, 19)],
  "Edge-on": [new T.Vector3(0, 0, 0), new T.Vector3(31, 1.2, 8)],
  "Sun": [SUN.clone(), SUN.clone().add(new T.Vector3(2.2, 2.4, 3.6))],
  "Sgr A*": [new T.Vector3(0, 0, 0), new T.Vector3(1.2, 1.4, 2.6)],
  "Orion Nebula": [fromSun(209.01, -19.38, 0.414), SUN.clone().add(new T.Vector3(-1.1, 0.7, 1.5))],
};
const bar = panel("left:8px;top:6px;max-width:70%");
const lab = document.createElement("span"); lab.textContent = "Fly to"; lab.style.cssText = "color:#a1a1aa;align-self:center;margin-right:2px"; bar.appendChild(lab);
for (const [name, [t, p]] of Object.entries(views)) button(bar, name, () => { userMoved = true; v.controls.autoRotate = false; flyTo(t, p); });
const tog = panel("right:8px;top:6px;justify-content:flex-end;max-width:28%");
let modelOn = true;
const mb = button(tog, "Model beyond the masers", b => { modelOn = !modelOn; for (const o of groups.model) show(o, modelOn); pressed(b, modelOn); v.render(); },
  "Show or hide the arms where Reid's fit is carried on past the measured azimuths");
pressed(mb, true);
const spinB = button(tog, "Turn", b => { userMoved = !userMoved; spin(); pressed(b, !userMoved); }); pressed(spinB, true);
v.controls.addEventListener("start", () => pressed(spinB, false));

note.style.right = "150px";
note.innerHTML = `Arms: Reid et al. 2019 log-spiral fits to ~200 maser parallaxes, solid where measured, dashed where extrapolated. Sun at ${R0} kpc (GRAVITY 2019). ` +
  `Bar, disc, gas and dust are an artist's model from published scales. Drag to orbit, wheel to zoom, hover the arms, the Sun or an object.`;

v.camera.near = 0.01; v.camera.far = 3000; v.camera.updateProjectionMatrix();
v.controls.target.copy(views.Tilted[0]); v.camera.position.copy(views.Tilted[1]); v.controls.maxDistance = 200; v.controls.update();
spin(); drawLabels();
setTimeout(measure, 1200);
return v.el;