# one row per vehicle variant (model years 2021–2025), with its energy use on EPA's city (UDDS) and highway (HWFET) test cycles.
# Unadjusted test values (ucity, uhighway: MPG, or MPGe for EVs) are the raw lab results; energy per 100 km:
#   fuel: (100 / mpg gallons per 100 miles) × 33.705 kWh per gallon of gasoline (37.95 for diesel) / 1.609
#   electric: 33.705 kWh per gallon-equivalent / MPGe × 100 / 1.609 (energy from the wall, charging losses included)
data.filter((col("ucity") > 0) & (col("uhighway") > 0))
    .with_columns(powertrain = when(col("atvtype") == "EV").then(lit("battery electric"))
                               .when(col("atvtype") == "Hybrid").then(lit("hybrid"))
                               .when(col("atvtype") == "Diesel").then(lit("diesel"))
                               .when(col("atvtype").is_null() & col("fueltype1").str.contains("Gasoline")).then(lit("petrol"))
                               .otherwise(lit("other")),
                  body = when(col("vclass").str.contains("Pickup")).then(lit("pickup"))
                         .when(col("vclass").str.contains("Sport Utility")).then(lit("SUV"))
                         .when(col("vclass").str.contains("Van")).then(lit("van"))
                         .when(col("vclass").str.contains("Car") | col("vclass").str.contains("Seater") | col("vclass").str.contains("Wagon")).then(lit("car"))
                         .otherwise(lit("other")),
                  kwh_per_gal = when(col("atvtype") == "Diesel").then(37.95).otherwise(33.705))
    .filter(col("powertrain") != "other")
    .with_columns(city_kwh_100km = (col("kwh_per_gal") * 100 / col("ucity") / 1.609).round(2),
                  hwy_kwh_100km = (col("kwh_per_gal") * 100 / col("uhighway") / 1.609).round(2))
    .with_columns(hwy_over_city = (col("hwy_kwh_100km") / col("city_kwh_100km")).round(3),
                  hwy_minus_city = (col("hwy_kwh_100km") - col("city_kwh_100km")).round(2),
                  year = col("year").str.slice(0, 4))
    # a few records are entry errors (e.g. a highway value five times the city one): keep ratios between 0.4 and 2
    .filter((col("hwy_over_city") >= 0.4) & (col("hwy_over_city") <= 2))
    .select("id", "year", "make", "model", "vclass", "body", "powertrain", "drive", "ucity", "uhighway", "city_kwh_100km", "hwy_kwh_100km",
            "hwy_over_city", "hwy_minus_city", "range")