# One row per chip and listed area (Apple's A5 has three: its die shrinks).
# kind: an image sensor (the largest dies made: a full-frame sensor is one die
# of 36 × 24 mm) or a logic chip. 'product model' entries without a maker or
# process node are dropped (AirTags, boards). link: English Wikipedia if there
# is an article, else the Wikidata item.
data.rows("results.bindings")
    .select(qid = col("chip").struct.field("value").str.replace("http://www.wikidata.org/entity/", "", literal=True),
            name = col("chipLabel").struct.field("value"), area_mm2 = col("area").struct.field("value").cast(Float64),
            classes = col("classes").struct.field("value"), node = col("node").struct.field("value"),
            maker = col("maker").struct.field("value"), released = col("released").struct.field("value").str.slice(0, 10),
            wikipedia = col("wikipedia").struct.field("value"))
    .filter(~(col("classes") == "product model") | col("node").is_not_null() | col("maker").is_not_null() | col("name").str.contains("PowerPC|Phenom"))
    .filter((col("area_mm2") > 1) & (col("area_mm2") < 1000))
    .with_columns(kind = when(col("classes").str.contains("image sensor", literal=True)).then(lit("image sensor")).otherwise(lit("logic chip")),
                  link = when(col("wikipedia").is_not_null()).then(col("wikipedia")).otherwise(concat_str([lit("https://www.wikidata.org/wiki/"), col("qid")])))
    .sort("area_mm2")