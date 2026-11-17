data.rows("results").select(route = col("term"), recalls = col("count"))
    .join(data1.rows("results").select(route = col("term"), products = col("count")), on="route")
    .filter(col("products") >= 100)
    .with_columns(rate = 1000 * col("recalls") / col("products"),
                  lo = 1000 * gamma_ppf(0.025, col("recalls"), col("products")),
                  hi = 1000 * gamma_ppf(0.975, col("recalls") + 1, col("products")))
    .sort("rate", descending=True)