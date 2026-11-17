data.select("year").with_row_index("i")
    .join(data.pca(["Denmark", "Finland", "Iceland", "Norway", "Sweden"], k=2, scale=True, output="scores").with_row_index("i"), on="i")
    .drop("i")