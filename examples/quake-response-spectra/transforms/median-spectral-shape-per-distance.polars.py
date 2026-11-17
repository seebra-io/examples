# the median spectral shape per distance bin: SA(T)/PGA, the dynamic amplification of a 5%-damped oscillator of period T
data.group_by("dist_bin", "period_s")
    .agg(stations = len(), median_amp = col("sa_over_pga").median(), q25 = col("sa_over_pga").quantile(0.25), q75 = col("sa_over_pga").quantile(0.75),
         median_sa_g = col("sa_g").median(), mean_distance_km = col("distance_km").mean())
    .with_columns(median_amp = col("median_amp").round(3), q25 = col("q25").round(3), q75 = col("q75").round(3),
                  median_sa_g = col("median_sa_g").round(4), mean_distance_km = col("mean_distance_km").round(0))
    .sort("dist_bin", "period_s")