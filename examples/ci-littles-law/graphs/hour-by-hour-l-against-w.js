// Per hour: measured L against that hour's λW.
const rows = (Array.isArray(data) ? data : []).filter(d => d.arrivals > 0 || d.L > 0);
const m = Math.max(1, d3.max(rows, d => Math.max(d.L, d.lambda_W)) * 1.05);
return plot({
  height: fit?.height ?? 360,
  x: {label: "λ·W from the hour's arrivals (runs) →", domain: [0, m], grid: true},
  y: {label: "↑ L measured in the hour (mean runs in flight)", domain: [0, m], grid: true},
  marks: [
    Plot.line([[0, 0], [m, m]], {stroke: "#a1a1aa", strokeDasharray: "4,3"}),
    Plot.dot(rows, {x: "lambda_W", y: "L", r: d => 3 + Math.sqrt(d.arrivals), fill: "#2563eb", fillOpacity: 0.7, tip: true, href: () => "https://github.com/numpy/numpy/actions", target: "_blank",
      channels: {"hour (UTC)": d => `${String(d.hour).padStart(2, "0")}:00`, arrivals: "arrivals", "mean time in system (min)": "W_min", "L measured": "L", "λW": "lambda_W", "L / λW": "ratio", "most in flight": "L_max"}}),
    Plot.text(rows, {x: "lambda_W", y: "L", text: d => String(d.hour).padStart(2, "0"), dy: -10, fontSize: 9, fill: "currentColor"}),
  ],
  caption: "On the dashed line the law holds hour by hour. It doesn't need to: an hour is not much longer than a 30-minute run, so a burst of arrivals counts fully in its own λW but spreads its load into the next hours (below the line in the burst hour, above it after). "
    + "Little's law is exact over a window when the system is empty at both ends, and approximate over any window much longer than W.",
});