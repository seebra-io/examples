# how far up the curve the measurements reach, and what the record flood stage gives under the curves that fit equally well
data.sort("peak_stage_ft", descending=True).head(1)
    .select(record_year = col("water_year"), record_stage_ft = col("peak_stage_ft"), record_published_cfs = col("peak_cfs"),
            record_q_curve = col("q_curve"), record_q_curve_lo = col("q_curve_lo"), record_q_curve_hi = col("q_curve_hi"))
    .join(data.select(peaks = len(), peaks_above_measured = col("above_measured").cast(Int64).sum(),
                      median_abs_curve_vs_published_pct = col("curve_vs_published_pct").abs().median()), how="cross")
    .join(data1.select(measurements = len(), max_measured_stage_ft = col("stage_ft").max(), max_measured_cfs = col("discharge_cfs").max(),
                       measurements_above_30ft = (col("stage_ft") >= 30).cast(Int64).sum(),
                       measurements_above_25ft = (col("stage_ft") >= 25).cast(Int64).sum(),
                       share_below_10ft = (col("stage_ft") < 10).cast(Float64).mean().round(3),
                       # the measurements near the record stage: how much water the same stage has carried
                       top_measurements = (col("stage_ft") >= 34.5).cast(Int64).sum(),
                       top_min_cfs = when(col("stage_ft") >= 34.5).then(col("discharge_cfs")).min(),
                       top_max_cfs = when(col("stage_ft") >= 34.5).then(col("discharge_cfs")).max()), how="cross")
    .with_columns(spread_at_record_pct = (100 * (col("record_q_curve_hi") - col("record_q_curve_lo")).abs() / col("record_q_curve")).round(1),
                  record_curve_vs_published_pct = (100 * (col("record_q_curve") / col("record_published_cfs") - 1)).round(1),
                  top_max_over_min = (col("top_max_cfs") / col("top_min_cfs")).round(2))