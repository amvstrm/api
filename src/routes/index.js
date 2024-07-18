/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import { Router } from "express";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import apicache from "apicache-extra";
import { readFileSync } from "fs";

import v1 from "./v1.js";
import v2 from "./v2.js";
import { env } from "../utils/env.js";
import { checkDomain } from "../middlewares.js";

const pkg = JSON.parse(readFileSync("./package.json"));

dotenv.config();
const router = Router();

const allowlist = env.data.ALLOWLIST.split(",") || "";
const limiter = rateLimit({
  windowMs: 60000,
  max: (req) => {
    if (!allowlist.includes(req.headers.origin || req.headers.host)) {
      return parseInt(env.data.RATE_LIMIT, 10) || 200;
    }
    return 0;
  },
  standardHeaders: false,
  legacyHeaders: true,
  message: async (req, res) => {
    res.status(429).json({
      code: 429,
      message: "Too many requests, please wait before sending another request.",
    });
  },
  skip: async (req) => allowlist.includes(req.headers.origin || req.headers.host),
});

let ifHit = false;

export const cache = apicache.options({
  afterHit: () => {
    // eslint-disable-next-line no-console
    console.log(ifHit);
    ifHit = true;
    return true;
  },
  defaultDuration: "1 hour",
  isBypassable: true,
}).middleware;

router.use("/", checkDomain);
router.use("/", (req, res, next) => {
  res.setHeader("x-amv-cache", ifHit ? "HIT" : "MISS");
  res.setHeader("x-amv-version", pkg.version || "0.0.0");
  next();
});
router.use("/", cache("30 minutes"));
router.use("/", limiter);
router.use("/v1", v1);
router.use("/v2", v2);

export default router;
