data.rows("items")
    .filter(col("status").struct.field("phase") == "Running")
    .select(namespace = col("metadata").struct.field("namespace"),
            pod = col("metadata").struct.field("name"),
            owner_kind = col("metadata").struct.field("ownerReferences").list.first().struct.field("kind"),
            rs = col("metadata").struct.field("ownerReferences").list.first().struct.field("name"),
            c = col("spec").struct.field("containers"))
    .filter(col("owner_kind") == "ReplicaSet")
    .with_columns(deployment = col("rs").str.replace("-[a-z0-9]+$", ""))
    .explode("c")
    .select("namespace", "deployment", "pod", container = col("c").struct.field("name"), running_image = col("c").struct.field("image"))
    .join(data1.select("namespace", "deployment", "container", template_image = col("image")), on=["namespace", "deployment", "container"])
    .group_by("namespace", "deployment", "container", "template_image", "running_image")
    .agg(pods = len())
    .with_columns(current = col("running_image") == col("template_image"))
    .sort("current")