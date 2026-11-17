# Every METAR in the box, decoded (NOAA's JSON: wind kt, visibility in
# statute miles with "+" for "or more", clouds in ft above the aerodrome,
# QNH hPa), with the flight category recomputed here and the SERA minima.
# Ceiling: the lowest BKN, OVC or OVX layer, or the vertical visibility (VV)
# when the sky is obscured. No ceiling counts as unlimited.
# category (the US/ICAO-chart convention AWC uses): LIFR under 500 ft or
# 1 SM, IFR under 1000 ft or 3 SM, MVFR up to 3000 ft or 5 SM, else VFR.
# vmc: SERA VFR minima at a controlled aerodrome, ceiling >= 1500 ft and
# visibility >= 5 km (SERA.5005(b)); svfr: special VFR, 600 ft and 1500 m
# (SERA.5010). MVFR is not "no VFR" in Europe: OVC025 is MVFR and VMC.
data.select(icao = col("icaoId"), name = col("name"), lat = col("lat"), lon = col("lon"), elev_m = col("elev"),
            obs = col("obsTime"), type = col("metarType"), raw = col("rawOb"),
            wdir = col("wdir").cast(String), wspd_kt = col("wspd"), gust_kt = col("wgst"),
            vis = col("visib").cast(String), wx = col("wxString"), qnh_hpa = col("altim"),
            temp_c = col("temp"), dew_c = col("dewp"), vv_ft = col("vertVis"), awc_cat = col("fltCat"), clouds = col("clouds"))
    .join(data.select(icao = col("icaoId"), cl = col("clouds")).explode("cl")
              .with_columns(cover = col("cl").struct.field("cover"), base = col("cl").struct.field("base"))
              .group_by("icao")
              .agg(layer_ft = when(col("cover").is_in(["BKN", "OVC", "OVX"])).then(col("base")).otherwise(lit(None)).min(),
                   lowest_ft = col("base").min()),
          on="icao", how="left")
    .with_columns(vis_sm = col("vis").str.replace("+", "", literal=True).cast(Float64, strict=False),
                  ceiling_ft = when(col("vv_ft").is_not_null()).then(col("vv_ft")).otherwise(col("layer_ft")))
    .with_columns(c = col("ceiling_ft").fill_null(99999), v = col("vis_sm").fill_null(99),
                  vis_m = (col("vis_sm") * 1609.34).round(0))
    .with_columns(cat_rank = when((col("c") < 500) | (col("v") < 1)).then(1).when((col("c") < 1000) | (col("v") < 3)).then(2).when((col("c") <= 3000) | (col("v") <= 5)).then(3).otherwise(4),
                  vmc = ((col("c") >= 1500) & (col("v") * 1609.34 >= 5000)).cast(Int64),
                  svfr = ((col("c") >= 600) & (col("v") * 1609.34 >= 1500)).cast(Int64))
    .with_columns(category = when(col("cat_rank") == 1).then(lit("LIFR")).when(col("cat_rank") == 2).then(lit("IFR")).when(col("cat_rank") == 3).then(lit("MVFR")).otherwise(lit("VFR")),
                  minima = when(col("vmc") == 1).then(lit("VMC"))
                           .when(col("svfr") == 1).then(lit("special VFR only"))
                           .otherwise(lit("below special VFR")))
    .with_columns(agrees = col("category") == col("awc_cat"),
                  obs_z = (col("obs") * 1000000).cast(Int64).cast(Datetime).dt.strftime("%d %H:%MZ"),
                  link = concat_str([lit("https://aviationweather.gov/data/metar/?ids="), col("icao"), lit("&hours=0&taf=1")]))
    .join(data1.select("icao", "role", "order"), on="icao", how="left")
    .select("icao", "name", "role", "order", "category", "minima", "vmc", "svfr", "ceiling_ft", "lowest_ft", "vis_m", "vis",
            "wdir", "wspd_kt", "gust_kt", "wx", "qnh_hpa", "temp_c", "dew_c", "obs", "obs_z", "type", "raw",
            "awc_cat", "agrees", "cat_rank", "lat", "lon", "elev_m", "clouds", "link")
    .sort("order", "icao", nulls_last=True)