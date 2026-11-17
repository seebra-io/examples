-- one row per column of air and pressure level (the API answers one wide record per place)
SELECT latitude, longitude, elevation, surface_hpa, time, 1000.0 AS p_hpa, t_1000 AS temp_c, z_1000 AS z_m FROM data
UNION ALL
SELECT latitude, longitude, elevation, surface_hpa, time, 925.0 AS p_hpa, t_925 AS temp_c, z_925 AS z_m FROM data
UNION ALL
SELECT latitude, longitude, elevation, surface_hpa, time, 850.0 AS p_hpa, t_850 AS temp_c, z_850 AS z_m FROM data
UNION ALL
SELECT latitude, longitude, elevation, surface_hpa, time, 700.0 AS p_hpa, t_700 AS temp_c, z_700 AS z_m FROM data
UNION ALL
SELECT latitude, longitude, elevation, surface_hpa, time, 600.0 AS p_hpa, t_600 AS temp_c, z_600 AS z_m FROM data
UNION ALL
SELECT latitude, longitude, elevation, surface_hpa, time, 500.0 AS p_hpa, t_500 AS temp_c, z_500 AS z_m FROM data
UNION ALL
SELECT latitude, longitude, elevation, surface_hpa, time, 400.0 AS p_hpa, t_400 AS temp_c, z_400 AS z_m FROM data
UNION ALL
SELECT latitude, longitude, elevation, surface_hpa, time, 300.0 AS p_hpa, t_300 AS temp_c, z_300 AS z_m FROM data
UNION ALL
SELECT latitude, longitude, elevation, surface_hpa, time, 250.0 AS p_hpa, t_250 AS temp_c, z_250 AS z_m FROM data
UNION ALL
SELECT latitude, longitude, elevation, surface_hpa, time, 200.0 AS p_hpa, t_200 AS temp_c, z_200 AS z_m FROM data
UNION ALL
SELECT latitude, longitude, elevation, surface_hpa, time, 150.0 AS p_hpa, t_150 AS temp_c, z_150 AS z_m FROM data
UNION ALL
SELECT latitude, longitude, elevation, surface_hpa, time, 100.0 AS p_hpa, t_100 AS temp_c, z_100 AS z_m FROM data
UNION ALL
SELECT latitude, longitude, elevation, surface_hpa, time, 50.0 AS p_hpa, t_50 AS temp_c, z_50 AS z_m FROM data