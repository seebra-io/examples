SELECT artist,
       count(*) AS plays,
       round(sum(minutes) / 60, 1) AS hours,
       round(avg(CASE WHEN skipped THEN 1.0 ELSE 0.0 END) * 100, 1) AS skip_pct,
       min(date) AS first_played,
       max(date) AS last_played,
       count(DISTINCT track) AS tracks
FROM data
GROUP BY artist
ORDER BY hours DESC