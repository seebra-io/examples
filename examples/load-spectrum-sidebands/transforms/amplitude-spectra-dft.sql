-- the amplitude spectrum: a discrete Fourier transform of the windowed signal at each grid frequency,
-- scaled so a pure cosine of amplitude A gives A (divide by the sum of the window, times 2)
SELECT variant, f_cpd, ROUND(2.0 * SQRT(c * c + s * s) / sw, 4) AS amplitude_gw,
       ROUND(20.0 * LOG10(GREATEST(2.0 * SQRT(c * c + s * s) / sw, 0.0001)), 2) AS amplitude_db, n
FROM (
  SELECT d.variant AS variant, g.f_cpd AS f_cpd,
         SUM(d.w * d.x * COS(6.283185307179586 * g.f_cpd * d.day)) AS c,
         SUM(d.w * d.x * SIN(6.283185307179586 * g.f_cpd * d.day)) AS s,
         SUM(d.w) AS sw, COUNT(*) AS n
  FROM data AS d CROSS JOIN data1 AS g
  WHERE g.f_cpd > 0
  GROUP BY d.variant, g.f_cpd
) AS p
ORDER BY variant, f_cpd