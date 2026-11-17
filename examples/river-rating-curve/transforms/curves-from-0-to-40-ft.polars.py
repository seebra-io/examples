# each curve from 0 to 40 ft in 0.5 ft steps; beyond the highest stage measured in its era it is an extrapolation
data.join(data1.with_row_index("k").filter(col("k") < 81).select(stage_ft = col("k").cast(Float64) * 0.5), how="cross")
    .filter(col("stage_ft") > col("e"))
    .with_columns(discharge_cfs = (col("C") * (col("stage_ft") - col("e")).pow(col("b"))).round(0),
                  part = when(col("stage_ft") > col("max_stage")).then(lit("extrapolated")).when(col("stage_ft") < col("min_stage")).then(lit("extrapolated")).otherwise(lit("measured range")))
    .select("era", "decade", "stage_ft", "discharge_cfs", "part", "b", "e", "C", "max_stage")
    .sort("decade", "stage_ft")