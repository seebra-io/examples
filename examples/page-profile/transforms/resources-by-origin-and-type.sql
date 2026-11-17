-- The network, by origin and type: every resource the browser fetched (scripts, styles, fonts, fetch/XHR from the page and its workers) and every fetch from the page.
-- wait_ms is the time to first byte (server and network latency); duration the whole transfer. bytes 0: from cache, or a cross-origin answer without Timing-Allow-Origin.
SELECT origin, type, COUNT(*) AS n,
  ROUND(SUM(dur_ms), 0) AS total_ms, ROUND(AVG(dur_ms), 0) AS mean_ms, ROUND(MAX(dur_ms), 0) AS slowest_ms,
  ROUND(AVG(blocking_ms), 0) AS mean_wait_ms, ROUND(SUM(COALESCE(bytes, 0)) / 1024.0, 1) AS kib,
  SUM(CASE WHEN moving THEN 1 ELSE 0 END) AS during_moves
-- Chromium reports a negative duration for a resource served from a preload already in flight (a module preload): counted as 0.
FROM (SELECT origin, blocking_ms, bytes, moving, COALESCE(detail, 'other') AS type, CASE WHEN duration_ms < 0 THEN 0 ELSE duration_ms END AS dur_ms
      FROM data WHERE kind = 'resource') AS r
GROUP BY origin, type
ORDER BY total_ms DESC