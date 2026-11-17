-- the response spectrum per station, as rows: period 0 s is the peak ground acceleration (an infinitely stiff oscillator)
SELECT station, name, distance_km, dist_bin, 0.0 AS period_s, pga AS sa_g, 1.0 AS sa_over_pga FROM data
UNION ALL SELECT station, name, distance_km, dist_bin, 0.3 AS period_s, psa03 AS sa_g, amp03 AS sa_over_pga FROM data
UNION ALL SELECT station, name, distance_km, dist_bin, 1.0 AS period_s, psa10 AS sa_g, amp10 AS sa_over_pga FROM data
UNION ALL SELECT station, name, distance_km, dist_bin, 3.0 AS period_s, psa30 AS sa_g, amp30 AS sa_over_pga FROM data