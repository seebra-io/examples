data.filter(col("is_beat"))
    .with_columns(t_prev = col("t_s").shift(1), prev = col("a").shift(1))
    .with_columns(rr_ms = ((col("t_s") - col("t_prev")) * 1000).round(0), mid_s = ((col("t_s") + col("t_prev")) / 2).round(3),
                  pair = concat_str([col("prev"), lit("→"), col("a")]))
    .drop_nulls("rr_ms")
    .select("t_prev", "t_s", "mid_s", "rr_ms", "pair", "a", "prev")