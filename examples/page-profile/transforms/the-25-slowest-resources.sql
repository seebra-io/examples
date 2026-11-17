-- The 25 slowest single resources: what to look at first (open one to see it).
SELECT name AS url, origin, file, detail AS type, t_s, ROUND(duration_ms, 0) AS duration_ms, ROUND(blocking_ms, 0) AS wait_ms,
  ROUND(COALESCE(bytes, 0) / 1024.0, 1) AS kib, status, moving
FROM data
WHERE kind = 'resource'
ORDER BY duration_ms DESC
LIMIT 25