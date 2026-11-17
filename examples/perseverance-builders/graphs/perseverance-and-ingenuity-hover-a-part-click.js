// Perseverance as NASA's 3D model (NASA/JPL-Caltech, NASA 3D Resources), Ingenuity beside it.
// Hover a part: what it does, which system it belongs to and who built it; the
// whole part lights up. Click it for the source. A dot marks a part the model
// has no shape for (MOXIE and the computer sit inside the body).
// data[0]: the rover's model {format, name, data}   data[1]: parts {part, system, nodes, role, ...}
// data[2]: builders {part, org, country, kind, role, source}   data[3]: Ingenuity's model
const [rover, partsIn, buildersIn, heli] = data;
const parts = Array.isArray(partsIn) ? partsIn : [];
const builders = Array.isArray(buildersIn) ? buildersIn : [];
const T = THREE;
const v = scene3d(fit, { background: 0x0c0a09 });
const systems = {
  "Science instruments": 0xa3e635, "Cameras": 0x38bdf8, "Sampling": 0xf87171, "Arm": 0xfb923c,
  "Power": 0xfbbf24, "Communications": 0xc084fc, "Computing": 0xf472b6, "Mobility": 0xd4d4d8, "Helicopter": 0x2dd4bf,
};
const hex = c => "#" + c.toString(16).padStart(6, "0");
const esc = s => String(s ?? "").replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const by = {};
for (const b of builders) (by[b.part] ??= []).push(b);
const kindMark = { agency: "◆", lab: "■", university: "▲", company: "●", "research institute": "★" };

v.scene.add(new T.GridHelper(8, 16, 0x44403c, 0x292524));
const info = document.createElement("div");
info.style.cssText = "position:absolute;left:8px;bottom:6px;font:11px sans-serif;color:#a8a29e;pointer-events:none";
info.textContent = "loading NASA's model…";
v.el.appendChild(info);
const legend = document.createElement("div");
legend.style.cssText = "position:absolute;left:8px;top:6px;font:11px sans-serif;color:#d6d3d1;pointer-events:none;line-height:1.5;max-width:70%";
legend.innerHTML = Object.entries(systems).map(([k, c]) => `<span style="color:${hex(c)}">●</span> ${k}`).join("&nbsp; ") +
  `<br><span style="color:#a8a29e">${Object.entries(kindMark).map(([k, m]) => `${m} ${k}`).join("&nbsp; ")}</span>`;
v.el.appendChild(legend);

const tip = (p) => {
  const c = systems[p.system] ?? 0xffffff;
  const facts = [p.mass_kg != null ? `${p.mass_kg} kg` : null, p.power_w != null ? `${p.power_w} W` : null].filter(Boolean).join(" · ");
  const who = (by[p.part] ?? []).map(b => `${kindMark[b.kind] ?? "·"} <b>${esc(b.org)}</b> (${esc(b.country)}): ${esc(b.role)}`).join("<br>");
  return `<div style="max-width:340px;white-space:normal"><b>${esc(p.part)}</b> <span style="color:${hex(c)}">· ${esc(p.system)}</span><br>` +
    `<i>${esc(p.role)}</i>` + (facts ? `<br><b>${facts}</b>` : "") +
    (who ? `<br><span style="color:#a8a29e">Built by</span><br>${who}` : `<br><span style="color:#a8a29e">No builder found in a source yet</span>`) +
    `<br><span style="color:#a1a1aa">click: source${p.approx ? " · position approximate" : ""}</span></div>`;
};

// lights a part up while hovered; its materials are its own (the model shares them between parts)
const glow = (objs, c) => {
  const meshes = [];
  for (const o of objs) o.traverse(m => { if (m.isMesh) meshes.push(m); });
  for (const m of meshes) {
    m.material = [].concat(m.material).map(x => x.clone());
    if (m.material.length === 1) m.material = m.material[0];
  }
  const set = on => { for (const m of meshes) for (const x of [].concat(m.material)) if (x.emissive) { x.emissive.setHex(on ? c : 0x000000); x.emissiveIntensity = on ? 0.6 : 1; } v.render(); };
  return { enter: () => set(true), leave: () => set(false) };
};

const dot = (p, at) => {
  const c = systems[p.system] ?? 0xffffff;
  const m = new T.Mesh(new T.SphereGeometry(0.035, 16, 12), new T.MeshBasicMaterial({ color: c, depthTest: false, transparent: true, opacity: 0.95 }));
  m.renderOrder = 2; m.position.copy(at); v.scene.add(m);
  return m;
};

const place = (obj, list) => {
  let shown = 0;
  for (const p of list) {
    const c = systems[p.system] ?? 0xffffff;
    const objs = String(p.nodes || "").split(",").map(s => s.trim()).filter(Boolean).map(n => obj.getObjectByName(n)).filter(Boolean);
    const open = () => p.source && window.open(p.source, "_blank");
    if (objs.length) {
      const g = glow(objs, c);
      for (const o of objs) v.hover(o, () => tip(p), { ...g, click: open });
      shown++;
    } else if (p.x != null) {
      const m = dot(p, new T.Vector3(p.x, p.y, p.z));
      v.hover(m, () => tip(p), { click: open, enter: () => { m.scale.setScalar(1.6); v.render(); }, leave: () => { m.scale.setScalar(1); v.render(); } });
      shown++;
    }
  }
  return shown;
};

const roverParts = parts.filter(p => p.system !== "Helicopter");
const heliParts = parts.filter(p => p.system === "Helicopter");
Promise.all([loadModel(rover), heli ? loadModel(heli) : Promise.resolve(null)]).then(([r, h]) => {
  v.scene.add(r);
  let n = place(r, roverParts);
  if (h) {
    // Ingenuity rode under the belly; here it stands beside the rover, to scale
    h.position.set(2.1, 0, 0.6);
    v.scene.add(h);
    const g = glow([h], systems.Helicopter);
    const whole = heliParts.find(p => p.part === "Ingenuity") ?? { part: "Ingenuity", system: "Helicopter", role: "Mars helicopter" };
    v.hover(h, () => tip(whole), { ...g, click: () => whole.source && window.open(whole.source, "_blank") });
    n += place(h, heliParts.filter(p => p !== whole));
  }
  v.camera.near = 0.01; v.camera.far = 200;
  v.camera.position.set(4.6, 2.6, 4.4);
  v.controls.target.set(0.5, 0.8, 0);
  v.camera.updateProjectionMatrix(); v.controls.update();
  info.textContent = `NASA/JPL-Caltech's model (NASA 3D Resources), to scale (grid: 0.5 m) · ${n} parts to hover · click for the source · drag to orbit, wheel to zoom`;
  v.render(2000);
}).catch(e => { info.textContent = `Couldn't read the model: ${e.message || e}`; info.style.color = "#f87171"; });
return v.el;
