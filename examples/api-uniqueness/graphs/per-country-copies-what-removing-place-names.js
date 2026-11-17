// The hypothesis, per group: distinct (the text part of the score) and the place-name effect, each with ±2 standard errors.
// Two small plots side by side, because the two measures live on scales a hundred times apart.
// data: test {group, apis, mean_distinct, sd_distinct, mean_place_effect, sd_place_effect, welch_t_distinct, welch_t_place_effect}
const rows = Array.isArray(data) ? data : [];
const w = Math.max(280, ((fit?.width ?? 760) - 20) / 2);
const panel = (label, m, sd, t) => plot({
  width: w, height: 170, marginLeft: 120, color: false,
  x: {label, grid: true},
  y: {label: null},
  marks: [
    Plot.ruleY(rows, {y: "group", x1: d => d[m] - 2 * d[sd] / Math.sqrt(d.apis), x2: d => d[m] + 2 * d[sd] / Math.sqrt(d.apis), stroke: "group", strokeWidth: 3, strokeOpacity: 0.5}),
    Plot.dot(rows, {y: "group", x: m, fill: "group", r: 5, tip: true,
      channels: {APIs: "apis", "standard deviation": sd, "standard error": d => (d[sd] / Math.sqrt(d.apis)).toFixed(4), "Welch t against the other group": t}}),
  ],
});
const box = document.createElement("div");
box.style.display = "flex"; box.style.flexWrap = "wrap"; box.style.gap = "20px";
box.append(panel("distinct: 1 − mean similarity to the 5 nearest →", "mean_distinct", "sd_distinct", "welch_t_distinct"),
           panel("place-name effect: distinct with places kept − removed →", "mean_place_effect", "sd_place_effect", "welch_t_place_effect"));
const cap = document.createElement("p");
cap.style.fontSize = "12px"; cap.style.margin = "4px 0 0";
cap.textContent = "Energy and market APIs (any category with 'energy' or 'markets' in its path) are a little less distinct than the rest, and they are the group where "
  + "removing place names makes neighbours look more alike (the per-country grid operators: Fingrid, Statnett, Elering, Energinet). "
  + "Both effects are small next to the vendor families and to rarity: read with the table and the field chart.";
const out = document.createElement("div");
out.append(box, cap);
return out;