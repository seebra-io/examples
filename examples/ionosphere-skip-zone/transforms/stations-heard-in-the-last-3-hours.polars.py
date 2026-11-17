# the latest ionogram per station (GIRO ionosondes via KC2G): keep stations heard from within 3 hours of the newest one
data.select(code = col("station").struct.field("code"), name = col("station").struct.field("name"),
            lat = col("station").struct.field("latitude").cast(Float64, strict=False),
            lon360 = col("station").struct.field("longitude").cast(Float64, strict=False),
            time = col("time"), fof2 = col("fof2").cast(Float64, strict=False), m3000 = col("md").cast(Float64, strict=False),
            mufd = col("mufd").cast(Float64, strict=False), hmf2 = col("hmf2").cast(Float64, strict=False),
            foe = col("foe").cast(Float64, strict=False), cs = col("cs").cast(Float64, strict=False))
    .filter(col("fof2").is_not_null() & col("m3000").is_not_null() & col("lat").is_not_null())
    .with_columns(minute = col("time").str.slice(0, 10).str.to_date("%Y-%m-%d").cast(Int64) * 1440
                           + col("time").str.slice(11, 2).cast(Int64) * 60 + col("time").str.slice(14, 2).cast(Int64),
                  utc_hour = col("time").str.slice(11, 2).cast(Float64) + col("time").str.slice(14, 2).cast(Float64) / 60)
    .with_columns(age_min = col("minute").max() - col("minute"))
    .filter(col("age_min") <= 180)
    .with_columns(lon = when(col("lon360") > 180).then(col("lon360") - 360).otherwise(col("lon360")),
                  lst = ((col("utc_hour") + col("lon360") / 15) % 24).round(2),
                  # MUF(3000)F2 = foF2 × M(3000)F2: the highest frequency the F2 layer returns over a 3000 km hop
                  muf_calc = (col("fof2") * col("m3000")).round(2),
                  # peak electron density from the critical frequency: N = f² / 80.6 (f in Hz)
                  nmax_e11_m3 = (col("fof2") * col("fof2") * 1000000000000 / 80.6 / 100000000000).round(2))
    .with_columns(daylight = when((col("lst") >= 7) & (col("lst") <= 17)).then(lit("day (07–17 local solar time)"))
                             .when((col("lst") >= 5) & (col("lst") <= 19)).then(lit("twilight"))
                             .otherwise(lit("night")))
    .select("code", "name", "lat", "lon", "time", "age_min", "lst", "daylight", "fof2", "m3000", "mufd", "muf_calc", "hmf2", "foe", "nmax_e11_m3", "cs")
    .sort("lon")