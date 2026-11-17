# one law for all four: COP ≈ η · T_hot / lift. Least squares of the measured COP on the Carnot COP, through all days
data.select(days = len(), mx = col("cop_carnot").mean(), my = col("cop").mean(), mxy = (col("cop_carnot") * col("cop")).mean(),
            mxx = (col("cop_carnot") * col("cop_carnot")).mean(), myy = (col("cop") * col("cop")).mean(),
            # slope through the origin: η = Σxy / Σx²
            eta0 = (col("cop_carnot") * col("cop")).sum() / (col("cop_carnot") * col("cop_carnot")).sum(),
            # and the same per kelvin of lift: COP against lift
            lx = col("lift_k").mean(), lxy = (col("lift_k") * col("cop")).mean(), lxx = (col("lift_k") * col("lift_k")).mean())
    .with_columns(slope = (col("mxy") - col("mx") * col("my")) / (col("mxx") - col("mx") * col("mx")),
                  r_carnot = ((col("mxy") - col("mx") * col("my")) / ((col("mxx") - col("mx") * col("mx")) * (col("myy") - col("my") * col("my"))).sqrt()),
                  cop_per_k = (col("lxy") - col("lx") * col("my")) / (col("lxx") - col("lx") * col("lx")),
                  r_lift = ((col("lxy") - col("lx") * col("my")) / ((col("lxx") - col("lx") * col("lx")) * (col("myy") - col("my") * col("my"))).sqrt()))
    .select("days", eta_through_origin = col("eta0").round(3), slope = col("slope").round(3), intercept = (col("my") - col("slope") * col("mx")).round(3),
            r_carnot = col("r_carnot").round(3), cop_per_kelvin_lift = col("cop_per_k").round(3), r_lift = col("r_lift").round(3),
            # what 5 K lower flow temperature is worth at a typical 25 K lift
            gain_5k_pct = ((-col("cop_per_k") * 5) / (col("my") + col("cop_per_k") * (25 - col("lx"))) * 100).round(1))