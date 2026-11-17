data.filter(col("p_hpa") == 500).select("latitude", "longitude", "elevation", "surface_hpa", z500 = col("z_m"), t500 = col("temp_c"))
    .join(data.filter(col("p_hpa") == 1000).select("latitude", z1000 = col("z_m"), t1000 = col("temp_c")), on="latitude")
    .join(data.filter(col("p_hpa") == 100).select("latitude", z100 = col("z_m")), on="latitude")
    # the 1000–500 hPa thickness is the column's mean temperature: T̄ = g₀ Δz / (R_d ln 2)
    .with_columns(thickness_m = col("z500") - col("z1000"))
    .with_columns(t_mean_c = (9.80665 * col("thickness_m") / (287.05 * 0.6931472) - 273.15).round(1),
                  below_ground_1000 = col("surface_hpa") < 1000)
    .sort("latitude")