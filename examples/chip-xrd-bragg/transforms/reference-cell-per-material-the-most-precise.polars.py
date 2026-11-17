# Keep the cubic diamond (F d -3 m) and zincblende (F -4 3 m) entries within 1%
# of the material's median a (that drops a Ba-doped clathrate filed as Si), then
# the most precisely reported one (most decimals), the most recent on a tie.
# spread_A: max - min
# a of the cubic entries, the scatter between measurements.
data.with_columns(a_A = col("a").cast(Float64, strict=False))
    .filter(col("sg").str.starts_with("F d -3 m") | col("sg").str.starts_with("F -4 3 m"))
    .with_columns(median_A = col("a_A").median().over("material"), n_entries = len().over("material"),
                  spread_A = (col("a_A").max() - col("a_A").min()).over("material"))
    .with_columns(off = (col("a_A") - col("median_A")).abs() / col("median_A"),
                  decimals = col("a").str.split(".").list.get(1, null_on_oob=True).str.len_chars().fill_null(0))
    .filter(col("off") < 0.01)
    .sort("material", "decimals", "year", descending=[False, True, True])
    .unique(subset=["material"], keep="first")
    .with_columns(link = concat_str([lit("https://www.crystallography.net/cod/"), col("file"), lit(".html")]))
    .select("material", "structure", "atom_a", "atom_b", "a_A", "median_A", "spread_A", "n_entries", "file", "sg", "year", "title", "link")
    .sort("a_A")