data.select(date = col("date"), code = col("countryCode"), holiday = col("name"), local_name = col("localName"),
            nationwide = col("global").cast(Int64),
            regions = col("counties").list.len().fill_null(0),
            types = col("types").list.join(", "))