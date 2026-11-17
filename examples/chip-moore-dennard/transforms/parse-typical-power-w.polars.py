# Karl Rupp's .dat file is two columns separated by spaces (year, value) with
# no header. It is read as CSV, so its one column is the whole line (and its
# first line, the Intel 4004 of 1971, becomes the column's name and is lost).
# Points added after 2010 carry the processor's name after a '#'; '####' lines
# separate the blocks and are dropped (no number in them).
data.select(line = all())
    .with_columns(parts = col("line").str.strip_chars().str.replace_all(r"\s+", ",").str.split(","))
    .select(series = lit("power"), measure = lit("typical power (W)"), unit = lit("W"),
            year = col("parts").list.get(0, null_on_oob=True).cast(Float64, strict=False),
            value = col("parts").list.get(1, null_on_oob=True).cast(Float64, strict=False),
            processor = when(col("line").str.contains("#", literal=True)).then(col("line").str.replace(r"^[^#]*#+\s*", "").str.strip_chars()).otherwise(None))
    .filter(col("value").is_not_null() & (col("value") > 0))