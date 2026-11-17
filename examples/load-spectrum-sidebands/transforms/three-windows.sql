-- three ways to look at the same signal: 8 whole weeks with a rectangular window, the same with a Hann window,
-- and only the first week (a record of T = 7 days resolves no better than 1/T = 1/7 per day)
SELECT 'A: 8 weeks, rectangular' AS variant, k, day, x, 1.0 AS w FROM data
UNION ALL
SELECT 'B: 8 weeks, Hann window' AS variant, k, day, x, 0.5 - 0.5 * COS(6.283185307179586 * k / N) AS w FROM data
UNION ALL
SELECT 'C: first week only, rectangular' AS variant, k, day, x, 1.0 AS w FROM data WHERE k < 168