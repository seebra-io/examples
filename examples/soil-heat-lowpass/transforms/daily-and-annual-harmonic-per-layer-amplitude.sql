-- the daily and the annual harmonic of each layer: amplitude and phase from a one-frequency Fourier transform
-- (x ≈ A·cos(ωt − φ); three whole years, so both cycles fit a whole number of times)
SELECT layer, depth_m, k, 'daily' AS cycle, 24.0 AS period_h, n,
       2.0 * SQRT(c1 * c1 + s1 * s1) / n AS amplitude_c, ATAN2(s1, c1) AS phase_rad, mean_c
FROM (SELECT layer, MAX(depth_m) AS depth_m, MAX(k) AS k, COUNT(*) AS n, AVG(temp_c) AS mean_c,
             SUM(x * COS(6.283185307179586 * h / 24.0)) AS c1, SUM(x * SIN(6.283185307179586 * h / 24.0)) AS s1
      FROM data GROUP BY layer) AS d
UNION ALL
SELECT layer, depth_m, k, 'annual' AS cycle, 8766.0 AS period_h, n,
       2.0 * SQRT(c2 * c2 + s2 * s2) / n AS amplitude_c, ATAN2(s2, c2) AS phase_rad, mean_c
FROM (SELECT layer, MAX(depth_m) AS depth_m, MAX(k) AS k, COUNT(*) AS n, AVG(temp_c) AS mean_c,
             SUM(x * COS(6.283185307179586 * h / 8766.0)) AS c2, SUM(x * SIN(6.283185307179586 * h / 8766.0)) AS s2
      FROM data GROUP BY layer) AS a