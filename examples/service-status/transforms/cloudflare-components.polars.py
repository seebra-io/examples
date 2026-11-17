data.rows("components")
    .filter(~col("group"))
    .select(service = lit("Cloudflare"), component = col("name"), status = col("status"), updated = col("updated_at"), description = col("description"))