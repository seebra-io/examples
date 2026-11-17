# the EVs with the largest and smallest highway penalty: drag in a nutshell
data.filter(col("powertrain") == "battery electric")
    .sort("hwy_minus_city", descending=True)
    .unique(["make", "model"], keep="first")
    .sort("hwy_minus_city", descending=True)
    .select("year", "make", "model", "body", "city_kwh_100km", "hwy_kwh_100km", "hwy_minus_city", "hwy_over_city", "range")