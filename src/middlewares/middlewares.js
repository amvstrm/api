export const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`404 Not Found`);
  next(error);
};

export const badrequest = (req, res, next) => {
  res.status(400);
  const error = new Error(`Bad Requests`);
  next(error);
}

export const methodNotAllowed = (req, res, next) => {
  res.status(405);
  const error = new Error(`Method Not Allowed`);
  next(error);
};

/* eslint-disable no-unused-vars */
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    status: statusCode,
    message: err.message
  });
};