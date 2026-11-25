// Collection gaps by record type, over the institution's whole set in
// K-samsök (not a sample): six facet counts per type (all records, and those
// without coordinates, dating, an image; those whose image has a licence;
// those whose record has a licence), turned into shares missing.
// K-samsök's flags: geoDataExists, timeInfoExists, thumbnailExists = n;
// mediaLicense = * (an image's licence), itemLicense = * (the record's).
(() => {
  const terms = (a) => new Map((((a || {}).result || {}).term || []).map((t) => [t.indexFields.value, t.records]));
  const [all, noGeo, noTime, noImg, imgLic, recLic] = data.map(terms);
  const pct = (k, n) => (n ? Math.round((1000 * k) / n) / 10 : null);
  return [...all]
    .filter(([, n]) => n > 0)
    .map(([type, records]) => {
      const no_coordinates = noGeo.get(type) ?? 0;
      const no_dating = noTime.get(type) ?? 0;
      const no_image = noImg.get(type) ?? 0;
      const with_image = Math.max(0, records - no_image);
      // an image without a stated licence: imaged records minus licensed images
      const image_no_licence = Math.max(0, with_image - (imgLic.get(type) ?? 0));
      const no_licence = Math.max(0, records - (recLic.get(type) ?? 0));
      return {
        type, records, no_coordinates, no_dating, no_image, with_image, image_no_licence, no_licence,
        pct_no_coordinates: pct(no_coordinates, records),
        pct_no_dating: pct(no_dating, records),
        pct_no_image: pct(no_image, records),
        pct_image_no_licence: pct(image_no_licence, with_image),
        pct_no_licence: pct(no_licence, records),
      };
    })
    .sort((a, b) => b.records - a.records);
})()
