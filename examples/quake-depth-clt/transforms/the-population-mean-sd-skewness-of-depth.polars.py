data.select(quakes = len(), mean_km = col("depth").mean(), sd_km = col("depth").std(), median_km = col("depth").median(),
            skewness = ((col("depth") - col("depth").mean()).pow(3)).mean() / col("depth").std(ddof=0).pow(3),
            share_shallow = (col("depth") < 70).cast(Float64).mean(), deepest_km = col("depth").max())