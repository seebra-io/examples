// The chosen merger's chirp, from its chirp mass alone: as two masses
// spiral in, the gravitational-wave frequency rises as f ∝ τ^(−3/8) (τ the
// time left) until they touch. Heavier pairs chirp lower and shorter: a
// neutron-star pair sweeps through the detectors' band for over a minute,
// GW231123 for a fraction of a second. The waveform is the leading-order
// (Newtonian) inspiral, not the measured signal; it stops at the
// innermost stable orbit. Press "Hear it" to play it as sound (it is
// already audio: tens to hundreds of hertz). Click another merger on the
// masses or energy slide to choose it.
const s = data || {};
const name = parameters?.event || s.selected;
const e = (s.events || []).find((x) => x.name === name) || (s.events || []).find((x) => x.name === "GW150914");
const W = Math.max(560, fit?.width ?? 1000), H = Math.max(380, (fit?.height ?? 540) - 20);
const box = document.createElement("div");
box.style.cssText = "font:12px system-ui,sans-serif;color:#e4e4e7";
if (!e?.chirp) { box.textContent = `No chirp mass published for ${name} yet: choose another merger on the masses slide.`; return box; }
const G = 6.674e-11, C = 2.998e8, MS = 1.989e30;
const Mc = e.chirp * (1 + (e.redshift || 0)) * MS * G / C ** 3;          // detector-frame chirp mass, in seconds
const Mt = (e.total || e.chirp * 2.3) * (1 + (e.redshift || 0)) * MS * G / C ** 3;
const fISCO = 1 / (6 ** 1.5 * Math.PI * Mt), f0 = 20;
const tau = (f) => 5 / 256 * (Math.PI * f) ** (-8 / 3) * Mc ** (-5 / 3);   // time left from frequency f
const freq = (t) => (1 / Math.PI) * (5 / (256 * t)) ** (3 / 8) * Mc ** (-5 / 8);
const T = tau(f0), tEnd = tau(fISCO);
const cycles = (f) => (1 / (32 * Math.PI ** (8 / 3))) * (Mc * f) ** (-5 / 3); // cycles left from f
const nCycles = cycles(f0) - cycles(fISCO);
// samples over the last stretch (at most 2 s, or all of it), dense near the end
const span = Math.min(T, 2), N = 4000, pts = [];
for (let i = 0; i <= N; i++) {
  const tl = tEnd + (span - tEnd) * (1 - i / N) ** 2;
  const f = freq(tl), phase = 2 * Math.PI * (cycles(f0) - cycles(f));
  pts.push({t: -tl, f, h: (f / fISCO) ** (2 / 3) * Math.cos(phase)});
}
const head = document.createElement("div");
head.innerHTML = `<div style="font-size:15px;font-weight:600">${e.name}: ${e.m1} + ${e.m2} → ${e.final ?? "?"} solar masses, ${e.distance_mpc} Mpc away (${e.date}, ${e.run})</div>
  <div style="color:#a1a1aa;margin:3px 0 8px">Chirp mass ${e.chirp} solar masses · in the band above ${f0} Hz for <b style="color:#e4e4e7">${T >= 1 ? T.toFixed(1) + " s" : (1000 * T).toFixed(0) + " ms"}</b>, about <b style="color:#e4e4e7">${Math.round(nCycles)}</b> cycles, up to ≈ ${fISCO.toFixed(0)} Hz at the innermost stable orbit ·
  <a target="_blank" rel="noopener" style="color:#60a5fa" href="${e.link}">GWOSC</a></div>`;
const btn = document.createElement("button");
btn.textContent = "▶ Hear it";
btn.style.cssText = "background:#27272a;color:#e4e4e7;border:1px solid #3f3f46;border-radius:6px;padding:4px 10px;cursor:pointer;margin-bottom:6px";
btn.onclick = () => {
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    const dur = Math.min(T, 8), rate = ac.sampleRate, n = Math.ceil((dur + 0.15) * rate), buf = ac.createBuffer(1, n, rate), out = buf.getChannelData(0);
    let ph = 0;
    for (let i = 0; i < n; i++) {
      const tl = dur - i / rate; if (tl <= tEnd) { out[i] = 0; continue; }
      const f = freq(tl); ph += 2 * Math.PI * f / rate;
      const env = Math.min(1, (f / fISCO) ** (2 / 3) * 1.5) * Math.min(1, i / (0.05 * rate));
      out[i] = 0.6 * env * Math.sin(ph);
    }
    const src = ac.createBufferSource(); src.buffer = buf; src.connect(ac.destination); src.start();
    btn.textContent = `▶ Hear it (playing the last ${dur.toFixed(1)} s)`; src.onended = () => { btn.textContent = "▶ Hear it"; ac.close(); };
  } catch (err) { btn.textContent = "Sound isn't available here"; }
};
const chart = (y, label, h, opts = {}) => Plot.plot({
  width: W, height: h, marginLeft: 60, style: {background: "transparent", color: "#e4e4e7"},
  x: {label: "seconds before the merger →", domain: [-span, 0]}, y: {label, grid: true, ...opts},
  marks: [Plot.line(pts, {x: "t", y, stroke: "#60a5fa", strokeWidth: 1.2})],
});
box.append(head, btn, chart("h", "↑ strain (arbitrary units)", (H - 90) * 0.55), chart("f", "↑ frequency (Hz, log)", (H - 90) * 0.45, {type: "log"}));
return box;