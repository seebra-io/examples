// Who else holds records from the parish (K-samsök's serviceOrganization
// facet for parishName = the parish parameter): each institution's code, its
// record count, and a link that opens this same board for that institution.
// Names for the codes we are sure of; the rest show K-samsök's code.
(() => {
  const NAMES = {"raä": "Riksantikvarieämbetet", "shm": "Statens historiska museer", "nomu": "Nordiska museet",
                 "jlm": "Jamtli", "upmu": "Upplandsmuseet", "smvk-em": "Etnografiska museet", "s-tek": "Tekniska museet",
                 "arme": "Armémuseum", "uu": "Uppsala universitet"};
  const terms = (((data || {}).result || {}).term || []).filter((t) => t.records > 0);
  return terms.map((t) => ({
    org: t.indexFields.value,
    institution: NAMES[t.indexFields.value] || t.indexFields.value,
    records: t.records,
    board: "https://www.seebra.io/?example=heritage-collection&org=" + encodeURIComponent(t.indexFields.value),
  }));
})()
