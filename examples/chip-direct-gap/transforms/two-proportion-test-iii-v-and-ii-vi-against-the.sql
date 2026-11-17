-- H1: III-V and II-VI compounds have a direct gap more often than the other
-- materials here. Two-proportion z-test with the pooled share; one-sided p.
-- (norm_cdf is not in SQL, so the p-value is computed in the next step.)
SELECT grp, COUNT(*) AS n, SUM(is_direct) AS n_direct, AVG(CAST(is_direct AS DOUBLE)) AS share FROM (
  SELECT CASE WHEN family = 'III-V' OR family LIKE 'II-VI%' THEN 'III-V and II-VI' ELSE 'rest' END AS grp,
         CASE WHEN gap_type = 'direct' THEN 1 ELSE 0 END AS is_direct FROM data) AS g
GROUP BY grp ORDER BY grp