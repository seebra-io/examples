-- which explains the price better: the load, or the residual load that is left for dispatchable plants? (least squares, hourly)
SELECT predictor, hours, ROUND(cov / varx, 2) AS slope_eur_per_gwh, ROUND(my - cov / varx * mx, 1) AS intercept_eur_mwh,
       ROUND(cov * cov / (varx * vary), 3) AS r2, ROUND(cov / SQRT(varx * vary), 3) AS r
FROM (
  SELECT 'residual load (load - wind - solar)' AS predictor, COUNT(*) AS hours, AVG(residual_gw) AS mx, AVG(price) AS my,
         AVG(residual_gw * price) - AVG(residual_gw) * AVG(price) AS cov,
         AVG(residual_gw * residual_gw) - AVG(residual_gw) * AVG(residual_gw) AS varx,
         AVG(price * price) - AVG(price) * AVG(price) AS vary
  FROM data
  UNION ALL
  SELECT 'load' AS predictor, COUNT(*) AS hours, AVG(load_gw) AS mx, AVG(price) AS my,
         AVG(load_gw * price) - AVG(load_gw) * AVG(price) AS cov,
         AVG(load_gw * load_gw) - AVG(load_gw) * AVG(load_gw) AS varx,
         AVG(price * price) - AVG(price) * AVG(price) AS vary
  FROM data
  UNION ALL
  SELECT 'wind + solar' AS predictor, COUNT(*) AS hours, AVG(renewables_gw) AS mx, AVG(price) AS my,
         AVG(renewables_gw * price) - AVG(renewables_gw) * AVG(price) AS cov,
         AVG(renewables_gw * renewables_gw) - AVG(renewables_gw) * AVG(renewables_gw) AS varx,
         AVG(price * price) - AVG(price) * AVG(price) AS vary
  FROM data
) AS s
ORDER BY r2 DESC