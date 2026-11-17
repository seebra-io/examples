# Beat annotations (atr, by cardiologists) → RR intervals. LightWAVE answers {fetch: {annotator: [{annotation: [{t, a, ...}]}]}}; t is a sample number at 360 Hz.
data.rows("fetch.annotator").explode("annotation").unnest("annotation")
    .select("t", "a")
    # beat labels only (N normal, A/a/S/J atrial or junctional premature, V ventricular premature, F fusion, ...); rhythm (+), noise (~) and artefact (|) marks are not beats
    .filter(col("a").is_in(["N", "L", "R", "e", "j", "A", "a", "J", "S", "V", "E", "F", "/", "f", "Q"]))
    .with_columns(t_s = col("t") / 360.0)
    # the same window for every record: the first 15 minutes (SDNN grows with window length)
    .filter(col("t_s") < 900)
    .with_columns(record = lit("mitdb 100"), db = lit("mitdb"), label = lit("sinus rhythm, a few APCs (M, 69)"), fs = lit(360), link = lit("https://physionet.org/files/mitdb/1.0.0/mitdbdir/records.htm#100"),
                  prev = col("a").shift(1), nxt = col("a").shift(-1),
                  rr_ms = (col("t") - col("t").shift(1)) * 1000.0 / 360)
    .with_columns(rr_next = col("rr_ms").shift(-1),
                  pair = concat_str([col("prev"), lit("→"), col("a")]),
                  # normal-to-normal: both ends of the interval are normal beats, and the interval is physiologically plausible
                  nn = (col("prev") == "N") & (col("a") == "N") & (col("rr_ms") > 300) & (col("rr_ms") < 2000))
    .with_columns(nn_next = col("nn").shift(-1),
                  d_all = col("rr_ms") - col("rr_ms").shift(1))
    .with_columns(d_nn = when(col("nn") & col("nn").shift(1)).then(col("d_all")),
                  poincare_nn = col("nn") & col("nn_next"))
    .with_columns(abs_d_all = col("d_all").abs(), abs_d_nn = col("d_nn").abs())
    .drop_nulls("rr_ms")
    .with_row_index("beat")