# Every TAF in the box, one row per change group (NOAA's decoded
# fcsts): the base forecast, FM, BECMG, TEMPO and PROB groups, with their
# validity (s since 1970), wind, visibility, weather and ceiling.
# kind: "prevailing" for the base forecast, FM and BECMG (what is expected);
# "temporary" for TEMPO and PROB (what may happen for part of the time, or
# with a 30 or 40% chance). NOAA carries every element forward into BECMG
# groups; a TEMPO or PROB group lists only what changes, so given_vis and
# given_cloud say whether it sets visibility and cloud (else they come from
# the prevailing group in the next step).
# own_rank: the category from the elements the group gives (no ceiling =
# unlimited) and own_vmc whether it meets the minima: right for prevailing
# groups.
data.select(icao = col("icaoId"), name = col("name"), issued = col("issueTime"),
            valid_from = col("validTimeFrom"), valid_to = col("validTimeTo"), raw = col("rawTAF"), f = col("fcsts"))
    .explode("f")
    .with_row_index("p")
    .with_columns(change = col("f").struct.field("fcstChange"), prob = col("f").struct.field("probability"),
                  t_from = col("f").struct.field("timeFrom"), t_to = col("f").struct.field("timeTo"),
                  t_bec = col("f").struct.field("timeBec"),
                  wdir = col("f").struct.field("wdir").cast(String), wspd_kt = col("f").struct.field("wspd"),
                  gust_kt = col("f").struct.field("wgst"), vis = col("f").struct.field("visib").cast(String),
                  vv_ft = col("f").struct.field("vertVis"), wx = col("f").struct.field("wxString"),
                  n_cloud = col("f").struct.field("clouds").list.len())
    .join(data.select(icao = col("icaoId"), f = col("fcsts")).explode("f").with_row_index("p")
              .select("p", cl = col("f").struct.field("clouds")).explode("cl")
              .with_columns(cover = col("cl").struct.field("cover"), base = col("cl").struct.field("base"),
                            cb = col("cl").struct.field("type"))
              .group_by("p")
              .agg(layer_ft = when(col("cover").is_in(["BKN", "OVC", "OVX"])).then(col("base")).otherwise(lit(None)).min(),
                   cb = col("cb").first()),
          on="p", how="left")
    .with_columns(kind = when(col("change").is_in(["TEMPO", "PROB"])).then(lit("temporary")).otherwise(lit("prevailing")),
                  group = when(col("change").is_null() & (col("t_from") == col("valid_from"))).then(lit("BASE"))
                          .when(col("change").is_null()).then(lit("FM"))
                          .when((col("change") == "PROB")).then(concat_str([lit("PROB"), col("prob").cast(String)]))
                          .when(col("prob").is_not_null()).then(concat_str([lit("PROB"), col("prob").cast(String), lit(" TEMPO")]))
                          .otherwise(col("change")),
                  vis_sm = col("vis").str.replace("+", "", literal=True).cast(Float64, strict=False),
                  ceiling_ft = when(col("vv_ft").is_not_null()).then(col("vv_ft")).otherwise(col("layer_ft")),
                  given_cloud = ((col("n_cloud") > 0) | col("vv_ft").is_not_null()).cast(Int64))
    .with_columns(given_vis = col("vis_sm").is_not_null().cast(Int64),
                  own_rank = when((col("ceiling_ft").fill_null(99999) < 500) | (col("vis_sm").fill_null(99) < 1)).then(1).when((col("ceiling_ft").fill_null(99999) < 1000) | (col("vis_sm").fill_null(99) < 3)).then(2).when((col("ceiling_ft").fill_null(99999) <= 3000) | (col("vis_sm").fill_null(99) <= 5)).then(3).otherwise(4),
                  own_vmc = ((col("ceiling_ft").fill_null(99999) >= 1500) & (col("vis_sm").fill_null(99) * 1609.34 >= 5000)).cast(Int64),
                  from_z = (col("t_from") * 1000000).cast(Int64).cast(Datetime).dt.strftime("%d/%H"),
                  to_z = (col("t_to") * 1000000).cast(Int64).cast(Datetime).dt.strftime("%d/%H"),
                  issued_z = (col("issued").str.slice(0, 10).str.to_date("%Y-%m-%d").cast(Int64) * 86400 + col("issued").str.slice(11, 2).cast(Int64) * 3600 + col("issued").str.slice(14, 2).cast(Int64) * 60 * 1000000).cast(Int64).cast(Datetime).dt.strftime("%d %H:%MZ"))
    .with_columns(text = concat_str([col("group"), lit(" "), col("from_z"), lit("–"), col("to_z"), lit("Z:"),
                                     when(col("given_vis") == 1).then(concat_str([lit(" vis "), ((col("vis_sm") * 16.0934).round(0) * 100).cast(Int64).cast(String), lit(" m"), when(col("vis").str.ends_with("+")).then(lit("+")).otherwise(lit(""))])).otherwise(lit("")),
                                     when(col("wx").is_not_null()).then(concat_str([lit(", "), col("wx")])).otherwise(lit("")),
                                     when(col("given_cloud") == 0).then(lit(""))
                                     .when(col("ceiling_ft").is_null()).then(lit(", no ceiling"))
                                     .otherwise(concat_str([lit(", ceiling "), col("ceiling_ft").cast(String), lit(" ft")])),
                                     when(col("cb").is_not_null()).then(concat_str([lit(" "), col("cb")])).otherwise(lit("")),
                                     when(col("gust_kt").is_not_null()).then(concat_str([lit(", gusts "), col("gust_kt").cast(String), lit(" kt")])).otherwise(lit(""))]))
    .select("p", "icao", "name", "issued", "issued_z", "valid_from", "valid_to", "group", "kind", "change", "prob",
            "t_from", "t_to", "t_bec", "from_z", "to_z", "wdir", "wspd_kt", "gust_kt", "vis", "vis_sm", "wx",
            "ceiling_ft", "cb", "given_vis", "given_cloud", "own_rank", "own_vmc", "text", "raw")