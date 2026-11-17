-- one row per hour and layer; depth_m is the layer's middle (ERA5's layers: 0–7, 7–28, 28–100, 100–255 cm)
SELECT 'air (2 m)' AS layer, 0.0 AS depth_m, 0 AS k, h, time, air AS temp_c FROM data WHERE air IS NOT NULL
UNION ALL SELECT 'soil 0–7 cm' AS layer, 0.035 AS depth_m, 1 AS k, h, time, soil_0_7 AS temp_c FROM data WHERE soil_0_7 IS NOT NULL
UNION ALL SELECT 'soil 7–28 cm' AS layer, 0.175 AS depth_m, 2 AS k, h, time, soil_7_28 AS temp_c FROM data WHERE soil_7_28 IS NOT NULL
UNION ALL SELECT 'soil 28–100 cm' AS layer, 0.64 AS depth_m, 3 AS k, h, time, soil_28_100 AS temp_c FROM data WHERE soil_28_100 IS NOT NULL
UNION ALL SELECT 'soil 100–255 cm' AS layer, 1.775 AS depth_m, 4 AS k, h, time, soil_100_255 AS temp_c FROM data WHERE soil_100_255 IS NOT NULL