data.rows("components")
    .filter(~col("group"))
    .select(service = lit("GitHub"), component = col("name"), status = col("status"), updated = col("updated_at"), description = col("description"))