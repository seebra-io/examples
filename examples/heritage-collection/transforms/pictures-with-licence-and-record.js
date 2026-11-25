// The image grid's rows: the picture (url), what it shows (title), its
// licence and credit as the record states them, and the record to open
// (link). A picture with no stated licence says so: check before reuse.
data.filter((d) => d.set === "image sample" && d.thumbnail)
  .map((d) => ({
    url: d.thumbnail,
    title: [d.label, d.dated, d.place || d.parish].filter(Boolean).join(" · "),
    licence: d.image_licence || "no licence stated",
    credit: d.image_credit,
    link: d.record,
  }))
