data.rows("results")
    .select(reported = col("report_date").str.to_date("%Y%m%d", strict=False).dt.strftime("%Y-%m-%d"), initiated = col("recall_initiation_date").str.to_date("%Y%m%d", strict=False).dt.strftime("%Y-%m-%d"),
            firm = col("recalling_firm"), state = col("state"), class = col("classification"), status = col("status"),
            reason = col("reason_for_recall"),
            product = when(col("product_description").str.len_chars() > 140)
                .then(concat_str([col("product_description").str.slice(0, 140), lit("…")]))
                .otherwise(col("product_description")),
            quantity = col("product_quantity"), distribution = col("distribution_pattern"), recall_number = col("recall_number"))