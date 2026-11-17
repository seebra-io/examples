// Tags that travel with Python in the hot list; orange: questions not answered yet.
const rows = Array.isArray(data) ? data : [];
return plot({
  marginLeft: 120,
  x: {label: "hot questions with the tag →", grid: true},
  y: {label: null},
  color: {legend: true, domain: ["answered", "not answered yet"], range: ["#60a5fa", "#f97316"]},
  marks: [
    Plot.barX(rows, {y: "tags", x: "questions", fill: "#60a5fa", sort: {y: "-x"}, channels: {views: "views"}, tip: true}),
    Plot.barX(rows, {y: "tags", x: "unanswered", fill: "#f97316"}),
    Plot.ruleX([0]),
  ],
});