# the skip zone per amateur band: the shortest distance at which the band's frequency is returned (0 = also straight up, NVIS)
data.join(data.head(5).with_row_index("b").select(b = col("b"), f_mhz = when(col("b") == 0).then(3.6).when(col("b") == 1).then(7.1)
                                                 .when(col("b") == 2).then(14.1).when(col("b") == 3).then(21.1).otherwise(28.4)).unique("b"), how="cross")
    .group_by("code", "name", "daylight", "fof2", "f_mhz")
    .agg(skip_km = when(col("muf_mhz") >= col("f_mhz")).then(col("d_km")).otherwise(None).min(),
         max_muf = col("muf_mhz").max())
    .with_columns(band = concat_str([col("f_mhz").cast(Utf8), lit(" MHz")]),
                  status = when(col("skip_km").is_null()).then(lit("no single-hop path"))
                           .when(col("skip_km") == 0).then(lit("open overhead (f below foF2)"))
                           .otherwise(lit("skips nearby stations")))
    .sort("code", "f_mhz")