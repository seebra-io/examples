# each water year's annual peak: the discharge USGS published and the stage on the same day, against the curve
data.rows("features")
    .select(water_year = col("properties").struct.field("water_year"), param = col("properties").struct.field("parameter_code"), value_text = col("properties").struct.field("value"), time = col("properties").struct.field("time"),
            flags = col("properties").struct.field("qualifier").list.join(", "))
    .filter(col("param") == "00060")
    .select("water_year", "time", "flags", peak_cfs = col("value_text").cast(Float64, strict=False))
    .join(data.rows("features")
              .select(water_year = col("properties").struct.field("water_year"), param = col("properties").struct.field("parameter_code"), value_text = col("properties").struct.field("value"), time = col("properties").struct.field("time"))
              .filter(col("param") == "00065")
              .select("water_year", "time", peak_stage_ft = col("value_text").cast(Float64, strict=False)),
          on=["water_year", "time"], how="left")
    .join(data1.select("e", "b", "C", "e_lo", "b_lo", "C_lo", "e_hi", "b_hi", "C_hi", max_measured_stage = col("max_stage"), max_measured_q = col("max_q")), how="cross")
    .filter(col("peak_stage_ft") > col("e_hi"))
    .with_columns(q_curve = col("C") * (col("peak_stage_ft") - col("e")).pow(col("b")),
                  q_curve_lo = col("C_lo") * (col("peak_stage_ft") - col("e_lo")).pow(col("b_lo")),
                  q_curve_hi = col("C_hi") * (col("peak_stage_ft") - col("e_hi")).pow(col("b_hi")))
    .with_columns(curve_vs_published_pct = (100 * (col("q_curve") / col("peak_cfs") - 1)).round(1),
                  above_measured = col("peak_stage_ft") > col("max_measured_stage"),
                  q_curve = col("q_curve").round(0), q_curve_lo = col("q_curve_lo").round(0), q_curve_hi = col("q_curve_hi").round(0),
                  date = col("time"), link = lit("https://waterdata.usgs.gov/monitoring-location/USGS-06934500/"))
    .select("water_year", "date", "peak_stage_ft", "peak_cfs", "q_curve", "q_curve_lo", "q_curve_hi", "curve_vs_published_pct", "above_measured", "flags", "max_measured_stage", "link")
    .sort("water_year")