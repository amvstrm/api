export const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`404 Not Found`);
  next(error);
};

export const interServerr = (req, res, next) => {
  res.status(500);
  const error = new Error(`500 Server Error`);
  next(error);
};


/* eslint-disable no-unused-vars */
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode;
  res.status(statusCode);
  res.json({
    status: statusCode,
    message: err.message
  });
};