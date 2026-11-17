SELECT * FROM (
  SELECT date, weekday, series, count(*) AS episodes
  FROM data
  WHERE kind = 'episode'
  GROUP BY date, weekday, series
) AS days
WHERE episodes >= 3
ORDER BY episodes DESC, date DESC