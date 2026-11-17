# THE ROUTE: edit it here and every step after this one follows.
# dep and dest: ICAO codes; alternates: airports on the way to divert to
# (comma-separated, in route order); etd_after_h: the planned departure, in
# hours after `now`; cruise_kt: true airspeed (no wind is applied).
# Any airport in the box 55-69°N, 10-24°E with a METAR works (Sweden and its
# neighbours). An airport without a METAR stays in the table with no
# position: the verdict names it.
# now: the newest METAR's observation time (s since 1970, UTC). Every step
# uses this clock, so a saved answer gives the same verdict; the graphs show
# each report's age on the viewer's own clock.
# The SMHI forecast points (queries fc0-fc4) are fixed on ESSA-ESGG: move
# their lon/lat too when the route changes (the map shows where they are).
data.head(1)
    .select(dep = lit("ESSA"), dest = lit("ESGG"), alternates = lit("ESOE,ESGJ"),
            etd_after_h = lit(2.0), cruise_kt = lit(110.0))
    .with_columns(icao = concat_str([col("dep"), col("alternates"), col("dest")], separator=",").str.split(","))
    .explode("icao")
    .with_row_index("order")
    .with_columns(role = when(col("icao") == col("dep")).then(lit("departure"))
                         .when(col("icao") == col("dest")).then(lit("destination"))
                         .otherwise(lit("alternate")))
    .join(data.select(icao = col("icaoId"), name = col("name"), lat = col("lat"), lon = col("lon"),
                      elev_m = col("elev")), on="icao", how="left")
    .join(data.select(now = col("obsTime").max()), how="cross")
    .select("order", "icao", "role", "name", "lat", "lon", "elev_m", "etd_after_h", "cruise_kt", "now")