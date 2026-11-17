// The verdict: can the route be flown VFR at the planned time? It reads the
// steps' verdicts (Polars) and says which report decides it.
// Inputs: 0 checkpoints (airports: TAF in their ±1 h window, METAR now),
// 1 enroute_check (SMHI model between them), 2 route_hours (route hour by
// hour), 3 legs (route, ETD, ETA), 4 sigmets (polygons), 5 metars, 6 tafp,
// 7 consistency (does each METAR fall inside its TAF now).
// Minima: SERA VMC at a controlled aerodrome, ceiling >= 1500 ft and
// visibility >= 5 km; hover a chip for the reports behind it.
// a step with no rows can arrive as something other than an array (an
// empty answer, a SIGMET feed with nothing in force): treat it as no rows
const asRows = x => Array.isArray(x) ? x : (x && Array.isArray(x.rows) ? x.rows : []);
let [cps = [], en = [], rh = [], legs = [], sig = [], mets = [], tafp = [], cons = []] = Array.isArray(data) ? data : [];
[cps, en, rh, legs, sig, mets, tafp, cons] = [cps, en, rh, legs, sig, mets, tafp, cons].map(asRows);
const fitOf = new Map(cons.map(c => [c.icao, c.fit]));
const W = fit?.width ?? 760;
const COL = {VFR: "#16a34a", MVFR: "#2563eb", IFR: "#dc2626", LIFR: "#c026d3"};
const z = t => t == null ? "?" : new Date(t * 1000).toISOString().slice(11, 16) + "Z";
const ago = t => { const m = Math.round((Date.now() / 1000 - t) / 60); return m < 90 ? `${m} min old` : `${(m / 60).toFixed(1)} h old`; };
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
const dep = legs.find(l => l.role === "departure") || {}, dst = legs.find(l => l.role === "destination") || {};
const etd = dep.etd, eta = dep.eta;

// --- SIGMETs on the route: the great circle sampled every ~4 km, tested
// against each polygon (planar ray casting in lon/lat), valid during the flight
const line = dep.lon != null && dst.lon != null ? d3.range(0, 1.0001, 0.01).map(d3.geoInterpolate([dep.lon, dep.lat], [dst.lon, dst.lat])) : [];
const inside = (p, ring) => { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, yi] = ring[i], [xj, yj] = ring[j]; if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
const onRoute = sig.filter(s => s.near && s.valid_to >= etd && s.valid_from <= eta && line.some(p => inside(p, s.ring || [])));
const nearSig = sig.filter(s => s.near);

// --- the decision
const missing = legs.filter(l => l.lat == null).map(l => l.icao);
const prevFail = cps.filter(c => c.verdict === "below VMC minima");
const tempFail = cps.filter(c => c.verdict === "VMC, but TEMPO/PROB below");
const noTaf = cps.filter(c => c.verdict === "no TAF");
const metFail = cps.filter(c => c.metar_vmc === 0);
const enFail = en.filter(e => e.hours_below > 0);
const level = prevFail.length || onRoute.length || missing.length ? "no" : tempFail.length || enFail.length || (metFail.some(c => c.role === "departure") && etd - (dep.now ?? etd) <= 3600) ? "marginal" : "go";
const after = rh.filter(r => r.t + 3600 > etd);
const firstAllOk = after.find(r => r.all_ok === 1);
const firstPrevFail = after.find(r => r.all_prev === 0);
const route = `${dep.icao ?? "?"} → ${dst.icao ?? "?"}`;
const head = {
  go: `VFR ${route} looks possible at ${z(etd)}: every TAF group and the model meet the VMC minima`,
  marginal: `${route} at ${z(etd)}: VFR on paper, but ${[...tempFail.map(c => `a ${String(c.decides).split(" ")[0]} at ${c.icao}`), ...enFail.map(e => `the model at ${e.point}`)].slice(0, 3).join(", ") || "the departure METAR"} says no`,
  no: `Not VFR ${route} at ${z(etd)}: ${prevFail.length ? `the prevailing forecast at ${prevFail.map(c => c.icao).join(", ")} is below the minima` : onRoute.length ? `a SIGMET (${onRoute.map(s => s.hazard).join(", ")}) lies on the route` : `no METAR for ${missing.join(", ")}`}`,
}[level];
const tone = {go: "#16a34a", marginal: "#d97706", no: "#dc2626"}[level];

const why = [];
for (const c of tempFail) why.push(`${c.icao} (${c.role}, ${c.use_z}): prevailing ${c.prevailing}, but <b>${esc(c.decides)}</b> → ${c.worst}.`);
for (const c of prevFail) why.push(`${c.icao} (${c.role}, ${c.use_z}): <b>${esc(c.decides)}</b> → ${c.prevailing}.`);
const fitSays = {"inside a TEMPO/PROB": "its TAF's TEMPO/PROB is happening", "worse than the TAF allows": "worse than its TAF allows: expect an amendment (TAF AMD)", "inside the prevailing forecast": "within its TAF's base forecast"};
for (const c of metFail) why.push(`${c.icao} now (METAR ${c.metar_z}): ${c.metar}, ${c.metar_minima} — ${fitSays[fitOf.get(c.icao)] ?? "no TAF to compare"}.`);
for (const e of enFail) why.push(`${/^[A-Z]{4}$/.test(e.point) ? "At " + e.point : "Between the airports, " + e.point + " of the way"} (${e.pass_z}): SMHI's model has ${e.worst}, ceiling ${e.min_ceiling_ft ?? "none"} ft, visibility ${e.min_vis_m != null ? Math.round(e.min_vis_m) + " m" : "?"}.`);
for (const s of onRoute) why.push(`SIGMET ${esc(s.fir)} ${esc(s.series)}: ${esc(s.qualifier ?? "")} ${esc(s.hazard)} ${s.base_ft ?? "SFC"}–${s.top_ft ?? "?"} ft, ${z(s.valid_from)}–${z(s.valid_to)}, crosses the route.`);
if (noTaf.length) why.push(`No TAF from ${noTaf.map(c => c.icao).join(", ")}: only the METAR and the model speak for it.`);
const when = [
  firstAllOk ? (firstAllOk.t <= etd + 3600 ? "" : `Everything the TAFs allow meets the minima from <b>${z(firstAllOk.t)}</b> (${firstAllOk.airports} of ${legs.length} airports' TAFs still valid then).`)
             : `No hour in the TAFs' validity where every group meets the minima.`,
  firstPrevFail ? `The prevailing forecast drops below the minima at ${firstPrevFail.worst_icao} from ${z(firstPrevFail.t)}.` : `The prevailing forecasts stay VMC as far as they go (${z(rh.at(-1)?.t)}).`,
].filter(Boolean);

// --- the tile
const root = d3.create("div").style("width", W + "px").style("font", "13px/1.45 system-ui, sans-serif").style("color", "currentColor");
root.append("div").style("border-left", `6px solid ${tone}`).style("padding", "6px 12px").style("font-size", "18px").style("font-weight", "600").html(esc(head));
root.append("div").style("margin", "4px 0 8px 18px").style("opacity", 0.8)
  .text(`ETD ${dep.etd_z ?? "?"} · ${dep.dist_nm ?? "?"} NM at ${dep.cruise_kt ?? "?"} kt (no wind) · ETA ${dep.eta_z ?? "?"} · minima: ceiling ≥ 1500 ft and visibility ≥ 5 km (SERA VMC in a control zone; special VFR 600 ft, 1500 m)`);
const chips = root.append("div").style("display", "flex").style("flex-wrap", "wrap").style("gap", "6px").style("margin-left", "18px");
const chip = (label, cat, title, href) => chips.append("a").attr("href", href).attr("target", "_blank").attr("title", title)
  .style("text-decoration", "none").style("color", "inherit").style("border", `2px solid ${COL[cat] || "#71717a"}`).style("border-radius", "6px").style("padding", "2px 8px")
  .html(label);
for (const c of cps) {
  const issued = tafp.find(p => p.icao === c.icao)?.issued_z;
  chip(`<b>${c.icao}</b> ${c.role} ${c.use_z.slice(3)} · TAF ${c.prevailing ?? "—"}${c.worst && c.worst !== c.prevailing ? "/" + c.worst : ""} · now ${c.metar ?? "—"}`, c.worst ?? c.metar,
    `${c.name}\n${c.verdict} in ${z(c.win_from)}–${z(c.win_to)}\nDecides: ${c.decides ?? "—"}\nTAF issued ${issued ?? "—"}\nMETAR ${c.metar_z ?? "—"} (${c.obs ? ago(c.obs) : "no report"}): ${c.metar_raw ?? "—"}\nclick: METAR and TAF at NOAA AWC`,
    `https://aviationweather.gov/data/metar/?ids=${c.icao}&hours=0&taf=1`);
}
for (const e of en) chip(`${e.point} ${e.pass_z} · model ${e.worst}`, e.worst,
  `SMHI snow1g at ${e.lat}°N ${e.lon}°E, ${e.hours} h around ${e.pass_z}\n${e.hours_below} h below the minima; lowest ceiling ${e.min_ceiling_ft ?? "none"} ft, visibility ${e.min_vis_m ?? "?"} m, gusts ${e.max_gust_kt ?? "?"} kt, thunder ${e.max_thunder_pct ?? "?"}%\nclick: the point's forecast (JSON)`,
  `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/${e.lon}/lat/${e.lat}/data.json`);
root.append("ul").style("margin", "8px 0 4px 0").selectAll("li").data([...why, ...when]).join("li").html(d => d);
root.append("div").style("margin-left", "18px").style("opacity", 0.8)
  .text(`SIGMETs: ${onRoute.length} on the route, ${nearSig.length} near Sweden (${[...new Set(nearSig.map(s => s.fir))].join(", ") || "none"}), ${sig.length} worldwide. AIRMETs are not in the feed (Europe issues them per FIR; ask your briefing service).`);
const aware = root.append("div").style("margin", "8px 0 0 18px").style("padding", "6px 10px").style("border", "1px dashed #d97706").style("border-radius", "6px");
aware.append("div").html(`<b>Not an official pre-flight briefing.</b> Use <a href="https://www.aro.lfv.se" target="_blank">AROWeb</a> or your briefing service: NOTAMs, winds and temperatures aloft, icing, airspace and terrain are not here. The flight category (VFR/MVFR/IFR/LIFR) is the US convention; the go/no-go uses the SERA minima. Ages are on your clock: newest METAR ${legs[0]?.now ? ago(legs[0].now) : "?"}; ${mets.length} METARs, ${new Set(tafp.map(p => p.icao)).size} TAFs in the box.`);
aware.append("div").style("opacity", 0.8).html(`METAR/TAF/SIGMET: <a href="https://aviationweather.gov/data/api/" target="_blank">NOAA Aviation Weather Center</a> (public domain). Forecast: <a href="https://opendata.smhi.se/apidocs/metfcst/" target="_blank">SMHI</a> (CC BY 4.0). Next: change the ETD or the airports in the <i>route</i> step; the timeline shows when each group bites.`);
return root.node();
