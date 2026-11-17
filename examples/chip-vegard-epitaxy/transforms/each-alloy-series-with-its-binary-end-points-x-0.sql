SELECT system, formula, sg, x, a_A, gap_ev, hull_ev, link, 'ordered alloy' AS kind FROM data
UNION ALL SELECT '(In,Ga)As' AS system, formula, sg, CASE WHEN material = 'GaAs' THEN 0.0 ELSE 1.0 END AS x, a_A, gap_ev, hull_ev, link, 'binary' AS kind FROM data1 WHERE material IN ('GaAs', 'InAs')
UNION ALL SELECT '(Al,Ga)As' AS system, formula, sg, CASE WHEN material = 'GaAs' THEN 0.0 ELSE 1.0 END AS x, a_A, gap_ev, hull_ev, link, 'binary' AS kind FROM data1 WHERE material IN ('GaAs', 'AlAs')
ORDER BY system, x