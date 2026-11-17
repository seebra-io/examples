-- Everything on one time axis (seconds since the page loaded): lanes for canvas moves, long frames, scripts, page fetches, resources and interactions; paints and LCP as instants.
SELECT kind,
  CASE kind WHEN 'move' THEN '1 canvas moves' WHEN 'interaction' THEN '2 interactions' WHEN 'frame' THEN '3 long frames' WHEN 'task' THEN '3 long frames'
            WHEN 'script' THEN '4 scripts in them' WHEN 'span' THEN '5 Seebra spans' WHEN 'request' THEN '6 page fetches'
            WHEN 'resource' THEN '7 resources' ELSE '0 paints' END AS lane,
  name, origin, file, detail, start_ms / 1000.0 AS start_s, (start_ms + COALESCE(duration_ms, 0)) / 1000.0 AS end_s,
  duration_ms, blocking_ms, status, moving
FROM data
WHERE kind <> 'navigation'
ORDER BY start_ms