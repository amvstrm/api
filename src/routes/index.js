import { Router } from "express";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import v1 from "./v1.js";
import v2 from "./v2.js";

dotenv.config();
const router = Router();

function parseEnvList(env) {
  if (!env) {
      return [];
  }
  return env.split(',');
}

const allowlist = parseEnvList(process.env.BYPASS_RATELIMITER)
const limiter = rateLimit({
  windowMs: 60000,
  max: (req) => {
    if (!allowlist.includes(req.headers.origin && req.headers.host))
      return process.env.RATE_LIMIT || 300;
    else return 0;
  },
  standardHeaders: false,
  legacyHeaders: true,
  message: async (req, res) => {
    res.status(429).json({
      status: 429,
      message: "Too many requests, please wait before sending another request.",
    });
  },
  skip: async (req) => {
    return allowlist.includes(req.headers.origin);
  },
});

router.use("/", limiter);
router.use("/v1", v1);
router.use("/v2", v2);

export default router;
