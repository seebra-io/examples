data.join(data1.select("sd_km", "skewness"), how="cross")
    .group_by("n")
    .agg(samples = len(), mean_of_means_km = col("mean_km").mean(), sd_of_means_km = col("mean_km").std(),
         se_predicted_km = (col("sd_km") / col("n").cast(Float64).sqrt()).first(),
         skewness_of_means = ((col("z") - col("z").mean()).pow(3)).mean() / col("z").std(ddof=0).pow(3),
         skewness_predicted = (col("skewness") / col("n").cast(Float64).sqrt()).first(),
         within_1_96 = (col("z").abs() <= 1.96).cast(Float64).mean())
    .with_columns(mean_of_means_km = col("mean_of_means_km").round(1), sd_of_means_km = col("sd_of_means_km").round(1),
                  se_predicted_km = col("se_predicted_km").round(1), skewness_of_means = col("skewness_of_means").round(2),
                  skewness_predicted = col("skewness_predicted").round(2), within_1_96 = col("within_1_96").round(3))
    .sort("n")