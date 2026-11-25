// The protein changes one DNA letter can make, with AlphaMissense, gnomAD and ClinVar: sort by am,
// filter clinvar = uncertain for the variants a prediction could help with.
data.variants.map(({variant_ids, carriers, ...v}) => ({...v, variant: variant_ids.join(" "), af: v.af ? +v.af.toPrecision(3) : 0}))