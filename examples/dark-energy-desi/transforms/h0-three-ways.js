// The Hubble constant from the distance ladder, from the sound-horizon ruler and from Planck.
data.h0.map((h) => ({...h, h0: +h.h0.toFixed(2), err: h.err == null ? null : +h.err.toFixed(2)}))