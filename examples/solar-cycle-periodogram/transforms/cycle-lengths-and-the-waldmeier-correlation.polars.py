data.filter(col("complete"))
    .select(complete_cycles = len(), mean_length_yr = col("length_yr").mean().round(2), sd_length_yr = col("length_yr").std().round(2),
            shortest_yr = col("length_yr").min(), longest_yr = col("length_yr").max(),
            mean_rise_yr = col("rise_yr").mean().round(2), strongest_peak = col("peak_smoothed").max(), weakest_peak = col("peak_smoothed").min(),
            corr_peak_rise = (((col("peak_smoothed") - col("peak_smoothed").mean()) * (col("rise_yr") - col("rise_yr").mean())).mean()
                              / (col("peak_smoothed").std(ddof=0) * col("rise_yr").std(ddof=0))).round(3))