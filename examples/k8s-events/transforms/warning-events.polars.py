data.rows("items")
    .select(namespace = col("involvedObject").struct.field("namespace"),
            kind = col("involvedObject").struct.field("kind"),
            object = col("involvedObject").struct.field("name"),
            reason = col("reason"),
            message = col("message"),
            component = col("source").struct.field("component"),
            last = when(col("lastTimestamp").is_null()).then(col("eventTime")).otherwise(col("lastTimestamp")).str.slice(0, 19),
            first = col("firstTimestamp"),
            occurrences = col("count").fill_null(1))
    .with_columns(first = when(col("first").is_null()).then(col("last")).otherwise(col("first").str.slice(0, 19)))
    .with_columns(minute = col("last").str.slice(0, 10).str.to_date("%Y-%m-%d").cast(Int64) * 1440
                         + col("last").str.slice(11, 2).cast(Int64) * 60 + col("last").str.slice(14, 2).cast(Int64),
                  first_minute = col("first").str.slice(0, 10).str.to_date("%Y-%m-%d").cast(Int64) * 1440
                         + col("first").str.slice(11, 2).cast(Int64) * 60 + col("first").str.slice(14, 2).cast(Int64))
    .sort("last")