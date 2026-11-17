data.rows("fetch.annotator").explode("annotation").unnest("annotation")
    .select(sample = col("t"), a = col("a"), rhythm = col("x"))
    .with_columns(t_s = (col("sample") / 360.0).round(3),
                  is_beat = col("a").is_in(["N", "L", "R", "e", "j", "A", "a", "J", "S", "V", "E", "F", "/", "f", "Q"]))
    .join(data1.select("sample", "mv"), on="sample", how="left")
    .with_columns(kind = when(col("a") == "N").then(lit("normal (N)")).when(col("a") == "V").then(lit("ventricular premature (V)")).when(col("is_beat")).then(lit("other beat")).otherwise(lit("rhythm/noise mark")))
    .sort("sample")