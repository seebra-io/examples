# LightWAVE sends each signal delta-coded: samp[0] is the first sample in ADC units and each next value is the change from the one before,
# so the running sum gives the raw ADC value; mV = (adu − base) / gain (gain 200 adu/mV, base 1024 for mitdb).
data.rows("fetch.signal").explode("samp")
    .with_row_index("i")
    .with_columns(adu = col("samp").cum_sum())
    .with_columns(sample = col("t0") + col("i"), mv = ((col("adu") - col("base")) / col("gain")).round(3))
    .with_columns(t_s = (col("sample") / 360.0).round(4))
    .select("sample", "t_s", "adu", "mv", "units")