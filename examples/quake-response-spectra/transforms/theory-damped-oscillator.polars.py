# the theory: a single-degree-of-freedom oscillator (one storey on a spring) shaken at its base by a steady sine.
# Its acceleration amplification is √((1 + (2ζβ)²) / ((1 − β²)² + (2ζβ)²)), β = natural period / shaking period
data.head(240).with_row_index("i")
    .select(beta = (col("i").cast(Float64) * 0.0125 + 0.05))
    .join(data.head(3).with_row_index("z").select(zeta = when(col("z") == 0).then(0.02).when(col("z") == 1).then(0.05).otherwise(0.2)), how="cross")
    .with_columns(amplification = (((1 + (2 * col("zeta") * col("beta")) ** 2) / ((1 - col("beta") ** 2) ** 2 + (2 * col("zeta") * col("beta")) ** 2)).sqrt()).round(3),
                  damping = concat_str([(col("zeta") * 100).cast(Int64).cast(Utf8), lit("% damping")]))
    .sort("zeta", "beta")