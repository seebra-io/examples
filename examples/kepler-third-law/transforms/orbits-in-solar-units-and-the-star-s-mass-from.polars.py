data.select("pl_name", "hostname", "discoverymethod", "disc_year", "sy_pnum", "sy_dist",
            period_days = col("pl_orbper").cast(Float64), a_au = col("pl_orbsmax").cast(Float64), star_msun = col("st_mass").cast(Float64))
    .filter((col("period_days") > 0) & (col("a_au") > 0) & (col("star_msun") > 0))
    # Kepler's third law in solar units: P[yr]² = a[AU]³ / M[M☉] (the planet's own mass neglected)
    .with_columns(period_yr = col("period_days") / 365.25)
    .with_columns(log_a = col("a_au").log(10), log_p = col("period_yr").log(10),
                  log_p2 = (col("period_yr").pow(2)).log(10),
                  log_a3_m = (col("a_au").pow(3) / col("star_msun")).log(10),
                  # the star's mass recovered from this one planet's orbit
                  m_kepler = col("a_au").pow(3) / col("period_yr").pow(2))
    .with_columns(log_ratio = (col("m_kepler") / col("star_msun")).log(10))
    # within 1% in mass (0.0043 dex): almost surely a computed from P and M★ with this very law
    .with_columns(a_source = when(col("log_ratio").abs() < 0.0043).then(lit("consistent to <1% (likely computed)")).otherwise(lit("independent or other M★")),
                  link = concat_str([lit("https://exoplanetarchive.ipac.caltech.edu/overview/"), col("hostname")]))
    .sort("period_days")
    .with_row_index("i")