import httpStatus from "http-status";
import { env } from "./utils/env.js";

export function notFound(req, res, next) {
  const error = new Error(`Route not found`);
  error.code = 404;
  next(error);
}

export function errorHandler(err, req, res, next) {
  res.status(err.code || 500);
  res.json({
    code: err.code || 500,
    message: err.message || httpStatus["500_MESSAGE"],
  });

  next();
}

const allowedDomains = env.data.ALLOWLIST.split(",");

export const checkDomain = (req, res, next) => {
  const { origin } = req.headers;
  if (!allowedDomains.includes(origin)) {
    res.setHeader("x-amv-trueIP", req.ip || "0.0.0.0");
    res.setHeader("x-amv-trueHost", req.headers.referer || "");
    res.setHeader("x-amv-trueUA", req.headers["user-agent"] || "");
    res.setHeader("x-amv-info", "logged");

    return next()
  }
  next();
};

export const empty = (req, res, next) => {
  next();
};

export default {
  notFound,
  errorHandler,
  checkDomain,
  empty,
};
