// Band gaps by family: each dot a material's ground state, filled if the gap is direct.
// data: classified {formula, family, gap_type, gap_ev, gap_direct_ev, margin_ev, photon_nm, delta_chi, sg, link}
const rows = Array.isArray(data) ? data : [];
const order = ["IV element", "IV-IV", "III-V", "II-VI (Zn, Cd, Hg)", "II-VI (Be to Ba)", "I-VII (Cu, Ag)", "I-VII (alkali)", "IV-VI", "other"];
const famous = new Set(["Si", "C", "CSi", "AsGa", "GaN", "InP", "GaP", "AlAs", "AlP", "AlN", "SeZn", "SZn", "CdTe", "CdS", "BP", "AlSb", "OZn", "PbS", "MgO", "ClNa"]);
const pretty = f => ({AsGa: "GaAs", SeZn: "ZnSe", SZn: "ZnS", TeZn: "ZnTe", OZn: "ZnO", CSi: "SiC", ClNa: "NaCl"})[f] || f;
// the visible spectrum, 1.65-3.26 eV (750-380 nm)
const visible = d3.range(1.65, 3.27, 0.02).map(e => ({e, c: d3.interpolateTurbo(Math.max(0, Math.min(1, (1239.84 / e - 380) / 370)))}));
return plot({
  height: Math.max(420, (fit?.height ?? 480) - 20),
  marginLeft: 130,
  x: {label: "band gap (eV, PBE) →", domain: [0, 9], grid: true},
  fy: {domain: order, label: null},
  color: {domain: ["direct", "indirect"], range: ["#f97316", "#64748b"], legend: true, label: "gap"},
  marks: [
    Plot.rectX(visible, {x1: "e", x2: d => d.e + 0.02, fill: "c", fillOpacity: 0.2}),
    Plot.dot(rows, Plot.dodgeY({anchor: "middle", x: "gap_ev", fy: "family", r: 3.5, padding: 0.5,
      fill: d => d.gap_type === "direct" ? "direct" : "white", stroke: "gap_type", href: "link", target: "_blank", tip: true,
      channels: {material: d => pretty(d.formula), family: "family", "gap (eV)": "gap_ev", "direct gap (eV)": "gap_direct_ev", "direct − gap (eV)": "margin_ev", "photon at the gap (nm, PBE)": "photon_nm", "Δχ (Pauling)": "delta_chi", "space group": "sg"}})),
    Plot.text(rows.filter(d => famous.has(d.formula)), {x: "gap_ev", fy: "family", text: d => pretty(d.formula), frameAnchor: "top", dy: 2, fontSize: 9, fill: "currentColor"}),
  ],
  caption: "Filled orange: direct gap (a photon can cross it on its own); grey ring: indirect (it needs a lattice vibration too, so light emission is about a million times slower than the competing non-radiative losses). "
    + "Notice that Si and C are indirect, while GaAs, InP, GaN and the Zn and Cd chalcogenides (ZnSe, CdTe) are direct: that is why LEDs and lasers are III-V or II-VI, not silicon. The rock-salt alkaline-earth chalcogenides (CaO, SrS) are indirect, and the alkali halides are direct but insulators, their gaps far in the ultraviolet. "
    + "Caveat: PBE gaps are too small (Si 1.12 eV measured, GaAs 1.42, GaN 3.4), so read colours and positions as relative; the direct/indirect character is more reliable than the value.",
});