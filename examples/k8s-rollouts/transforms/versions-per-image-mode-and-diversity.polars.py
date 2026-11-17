data.group_by("repo", "tag").agg(n = len())
    .group_by("repo")
    .agg(versions = len(), uses = col("n").sum(), squares = (col("n") * col("n")).sum(), modal = col("n").max())
    .with_columns(diversity = 1 - col("squares") / (col("uses") * col("uses")),
                  modal_share = col("modal") / col("uses"))
    .drop("squares")
    .sort("diversity", descending=True)