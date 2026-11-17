SELECT 'all years' AS period, year, date, max_mm FROM data
UNION ALL SELECT CASE WHEN year <= 1982 THEN '1940–1982' ELSE '1983–2025' END AS period, year, date, max_mm FROM data