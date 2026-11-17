data.group_by("stage")
    .agg(stars = len(), median_teff_k = col("teff").median(), median_lum = col("lum").median(), median_radius = col("radius_sb").median(),
         r_p10 = col("radius_sb").quantile(0.1, "linear"), r_p90 = col("radius_sb").quantile(0.9, "linear"), median_mass = col("mass_flame").median(),
         median_dist_pc = col("dist_pc").median())
    .with_columns(median_teff_k = col("median_teff_k").round(0), median_lum = col("median_lum").round(2), median_radius = col("median_radius").round(2),
                  r_p10 = col("r_p10").round(2), r_p90 = col("r_p90").round(2), median_mass = col("median_mass").round(2), median_dist_pc = col("median_dist_pc").round(0))
    .sort("median_radius")