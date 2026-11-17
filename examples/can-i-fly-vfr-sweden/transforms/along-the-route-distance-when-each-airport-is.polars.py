# Where each airport lies along the straight line from departure to
# destination, and when the aircraft is there. Local flat coordinates (km):
# x east = Δlon · 111.195 · cos(mid latitude), y north = Δlat · 111.195; cos
# as its Taylor series (the dialect has no trig; 5 terms are exact to 1e-5
# here). Under 0.5% off the great circle for a route inside Sweden.
# along: 0 at departure, 1 at destination (an alternate's projection);
# off_km: how far it is from the line. t_use: when it is used (departure:
# ETD; others: ETD + along · flight time); the window is t_use ± 1 h, the
# margin planning rules use around an arrival.
data.join(data.filter(col("role") == "departure").select(lat0 = col("lat"), lon0 = col("lon")), how="cross")
    .join(data.filter(col("role") == "destination").select(lat1 = col("lat"), lon1 = col("lon")), how="cross")
    .with_columns(r = (col("lat0") + col("lat1")) / 2 * 0.01745329)
    .with_columns(kx = 111.195 * (1 - col("r").pow(2) / 2 + col("r").pow(4) / 24 - col("r").pow(6) / 720 + col("r").pow(8) / 40320))
    .with_columns(X = (col("lon1") - col("lon0")) * col("kx"), Y = (col("lat1") - col("lat0")) * 111.195,
                  x = (col("lon") - col("lon0")) * col("kx"), y = (col("lat") - col("lat0")) * 111.195)
    .with_columns(dist_km = (col("X").pow(2) + col("Y").pow(2)).sqrt())
    .with_columns(along = ((col("x") * col("X") + col("y") * col("Y")) / col("dist_km").pow(2)).round(3),
                  off_km = ((col("x") * col("Y") - col("y") * col("X")) / col("dist_km")).abs().round(1),
                  dist_nm = (col("dist_km") / 1.852).round(1),
                  flight_h = (col("dist_km") / 1.852 / col("cruise_kt")).round(2),
                  etd = col("now") + col("etd_after_h") * 3600)
    .with_columns(t_use = (col("etd") + col("along").clip(0, 1) * col("flight_h") * 3600).round(0))
    .with_columns(win_from = col("t_use") - 3600, win_to = col("t_use") + 3600,
                  eta = col("etd") + col("flight_h") * 3600)
    .with_columns(use_z = (col("t_use") * 1000000).cast(Int64).cast(Datetime).dt.strftime("%d %H:%MZ"),
                  etd_z = (col("etd") * 1000000).cast(Int64).cast(Datetime).dt.strftime("%d %H:%MZ"),
                  eta_z = (col("eta") * 1000000).cast(Int64).cast(Datetime).dt.strftime("%d %H:%MZ"),
                  dist_km = col("dist_km").round(1))
    .select("order", "icao", "role", "name", "lat", "lon", "along", "off_km", "dist_km", "dist_nm",
            "cruise_kt", "flight_h", "now", "etd", "eta", "etd_z", "eta_z", "t_use", "use_z", "win_from", "win_to")
    .sort("order")