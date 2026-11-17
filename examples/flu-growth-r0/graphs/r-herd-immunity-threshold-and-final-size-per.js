// What the growth rates mean: each season's effective reproduction number
// R (from r with a 3-day generation interval), and the SIR model's three
// consequences: the herd-immunity threshold 1 − 1/R (the share immune at
// which an epidemic stops growing), the final size (share ever infected,
// z = 1 − e^(−Rz)) and its overshoot past the threshold. Notice: R is
// about 1.1–1.3, so blocking a tenth to a fifth of transmissions (or
// immunising that share) is enough to stop growth; measles (R0 ≈ 12–18)
// needs over 90%. Yet the final size is about twice the threshold. Hover a season for its numbers.
const rows = Array.isArray(data) ? data : [];
const long = rows.flatMap(d => [
  {season: d.season, what: "herd-immunity threshold 1 − 1/R", v: d.hit, d},
  {season: d.season, what: "final size (SIR)", v: d.final_size, d}]);
return plot({
  height: Math.max(360, (fit?.height ?? 440) - 20), marginLeft: 70, marginRight: 60,
  y: {domain: rows.map(d => d.season), label: null},
  x: {label: "share of the population →", domain: [0, 0.5], tickFormat: "%", grid: true},
  color: {domain: ["herd-immunity threshold 1 − 1/R", "final size (SIR)"], range: ["#10b981", "#f43f5e"], legend: true},
  marks: [
    Plot.link(rows, {y1: "season", y2: "season", x1: "hit", x2: "final_size", stroke: "currentColor", strokeOpacity: 0.35}),
    Plot.dot(long, {y: "season", x: "v", fill: "what", r: 5, tip: true,
      channels: {R: d => d.d.R, "R (SIR, exponential interval)": d => d.d.R_sir, "r per week": d => d.d.r_week, "doubling (days)": d => d.d.doubling_days,
                 "fit R²": d => d.d.fit_r2, "window (weeks)": d => `${d.d.t0}–${d.d.t1}`, "peak ILI+": d => d.d.peak}}),
    Plot.text(rows, {y: "season", x: "final_size", text: d => `R ${d.R}`, dx: 10, textAnchor: "start", fontSize: 11}),
  ],
  caption: "Line: the overshoot (infections after the threshold is reached). SIR in a homogeneous, fully susceptible population: real seasons infect fewer (prior immunity, behaviour, school terms).",
});