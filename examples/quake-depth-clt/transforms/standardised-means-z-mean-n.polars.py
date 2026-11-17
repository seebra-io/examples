data.join(data1.select("mean_km", "sd_km"), how="cross", suffix="_pop")
    .with_columns(se_km = col("sd_km") / col("n").cast(Float64).sqrt())
    .with_columns(z = (col("mean_km") - col("mean_km_pop")) / col("se_km"))
    .select("n", "r", "mean_km", "z", "se_km", population_mean_km = col("mean_km_pop"))