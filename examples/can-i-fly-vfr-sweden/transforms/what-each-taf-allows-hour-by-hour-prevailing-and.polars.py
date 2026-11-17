# Per airport and hour, what the TAF allows: the prevailing forecast and
# the worst TEMPO or PROB group valid then. A temporary group's missing
# elements come from the prevailing group of that hour (a TEMPO giving only
# visibility keeps the prevailing ceiling). worst_rank: the lowest category
# possible in that hour (prevailing, temporary, or the conditions a BECMG
# is changing away from). ok_prev / ok_all: SERA VMC minima (1500 ft, 5 km)
# met by the prevailing forecast / by everything the TAF allows.
data1.join(data.filter(col("kind") == "temporary")
                .join(data1.select("icao", "t", p_vis = col("vis_sm"), p_ceil = col("ceiling_ft")), on="icao")
                .filter((col("t") >= col("t_from")) & (col("t") < col("t_to")))
                .with_columns(c = when(col("given_cloud") == 1).then(col("ceiling_ft")).otherwise(col("p_ceil")).fill_null(99999),
                              v = when(col("given_vis") == 1).then(col("vis_sm")).otherwise(col("p_vis")).fill_null(99))
                .with_columns(t_rank = when((col("c") < 500) | (col("v") < 1)).then(1).when((col("c") < 1000) | (col("v") < 3)).then(2).when((col("c") <= 3000) | (col("v") <= 5)).then(3).otherwise(4),
                              t_vmc = ((col("c") >= 1500) & (col("v") * 1609.34 >= 5000)).cast(Int64))
                .sort("t_rank", "prob", nulls_last=True)
                .group_by("icao", "t")
                .agg(temp_rank = col("t_rank").first(), temp_vmc = col("t_vmc").min(), temp_text = col("text").first(),
                     temp_prob = col("prob").first(), temp_ceil = col("c").first(), temp_vis_sm = col("v").first(), n_temp = len()),
           on=["icao", "t"], how="left")
    .with_columns(b = when(col("in_change") == 1).then(col("before_rank")).otherwise(lit(9)).fill_null(9),
                  tr = col("temp_rank").fill_null(9))
    .with_columns(worst_rank = when((col("tr") <= col("rank")) & (col("tr") <= col("b"))).then(col("tr"))
                               .when(col("b") <= col("rank")).then(col("b")).otherwise(col("rank")),
                  ok_prev = col("vmc"),
                  ok_all = when(col("temp_vmc").fill_null(1) == 0).then(0)
                           .when((col("in_change") == 1) & (col("before_vmc").fill_null(1) == 0)).then(0)
                           .otherwise(col("vmc")))
    .with_columns(category = when(col("rank") == 1).then(lit("LIFR")).when(col("rank") == 2).then(lit("IFR")).when(col("rank") == 3).then(lit("MVFR")).otherwise(lit("VFR")),
                  worst = when(col("worst_rank") == 1).then(lit("LIFR")).when(col("worst_rank") == 2).then(lit("IFR")).when(col("worst_rank") == 3).then(lit("MVFR")).otherwise(lit("VFR")),
                  temp_cat = when(col("temp_rank").is_null()).then(lit(None)).otherwise(when(col("temp_rank") == 1).then(lit("LIFR")).when(col("temp_rank") == 2).then(lit("IFR")).when(col("temp_rank") == 3).then(lit("MVFR")).otherwise(lit("VFR"))),
                  decides = when(col("vmc") == 0).then(col("text"))
                            .when(col("temp_vmc").fill_null(1) == 0).then(col("temp_text"))
                            .otherwise(lit(None)))
    .select("icao", "t", "hour", "group", "category", "rank", "vmc", "text", "ceiling_ft", "vis_sm", "in_change", "before_rank",
            "temp_cat", "temp_rank", "temp_vmc", "temp_prob", "temp_text", "n_temp", "worst", "worst_rank", "ok_prev", "ok_all", "decides")
    .sort("icao", "t")