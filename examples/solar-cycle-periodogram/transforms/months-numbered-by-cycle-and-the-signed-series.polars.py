data.join(data1.select("i", is_min = lit(1)), on="i", how="left")
    .with_columns(is_min = col("is_min").fill_null(0))
    .sort("i")
    # cycle 1 starts at the 1755 minimum, as SILSO numbers them
    .with_columns(cycle = col("is_min").cum_sum())
    .with_columns(sign = when(col("cycle") % 2 == 0).then(1.0).otherwise(-1.0))
    .with_columns(signed = col("ssn") * col("sign"))