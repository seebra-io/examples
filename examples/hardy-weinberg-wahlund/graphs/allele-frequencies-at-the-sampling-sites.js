// Where each allele is common: the 1000 Genomes populations at their
// sampling sites, sized by sample size, coloured by the frequency of the
// alternative allele. Pick a variant with the buttons. Hover a site for
// its genotype counts and Hardy–Weinberg test; click it for the variant's
// population page in Ensembl. Caveat: sites are where people were
// sampled (CEU in Utah, GIH in Houston), not where the ancestry is from.
const rows = (Array.isArray(data) ? data : []).filter(d => d.level === "population" && d.lat != null);
const variants = [...new Set(rows.map(d => d.rsid))];
const W = fit?.width ?? 900, Hh = Math.max(360, (fit?.height ?? 480) - 40);
const wrap = document.createElement("div");
const bar = document.createElement("div");
bar.style.cssText = "display:flex;gap:6px;flex-wrap:wrap;margin:4px 0;font:12px sans-serif";
wrap.append(bar);
const holder = document.createElement("div");
wrap.append(holder);
const color = d3.scaleSequential(d3.interpolateViridis).domain([0, 1]);
const draw = rs => {
  holder.innerHTML = "";
  const sel = rows.filter(d => d.rsid === rs);
  const projection = d3.geoNaturalEarth1().fitSize([W, Hh], {type: "Sphere"});
  const path = d3.geoPath(projection);
  const svg = d3.create("svg").attr("width", W).attr("height", Hh).attr("viewBox", [0, 0, W, Hh]);
  svg.append("path").attr("d", path(atlas.land)).attr("fill", "currentColor").attr("fill-opacity", 0.08);
  svg.append("path").attr("d", path(atlas.borders)).attr("fill", "none").attr("stroke", "currentColor").attr("stroke-opacity", 0.25);
  const a = svg.append("g").selectAll("a").data(sel).join("a").attr("href", d => d.link).attr("target", "_blank");
  a.append("circle").attr("transform", d => `translate(${projection([d.lon, d.lat])})`)
    .attr("r", d => 3 + Math.sqrt(d.N) / 1.6).attr("fill", d => color(d.p)).attr("fill-opacity", 0.85)
    .attr("stroke", d => d.p_value < 0.05 ? "#ef4444" : "#fff").attr("stroke-width", d => d.p_value < 0.05 ? 2 : 0.6)
    .append("title").text(d => `${d.pop} ${d.pop_name} (${d.superpop}), N ${d.N}\n${d.rsid} ${d.gene}: p(${d.alt}) = ${d.p}\n` +
      `genotypes ${d.ref}${d.ref} / ${d.ref}${d.alt} / ${d.alt}${d.alt}: ${d.n_ref_ref} / ${d.n_het} / ${d.n_alt_alt} (expected ${d.e_ref_ref} / ${d.e_het} / ${d.e_alt_alt})\n` +
      `χ² ${d.chi2 ?? "–"} (p ${d.p_value ?? "–"}), F ${d.F ?? "–"}${d.p_value < 0.05 ? "\nred ring: off Hardy–Weinberg at p < 0.05" : ""}`);
  const lg = svg.append("g").attr("transform", `translate(12,${Hh - 26})`);
  d3.range(0, 1.01, 0.1).forEach((v, i) => lg.append("rect").attr("x", i * 18).attr("width", 18).attr("height", 10).attr("fill", color(v)));
  lg.append("text").attr("y", -4).attr("font-size", 11).attr("fill", "currentColor").text(`frequency of ${sel[0]?.alt ?? "alt"} at ${rs} (${sel[0]?.trait ?? ""}): 0 → 1`);
  holder.append(svg.node());
};
variants.forEach((rs, i) => {
  const b = document.createElement("button");
  const g = rows.find(d => d.rsid === rs)?.gene;
  b.textContent = `${rs} ${g}`;
  b.style.cssText = "padding:2px 8px;border:1px solid currentColor;border-radius:4px;background:transparent;color:inherit;cursor:pointer";
  b.onclick = () => draw(rs);
  bar.append(b);
});
draw(variants[0]);
return wrap;