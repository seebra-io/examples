data.with_columns(dl = (col("lum") / col("lum_flame")).log(10), dr = col("log_r_sb") - col("log_r_gsp"),
                  mx = col("log_r_gsp").mean(), my = col("log_r_sb").mean())
    .select(stars = len(),
            lum_vs_flame_median_dex = col("dl").median(), lum_vs_flame_sd_dex = col("dl").std(),
            radius_vs_gspphot_median_dex = col("dr").median(), radius_vs_gspphot_sd_dex = col("dr").std(),
            radius_slope = ((col("log_r_gsp") - col("mx")) * (col("log_r_sb") - col("my"))).sum() / (col("log_r_gsp") - col("mx")).pow(2).sum(),
            within_10pct = (col("dr").abs() < 0.0414).cast(Float64).mean(),
            smallest_r = col("radius_sb").min(), largest_r = col("radius_sb").max(),
            dimmest_l = col("lum").min(), brightest_l = col("lum").max())
    .with_columns(lum_vs_flame_median_dex = col("lum_vs_flame_median_dex").round(3), lum_vs_flame_sd_dex = col("lum_vs_flame_sd_dex").round(3),
                  radius_vs_gspphot_median_dex = col("radius_vs_gspphot_median_dex").round(3), radius_vs_gspphot_sd_dex = col("radius_vs_gspphot_sd_dex").round(3),
                  radius_slope = col("radius_slope").round(3), within_10pct = col("within_10pct").round(3),
                  smallest_r = col("smallest_r").round(2), largest_r = col("largest_r").round(1), dimmest_l = col("dimmest_l").round(4), brightest_l = col("brightest_l").round(0))