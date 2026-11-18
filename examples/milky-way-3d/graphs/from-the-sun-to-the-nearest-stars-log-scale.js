// From the Sun to the nearest stars on one logarithmic scale: each ring is ten
// times farther than the last, directions stay true (the ecliptic is the floor).
// Planets' orbits, the asteroid and Kuiper belts, the scattered disc, the
// heliosphere with both Voyagers where they are now, the Oort cloud (a
// hypothesis: no Oort cloud body has ever been seen there), long-period comets
// on their own orbits, and Alpha Centauri, Proxima and Barnard's Star where the
// stellar-neighbourhood slide picks them up. Hover anything for its numbers
// and their source. data[0].solar
// data: [milky-way.json]
const PICK = 0.5;
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
const S = (data[0] || data).solar, rad = d => d * Math.PI / 180, AU_LY = 63241.077;
// the log scale: 0.1 AU at the centre, 6 scene units per factor of ten
const K = 6, R_MIN = 0.1;
const logR = au => K * Math.log10(Math.max(au, R_MIN) / R_MIN);
// ecliptic x, y, z (any unit) to the scene with the radius on the log scale; the ecliptic is the floor
const place = (x, y, z) => { const r = Math.hypot(x, y, z) || 1e-9, k = logR(r) / r; return new T.Vector3(x * k, z * k, -y * k); };
const eps = rad(23.4392911);
const eclOf = (ra, dec) => { const a = rad(ra), d = rad(dec), x = Math.cos(d) * Math.cos(a), y = Math.cos(d) * Math.sin(a), z = Math.sin(d); return [x, y * Math.cos(eps) + z * Math.sin(eps), -y * Math.sin(eps) + z * Math.cos(eps)]; };
const dirAt = (ra, dec, au) => { const e = eclOf(ra, dec); return place(e[0] * au, e[1] * au, e[2] * au); };
// a point on an orbit (q, e, i, node, peri; ecliptic J2000) at true anomaly nu, in AU
const orbitAt = (o, nu) => {
  const p = o.q * (1 + o.e), r = p / (1 + o.e * Math.cos(nu)), u = rad(o.w) + nu, O = rad(o.om), i = rad(o.i);
  return [r * (Math.cos(O) * Math.cos(u) - Math.sin(O) * Math.sin(u) * Math.cos(i)), r * (Math.sin(O) * Math.cos(u) + Math.cos(O) * Math.sin(u) * Math.cos(i)), r * Math.sin(u) * Math.sin(i)];
};
const auText = au => au >= 20000 ? `${fmt(au)} AU (${fmt(au / AU_LY, au > 1e5 ? 2 : 3)} ly)` : `${fmt(au, au < 10 ? 2 : 0)} AU`;

// rings: 1, 10, 100, 1,000, 10,000, 100,000 AU and 1 light year
const ringAt = (au, color, opacity, text, dashed, at = -100) => {
  const r = logR(au), pts = d3.range(0, 361, 2).map(k => new T.Vector3(r * Math.cos(rad(k)), 0, r * Math.sin(rad(k))));
  const m = dashed ? new T.LineDashedMaterial({color, transparent: true, opacity, dashSize: 0.25, gapSize: 0.3, depthWrite: false}) : new T.LineBasicMaterial({color, transparent: true, opacity, depthWrite: false});
  const ln = new T.Line(new T.BufferGeometry().setFromPoints(pts), m); if (dashed) ln.computeLineDistances(); v.scene.add(ln);
  if (text) label(text, new T.Vector3(r * Math.cos(rad(at)), 0, r * Math.sin(rad(at))), {color: "#71717a", size: 10, dx: 4});
  return ln;
};
let ringK = 0;
for (const au of [1, 10, 100, 1000, 10000, 100000]) ringAt(au, 0x3f3f46, 0.7, `${au.toLocaleString()} AU`, true, -130 + 14 * ringK++);
ringAt(AU_LY, 0x6366f1, 0.6, "1 light year (63,241 AU)", false, -40);

// the Sun
const sunP = glowPoints(4, i => [0, 0, 0, [0.35, 0.9, 2.2, 4.5][i], ...rgb([0xffffff, 0xfff1c1, 0xffc94a, 0xff8a3c][i]).map(c => c * [1, 0.8, 0.35, 0.12][i])], {opacity: 1, maxPx: 400, hard: 0.6, order: 9});
v.hover(sunP, `<b>The Sun</b> · G2V<br>the centre of this view is 0.1 AU; each ring outward is ten times farther<br>${dim("log scale: equal steps are equal factors, so the Oort cloud gets as much room as the planets")}`);

// planets' orbits (circles at the semi-major axis; on a log scale an ellipse would be bent)
for (const p of S.planets) {
  const ln = ringAt(p.a_au, new T.Color(p.color), 0.8);
  v.hover(ln, `<b>${esc(p.name)}</b> · a = ${fmt(p.a_au, 3)} AU<br>${dim("orbit drawn as a circle at its semi-major axis · JPL approximate elements (Standish)")}`);
  label(p.name, new T.Vector3(logR(p.a_au) * Math.cos(rad(20)), 0, logR(p.a_au) * Math.sin(rad(20))), {color: p.color, size: 10});
}

// belts and clouds as particle shells: radius uniform in log(AU) between the edges
const shell = (b, n, {flat = 0.1, color, size, opacity = 1, order = 2}) => glowPoints(n, () => {
  const au = b.inner_au * Math.pow(b.outer_au / b.inner_au, rnd()), th = rnd() * 2 * Math.PI;
  const inc = flat >= 1 ? Math.asin(rnd() * 2 - 1) : gauss() * flat;
  const x = au * Math.cos(inc) * Math.cos(th), y = au * Math.cos(inc) * Math.sin(th), z = au * Math.sin(inc), p = place(x, y, z), k = 0.5 + rnd() * 0.5;
  return [p.x, p.y, p.z, size * (0.6 + rnd() * 0.8), color[0] * k, color[1] * k, color[2] * k];
}, {opacity, maxPx: 14, hard: 0.3, order});
const beltTip = b => `<b>${esc(b.name)}</b><br>${auText(b.inner_au)} to ${auText(b.outer_au)}${b.note ? "<br>" + esc(b.note) : ""}<br>${dim("source: " + esc(b.source))}`;
const belts = {};
for (const b of S.belts) {
  const st = {asteroid: {n: 3000, flat: 0.12, color: rgb(0xa1a1aa), size: 0.05}, kuiper: {n: 9000, flat: 0.12, color: rgb(0x93c5fd), size: 0.07},
    scattered: {n: 5000, flat: 0.35, color: rgb(0x818cf8), size: 0.07}, "inner oort": {n: 22000, flat: 0.45, color: rgb(0x7dd3fc), size: 0.12, opacity: 0.55},
    "outer oort": {n: 30000, flat: 1, color: rgb(0xa5b4fc), size: 0.16, opacity: 0.45}}[b.kind];
  if (!st) continue;
  const pts = shell(b, Math.round(st.n * DETAIL), st);
  belts[b.kind] = pts;
  v.hover(pts, () => beltTip(b));
  const r = logR(Math.sqrt(b.inner_au * b.outer_au));
  label(b.name, new T.Vector3(r * Math.cos(rad(60)), b.kind.includes("oort") ? 1.5 : 0.3, r * Math.sin(rad(60))), {color: "#" + new T.Color(...st.color).getHexString(), size: 11, weight: 600});
}

// the heliosphere: the termination shock and the heliopause, as glowing shells (spheres here; the real one has a tail)
const hs = S.heliosphere;
const glowShell = (au, color, opacity) => {
  const m = new T.ShaderMaterial({uniforms: {c: {value: new T.Color(color)}, o: {value: opacity}},
    vertexShader: `varying float f; void main() { vec3 n = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position, 1.0); f = 1.0 - abs(dot(n, normalize(-mv.xyz))); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 c; uniform float o; varying float f; void main() { gl_FragColor = vec4(c, pow(f, 4.0) * o); }`,
    transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide});
  const s = new T.Mesh(new T.SphereGeometry(logR(au), 64, 32), m); s.renderOrder = 5; v.scene.add(s); return s;
};
const hp = glowShell(hs.heliopause_au, 0x38bdf8, 0.3), ts = glowShell(hs.termination_shock_au, 0x22d3ee, 0.12);
v.hover(hp, `<b>The heliopause</b> · ~${hs.heliopause_au} AU toward the Voyagers<br>where the solar wind meets the interstellar medium; both Voyagers crossed it (marked ×)<br>${dim(esc(hs.note) + " · source: " + esc(hs.source))}`);
label("heliopause", new T.Vector3(0, logR(hs.heliopause_au) * 0.98, 0), {color: "#38bdf8", size: 10, dx: -30});

// Voyager 1 and 2: their path out, the crossings, and where they are today (from a dated distance and speed)
const now = Date.now(), yr = 365.25 * 864e5;
for (const c of S.voyagers) {
  const au = c.anchor_au + c.speed_au_per_yr * (now - Date.parse(c.anchor_date)) / yr, col = rgb(c.color);
  const pathPts = d3.range(0, 1.0001, 0.01).map(t => dirAt(c.ra, c.dec, 1 * Math.pow(au, t)));
  v.scene.add(new T.Line(new T.BufferGeometry().setFromPoints(pathPts), new T.LineBasicMaterial({color: new T.Color(c.color), transparent: true, opacity: 0.6})));
  const p = dirAt(c.ra, c.dec, au);
  const dot = glowPoints(2, i => [p.x, p.y, p.z, [0.12, 0.5][i], ...col.map(x => x * [1, 0.5][i])], {opacity: 1, maxPx: 40, hard: 0.8, order: 10});
  const tip = () => `<b>${esc(c.name)}</b> · about ${fmt(au, 1)} AU from the Sun today (${fmt(au / AU_LY * 365.25 * 24, 1)} light hours)<br>` +
    `crossed the termination shock ${esc(c.ts_date)} at ${c.ts_au} AU, the heliopause ${esc(c.hp_date)} at ${c.hp_au} AU<br>heading RA ${fmt(c.ra, 1)}°, Dec ${fmt(c.dec, 1)}° (${esc(c.toward)}) at ${c.speed_au_per_yr} AU a year<br>` +
    `${dim("today's distance: " + c.anchor_au + " AU on " + esc(c.anchor_date) + " plus the speed since · source: " + esc(c.source) + " · click: NASA's live status")}`;
  const hit = new T.Mesh(new T.SphereGeometry(0.35, 10, 8), new T.MeshBasicMaterial({visible: false})); hit.position.copy(p); v.scene.add(hit);
  v.hover(hit, tip, {click: () => window.open("https://science.nasa.gov/mission/voyager/where-are-voyager-1-and-voyager-2-now/")});
  label(c.name, p, {color: "#" + new T.Color(...col).getHexString(), size: 11, weight: 600});
  for (const [d, what] of [[c.ts_au, "termination shock " + c.ts_date], [c.hp_au, "heliopause " + c.hp_date]]) {
    const q = dirAt(c.ra, c.dec, d), x = label("×", q, {color: "#fafafa", size: 10, dx: -3, dy: -7});
    const h2 = new T.Mesh(new T.SphereGeometry(0.25, 8, 6), new T.MeshBasicMaterial({visible: false})); h2.position.copy(q); v.scene.add(h2);
    v.hover(h2, `<b>${esc(c.name)} crossed the ${esc(what)}</b> at ${d} AU<br>${dim(esc(c.source))}`);
  }
}

// long-period comets on their own orbits (sampled in real space, then put on the log scale)
for (const o of S.comets) {
  const col = new T.Color(o.color || 0x5eead4), nuMax = o.e < 1 ? Math.PI : Math.acos(-1 / o.e) * 0.98;
  const pts = d3.range(-1, 1.0001, 1 / 300).map(t => { const e = orbitAt(o, nuMax * Math.sign(t) * Math.pow(Math.abs(t), 0.35)); return place(...e); });
  const ln = new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({color: col, transparent: true, opacity: 0.75}));
  v.scene.add(ln);
  const tip = `<b>${esc(o.name)}</b> · ${esc(o.kind || "long-period comet")}<br>perihelion q = ${fmt(o.q, 3)} AU, e = ${fmt(o.e, 5)}${o.Q ? `, aphelion Q = ${auText(o.Q)}` : ""}${o.period_yr ? ` · period ≈ ${fmt(o.period_yr)} years` : ""}<br>` +
    `${o.fact ? esc(o.fact) + "<br>" : ""}${dim("osculating elements, epoch " + esc(o.epoch) + ": JPL Small-Body Database · click: JPL's page")}`;
  v.hover(ln, tip, {click: () => window.open(`https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${encodeURIComponent(o.sbdb || o.name)}`)});
  if (o.Q) { const a = place(...orbitAt(o, Math.PI)); label(o.short || o.name, a, {color: "#" + col.getHexString(), size: 10}); }
}

// the nearest stars, where the neighbourhood slide begins
for (const s of S.stars) {
  const p = dirAt(s.ra, s.dec, s.dist_au), col = rgb(s.color);
  const g = glowPoints(3, i => [p.x, p.y, p.z, [0.25, 0.8, 1.9][i], ...col.map(x => x * [1, 0.6, 0.2][i])], {opacity: 1, maxPx: 120, hard: 0.6, order: 10});
  v.hover(g, `<b>${esc(s.name)}</b> · ${esc(s.spect)}<br>${fmt(s.dist_ly, 4)} ly = ${fmt(s.dist_au)} AU${s.fact ? "<br>" + esc(s.fact) : ""}<br>${dim("source: " + esc(s.source) + " · next: the slide “The Sun's neighbourhood” · click: SIMBAD")}`,
    {click: () => window.open(`https://simbad.cds.unistra.fr/simbad/sim-id?Ident=${encodeURIComponent(s.simbad || s.name)}`)});
  label(s.name, p, {color: "#" + new T.Color(...col).getHexString(), size: 11, weight: 600, dy: s.name.startsWith("Proxima") ? 8 : -6});
}

// views
const bar = panel("left:8px;top:6px;max-width:72%");
const lab = document.createElement("span"); lab.textContent = "Fly to"; lab.style.cssText = "color:#a1a1aa;align-self:center;margin-right:2px"; bar.appendChild(lab);
const pv = au => logR(au);
button(bar, "Planets", () => { userMoved = true; flyTo(new T.Vector3(), new T.Vector3(0, pv(100) * 1.2, pv(100) * 1.5)); });
button(bar, "Voyagers", () => { userMoved = true; const c = S.voyagers[0], p = dirAt(c.ra, c.dec, 150); flyTo(p.clone().multiplyScalar(0.6), p.clone().multiplyScalar(1.5).add(new T.Vector3(0, 6, 0))); });
button(bar, "Oort cloud", () => { userMoved = true; flyTo(new T.Vector3(), new T.Vector3(pv(1e6) * 0.9, pv(1e6) * 0.7, pv(1e6) * 1.2)); });
button(bar, "Alpha Centauri", () => { userMoved = true; const s = S.stars[0], p = dirAt(s.ra, s.dec, s.dist_au); flyTo(p.clone().multiplyScalar(0.8), p.clone().multiplyScalar(1.25).add(new T.Vector3(0, 10, 0))); });
const tog = panel("right:8px;top:6px;justify-content:flex-end;max-width:26%");
const ob = button(tog, "Oort cloud", b => { const on = !belts["outer oort"].visible; show(belts["outer oort"], on); show(belts["inner oort"], on); pressed(b, on); v.render(); }); pressed(ob, true);
const spinB = button(tog, "Turn", b => { userMoved = !userMoved; spin(); pressed(b, !userMoved); }); pressed(spinB, true);
v.controls.addEventListener("start", () => pressed(spinB, false));

note.style.right = "150px";
note.innerHTML = `Logarithmic: each ring is 10× the last, directions are true. The Oort cloud is inferred from long-period comets' orbits and has never been observed; its edges are model ranges. Belts and clouds are particle sketches of published ranges, not observed bodies.`;

v.camera.near = 0.01; v.camera.far = 2000; v.camera.updateProjectionMatrix();
v.controls.target.set(0, 0, 0); v.camera.position.set(44, 38, 72);
starfield(700, 3000); v.controls.maxDistance = 300; v.controls.update();
spin(); drawLabels();
setTimeout(measure, 1200);
return v.el;