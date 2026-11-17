# per powertrain: does the highway cost more or less energy per km than the city?
data.group_by("powertrain")
    .agg(variants = len(), city_kwh_100km = col("city_kwh_100km").median(), hwy_kwh_100km = col("hwy_kwh_100km").median(),
         median_ratio = col("hwy_over_city").median(), q10_ratio = col("hwy_over_city").quantile(0.1), q90_ratio = col("hwy_over_city").quantile(0.9),
         highway_costs_more_pct = when(col("hwy_over_city") > 1).then(100.0).otherwise(0.0).mean())
    .with_columns(highway_change_pct = ((col("median_ratio") - 1) * 100).round(1), highway_costs_more_pct = col("highway_costs_more_pct").round(1),
                  q10_ratio = col("q10_ratio").round(3), q90_ratio = col("q90_ratio").round(3))
    .sort("median_ratio")