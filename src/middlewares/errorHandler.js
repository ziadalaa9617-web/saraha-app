const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  if (!err.isOperational) console.error(err);
  res.status(status).json({
    message: err.isOperational ? err.message : 'something went wrong',
  });
};

module.exports = errorHandler;