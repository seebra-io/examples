# per system and 2 K band of outdoor temperature: the measured COP against the Carnot limit at the same temperatures
data.with_columns(out_bin = (col("outside_c") / 2).floor() * 2 + 1)
    .group_by("system", "out_bin")
    .agg(days = len(), cop = (col("heat_kwh").sum() / col("elec_kwh").sum()), flow_c = col("flow_c").mean(), lift_k = col("lift_k").mean(),
         cop_carnot = col("cop_carnot").median(), heat_kwh_per_day = col("heat_kwh").mean())
    .filter(col("days") >= 3)
    .with_columns(cop = col("cop").round(2), flow_c = col("flow_c").round(1), lift_k = col("lift_k").round(1), cop_carnot = col("cop_carnot").round(2),
                  carnot_fraction = (col("cop") / col("cop_carnot")).round(3), heat_kwh_per_day = col("heat_kwh_per_day").round(1))
    .sort("system", "out_bin")