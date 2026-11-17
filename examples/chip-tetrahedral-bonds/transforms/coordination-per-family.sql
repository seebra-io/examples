SELECT family, coordination, COUNT(*) AS n, ROUND(AVG(delta_chi), 2) AS mean_delta_chi, ROUND(AVG(n_bar), 2) AS mean_n_bar
FROM data GROUP BY family, coordination ORDER BY family, coordination