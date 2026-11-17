# battery EVs by body: the extra energy the highway costs, in kWh per 100 km, grows with the frontal area (drag ∝ CdA · v²)
data.filter(col("powertrain") == "battery electric")
    .group_by("body")
    .agg(variants = len(), city_kwh_100km = col("city_kwh_100km").median(), hwy_kwh_100km = col("hwy_kwh_100km").median(),
         extra_kwh_100km = col("hwy_minus_city").median(), median_ratio = col("hwy_over_city").median(), median_range_mi = col("range").median())
    .with_columns(highway_change_pct = ((col("median_ratio") - 1) * 100).round(1))
    .filter((col("variants") >= 3) & (col("body") != "other"))
    .sort("extra_kwh_100km")