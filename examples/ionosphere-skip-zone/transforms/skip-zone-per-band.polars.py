# per band: how many stations open it, and the median skip distance where it opens
data.group_by("band", "f_mhz")
    .agg(stations = len(), open = col("skip_km").is_not_null().sum(), median_skip_km = col("skip_km").median(),
         overhead = when(col("skip_km") == 0).then(1).otherwise(0).sum())
    .sort("f_mhz")