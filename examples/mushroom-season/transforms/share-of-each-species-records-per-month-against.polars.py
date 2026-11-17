# share: the part of a species' records that fall in each month.
# fungi_share: the same for all fungi, which is mostly when people go looking.
# enrichment = share / fungi_share: above 1, the species is over-represented that month.
data.with_columns(share = col("records").cast(Float64) / col("records").sum().over("species").cast(Float64))
    .join(data.filter(col("species") == "All fungi")
              .select(month = col("month"), fungi_share = col("records").cast(Float64) / col("records").sum().cast(Float64)),
          on="month")
    .with_columns(enrichment = (col("share") / col("fungi_share")).round(3))
    .sort("species", "month")