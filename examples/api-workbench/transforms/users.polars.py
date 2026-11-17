data.select(userId = col("id"), name = col("name"),
            company = col("company").struct.field("name"),
            city = col("address").struct.field("city"),
            site = col("website"), email = col("email"))