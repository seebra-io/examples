SELECT quantity, MAX(total) AS countries, MAX(chi2) AS chi2, MAX(p_value) AS p_value, MAX(mad) AS mad, MAX(mad_by_chance) AS mad_by_chance,
  CASE WHEN MAX(mad) < 0.006 THEN 'close conformity' WHEN MAX(mad) < 0.012 THEN 'acceptable conformity'
       WHEN MAX(mad) < 0.015 THEN 'marginal' ELSE 'nonconformity' END AS nigrini_large_samples
FROM data GROUP BY quantity ORDER BY mad