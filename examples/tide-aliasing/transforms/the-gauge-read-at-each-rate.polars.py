# read the gauge only every step_h hours (no averaging in between: what a slow sampler sees)
data.join(data1, how="cross")
    .filter(col("h0") % col("step_h") == 0)
    .select("scheme", "step_h", "fs_cpd", "nyquist_cpd", "t", "h0", "day", "level_m", "x")