-- Miller indices h ≥ k ≥ l ≥ 0 up to 6 (one representative per family {hkl}),
-- N = h² + k² + l², the multiplicity m (permutations × sign changes) and the
-- structure-factor class of the fcc lattice with a two-atom basis at 0 and ¼¼¼:
--   mixed parity:               |F|² = 0 (fcc extinction)
--   all odd:                    |F|² = 16 (fA² + fB²)
--   all even, h+k+l = 4n:       |F|² = 16 (fA + fB)²
--   all even, h+k+l = 4n + 2:   |F|² = 16 (fA − fB)²  (zero when A = B: Si, Ge, C)
SELECT h, k, l, h*h + k*k + l*l AS n_sq,
  CONCAT('(', CAST(h AS VARCHAR), CAST(k AS VARCHAR), CAST(l AS VARCHAR), ')') AS hkl,
  (CASE WHEN h = k AND k = l THEN 1 WHEN h = k OR k = l THEN 3 ELSE 6 END)
    * (CASE WHEN h > 0 THEN 2 ELSE 1 END) * (CASE WHEN k > 0 THEN 2 ELSE 1 END) * (CASE WHEN l > 0 THEN 2 ELSE 1 END) AS multiplicity,
  CASE WHEN (h % 2) = 1 AND (k % 2) = 1 AND (l % 2) = 1 THEN 'all odd'
       WHEN (h % 2) = 0 AND (k % 2) = 0 AND (l % 2) = 0 AND ((h + k + l) % 4) = 0 THEN 'even, h+k+l = 4n'
       WHEN (h % 2) = 0 AND (k % 2) = 0 AND (l % 2) = 0 THEN 'even, h+k+l = 4n+2'
       ELSE 'mixed' END AS class
FROM UNNEST([0, 1, 2, 3, 4, 5, 6]) AS hh(h)
CROSS JOIN UNNEST([0, 1, 2, 3, 4, 5, 6]) AS kk(k)
CROSS JOIN UNNEST([0, 1, 2, 3, 4, 5, 6]) AS ll(l)
WHERE h >= k AND k >= l AND h > 0 AND h*h + k*k + l*l <= 48
ORDER BY n_sq