data.filter(col("below_ground").not_())
    .select(layers = len(), mean_abs_error_pct = col("error_pct").abs().mean().round(3), max_abs_error_pct = col("error_pct").abs().max(),
            mean_error_m = col("error_m").mean().round(1), mean_scale_height_km = col("scale_height_km").mean().round(2),
            scale_height_min_km = col("scale_height_km").min(), scale_height_max_km = col("scale_height_km").max(),
            sound_min_m_s = col("sound_m_s").min(), sound_max_m_s = col("sound_m_s").max())