// The paper and its archived data, as Crossref and DataCite describe them
// today: data[0] the paper's Crossref record, data[1] the Dryad dataset's
// DataCite record. One row each, with what a citation needs.
(() => {
  const w = (data[0] && data[0].message) || {};
  const d = (data[1] && data[1].data && data[1].data.attributes) || {};
  const year = (x) => (x && x["date-parts"] && x["date-parts"][0] && x["date-parts"][0][0]) || null;
  const authors = (w.author || []).map((a) => `${a.family}, ${(a.given || "").split(/[\s.]+/).filter(Boolean).map((g) => g[0] + ".").join(" ")}`);
  return [
    {
      kind: "paper",
      title: (w.title || [])[0] || "",
      authors: authors.join("; "),
      year: year(w.issued),
      journal: (w["container-title"] || [])[0] || "",
      volume: w.volume || "", issue: w.issue || "", article: w.page || w["article-number"] || "",
      doi: w.DOI || "10.1371/journal.pbio.1002359",
      url: "https://doi.org/" + (w.DOI || "10.1371/journal.pbio.1002359"),
      figure_url: "https://journals.plos.org/plosbiology/article/figure?id=10.1371/journal.pbio.1002359.g001",
      figure_doi: "10.1371/journal.pbio.1002359.g001",
      cited_by: w["is-referenced-by-count"] ?? null,
      license: ((w.license || [])[0] || {}).URL || "",
      source: "Crossref"
    },
    {
      kind: "data",
      title: ((d.titles || [])[0] || {}).title || "",
      authors: (d.creators || []).map((c) => c.name).join("; "),
      year: d.publicationYear || null,
      journal: d.publisher || "Dryad",
      volume: "", issue: "", article: "",
      doi: d.doi || "10.5061/dryad.9fr76",
      url: "https://doi.org/" + (d.doi || "10.5061/dryad.9fr76"),
      figure_url: "", figure_doi: "",
      cited_by: d.citationCount ?? null,
      license: ((d.rightsList || [])[0] || {}).rights || "",
      source: "DataCite"
    }
  ];
})()