# Welch's t for the difference in mean ΔS: O–H donors against liquids with no donor (plausible readings only)
data.filter(col("plausible"))
    .select(n_oh = (col("hbond") == "O–H donor (alcohols, acids, water)").cast(Float64).sum(), mean_oh = when(col("hbond") == "O–H donor (alcohols, acids, water)").then(col("ds_implied")).mean(), var_oh = when(col("hbond") == "O–H donor (alcohols, acids, water)").then(col("ds_implied")).var(),
            n_none = (col("hbond") == "no H-bond donor").cast(Float64).sum(), mean_none = when(col("hbond") == "no H-bond donor").then(col("ds_implied")).mean(), var_none = when(col("hbond") == "no H-bond donor").then(col("ds_implied")).var())
    .with_columns(a = col("var_oh") / col("n_oh"), b = col("var_none") / col("n_none"))
    .with_columns(diff = col("mean_oh") - col("mean_none"), se = (col("a") + col("b")).sqrt(),
                  df = (col("a") + col("b")).pow(2) / (col("a").pow(2) / (col("n_oh") - 1) + col("b").pow(2) / (col("n_none") - 1)))
    .with_columns(t = col("diff") / col("se"))
    .with_columns(p_two_sided = 2 * (1 - t_cdf(col("t").abs(), col("df"))),
                  lo95 = col("diff") - t_ppf(0.975, col("df")) * col("se"), hi95 = col("diff") + t_ppf(0.975, col("df")) * col("se"),
                  # how much lower the vapour pressure at 25 °C is for a typical donor (at x = Tb/T - 1 = 0.4, about the median), from the difference in ΔS
                  vp_factor_at_x_0_4 = (-(col("diff") / 8.314462618) * 0.4).exp())
    .select(n_oh = col("n_oh").cast(Int64), n_none = col("n_none").cast(Int64), mean_oh = col("mean_oh").round(1), mean_none = col("mean_none").round(1),
            diff = col("diff").round(1), lo95 = col("lo95").round(1), hi95 = col("hi95").round(1), t = col("t").round(2), df = col("df").round(1),
            p_two_sided = col("p_two_sided"), vp_factor_at_x_0_4 = col("vp_factor_at_x_0_4").round(3))