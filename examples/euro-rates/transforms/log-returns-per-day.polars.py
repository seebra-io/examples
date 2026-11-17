data.sort(["currency", "date"])
    .with_columns(log_return_pct = ((col("rate") / col("rate").shift(1).over("currency")).log() * 100).round(4),
                  month = col("date").str.slice(0, 7))
    .filter(col("log_return_pct").is_not_null())
    .select("currency", "date", "month", "rate", "log_return_pct")