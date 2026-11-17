// The aha, over every TAF in the box (Sweden and its neighbours): per hour
// ahead, the share of airports below the SERA VMC minima (1500 ft, 5 km) in
// the prevailing forecast alone, and in everything the TAF allows (TEMPO,
// PROB, a BECMG in progress). The diamond at hour 0: the METARs now, for the
// same airports. Notice: the METARs sit near the upper line, not the lower
// one: reading only a TAF's first line, or only today's METAR, misses most
// of what can stop a VFR flight a few hours out. The drop after 9 h is the
// small airports' 9-hour TAFs ending (the count is in the tip).
// Inputs: 0 outlook, 1 consistency.
// a step with no rows can arrive as something other than an array (an
// empty answer, a SIGMET feed with nothing in force): treat it as no rows
const asRows = x => Array.isArray(x) ? x : (x && Array.isArray(x.rows) ? x.rows : []);
let [o = [], c = []] = Array.isArray(data) ? data : [];
[o, c] = [o, c].map(asRows);
const W = fit?.width ?? 720, H = fit?.height ?? 380;
const long = o.flatMap(d => [
  {...d, k: "prevailing forecast only", share: d.share_prev, n: d.below_prev},
  {...d, k: "including TEMPO / PROB / BECMG", share: d.share_all, n: d.below_all}]);
const metBelow = c.filter(d => d.minima !== "VMC").length;
const met = c.length ? [{h: 0, share: metBelow / c.length, n: metBelow, airports: c.length}] : [];
const at2 = o.find(d => d.h === 2);
return plot({
  width: W, height: H,
  x: {label: "hours ahead (from the newest METAR's hour) →"},
  y: {label: "↑ airports below VMC minima (share)", domain: [0, Math.max(0.2, d3.max(long, d => d.share) ?? 0, met[0]?.share ?? 0)], tickFormat: "%", grid: true},
  color: {domain: ["prevailing forecast only", "including TEMPO / PROB / BECMG"], range: ["#2563eb", "#dc2626"], legend: true},
  marks: [
    Plot.lineY(long, {x: "h", y: "share", stroke: "k", strokeWidth: 2, curve: "step-after"}),
    Plot.dot(long, {x: "h", y: "share", fill: "k", r: 3, tip: true,
      title: d => `${d.hour} (+${d.h} h): ${d.n} of ${d.airports} airports below the minima, ${d.k}\n${d.with_temp} of them have a TEMPO/PROB group in this hour`}),
    Plot.dot(met, {x: "h", y: "share", symbol: "diamond", r: 7, fill: "currentColor", tip: true,
      title: d => `METARs now: ${d.n} of ${d.airports} airports with a TAF are below the minima`}),
    Plot.ruleY([0]),
  ],
  caption: at2 ? `Two hours out, ${at2.below_prev} of ${at2.airports} airports are below the minima by their prevailing forecast and ${at2.below_all} by everything their TAF allows; ${metBelow} of ${c.length} METARs are below now. The temporary groups, not the base forecast, decide a VFR plan.` : "",
});
