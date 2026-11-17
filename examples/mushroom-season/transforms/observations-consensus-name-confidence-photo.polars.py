# confidence: the community's vote on the consensus name, from -3 (as if not) to 3 (as if certain).
data.rows("results")
    .select(observation = col("id"), date = col("date"), confidence = col("confidence").round(2),
            name = col("consensus").struct.field("name"), place = col("location").struct.field("name"),
            namings = col("namings").list.len(), votes = col("votes").list.len(),
            url = concat_str([lit("https://mushroomobserver.org/images/320/"), col("primary_image").struct.field("id").cast(String), lit(".jpg")]),
            link = concat_str([lit("https://mushroomobserver.org/obs/"), col("id").cast(String)]))
    .sort("confidence", descending=True)