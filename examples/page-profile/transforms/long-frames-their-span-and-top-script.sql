-- Every long frame (LoAF, or a long task where the browser has no LoAF): when, how long, how much of it blocked input (blocking_ms: the part over 50 ms),
-- whether the canvas was moving, the span (graph draw, runtime spec...) that ran longest in it, and its longest script.
SELECT f.t_s, f.start_ms, f.duration_ms, f.blocking_ms, f.moving, f.name AS span, f.kind,
  sc.script, sc.script_origin, sc.script_ms
FROM (SELECT * FROM data WHERE kind IN ('frame', 'task')) AS f
LEFT JOIN (
  SELECT x.frame_ms, MAX(x.name) AS script, MAX(x.origin) AS script_origin, MAX(x.duration_ms) AS script_ms
  FROM (SELECT * FROM data WHERE kind = 'script') AS x
  JOIN (SELECT frame_ms, MAX(duration_ms) AS top_ms FROM data WHERE kind = 'script' GROUP BY frame_ms) AS m
    ON x.frame_ms = m.frame_ms AND x.duration_ms = m.top_ms
  GROUP BY x.frame_ms
) AS sc ON f.frame_ms = sc.frame_ms
ORDER BY f.start_ms