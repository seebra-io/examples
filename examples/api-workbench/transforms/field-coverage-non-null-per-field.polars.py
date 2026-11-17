data.select(records = len(), userId = col("userId").count(), name = col("name").count(),
            company = col("company").count(), city = col("city").count(),
            site = col("site").count(), email = col("email").count())