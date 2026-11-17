# the year per system: seasonal COP (heat / electricity), heat-weighted temperatures and the share of Carnot
data.group_by("system", "system_id")
    .agg(days = len(), heat_kwh = col("heat_kwh").sum(), elec_kwh = col("elec_kwh").sum(),
         flow_c = (col("flow_c") * col("heat_kwh")).sum() / col("heat_kwh").sum(),
         outside_c = (col("outside_c") * col("heat_kwh")).sum() / col("heat_kwh").sum(),
         lift_k = (col("lift_k") * col("heat_kwh")).sum() / col("heat_kwh").sum(),
         carnot_fraction = col("carnot_fraction").median())
    .with_columns(scop = (col("heat_kwh") / col("elec_kwh")).round(2), heat_kwh = col("heat_kwh").round(0), elec_kwh = col("elec_kwh").round(0),
                  flow_c = col("flow_c").round(1), outside_c = col("outside_c").round(1), lift_k = col("lift_k").round(1),
                  carnot_fraction = col("carnot_fraction").round(3),
                  cop_carnot_at_mean = ((col("flow_c") + 273.15) / col("lift_k")).round(2))
    .select("system", "system_id", "days", "heat_kwh", "elec_kwh", "scop", "flow_c", "outside_c", "lift_k", "cop_carnot_at_mean", "carnot_fraction")
    .sort("flow_c")