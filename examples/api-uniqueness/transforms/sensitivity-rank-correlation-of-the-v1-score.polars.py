# Spearman rank correlation of the v1 score (k = 5, places removed) with each variant, and how many of the 50 most and
# 50 least unique stay so; a ranking that moves little under these choices is a property of the catalog, not of k
data.with_row_index("r_v1")
    .sort("score_k3", descending=True).with_row_index("r_k3")
    .sort("score_k10", descending=True).with_row_index("r_k10")
    .sort("score_kept", descending=True).with_row_index("r_kept")
    .with_columns(n = len())
    .select(apis = len(),
            spearman_k3 = (1 - 6 * (col("r_v1").cast(Float64) - col("r_k3").cast(Float64)).pow(2).sum() / (col("n").first().cast(Float64) * (col("n").first().cast(Float64).pow(2) - 1))).round(3),
            spearman_k10 = (1 - 6 * (col("r_v1").cast(Float64) - col("r_k10").cast(Float64)).pow(2).sum() / (col("n").first().cast(Float64) * (col("n").first().cast(Float64).pow(2) - 1))).round(3),
            spearman_kept = (1 - 6 * (col("r_v1").cast(Float64) - col("r_kept").cast(Float64)).pow(2).sum() / (col("n").first().cast(Float64) * (col("n").first().cast(Float64).pow(2) - 1))).round(3),
            top50_kept_k3 = ((col("r_v1") < 50) & (col("r_k3") < 50)).cast(Int64).sum(),
            top50_kept_k10 = ((col("r_v1") < 50) & (col("r_k10") < 50)).cast(Int64).sum(),
            top50_kept_places = ((col("r_v1") < 50) & (col("r_kept") < 50)).cast(Int64).sum(),
            bottom50_kept_k3 = ((col("r_v1") >= col("n") - 50) & (col("r_k3") >= col("n") - 50)).cast(Int64).sum(),
            bottom50_kept_k10 = ((col("r_v1") >= col("n") - 50) & (col("r_k10") >= col("n") - 50)).cast(Int64).sum(),
            bottom50_kept_places = ((col("r_v1") >= col("n") - 50) & (col("r_kept") >= col("n") - 50)).cast(Int64).sum(),
            mean_shift_k3 = (col("score_k3") - col("score_raw")).mean().round(1),
            mean_shift_k10 = (col("score_k10") - col("score_raw")).mean().round(1),
            mean_shift_kept = (col("score_kept") - col("score_raw")).mean().round(1))