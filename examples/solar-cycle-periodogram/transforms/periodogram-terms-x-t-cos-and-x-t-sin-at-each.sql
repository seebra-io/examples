-- Schuster's periodogram: for each trial period P, the squared length of Σ x(t)·e^(−2πit/P), per year of data.
-- Two series: the sunspot number as published, and with every other cycle's sign flipped (the Sun's magnetic polarity).
-- (The terms here; the sums in the next step.)
SELECT 'sunspot number' AS series, period_yr, t, x * COS(6.283185307179586 * t / period_yr) AS re, x * SIN(6.283185307179586 * t / period_yr) AS im
FROM data CROSS JOIN data1
UNION ALL
SELECT 'signed (polarity flips each cycle)' AS series, period_yr, t, xs * COS(6.283185307179586 * t / period_yr) AS re, xs * SIN(6.283185307179586 * t / period_yr) AS im
FROM data CROSS JOIN data1