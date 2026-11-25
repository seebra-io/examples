// The paper being reproduced: its citation (APA, from Crossref), the
// original figure (a link: the image stays at PLOS), its archived data and
// what this board does differently. data: the paper and dataset rows.
const [paper, dataset] = [data.find((d) => d.kind === "paper") || {}, data.find((d) => d.kind === "data") || {}];
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const a = (href, text) => `<a href="${esc(href)}" style="color:#4e9bd6">${esc(text)}</a>`;
const names = String(paper.authors || "").split("; ").filter(Boolean);
const apaNames = names.length > 1 ? names.slice(0, -1).join(", ") + ", & " + names[names.length - 1] : names[0] || "";
const box = document.createElement("div");
box.style.cssText = `font:13px/1.5 sans-serif;padding:10px 12px;max-width:${Math.max(320, fit.width - 24)}px;overflow:auto;max-height:${fit.height - 8}px`;
box.innerHTML = `
<div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;opacity:.6">Reproducing Figure 1 of</div>
<div style="margin:2px 0 8px">${esc(apaNames)} (${esc(paper.year)}). ${esc(paper.title)}. <i>${esc(paper.journal)}</i>, <i>${esc(paper.volume)}</i>(${esc(paper.issue)}), ${esc(paper.article)}.
 ${a(paper.url, paper.url)}</div>
<div>${a(paper.figure_url, "See the original Figure 1 at PLOS Biology")} (figure DOI ${a("https://doi.org/" + paper.figure_doi, paper.figure_doi)}) and compare it with the panels beside this card.</div>
<div style="margin-top:8px"><b>The paper's data</b>: ${esc(dataset.title)}. ${esc(dataset.journal)}, ${esc(dataset.year)}. ${a(dataset.url, dataset.url)} · ${esc(dataset.license)}.
 This board doesn't read that frozen copy: it asks the PBDB today, so the counts have grown since the authors' download of 22 January 2015.</div>
<div style="margin-top:8px"><b>The claim checked</b> (the study on this board): across the Mesozoic, face-value genus and species counts show no significant
 long-term trend unless the first Triassic bin is left out, and after subsampling the net diversification rate is near zero
 (0.00335 ln(species) per Myr, ±2 SE 0.00089–0.00581).</div>
<div style="margin-top:8px;opacity:.8"><b>Different here</b>: PBDB's 10-Myr bins (the paper's S1 Table bins differ a little); non-marine taken as PBDB's
 terrestrial environments with regular taxa (the paper removed ootaxa, ichnotaxa and marine taxa by name); SQS worldwide at genus level,
 by occurrence (the paper: species, within continental regions).</div>
<div style="margin-top:8px;opacity:.8">Crossref counts ${esc(paper.cited_by ?? "?")} citations of the paper: ${a("https://journals.plos.org/plosbiology/article/metrics?id=10.1371/journal.pbio.1002359", "the paper's metrics at PLOS")} ·
 the boards using the same data: Cite › Paleobiology Database › Other boards.</div>`;
return box;