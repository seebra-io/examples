# one row per degree k: how many people have exactly k students (n), from the SPARQL answer
data.rows("results.bindings")
    .select(k = col("students").struct.field("value").cast(Int64), n = col("advisors").struct.field("value").cast(Int64))
    .sort("k")
    .with_columns(network = lit("students per advisor"), total = col("n").sum(), links = col("n") * col("k"))
    # the histogram's share P(K = k) and the complementary cumulative distribution P(K ≥ k)
    .with_columns(share = col("n") / col("total"), ccdf = col("n").cum_sum(reverse=True) / col("total"))
    .with_columns(log_k = col("k").cast(Float64).log(10), log_share = (col("n") / col("total")).log(10), log_ccdf = col("ccdf").log(10),
                  link = concat_str([lit("https://query.wikidata.org/#SELECT%20%3Fadv%20%3FadvLabel%20%3Fn%20WHERE%20%7B%20%7B%20SELECT%20%3Fadv%20%28COUNT%28%3Fs%29%20AS%20%3Fn%29%20WHERE%20%7B%20%3Fs%20wdt%3AP184%20%3Fadv%20%7D%20GROUP%20BY%20%3Fadv%20HAVING%28COUNT%28%3Fs%29%20%3D%20"), col("k").cast(String), lit("%29%20%7D%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22en%22.%20%7D%20%7D%20LIMIT%20300")]))
    .select("network", "k", "n", "links", "total", "share", "ccdf", "log_k", "log_share", "log_ccdf", "link")