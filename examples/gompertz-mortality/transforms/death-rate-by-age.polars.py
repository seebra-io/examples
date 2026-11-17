# Age as a number (Y_LT1 is under one year: 0; the last group is open,
# 85+ in 2003 and 95+ in 2023, and is flagged), ln m(x) for the fit, and
# readable labels for the codes.
data.filter(col("mx") > 0)
    .with_columns(open_age = col("age_code").str.starts_with("Y_GE"),
                  age = when(col("age_code") == "Y_LT1").then(lit(0))
                        .when(col("age_code").str.starts_with("Y_GE")).then(col("age_code").str.slice(4, 3).cast(Int64, strict=False))
                        .otherwise(col("age_code").str.slice(1, 3).cast(Int64, strict=False)))
    .with_columns(ln_mx = col("mx").log(),
                  sex = when(col("sex") == "F").then(lit("women")).otherwise(lit("men")),
                  country = when(col("geo") == "SE").then(lit("Sweden")).when(col("geo") == "DK").then(lit("Denmark"))
                            .when(col("geo") == "FR").then(lit("France")).when(col("geo") == "ES").then(lit("Spain"))
                            .when(col("geo") == "IT").then(lit("Italy")).when(col("geo") == "PL").then(lit("Poland"))
                            .when(col("geo") == "LT").then(lit("Lithuania")).when(col("geo") == "BG").then(lit("Bulgaria")).otherwise(col("geo")),
                  link = lit("https://ec.europa.eu/eurostat/databrowser/view/demo_mlifetable/default/table"))
    .select("geo", "country", "sex", "year", "age", "open_age", "mx", "ln_mx", "link")
    .sort("geo", "sex", "year", "age")