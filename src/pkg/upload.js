const multer = require('multer');
const AppError = require('./AppError');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) =>
    ['image/jpeg', 'image/png'].includes(file.mimetype)
      ? cb(null, true)
      : cb(new AppError('only jpeg and png allowed', 400)),
});

const single = (field) => (req, res, next) =>
  upload.single(field)(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      const msg = err.code === 'LIMIT_FILE_SIZE' ? 'file too large (max 2MB)' : err.message;
      return next(new AppError(msg, 400));
    }
    next(err);
  });

module.exports = { single };