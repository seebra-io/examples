// NASA's own models of four Mars missions, side by side. Hover one for what it
// is and its size in the file; click it for NASA's file. "File scale" shows each
// as its file has it: glTF's unit is the metre, but not every model keeps to
// it, so compare a size with the mission's published one before you trust it.
// "Same size" scales each to fit, for looking at shapes.
// data: [MRO, Mars Global Surveyor, Opportunity, Ingenuity] as {format, name, data}
const T = THREE;
const v = scene3d(fit, {background: 0x0c0a09});
const info = [
  {name: "Mars Reconnaissance Orbiter", what: "orbiter, at Mars since 2006: HiRISE, the sharpest camera around Mars, and a relay for the rovers", color: 0x38bdf8, url: "https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/mars-reconnaissance-orbiter-(mro)-(a)/Mars%20Reconnaissance%20Orbiter%20(MRO)%20(A).glb"},
  {name: "Mars Global Surveyor", what: "orbiter, 1997-2006: mapped the planet's topography (MOLA) and magnetic field", color: 0xa3e635, url: "https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/mars-global-surveyor/Mars%20Global%20Surveyor.glb"},
  {name: "Opportunity (MER-B)", what: "rover, 2004-2018: found the water-formed hematite of Meridiani Planum; drove 45 km", color: 0xf97316, url: "https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/mars-exploration-rover---opportunity-(mer-b)/Mars%20Exploration%20Rover%20-%20Opportunity%20(MER-B).glb"},
  {name: "Ingenuity", what: "helicopter, 2021-2024: the first powered flight on another planet, 72 flights", color: 0xf472b6, url: "https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/ingenuity-mars-helicopter/Ingenuity%20Mars%20Helicopter.glb"},
];
const esc = s => String(s ?? "").replace(/[&<>]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;"}[c]));
const note = document.createElement("div");
note.style.cssText = "position:absolute;left:8px;bottom:6px;font:11px sans-serif;color:#a8a29e;pointer-events:none;max-width:75%";
note.textContent = "loading NASA's models…";
v.el.appendChild(note);
const bar = document.createElement("div");
bar.style.cssText = "position:absolute;right:8px;top:6px;display:flex;gap:4px";
v.el.appendChild(bar);
const legend = document.createElement("div");
legend.style.cssText = "position:absolute;left:8px;top:6px;font:11px sans-serif;color:#d6d3d1;pointer-events:none;line-height:1.5";
v.el.appendChild(legend);
const models = (Array.isArray(data) ? data : [data]).slice(0, 4);
Promise.all(models.map(m => loadModel(m).catch(e => ({error: e.message || String(e)})))).then(objs => {
  const items = objs.map((o, i) => ({o, ...info[i], file: models[i] && models[i].name}));
  const ok = items.filter(it => it.o && !it.error);
  for (const it of ok) {
    const b = new T.Box3().setFromObject(it.o), s = b.getSize(new T.Vector3());
    it.size = s; it.span = Math.max(s.x, s.y, s.z) || 1;
    it.base = it.o.position.clone().sub(b.getCenter(new T.Vector3()));
    it.holder = new T.Group(); it.holder.add(it.o); it.o.position.copy(it.base); v.scene.add(it.holder);
    v.hover(it.o, () => `<div style="max-width:320px;white-space:normal"><b style="color:#${it.color.toString(16).padStart(6, "0")}">${esc(it.name)}</b><br>${esc(it.what)}<br>` +
      `<span style="color:#a8a29e">in the file: ${s.x.toPrecision(3)} × ${s.y.toPrecision(3)} × ${s.z.toPrecision(3)} (metres if it keeps to glTF)</span><br><span style="color:#a1a1aa">click: NASA's file</span></div>`,
      {click: () => window.open(it.url, "_blank")});
  }
  const grid = new T.GridHelper(1, 10, 0x44403c, 0x292524);
  const arrange = mode => {
    let x = 0;
    for (const it of ok) {
      const k = mode === "same" ? 2 / it.span : 1;
      it.holder.scale.setScalar(k);
      const w = it.span * k;
      it.holder.position.set(x + w / 2, 0, 0);
      x += w * 1.25;
    }
    const box = new T.Box3();
    for (const it of ok) box.expandByObject(it.holder);
    if (box.isEmpty()) return;
    const span = box.getSize(new T.Vector3()).length() || 1;
    // frame the spacecraft, then lay the grid under them
    v.scene.remove(grid);
    v.frame(v.scene);
    grid.scale.setScalar(span * 1.2); grid.position.set(box.getCenter(new T.Vector3()).x, box.min.y, 0);
    v.scene.add(grid);
    for (const b of bar.children) b.style.background = b.dataset.mode === mode ? "#3f3f46" : "#18181b";
    note.textContent = (mode === "same" ? "Same size: each scaled to fit, for shapes only. " : "File scale: as each file has it; the grid's squares are a tenth of the scene. ") +
      (items.some(it => it.error) ? "Not loaded: " + items.filter(it => it.error).map(it => `${it.name} (${it.error})`).join(", ") + ". " : "") +
      "Drag to orbit, wheel to zoom.";
    v.render();
  };
  for (const [mode, label] of [["file", "File scale"], ["same", "Same size"]]) {
    const b = document.createElement("button");
    b.textContent = label; b.dataset.mode = mode;
    b.style.cssText = "font:11px sans-serif;color:#e4e4e7;border:1px solid #3f3f46;border-radius:4px;padding:2px 6px;cursor:pointer";
    b.onclick = () => arrange(mode);
    bar.appendChild(b);
  }
  legend.innerHTML = ok.map(it => `<span style="color:#${it.color.toString(16).padStart(6, "0")}">●</span> ${esc(it.name)}: ${it.span.toPrecision(3)} across`).join("<br>");
  for (const it of ok) it.o.traverse(m => { if (m.isMesh && m.material && m.material.emissive) { m.material = m.material.clone(); m.material.emissive.setHex(it.color); m.material.emissiveIntensity = 0.08; } });
  arrange("file");
});
return v.el;