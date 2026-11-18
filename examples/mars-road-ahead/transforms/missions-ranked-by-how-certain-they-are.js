// One row per mission, ranked from most to least certain, with the year it
// was first meant to launch and how many years it has slipped since.
// (One expression: a JavaScript step returns its value.)
data.missions.map(d => {
  const RANK = ["On the way", "Funded", "Partly funded", "Proposed", "Uncertain", "Cancelled"];
  const target = d.launch_year != null ? d.launch_year : d.launch_earliest;
  const first = d.slipped_years.length ? Math.min(...d.slipped_years) : null;
  return {...d,
    certainty: RANK.indexOf(d.status) + 1,
    first_target_year: first,
    years_slipped: first != null && target != null ? Math.floor(target) - first : null,
    as_of: data.checked};
})