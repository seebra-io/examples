data.rows("items")
    .select(namespace = col("metadata").struct.field("namespace"),
            budget = col("metadata").struct.field("name"),
            allowed = col("status").struct.field("disruptionsAllowed"),
            healthy = col("status").struct.field("currentHealthy"),
            desired_healthy = col("status").struct.field("desiredHealthy"),
            expected = col("status").struct.field("expectedPods"))
    .with_columns(blocks_evictions = col("allowed") == 0)
    .sort("allowed")