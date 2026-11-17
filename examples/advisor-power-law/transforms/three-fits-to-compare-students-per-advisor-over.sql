SELECT d.*, CONCAT(d.network, ', k ≥ 1') AS fit, 1 AS xmin FROM data d
UNION ALL
SELECT d.*, CONCAT(d.network, ', tail k ≥ ', CAST(b.xmin AS VARCHAR)) AS fit, b.xmin AS xmin
FROM data d CROSS JOIN data1 b WHERE d.network = 'students per advisor' AND d.k >= b.xmin