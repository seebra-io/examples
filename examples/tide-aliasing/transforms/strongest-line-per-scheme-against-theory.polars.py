# the strongest line of each spectrum (above 0.03 cpd, the record's slow drift aside), against the alias theory for M2
data.filter(col("f_cpd") >= 0.03)
    .filter(col("amplitude_m") == col("amplitude_m").max().over("scheme"))
    .select("scheme", peak_cpd = col("f_cpd"), peak_amplitude_m = col("amplitude_m").round(3), samples = col("samples"),
            apparent_period_days = (1 / col("f_cpd")).round(2), apparent_period_hours = (24 / col("f_cpd")).round(2))
    .join(data1.filter(col("constituent") == "M2").select("scheme", "step_h", m2_alias_cpd = col("alias_cpd"), m2_apparent_days = col("apparent_period_days"), m2_aliased = col("aliased")),
          on="scheme", how="left")
    .sort("step_h", "scheme")