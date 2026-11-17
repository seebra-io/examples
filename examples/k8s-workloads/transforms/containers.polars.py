data.rows("items")
    .select(namespace = col("metadata").struct.field("namespace"),
            pod = col("metadata").struct.field("name"),
            owner_kind = col("metadata").struct.field("ownerReferences").list.first().struct.field("kind"),
            owner = col("metadata").struct.field("ownerReferences").list.first().struct.field("name"),
            node = col("spec").struct.field("nodeName"),
            phase = col("status").struct.field("phase"),
            c = col("status").struct.field("containerStatuses"))
    .explode("c")
    .filter(col("c").is_not_null())
    .select("namespace", "pod", "owner_kind", "owner", "node", "phase",
            container = col("c").struct.field("name"),
            restarts = col("c").struct.field("restartCount"),
            ready = col("c").struct.field("ready"),
            image = col("c").struct.field("image"))