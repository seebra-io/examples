# each measurement against the one curve fitted to all years: how much more (+) or less (-) water than the curve says
data.join(data1.select(e_fit = col("e"), b_fit = col("b"), C_fit = col("C")), how="cross")
    .with_columns(q_curve = col("C_fit") * (col("stage_ft") - col("e_fit")).pow(col("b_fit")))
    .with_columns(res_log = (col("discharge_cfs") / col("q_curve")).log(),
                  res_pct = (100 * (col("discharge_cfs") / col("q_curve") - 1)).round(1),
                  q_curve = col("q_curve").round(0))
    .select("visit", "date", "year", "decade", "stage_ft", "discharge_cfs", "q_curve", "res_pct", "res_log", "rated", "flow_class", "link")