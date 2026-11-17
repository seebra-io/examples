-- One row per season and year: the mean of its daily minima. Only seasons with at least 80 of their ~90 days (the record has gaps: 1868-83, 1922-30, 1945-58).
SELECT * FROM (
SELECT season_year AS year, season, ROUND(AVG(tmin_c), 2) AS mean_tmin_c, COUNT(*) AS days,
  CASE WHEN season_year BETWEEN 1850 AND 1900 THEN '1850–1900 (pre-industrial)'
       WHEN season_year BETWEEN 1996 AND 2025 THEN '1996–2025 (last 30 years)' ELSE 'other years' END AS era
FROM data
GROUP BY season_year, season
) AS s
WHERE days >= 80
ORDER BY season, year