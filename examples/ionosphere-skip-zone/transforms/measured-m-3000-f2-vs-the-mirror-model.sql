-- measured M(3000)F2 (from the ionogram's shape) against the mirror model's sec i at 3000 km, and the longest single hop
SELECT code, name, daylight, lst, fof2, hmf2, m3000, mufd, muf_calc,
       ROUND(SQRT(1 + POWER(SIN(3000 / 12742.0) / (1 + hmf2 / 6371.0 - COS(3000 / 12742.0)), 2)), 3) AS sec_i_3000,
       ROUND(fof2 * SQRT(1 + POWER(SIN(3000 / 12742.0) / (1 + hmf2 / 6371.0 - COS(3000 / 12742.0)), 2)), 2) AS muf_mirror_3000,
       ROUND(2 * 6371.0 * ACOS(6371.0 / (6371.0 + hmf2)), 0) AS max_hop_km
FROM data
WHERE hmf2 IS NOT NULL
ORDER BY lst