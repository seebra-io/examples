// Explore's catalog is open: an item submitted to Explore may carry more,
// such as its dashboard's whole spec in place of a link. Read as one table,
// a field that is a link here and an object there failed every step
// ("error deserializing value"), so only the fields used below are kept
({ items: data.items.map((x) => ({
  id: x.id, kind: x.kind, title: x.title, summary: x.summary, description: x.description,
  categories: x.categories || [], tags: x.tags || [],
  api: x.api ? { url: x.api.url ?? null, docs: x.api.docs ?? null } : null,
})) })
