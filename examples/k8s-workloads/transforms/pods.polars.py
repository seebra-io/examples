data.rows("items")
    .select(namespace = col("metadata").struct.field("namespace"),
            pod = col("metadata").struct.field("name"),
            owner_kind = col("metadata").struct.field("ownerReferences").list.first().struct.field("kind"),
            owner = col("metadata").struct.field("ownerReferences").list.first().struct.field("name"),
            node = col("spec").struct.field("nodeName"),
            phase = col("status").struct.field("phase"),
            created = col("metadata").struct.field("creationTimestamp"))