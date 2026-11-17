data.rows("items")
    .select("number", "title", "state", "state_reason", "comments", "created_at", "closed_at", "updated_at", url = col("html_url"),
            author = col("user").struct.field("login"))
    .join(data.rows("items").select("number", "labels").explode("labels")
              .with_columns(label = col("labels").struct.field("name"))
              .group_by("number")
              .agg(bug = (col("label") == "bug").cast(Int64).max(), enhancement = (col("label") == "enhancement").cast(Int64).max(),
                   labels = col("label")), on="number", how="left")
    .with_columns(kind = when(col("bug") == 1).then(lit("bug")).when(col("enhancement") == 1).then(lit("enhancement")).otherwise(lit("other")),
                  labels = col("labels").list.join(", "),
                  closed = col("closed_at").is_not_null(),
                  # an open issue is followed up to the API's latest update: it is censored there
                  as_of = col("updated_at").max())
    .with_columns(end_at = when(col("closed")).then(col("closed_at")).otherwise(col("as_of")))
    .with_columns(days = ((col("end_at").str.slice(0, 10).str.to_date().cast(Int64).cast(Float64) + col("end_at").str.slice(11, 2).cast(Float64) / 24 + col("end_at").str.slice(14, 2).cast(Float64) / 1440) - (col("created_at").str.slice(0, 10).str.to_date().cast(Int64).cast(Float64) + col("created_at").str.slice(11, 2).cast(Float64) / 24 + col("created_at").str.slice(14, 2).cast(Float64) / 1440)).round(2))
    .select("number", "title", "kind", "labels", "state", "state_reason", "closed", "days", "created_at", "closed_at", "as_of", "comments", "author", "url")
    .sort("days")