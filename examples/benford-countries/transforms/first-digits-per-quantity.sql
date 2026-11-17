SELECT quantity, digit, COUNT(*) AS n FROM (
  SELECT 'population' AS quantity, d_pop AS digit FROM data WHERE d_pop IS NOT NULL
  UNION ALL SELECT 'land area (km²)' AS quantity, d_area AS digit FROM data WHERE d_area IS NOT NULL
  UNION ALL SELECT 'GDP (current US$)' AS quantity, d_gdp AS digit FROM data WHERE d_gdp IS NOT NULL
  UNION ALL SELECT 'CO₂ emissions (Mt)' AS quantity, d_co2 AS digit FROM data WHERE d_co2 IS NOT NULL
) AS d GROUP BY quantity, digit ORDER BY quantity, digit