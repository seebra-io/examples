// The local universe around the Milky Way, out to ~80 Mpc: the 869 galaxies
// of the Updated Nearby Galaxy Catalog (individual distances, within ~11 Mpc;
// data[0]) glowing by their K-band luminosity, then the 2MASS Redshift
// Survey's galaxies (data[1]) placed by velocity / H0, fainter, with the named
// landmarks (data[2].landmarks). A logarithmic radius by default (each ring
// ten times farther), or linear. Galactic frame (the Milky Way's disc as the
// floor: the empty wedge is the Zone of Avoidance) or supergalactic (the Local
// Sheet and the Supergalactic Plane as the floor). Hover a galaxy for its
// distance, method and error; click it for NED.
// data: [UNGC rows, 2MRS rows, local-universe.json]
const PICK = 0.35;
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
const [ungc, tmrs, U] = data, rad = d => d * Math.PI / 180;
const unit = (l, b) => [Math.cos(rad(b)) * Math.cos(rad(l)), Math.cos(rad(b)) * Math.sin(rad(l)), Math.sin(rad(b))];
// the supergalactic frame (de Vaucouleurs; Lahav et al. 2000): its pole at l = 47.37°, b = 6.32°, zero longitude at l = 137.37°, b = 0
const SGZ = unit(47.37, 6.32), SGX = unit(137.37, 0), SGY = [SGZ[1] * SGX[2] - SGZ[2] * SGX[1], SGZ[2] * SGX[0] - SGZ[0] * SGX[2], SGZ[0] * SGX[1] - SGZ[1] * SGX[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
let frame = "galactic", scale = "log";
// a radius in Mpc on the scale: log (0.2 Mpc in, each factor of ten 26 units) or linear (1 Mpc = 0.85 units)
const R = d => scale === "log" ? 26 * Math.log10(1 + d / 0.2) : d * 0.85;
// Galactic unit vector to the scene: galactic (centre at -z, rotation +x, north up) or supergalactic (SGZ up)
const orient = u => frame === "galactic" ? [u[1], u[2], -u[0]] : [dot(u, SGX), dot(u, SGZ), -dot(u, SGY)];
const place = (u, d, out) => { const o = orient(u), r = R(d); out[0] = o[0] * r; out[1] = o[1] * r; out[2] = o[2] * r; return out; };

const near = (Array.isArray(ungc) ? ungc : []).filter(g => g.dist_mpc != null).map(g => ({...g, u: unit(g.l, g.b)}));
const far = (Array.isArray(tmrs) ? tmrs : []).filter(g => g.dist_mpc > 11).map(g => ({...g, u: unit(g.l, g.b)}));
const typeCol = t => t == null ? rgb(0xd4d4d8) : t <= -1 ? rgb(0xffb36b) : t <= 3 ? rgb(0xffe2a8) : t <= 7 ? rgb(0xd6e4ff) : rgb(0x8fb8ff);
// glowing UNGC galaxies: core + halo, by log K-band luminosity (a stellar-mass proxy)
const sz = g => Math.max(0, (g.log_lk ?? 7) - 5.5);
const nearPts = glowPoints(near.length * 2, i => {
  const g = near[i >> 1], k = i & 1, s = sz(g), c = typeCol(g.morph_t), b = (k ? 0.4 : 1) * (0.45 + s / 5);
  const p = place(g.u, g.dist_mpc, [0, 0, 0]);
  return [p[0], p[1], p[2], k ? 0.35 + s * 0.3 : 0.1 + s * 0.06, c[0] * b, c[1] * b, c[2] * b];
}, {opacity: 1, maxPx: 70, hard: 0.6, order: 4});
const farPts = glowPoints(far.length, i => {
  const g = far[i], c = mix(typeCol(g.morph_t), rgb(0xa5b4fc), 0.4), b = 0.32 + Math.max(0, 11.75 - (g.ks ?? 11.75)) * 0.09, p = place(g.u, g.dist_mpc, [0, 0, 0]);
  return [p[0], p[1], p[2], 0.55, c[0] * b, c[1] * b, c[2] * b];
}, {opacity: 1, maxPx: 16, hard: 0.45, order: 3});
// the Milky Way at the centre
const mw = glowPoints(3, i => [0, 0, 0, [0.6, 1.8, 4.5][i], ...rgb([0xffffff, 0xffe7b8, 0xffb36b][i]).map(c => c * [1, 0.6, 0.18][i])], {opacity: 1, maxPx: 200, hard: 0.6, order: 6});
v.hover(mw, `<b>The Milky Way</b> · we look out from inside its disc<br>${dim("the centre of this view; distances are from the Sun")}`);

// rings: 0.1, 1, 10, 30, 80 Mpc in the floor, relabelled on a change of scale
const ringObjs = [];
for (const d of [0.1, 1, 3, 10, 30, 80]) {
  const ln = new T.Line(new T.BufferGeometry().setFromPoints(d3.range(0, 361, 2).map(() => new T.Vector3())), new T.LineDashedMaterial({color: d === 10 ? 0x52525b : 0x3f3f46, dashSize: 0.4, gapSize: 0.5, transparent: true, opacity: 0.8, depthWrite: false}));
  v.scene.add(ln);
  const lb = label(`${d} Mpc · ${d * 3.2616 < 10 ? fmt(d * 3.2616, 1) : fmt(d * 3.2616)} Mly`, new T.Vector3(), {color: "#71717a", size: 10});
  ringObjs.push({d, ln, lb});
}
// the Zone of Avoidance: |b| < 5° (2MRS's cut), drawn as the two cones b = ±5°
const zoa = [];
for (const sgn of [-1, 1]) for (const d of [10, 80]) {
  const ln = new T.LineLoop(new T.BufferGeometry().setFromPoints(d3.range(0, 360, 3).map(() => new T.Vector3())), new T.LineBasicMaterial({color: 0xb91c1c, transparent: true, opacity: 0.28, depthWrite: false}));
  ln.userData = {sgn, d}; v.scene.add(ln); zoa.push(ln);
  v.hover(ln, `<b>The Zone of Avoidance</b> · |b| < 5° (8° toward the bulge)<br>the Milky Way's own dust and stars hide the galaxies behind its plane: 2MRS leaves it out,<br>so this wedge is empty by selection, not by nature (the Norma Cluster sits at its edge)<br>${dim("Huchra et al. 2012; Kraan-Korteweg et al. 1996")}`);
}
const zl = label("Zone of Avoidance (behind the Milky Way's plane)", new T.Vector3(), {color: "#f87171", size: 10});

// landmarks
const marks = (U && U.landmarks || []).map(m => ({...m, u: unit(m.l, m.b)}));
const markObjs = marks.map(m => {
  const g = glowPoints(2, i => [0, 0, 0, [0.5, 2.2][i], ...rgb(m.kind === "void" ? 0x64748b : 0xfde68a).map(c => c * [0.9, 0.25][i])], {opacity: 1, maxPx: 120, hard: 0.4, order: 7});
  v.hover(g, `<b>${esc(m.name)}</b><br>${m.dist_mpc} Mpc${m.err_mpc ? " ± " + m.err_mpc : ""} (${fmt(m.dist_mpc * 3.2616)} Mly) · l ${m.l}°, b ${m.b}°<br>${esc(m.method)}${m.fact ? "<br>" + esc(m.fact) : ""}<br>${dim(esc(m.source) + " · click: the paper")}`, {click: () => window.open(m.url)});
  const lb = label(m.name, new T.Vector3(), {color: m.kind === "void" ? "#94a3b8" : "#fde68a", size: 11, weight: 600});
  // an arrow for directions (the void, Laniakea's core)
  const arrow = m.kind === "void" || m.kind === "supercluster" ? new T.ArrowHelper(new T.Vector3(1, 0, 0), new T.Vector3(), 1, m.kind === "void" ? 0x64748b : 0xfbbf24, 2, 1) : null;
  if (arrow) v.scene.add(arrow);
  return {m, g, lb, arrow};
});

// named galaxies to label
const famous = new Set(["MESSIER031", "MESSIER033", "LMC", "SMC", "NGC5128", "MESSIER081", "MESSIER082", "MESSIER101", "NGC0253", "MESSIER083", "NGC4945", "Maffei 1", "Maffei 2", "IC0342", "NGC0300", "NGC0055", "MESSIER051", "MESSIER094", "NGC6946", "MESSIER064", "MESSIER106", "Circinus"]);
const pretty = n => String(n).replace(/^MESSIER0*(\d+)/, "M$1").replace(/^NGC0*(\d+)/, "NGC $1").replace(/^IC0*(\d+)/, "IC $1").replace("NGC 5128", "Centaurus A (NGC 5128)").replace(/^M31$/, "Andromeda (M31)").replace(/^M33$/, "Triangulum (M33)");
const nameLabels = near.filter(g => famous.has(g.name)).map(g => ({g, lb: label(pretty(g.name), new T.Vector3(), {color: "#e4e4e7", size: 10})}));

// put everything where the frame and scale say
const layout = () => {
  const a = nearPts.geometry.attributes.position, b = farPts.geometry.attributes.position, p = [0, 0, 0];
  near.forEach((g, i) => { place(g.u, g.dist_mpc, p); a.setXYZ(2 * i, ...p); a.setXYZ(2 * i + 1, ...p); });
  far.forEach((g, i) => { place(g.u, g.dist_mpc, p); b.setXYZ(i, ...p); });
  a.needsUpdate = b.needsUpdate = true;
  for (const r of ringObjs) { const q = r.ln.geometry.attributes.position, rr = R(r.d); for (let k = 0; k < q.count; k++) q.setXYZ(k, rr * Math.cos(rad(k * 2)), 0, rr * Math.sin(rad(k * 2))); q.needsUpdate = true; r.ln.computeLineDistances(); r.lb.pos = new T.Vector3(rr * Math.cos(rad(-60)), 0, rr * Math.sin(rad(-60))); }
  for (const z of zoa) { const q = z.geometry.attributes.position; for (let k = 0; k < q.count; k++) { place(unit(k * 3, 5 * z.userData.sgn), z.userData.d, p); q.setXYZ(k, ...p); } q.needsUpdate = true; z.geometry.computeBoundingSphere(); }
  zl.pos = new T.Vector3(...place(unit(300, 0), 30, [0, 0, 0]));
  for (const o of markObjs) {
    place(o.m.u, o.m.dist_mpc, p); const q = o.g.geometry.attributes.position; q.setXYZ(0, ...p); q.setXYZ(1, ...p); q.needsUpdate = true; o.g.geometry.computeBoundingSphere();
    o.lb.pos = new T.Vector3(...p);
    if (o.arrow) { const d = new T.Vector3(...p); const len = d.length(); o.arrow.setDirection(d.clone().normalize()); o.arrow.setLength(len, Math.min(4, len * 0.08), Math.min(2, len * 0.04)); }
  }
  for (const n of nameLabels) { place(n.g.u, n.g.dist_mpc, p); n.lb.pos = new T.Vector3(...p); }
  nearPts.geometry.computeBoundingSphere(); farPts.geometry.computeBoundingSphere();
  drawLabels(); v.render();
};

const tipNear = g => `<b>${esc(pretty(g.name))}</b> · ${esc(g.type)}<br>${fmt(g.dist_mpc, 2)} Mpc${g.err_mpc ? " ± " + fmt(g.err_mpc, 2) : ""} (${fmt(g.dist_mpc * 3.2616, 1)} Mly)` +
  `<br>distance by ${esc(g.method_name)} · typical error ${esc(g.typical_error)}${g.method === "h" || g.method === "h'" ? dim(" · a velocity, not a measured distance") : ""}` +
  `${g.log_lk != null ? `<br>K-band luminosity 10^${g.log_lk} Suns` : ""}${g.v_lg != null ? ` · V_LG ${fmt(g.v_lg)} km/s` : ""}${g.main_neighbour ? `<br>its main neighbour: ${esc(pretty(g.main_neighbour))}` : ""}` +
  `<br>${dim("UNGC (Karachentsev et al. 2013) via HEASARC · click: NED")}`;
const tipFar = g => `<b>${esc(g.name)}</b> ${dim(esc(g.id_2mass))}<br>cz = ${fmt(g.cz_kms)} km/s → ${fmt(g.dist_mpc, 1)} Mpc at H0 = 73 (${fmt(g.dist_mpc * 3.2616)} Mly)` +
  `<br>${dim("a redshift distance: peculiar velocities of a few hundred km/s move it by several Mpc (Virgo's members smear along the line of sight)")}<br>Ks = ${fmt(g.ks, 2)} · ${dim("2MASS Redshift Survey (Huchra et al. 2012) via HEASARC · click: NED")}`;
let last = null;
v.hover(nearPts, hit => { last = near[(hit && hit.index) >> 1]; return last ? tipNear(last) : ""; }, {click: () => last && window.open(last.ned)});
v.hover(farPts, hit => { last = far[hit && hit.index]; return last ? tipFar(last) : ""; }, {click: () => last && window.open(last.ned)});

// controls
const bar = panel("left:8px;top:6px;max-width:70%");
const lab = document.createElement("span"); lab.textContent = "Fly to"; lab.style.cssText = "color:#a1a1aa;align-self:center;margin-right:2px"; bar.appendChild(lab);
const fly = (u, d, back) => { userMoved = true; v.controls.autoRotate = false; const p = new T.Vector3(...place(u, d, [0, 0, 0])); const off = p.clone().normalize().multiplyScalar(back).add(new T.Vector3(0, back * 0.5, 0)); flyTo(p, p.clone().add(off).add(new T.Vector3(back * 0.4, 0, 0))); };
button(bar, "Milky Way", () => { userMoved = true; flyTo(new T.Vector3(), new T.Vector3(10, 8, 14)); });
const g31 = near.find(g => g.name === "MESSIER031"); if (g31) button(bar, "Andromeda", () => fly(g31.u, g31.dist_mpc, 6));
const cenA = near.find(g => g.name === "NGC5128"); if (cenA) button(bar, "Centaurus A", () => fly(cenA.u, cenA.dist_mpc, 8));
for (const m of marks.filter(m => m.kind === "cluster").slice(0, 3)) button(bar, m.name.split(" (")[0].replace(" Cluster", ""), () => fly(m.u, m.dist_mpc, 14));
button(bar, "Everything", () => { userMoved = true; flyTo(new T.Vector3(), new T.Vector3(70, 60, 100)); });
const tog = panel("right:8px;top:6px;justify-content:flex-end;max-width:30%");
const lb2 = button(tog, "Log", b => { scale = "log"; pressed(lb2, true); pressed(lin, false); layout(); });
const lin = button(tog, "Linear", b => { scale = "linear"; pressed(lb2, false); pressed(lin, true); layout(); });
const gb = button(tog, "Galactic", () => { frame = "galactic"; pressed(gb, true); pressed(sgb, false); layout(); }, "The Milky Way's disc as the floor");
const sgb = button(tog, "Supergalactic", () => { frame = "supergalactic"; pressed(gb, false); pressed(sgb, true); layout(); }, "The Supergalactic Plane (the Local Sheet, Virgo) as the floor");
pressed(lb2, true); pressed(gb, true);
const spinB = button(tog, "Turn", b => { userMoved = !userMoved; spin(); pressed(b, !userMoved); }); pressed(spinB, true);
v.controls.addEventListener("start", () => pressed(spinB, false));
note.style.right = "150px";
note.innerHTML = `Bright: ${near.length} UNGC galaxies with their own distances (TRGB, Cepheids, Tully–Fisher…; errors 5% to 25%+). Faint: ${far.length.toLocaleString()} 2MRS galaxies beyond 11 Mpc at velocity / H0, a redshift distance. ` +
  `The empty wedge is the Zone of Avoidance. Radius ${"log"}: each ring 10× farther.`;
const setNote = () => { note.innerHTML = note.innerHTML.replace(/Radius .*$/, scale === "log" ? "Radius log: equal steps are equal factors." : "Radius linear: the near galaxies crowd the centre."); };
lb2.addEventListener("click", setNote); lin.addEventListener("click", setNote);

v.camera.near = 0.01; v.camera.far = 5000; v.camera.updateProjectionMatrix();
v.controls.target.set(0, 0, 0); v.camera.position.set(52, 44, 78);
starfield(900); v.controls.maxDistance = 600; v.controls.update();
layout(); spin();
setTimeout(measure, 1200);
return v.el;