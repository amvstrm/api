import { Router } from "express";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import apicache from "apicache-plus";
import Redis from "ioredis";

import v1 from "./v1.js";
import v2 from "./v2.js";

dotenv.config();
const router = Router();

const allowlist = process.env.ALLOWLIST.split(",") || "";
const limiter = rateLimit({
  windowMs: 60000,
  max: (req, res) => {
    if (!allowlist.includes(req.headers.origin || req.headers.host))
      return parseInt(process.env.RATE_LIMIT) || 200;
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
  skip: async (req) => {
    return allowlist.includes(req.headers.origin || req.headers.host);
  },
});

let cache = apicache.options({
    defaultDuration: "1 hour",
  }).middleware;

router.use("/", cache("30 minutes"))
router.use("/", limiter);
router.use("/v1", v1);
router.use("/v2", v2);

export default router;
