# where the modulation theorem puts the lines: the daily harmonics k (1, 2, 3, 4 per day) and the weekly ones (j/7),
# each daily line flanked by sidebands at k ± j/7 because the weekly pattern multiplies the daily one
data.head(40).with_row_index("i")
    .with_columns(k = col("i").cast(Int64) // 8, j = col("i").cast(Int64) % 8 - 3)
    .filter((col("j") >= -3) & (col("j") <= 3) & ((col("k") > 0) | (col("j") > 0)) & (col("k") <= 4))
    .with_columns(f_cpd = col("k").cast(Float64) + col("j").cast(Float64) / 7)
    .filter((col("f_cpd") > 0) & (col("f_cpd") <= 4.5))
    .with_columns(role = when(col("k") == 0).then(lit("weekly harmonic"))
                         .when(col("j") == 0).then(lit("daily harmonic (carrier)"))
                         .otherwise(lit("sideband")),
                  label = when(col("j") == 0).then(concat_str([col("k").cast(Utf8), lit(" /day")]))
                          .when(col("k") == 0).then(concat_str([col("j").cast(Utf8), lit("/7 per day")]))
                          .otherwise(concat_str([col("k").cast(Utf8), when(col("j") > 0).then(lit(" + ")).otherwise(lit(" − ")), col("j").abs().cast(Utf8), lit("/7")])),
                  bin = (col("f_cpd") * 112).round(0).cast(Int64),
                  period_hours = (24 / col("f_cpd")).round(2))
    .select("label", "role", "k", "j", "f_cpd", "period_hours", "bin")