data.sort("country", "year")
    .with_columns(prev = col("gdp").shift(1).over("country"))
    .with_columns(growth_pct = (100 * (col("gdp") / col("prev") - 1)).round(1), log_growth = (col("gdp") / col("prev")).log())
    .drop("prev")