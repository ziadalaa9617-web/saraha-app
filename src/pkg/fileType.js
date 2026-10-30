const SIGNATURES = {
  'image/jpeg': { ext: 'jpg', bytes: [0xff, 0xd8, 0xff] },
  'image/png': { ext: 'png', bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
};

const detect = (buffer) => {
  for (const [mime, { ext, bytes }] of Object.entries(SIGNATURES)) {
    if (bytes.every((b, i) => buffer[i] === b)) return { mime, ext };
  }
  return null;
};

module.exports = { detect };