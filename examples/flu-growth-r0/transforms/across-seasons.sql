-- Across seasons: the typical growth, R and what it implies, and the
-- Pearson correlations of r with the peak's height and week (the study).
SELECT COUNT(*) AS seasons, ROUND(MEDIAN(r_week), 3) AS median_r_week, ROUND(MEDIAN(doubling_days), 1) AS median_doubling_days,
       ROUND(MIN(R), 2) AS min_R, ROUND(MEDIAN(R), 2) AS median_R, ROUND(MAX(R), 2) AS max_R,
       ROUND(MEDIAN(hit), 3) AS median_herd_threshold, ROUND(MEDIAN(final_size), 3) AS median_final_size,
       ROUND((AVG(r_week * peak) - AVG(r_week) * AVG(peak)) / SQRT((AVG(r_week * r_week) - AVG(r_week) * AVG(r_week)) * (AVG(peak * peak) - AVG(peak) * AVG(peak))), 2) AS corr_growth_peak,
       ROUND((AVG(r_week * peak_t) - AVG(r_week) * AVG(peak_t)) / SQRT((AVG(r_week * r_week) - AVG(r_week) * AVG(r_week)) * (AVG(peak_t * peak_t) - AVG(peak_t) * AVG(peak_t))), 2) AS corr_growth_peak_week
FROM data