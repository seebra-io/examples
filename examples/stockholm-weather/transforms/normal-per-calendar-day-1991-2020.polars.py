data.rows("daily.time").rename({"value": "date"}).with_row_index("i")
    .join(data.rows("daily.temperature_2m_mean").rename({"value": "t"}).with_row_index("i"), on="i")
    .with_columns(md = col("date").str.slice(5, 5))
    .group_by("md")
    .agg(normal = col("t").mean().round(1), sd = col("t").std().round(2), years = len(),
         p10 = col("t").quantile(0.1).round(1), p90 = col("t").quantile(0.9).round(1))
    .sort("md")