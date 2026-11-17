-- Frost per year (complete years only, ≥ 350 days): nights below 0 °C, the last spring frost (before July) and the first autumn frost (from July),
-- and the frost-free season between them: the growing season gardeners and farmers plan by.
SELECT * FROM (
SELECT year, COUNT(*) AS days,
  SUM(CASE WHEN tmin_c < 0 THEN 1 ELSE 0 END) AS frost_nights,
  MAX(CASE WHEN tmin_c < 0 AND month < 7 THEN doy END) AS last_spring_frost_doy,
  MIN(CASE WHEN tmin_c < 0 AND month >= 7 THEN doy END) AS first_autumn_frost_doy,
  MIN(CASE WHEN tmin_c < 0 AND month >= 7 THEN doy END) - MAX(CASE WHEN tmin_c < 0 AND month < 7 THEN doy END) - 1 AS frost_free_days
FROM data
GROUP BY year
) AS y
WHERE days >= 350
ORDER BY year