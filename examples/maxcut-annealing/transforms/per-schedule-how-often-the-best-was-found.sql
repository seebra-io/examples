SELECT method, sweeps,
       count(*) AS runs,
       sum(hit) AS found_best,
       round(100.0 * sum(hit) / count(*), 1) AS found_best_pct,
       round(avg(ratio), 4) AS mean_ratio,
       min(cut) AS worst_cut,
       max(cut) AS best_cut
FROM data
GROUP BY method, sweeps
ORDER BY sweeps