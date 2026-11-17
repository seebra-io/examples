-- The verdict: long frames and requests while the canvas moved against while it stood still, and what ran in the moving frames.
-- A pan should cost no long frames at all (each frame has 16 ms at 60 Hz); requests started during a move are a bug (perf.cljs logs them too).
SELECT phase,
  SUM(CASE WHEN kind IN ('frame', 'task') THEN 1 ELSE 0 END) AS long_frames,
  ROUND(SUM(CASE WHEN kind IN ('frame', 'task') THEN duration_ms ELSE 0 END), 0) AS long_frame_ms,
  ROUND(SUM(CASE WHEN kind IN ('frame', 'task') THEN COALESCE(blocking_ms, 0) ELSE 0 END), 0) AS blocking_ms,
  SUM(CASE WHEN kind = 'request' THEN 1 ELSE 0 END) AS page_requests,
  SUM(CASE WHEN kind = 'interaction' THEN 1 ELSE 0 END) AS interactions,
  ROUND(MAX(CASE WHEN kind = 'interaction' THEN duration_ms END), 0) AS slowest_interaction_ms,
  ROUND(SUM(CASE WHEN kind = 'move' THEN duration_ms ELSE 0 END) / 1000.0, 1) AS moving_s
FROM (SELECT *, CASE WHEN moving THEN 'while the canvas moved' ELSE 'while it stood still' END AS phase FROM data) AS d
GROUP BY phase
ORDER BY phase