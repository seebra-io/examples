// Four generations of Mars rovers to scale, side by side: Sojourner (1997), Spirit and
// Opportunity (2004), Curiosity (2012) and Perseverance (2021). Simplified shapes, not
// NASA's models; the dots mark each camera, instrument and power source.
// Hover a dot for what it does, its mass and power; click it for the source.
// Hover a rover's name for the whole rover. Drag to orbit, wheel to zoom, right-drag to pan.
// data[0]: parts {rover, part, kind, role, detail, mass_kg, power_w, source, x, y, z}
// data[1]: rovers {rover, name, mission, landed, mass_kg, power_source, peak_power_w, ...}
const parts = Array.isArray(data[0]) ? data[0] : [];
const rovers = Array.isArray(data[1]) ? data[1] : [];
const R = Object.fromEntries(rovers.map(r => [r.rover, r]));
const T = THREE;
const v = scene3d(fit, { background: 0x0c0a09 });
const kinds = { camera: 0x38bdf8, science: 0xa3e635, power: 0xfbbf24, sampling: 0xf87171, comms: 0xc084fc,
  computing: 0xf472b6, thermal: 0xfb923c, mobility: 0xd4d4d8, helicopter: 0x2dd4bf };
const hex = c => "#" + c.toString(16).padStart(6, "0");
const mat = c => new T.MeshStandardMaterial({ color: c, roughness: 0.75, metalness: 0.15 });
const ALU = 0xa8a29e, DARK = 0x3f3f46, GOLD = 0xb8860b, PANEL = 0x1e3a8a, WHITE = 0xe7e5e4;
const box = (g, l, h, w, x, y, z, c) => { const m = new T.Mesh(new T.BoxGeometry(l, h, w), mat(c)); m.position.set(x, y, z); g.add(m); return m; };
const cyl = (g, r, len, x, y, z, c, axis) => {
  const m = new T.Mesh(new T.CylinderGeometry(r, r, len, 28), mat(c));
  if (axis === "z") m.rotation.x = Math.PI / 2;
  if (axis === "x") m.rotation.z = Math.PI / 2;
  m.position.set(x, y, z); g.add(m); return m;
};
const rod = (g, a, b, r, c) => {
  const A = new T.Vector3(...a), B = new T.Vector3(...b), d = B.clone().sub(A), len = d.length();
  const m = new T.Mesh(new T.CylinderGeometry(r, r, len, 10), mat(c));
  m.position.copy(A).add(B).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize());
  g.add(m); return m;
};
// six wheels on a rocker-bogie: three per side, each tied to the body
const wheels = (g, r, w, xs, z, hubY) => {
  for (const x of xs) for (const s of [1, -1]) {
    cyl(g, r, w, x, r, s * z, DARK, "z");
    rod(g, [x, r, s * (z - w / 2)], [x * 0.45, hubY, s * z * 0.62], r * 0.12, ALU);
  }
};
const msl = (g, wr, percy) => {
  wheels(g, wr, 0.4, [1.0, 0.05, -0.95], 1.15, 0.85);
  box(g, 2.0, 0.55, 1.3, 0, 0.98, 0, WHITE);                 // body (warm electronics box)
  box(g, 2.1, 0.04, 1.4, 0, 1.27, 0, ALU);                   // deck
  rod(g, [0.75, 1.27, -0.45], [0.75, 1.95, -0.45], 0.06, WHITE); // mast
  box(g, 0.35, 0.25, 0.55, 0.8, 2.05, -0.45, WHITE);          // mast head
  box(g, 0.12, 0.1, 0.3, 0.8, 1.9, -0.38, DARK);              // Mastcam pair
  rod(g, [0.75, 1.6, -0.45], [0.75, 1.6, -0.75], 0.015, ALU); // weather booms
  rod(g, [0.75, 1.6, -0.45], [1.0, 1.6, -0.45], 0.015, ALU);
  cyl(g, 0.3, 0.7, -1.3, 1.2, 0, DARK, "x");                  // MMRTG and its fins
  for (let i = 0; i < 8; i++) box(g, 0.6, 0.015, 0.75, -1.3, 1.2, 0, DARK).rotation.x = i * Math.PI / 8;
  cyl(g, 0.25, 0.04, -0.2, 1.38, -0.5, ALU).rotation.x = 0.4;  // high-gain antenna
  rod(g, [-0.6, 1.27, 0.55], [-0.6, 1.55, 0.55], 0.02, ALU);   // UHF antenna
  rod(g, [1.0, 1.05, 0.45], [1.5, 1.15, 0.25], 0.05, WHITE);   // arm
  rod(g, [1.5, 1.15, 0.25], [1.62, 0.88, 0], 0.05, WHITE);
  box(g, 0.28, 0.28, 0.4, 1.64, 0.85, 0, ALU);                 // turret
  rod(g, [1.66, 0.75, 0], [1.66, 0.6, 0], 0.025, DARK);        // drill bit
  if (percy) { // Ingenuity, dropped off beside it
    const h = new T.Group(); h.position.set(0.3, 0, 2.1); g.add(h);
    box(h, 0.14, 0.14, 0.14, 0, 0.3, 0, 0xd4d4d8);
    for (const [a, b] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) rod(h, [0.05 * a, 0.25, 0.05 * b], [0.22 * a, 0, 0.22 * b], 0.008, ALU);
    rod(h, [0, 0.37, 0], [0, 0.58, 0], 0.012, ALU);
    for (const [y, a] of [[0.45, 0.3], [0.5, -0.4]]) { // two rotors, 1.2 m across
      const b = box(h, 1.2, 0.008, 0.08, 0, y, 0, 0x52525b); b.rotation.y = a;
      const disc = cyl(h, 0.6, 0.004, 0, y, 0, 0x71717a); disc.material.transparent = true; disc.material.opacity = 0.18; }
    box(h, 0.22, 0.01, 0.14, 0, 0.59, 0, PANEL);                // solar panel
  }
};
const build = {
  sojourner(g) {
    wheels(g, 0.065, 0.05, [0.22, 0, -0.22], 0.2, 0.15);
    box(g, 0.45, 0.12, 0.3, 0, 0.17, 0, GOLD);
    box(g, 0.63, 0.012, 0.48, 0, 0.27, 0, PANEL);
    rod(g, [-0.15, 0.27, 0.15], [-0.15, 0.47, 0.15], 0.005, ALU);
    box(g, 0.04, 0.04, 0.12, 0.24, 0.2, 0, DARK);
  },
  mer(g) {
    wheels(g, 0.125, 0.16, [0.55, 0.05, -0.5], 0.6, 0.35);
    box(g, 1.0, 0.35, 0.7, 0, 0.5, 0, GOLD);
    box(g, 1.4, 0.02, 1.2, 0, 0.73, 0, PANEL);
    box(g, 0.7, 0.02, 0.55, -0.1, 0.73, 0.88, PANEL); box(g, 0.7, 0.02, 0.55, -0.1, 0.73, -0.88, PANEL);
    box(g, 0.4, 0.02, 0.5, -0.88, 0.73, 0, PANEL);
    rod(g, [0.45, 0.73, 0.25], [0.45, 1.42, 0.25], 0.03, WHITE);
    box(g, 0.12, 0.1, 0.42, 0.45, 1.47, 0.2, WHITE);
    cyl(g, 0.14, 0.03, -0.15, 0.88, -0.3, WHITE);
    rod(g, [-0.35, 0.73, -0.35], [-0.35, 1.05, -0.35], 0.01, ALU);
    rod(g, [0.55, 0.4, 0.25], [0.6, 0.38, -0.22], 0.03, ALU);
    box(g, 0.1, 0.1, 0.1, 0.62, 0.36, -0.22, ALU);
  },
  curiosity(g) { msl(g, 0.25, false); },
  perseverance(g) { msl(g, 0.2625, true); },
};
// a text label that faces the camera
const label = (text, sub, scale) => {
  const c = document.createElement("canvas"); c.width = 1024; c.height = 160;
  const x = c.getContext("2d");
  x.fillStyle = "#fafaf9"; x.font = "bold 64px sans-serif"; x.textAlign = "center"; x.fillText(text, 512, 70);
  x.fillStyle = "#a8a29e"; x.font = "40px sans-serif"; x.fillText(sub, 512, 130);
  const s = new T.Sprite(new T.SpriteMaterial({ map: new T.CanvasTexture(c), depthTest: false, transparent: true }));
  s.scale.set(3.2 * scale, 0.5 * scale, 1); s.renderOrder = 3; return s;
};
const ground = new T.Mesh(new T.PlaneGeometry(40, 40), new T.MeshStandardMaterial({ color: 0x7c2d12, roughness: 1 }));
ground.rotation.x = -Math.PI / 2; v.scene.add(ground);
const grid = new T.GridHelper(40, 40, 0x9a3412, 0x9a3412); grid.material.opacity = 0.25; grid.material.transparent = true; grid.position.y = 0.002; v.scene.add(grid);
const place = { sojourner: -5.6, mer: -3.4, curiosity: 0, perseverance: 3.6 };
const sizeOf = { sojourner: 0.65, mer: 1.6, curiosity: 3, perseverance: 3 };
const fmt = n => n == null ? null : d3.format(",")(n);
for (const id of Object.keys(place)) {
  const g = new T.Group(); g.position.z = place[id]; v.scene.add(g);
  build[id](g);
  const r = R[id] || { name: id };
  const top = id === "sojourner" ? 0.7 : id === "mer" ? 1.95 : 2.6;
  const l = label(r.name, `${r.landed ? r.landed.slice(0, 4) : ""} · ${fmt(r.mass_kg) ?? "?"} kg`, id === "sojourner" ? 0.75 : 1.1);
  l.position.set(0, top, 0); g.add(l);
  v.hover(l, () => `<b>${r.name}</b> · ${r.mission ?? ""}<br>landed ${r.landed ?? "?"}${r.last_contact ? ", last contact " + r.last_contact : ", still working"}<br>` +
    `${fmt(r.mass_kg)} kg · ${r.length_m} m long · wheels ${r.wheel_cm} cm · top speed ${r.top_speed_cm_s} cm/s<br>` +
    `<b>Power:</b> ${r.power_source}, about ${r.peak_power_w} W${r.energy_per_sol_wh ? ", ~" + fmt(r.energy_per_sol_wh) + " Wh per sol" : ""}<br>` +
    `<b>Battery:</b> ${r.battery}<br><b>Computer:</b> ${r.computer}<br><b>Driven:</b> ${r.distance}<br><i>${r.note}</i><br><span style="color:#a1a1aa">click: source</span>`,
    { click: () => r.source && window.open(r.source, "_blank") });
  // the hover points: drawn over the body, so parts inside it can be found too
  const dotR = 0.012 + sizeOf[id] * 0.022;
  for (const p of parts.filter(p => p.rover === id)) {
    const c = kinds[p.kind] ?? 0xffffff;
    const m = new T.Mesh(new T.SphereGeometry(dotR, 16, 12), new T.MeshBasicMaterial({ color: c, depthTest: false, transparent: true, opacity: 0.95 }));
    m.renderOrder = 2; m.position.set(p.x, p.y, p.z); g.add(m);
    const ring = new T.Mesh(new T.RingGeometry(dotR * 1.3, dotR * 1.7, 24), new T.MeshBasicMaterial({ color: c, depthTest: false, transparent: true, opacity: 0.5, side: T.DoubleSide }));
    ring.renderOrder = 2; ring.position.copy(m.position); g.add(ring);
    const facts = [p.mass_kg != null ? `${p.mass_kg} kg` : null, p.power_w != null ? `${p.power_w} W` : null].filter(Boolean).join(" · ");
    v.hover(m, `<div style="max-width:300px"><b>${p.part}</b> · ${r.name}<br><i>${p.role}</i><br>${p.detail}` +
      (facts ? `<br><b>${facts}</b>` : "") + `<br><span style="color:${hex(c)}">● ${p.kind}</span> <span style="color:#a1a1aa">· click: source</span></div>`,
      { click: () => window.open(p.source, "_blank"),
        enter: () => { m.scale.setScalar(1.7); v.render(); }, leave: () => { m.scale.setScalar(1); v.render(); } });
  }
  // keep the rings facing the camera
}
const rings = []; v.scene.traverse(o => { if (o.geometry && o.geometry.type === "RingGeometry") rings.push(o); });
v.controls.addEventListener("change", () => rings.forEach(o => o.quaternion.copy(v.camera.quaternion)));
v.camera.near = 0.01; v.camera.far = 200;
v.camera.position.set(10.5, 3.9, 2.6);
v.controls.target.set(0, 0.8, 0.2);
v.camera.updateProjectionMatrix(); v.controls.update();
rings.forEach(o => o.quaternion.copy(v.camera.quaternion));
const legend = document.createElement("div");
legend.style.cssText = "position:absolute;left:8px;top:6px;font:11px sans-serif;color:#d6d3d1;pointer-events:none;line-height:1.5";
legend.innerHTML = Object.entries(kinds).map(([k, c]) => `<span style="color:${hex(c)}">●</span> ${k}`).join("&nbsp; ");
v.el.appendChild(legend);
const note = document.createElement("div");
note.style.cssText = "position:absolute;left:8px;bottom:6px;font:11px sans-serif;color:#a8a29e;pointer-events:none";
note.textContent = "Sizes to scale (grid: 1 m); shapes simplified and positions approximate · hover a dot or a name · click for the source · drag to orbit";
v.el.appendChild(note);
return v.el;