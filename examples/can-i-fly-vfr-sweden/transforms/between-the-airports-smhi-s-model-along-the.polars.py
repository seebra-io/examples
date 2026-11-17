# SMHI's model forecast (snow1g) at five points on the route, hour by
# hour: the weather between the airports, where no TAF looks. One input per
# point (queries fc0-fc4: their lon/lat); the dialect has no concat, so the
# five are joined on time and turned long with a cross join on the point.
# ceiling_ft: the model's cloud base (m · 3.281) when at least 5 of 8
# oktas are covered, the BKN threshold (the base is that of the lowest
# cloud, so a thin layer under a higher deck makes it conservative);
# vis_m: the model's visibility (km · 1000; it tops out at 75 km).
# 9999 is SMHI's missing value. gust_kt: m/s · 1.944.
# A model is not a TAF: no forecaster, a 2.5 km grid, and fog and low
# stratus are where models are weakest.
data.rows("timeSeries").select("time", d0 = col("data"))
    .join(data1.rows("timeSeries").select("time", d1 = col("data")), on="time")
    .join(data2.rows("timeSeries").select("time", d2 = col("data")), on="time")
    .join(data3.rows("timeSeries").select("time", d3 = col("data")), on="time")
    .join(data4.rows("timeSeries").select("time", d4 = col("data")), on="time")
    .join(data.rows("timeSeries").head(5).with_row_index("pt").select("pt"), how="cross")
    .with_columns(d = when(col("pt") == 0).then(col("d0")).when(col("pt") == 1).then(col("d1")).when(col("pt") == 2).then(col("d2")).when(col("pt") == 3).then(col("d3")).otherwise(col("d4")))
    .with_columns(point= when(col("pt") == 0).then(lit("ESSA")).when(col("pt") == 1).then(lit("25%")).when(col("pt") == 2).then(lit("50%")).when(col("pt") == 3).then(lit("75%")).when(col("pt") == 4).then(lit("ESGG")).otherwise(lit("?")),
                  along= when(col("pt") == 0).then(lit(0)).when(col("pt") == 1).then(lit(0.25)).when(col("pt") == 2).then(lit(0.5)).when(col("pt") == 3).then(lit(0.75)).when(col("pt") == 4).then(lit(1)).otherwise(lit(None)),
                  lon= when(col("pt") == 0).then(lit(17.92)).when(col("pt") == 1).then(lit(16.45)).when(col("pt") == 2).then(lit(15.02)).when(col("pt") == 3).then(lit(13.63)).when(col("pt") == 4).then(lit(12.28)).otherwise(lit(None)),
                  lat= when(col("pt") == 0).then(lit(59.65)).when(col("pt") == 1).then(lit(59.18)).when(col("pt") == 2).then(lit(58.69)).when(col("pt") == 3).then(lit(58.18)).when(col("pt") == 4).then(lit(57.66)).otherwise(lit(None)),
                  t = col("time").str.slice(0, 10).str.to_date("%Y-%m-%d").cast(Int64) * 86400
                      + col("time").str.slice(11, 2).cast(Int64) * 3600,
                  base_m = col("d").struct.field("cloud_base_altitude"),
                  cover_okta = col("d").struct.field("cloud_area_fraction"),
                  low_okta = col("d").struct.field("low_type_cloud_area_fraction"),
                  vis_km = col("d").struct.field("visibility_in_air"),
                  gust_ms = col("d").struct.field("wind_speed_of_gust"),
                  wind_ms = col("d").struct.field("wind_speed"),
                  wdir = col("d").struct.field("wind_from_direction"),
                  precip_mm_h = col("d").struct.field("precipitation_amount_mean"),
                  frozen_pct = col("d").struct.field("precipitation_frozen_part"),
                  thunder_pct = col("d").struct.field("thunderstorm_probability"),
                  temp_c = col("d").struct.field("air_temperature"))
    .filter(col("t") <= col("t").min() + 30 * 3600)
    .with_columns(ceiling_ft = when((col("cover_okta") >= 5) & (col("base_m") < 9999)).then(((col("base_m") * 0.3281).round(0) * 10)).otherwise(lit(None)),
                  vis_m = when(col("vis_km") < 9999).then(col("vis_km") * 1000).otherwise(lit(None)),
                  gust_kt = when(col("gust_ms") < 9999).then((col("gust_ms") * 1.944).round(0)).otherwise(lit(None)),
                  wind_kt = when(col("wind_ms") < 9999).then((col("wind_ms") * 1.944).round(0)).otherwise(lit(None)))
    .with_columns(rank = when((col("ceiling_ft").fill_null(99999) < 500) | (col("vis_m").fill_null(99999) / 1609.34 < 1)).then(1).when((col("ceiling_ft").fill_null(99999) < 1000) | (col("vis_m").fill_null(99999) / 1609.34 < 3)).then(2).when((col("ceiling_ft").fill_null(99999) <= 3000) | (col("vis_m").fill_null(99999) / 1609.34 <= 5)).then(3).otherwise(4),
                  vmc = ((col("ceiling_ft").fill_null(99999) >= 1500) & (col("vis_m").fill_null(99999) >= 5000)).cast(Int64),
                  hour = (col("t") * 1000000).cast(Int64).cast(Datetime).dt.strftime("%d %H:00Z"))
    .with_columns(category = when(col("rank") == 1).then(lit("LIFR")).when(col("rank") == 2).then(lit("IFR")).when(col("rank") == 3).then(lit("MVFR")).otherwise(lit("VFR")))
    .select("pt", "point", "along", "lon", "lat", "t", "hour", "category", "rank", "vmc", "ceiling_ft", "vis_m", "cover_okta", "low_okta",
            "wind_kt", "gust_kt", "wdir", "precip_mm_h", "frozen_pct", "thunder_pct", "temp_c")
    .sort("pt", "t")