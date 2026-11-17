data.rows("results.bindings")
    .select(advisor = col("advLabel").struct.field("value"), qid_url = col("adv").struct.field("value"),
            students = col("students").struct.field("value").cast(Int64))
    .join(data1.select("supervisions", "mean_students"), how="cross")
    .with_columns(link = col("qid_url").str.replace("http://www.wikidata.org/entity/", "https://www.wikidata.org/wiki/", literal=True),
                  share_pct = (100 * col("students") / col("supervisions")).round(3),
                  times_mean = (col("students") / col("mean_students")).round(1))
    .sort("students", descending=True)
    .with_row_index("rank", offset=1)
    .select("rank", "advisor", "students", "times_mean", "share_pct", "link")