# Zincblende entries within 1% of the median a, then the most precisely
# reported (most decimals), the most recent on a tie: GaAs 5.6537 Å over a
# 1940s 6.036 Å for InAs, say. Older entries are often less precise.
data.with_columns(a_A = col("a").cast(Float64, strict=False))
    .filter(col("sg").str.starts_with("F -4 3 m"))
    .with_columns(median_A = col("a_A").median().over("material"), n_entries = len().over("material"))
    .with_columns(off = (col("a_A") - col("median_A")).abs() / col("median_A"),
                  decimals = col("a").str.split(".").list.get(1, null_on_oob=True).str.len_chars().fill_null(0))
    .filter(col("off") < 0.01)
    .sort("material", "decimals", "year", descending=[False, True, True])
    .unique(subset=["material"], keep="first")
    .select("material", "n_entries", "file", "year", a_measured_A = col("a_A"),
            cod_link = concat_str([lit("https://www.crystallography.net/cod/"), col("file"), lit(".html")]))
    .sort("material")