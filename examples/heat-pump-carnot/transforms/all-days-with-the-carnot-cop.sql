-- the four systems' days together, with the Carnot limit: COP_carnot = T_hot / (T_hot − T_cold) in kelvin,
-- T_hot = flow temperature, T_cold = outdoor air; the lift is the temperature the heat pump has to climb.
-- Heating season only (daily mean outdoor ≤ 15 °C): warmer days are mostly short runs and hot-water-like cycles
SELECT system, system_id, day, heat_kwh, elec_kwh, flow_c, return_c, outside_c, room_c,
       ROUND(heat_kwh / elec_kwh, 3) AS cop,
       ROUND(flow_c - outside_c, 2) AS lift_k,
       ROUND((flow_c + 273.15) / (flow_c - outside_c), 3) AS cop_carnot,
       ROUND((heat_kwh / elec_kwh) / ((flow_c + 273.15) / (flow_c - outside_c)), 3) AS carnot_fraction
FROM (
  SELECT * FROM data UNION ALL SELECT * FROM data1 UNION ALL SELECT * FROM data2 UNION ALL SELECT * FROM data3
) AS d
WHERE flow_c - outside_c >= 5 AND outside_c <= 15
ORDER BY system, day