-- One long table: five measures, each point a processor (year of introduction, value),
-- with log2 of the value: on a log2 scale a straight line is a constant doubling time.
SELECT series, measure, unit, year, value, processor, LN(value) / LN(2.0) AS log2_value,
  'https://www.karlrupp.net/2018/02/42-years-of-microprocessor-trend-data/' AS link
FROM (
  SELECT * FROM data UNION ALL SELECT * FROM data1 UNION ALL SELECT * FROM data2
  UNION ALL SELECT * FROM data3 UNION ALL SELECT * FROM data4
) AS t
ORDER BY series, year