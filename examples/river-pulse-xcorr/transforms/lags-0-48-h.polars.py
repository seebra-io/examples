# lags of 0 to 48 hours in 15-minute steps
data.head(193).select(lag = col("i"), lag_h = col("i").cast(Float64) / 4)