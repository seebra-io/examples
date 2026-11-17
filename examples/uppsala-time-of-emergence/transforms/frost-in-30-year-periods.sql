-- The frost record in 30-year periods: how much longer the frost-free season is, and how many fewer frost nights.
SELECT period_from, period_from + 29 AS period_to,
  COUNT(*) AS years,
  ROUND(AVG(frost_free_days), 1) AS frost_free_days,
  ROUND(AVG(frost_nights), 1) AS frost_nights,
  ROUND(AVG(last_spring_frost_doy), 0) AS last_spring_frost_doy,
  ROUND(AVG(first_autumn_frost_doy), 0) AS first_autumn_frost_doy
FROM (SELECT *, CAST(1840 + 30 * FLOOR((year - 1840) / 30.0) AS INT) AS period_from FROM data) AS p
GROUP BY period_from
ORDER BY period_from