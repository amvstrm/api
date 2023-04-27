import httpStatus from 'http-status';

export function notFound(req, res, next) {
  const error = new Error(`Route not found`);
  error.code = 404
  next(error);
}

// handle error with http-status 

export function errorHandler(err, req, res, next) {
  console.error(err.message);
  res.status(err.code || 500);
  res.json({
    code: err.code || 500,
    message: err.message || httpStatus['500_MESSAGE']
  })
}

export default {
  notFound,
  errorHandler,
};
