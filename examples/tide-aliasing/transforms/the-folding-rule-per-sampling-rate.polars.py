# the folding rule for each sampling rate: every true frequency maps into 0 … fs/2
data.join(data1.filter(col("step_h") > 1).select("scheme", "step_h", "fs_cpd", "nyquist_cpd"), how="cross")
    .with_columns(apparent_cpd = (col("f_cpd") - col("fs_cpd") * (col("f_cpd") / col("fs_cpd")).round(0)).abs().round(5))
    .sort("step_h", "f_cpd")