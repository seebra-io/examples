// One row per platform: what you get, where to ask for it, which file in the
// export matters, how long it takes, and what to look at once it's here.
data.exports.map(e => ({
  platform: e.platform,
  kind: e.kind,
  where: e.where || "(your own provider's site)",
  steps: e.steps,
  file: e.file,
  format: e.format,
  wait: e.wait,
  wait_days: e.wait_days,
  ideas: e.ideas,
  caveat: e.caveat,
  live_api: e.live || ""
}))