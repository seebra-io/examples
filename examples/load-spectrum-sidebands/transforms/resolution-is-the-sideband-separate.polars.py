# can each record tell the sideband at 6/7 per day from the daily line at 1? Compare the amplitude midway (13/14) with the sideband
data.filter((col("f_cpd") * 112).round(0).is_in([96.0, 104.0, 112.0]))
    .group_by("variant")
    .agg(n = col("n").first(),
         sideband_gw = when((col("f_cpd") * 112).round(0) == 96).then(col("amplitude_gw")).otherwise(None).max(),
         midway_gw = when((col("f_cpd") * 112).round(0) == 104).then(col("amplitude_gw")).otherwise(None).max(),
         daily_gw = when((col("f_cpd") * 112).round(0) == 112).then(col("amplitude_gw")).otherwise(None).max())
    .with_columns(record_days = col("n").cast(Float64) / 24, resolution_cpd = (24 / col("n").cast(Float64)).round(4),
                  dip_ratio = (col("midway_gw") / col("sideband_gw")).round(2))
    .with_columns(resolved = col("dip_ratio") < 0.5)
    .select("variant", "record_days", "resolution_cpd", "daily_gw", "sideband_gw", "midway_gw", "dip_ratio", "resolved")
    .sort("variant")