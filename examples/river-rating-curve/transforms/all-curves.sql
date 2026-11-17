SELECT era, -1 AS decade, measurements, e, b, C, sigma_log, min_stage, max_stage, min_q, max_q FROM data
UNION ALL
SELECT era, decade, measurements, e, b, C, sigma_log, min_stage, max_stage, min_q, max_q FROM data1