-- WKB tunnelling through the Coulomb barrier: P = exp(−2G), G = 2η [arccos √x − √(x(1 − x))], x = R/b.
-- The half-life is (time between knocks on the barrier) / P, so log₁₀ t½ = 2G / ln 10 + a constant.
SELECT *, 2 * (2 * eta * (ACOS(SQRT(x)) - SQRT(x * (1 - x)))) / LN(10) AS gamow_log10
FROM data WHERE x > 0 AND x < 1 ORDER BY gamow_log10