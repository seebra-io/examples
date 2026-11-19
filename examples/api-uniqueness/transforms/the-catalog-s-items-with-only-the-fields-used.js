// Explore's catalog is open: an item submitted to Explore may carry more,
// such as its dashboard's whole spec in place of a link. Read as one table,
// a field that is a link here and an object there failed every step
// ("error deserializing value"); a nested api object, null for most items,
// stopped the data runtime. So: only the fields used below, flat, with
// text where a value is missing
({ items: data.items.map((x) => ({
  id: x.id, kind: x.kind || "", title: x.title || "", summary: x.summary || "", description: x.description || "",
  categories: (x.categories || []).map(String), tags: (x.tags || []).map(String),
  api_url: (x.api && x.api.url) || "", api_docs: (x.api && x.api.docs) || "",
})) })
