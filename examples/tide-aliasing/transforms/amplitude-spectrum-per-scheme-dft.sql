-- the amplitude spectrum (a discrete Fourier transform at each grid frequency), up to each scheme's Nyquist frequency
SELECT scheme, f_cpd, 2.0 * SQRT(c * c + s * s) / n AS amplitude_m, n AS samples, nyquist_cpd
FROM (
  SELECT d.scheme AS scheme, g.f_cpd AS f_cpd,
         SUM(d.x * COS(6.283185307179586 * g.f_cpd * d.day)) AS c,
         SUM(d.x * SIN(6.283185307179586 * g.f_cpd * d.day)) AS s,
         COUNT(*) AS n, MAX(d.nyquist_cpd) AS nyquist_cpd
  FROM data AS d CROSS JOIN data1 AS g
  WHERE g.f_cpd <= d.nyquist_cpd
  GROUP BY d.scheme, g.f_cpd
) AS p
ORDER BY scheme, f_cpd