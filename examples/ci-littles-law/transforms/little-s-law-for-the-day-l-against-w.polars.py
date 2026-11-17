# Little's law for the whole day: L (time-average in flight) against λ (arrival rate) times W (mean time in the system)
data.select(runs = len(), total_min = col("duration_min").sum(), W_min = col("duration_min").mean(),
            last_departure_min = col("depart_min").max(), arrivals_in_day = (col("arrive_min") < 1440).cast(Int64).sum())
    .join(data1.select(area_run_minutes = col("in_flight").sum().cast(Float64),
                       L_day = when(col("m") < 1440).then(col("in_flight").cast(Float64)).otherwise(lit(None)).mean(),
                       L_max = col("in_flight").max()), how="cross")
    .with_columns(lambda_per_min = col("arrivals_in_day").cast(Float64) / 1440)
    .with_columns(lambda_W = col("lambda_per_min") * col("W_min"),
                  L_all = col("area_run_minutes") / 1440)
    .select("runs", "arrivals_in_day", "L_max", "area_run_minutes", lambda_per_hour = (col("lambda_per_min") * 60).round(2), W_min = col("W_min").round(1),
            lambda_W = col("lambda_W").round(2), L_all = col("L_all").round(2), L_day = col("L_day").round(2),
            total_run_minutes = col("total_min").round(0),
            last_departure_min = col("last_departure_min").round(0))