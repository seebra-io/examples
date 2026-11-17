data.rows("items")
    .select(namespace = col("metadata").struct.field("namespace"),
            pod = col("metadata").struct.field("name"),
            c = col("status").struct.field("containerStatuses"))
    .explode("c")
    .filter(col("c").is_not_null())
    .select("namespace", "pod",
            container = col("c").struct.field("name"),
            restarts = col("c").struct.field("restartCount"),
            last_reason = col("c").struct.field("lastState").struct.field("terminated").struct.field("reason"),
            exit_code = col("c").struct.field("lastState").struct.field("terminated").struct.field("exitCode"),
            finished = col("c").struct.field("lastState").struct.field("terminated").struct.field("finishedAt"))
    .filter(col("restarts") > 0)
    .sort("restarts", descending=True)