# For a V beat between two normal beats: coupling = RR before it (N→V), pause = RR after it (V→N).
# A full compensatory pause (the sinus node isn't reset) makes coupling + pause = 2 × the normal RR around it.
data.with_columns(nn_median = when(col("nn")).then(col("rr_ms")).median().over("record"))
    .filter((col("a") == "V") & (col("prev") == "N") & (col("nxt") == "N"))
    .with_columns(coupling_ms = col("rr_ms"), pause_ms = col("rr_next"),
                  sum_ms = col("rr_ms") + col("rr_next"))
    .with_columns(compensation = (col("sum_ms") / (2 * col("nn_median"))).round(3),
                  prematurity = (col("coupling_ms") / col("nn_median")).round(3))
    .select("record", "label", "link", "beat", "t_s", "coupling_ms", "pause_ms", "sum_ms", "nn_median", "compensation", "prematurity")