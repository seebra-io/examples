data.select("name", "symbol", "current_price", "market_cap", "total_volume", "price_change_percentage_24h", "price_change_percentage_7d_in_currency")
    .with_columns(change_24h = col("price_change_percentage_24h").round(2), change_7d = col("price_change_percentage_7d_in_currency").round(2),
                  cap_bn = (col("market_cap") / 1e9).round(1), turnover_pct = (100 * col("total_volume") / col("market_cap")).round(2))
    .drop("price_change_percentage_24h", "price_change_percentage_7d_in_currency")