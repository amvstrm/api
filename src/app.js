import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
import {notFound, errorHandler} from "./middlewares/middlewares.js";
import api from "./routes/api.js";
import apiv2 from "./routes/apiv2.js";
import apiv3 from "./routes/apiv3.js";
import swaggerdocs from "./docs/index.js"

// ALLOW UNLIMITED RATE LIMIT ON AMVSTRM and LOCALHOST
// When you allow the website, pls only put the url eg 'http://xxx.xxx/'
const allowlist = ['https://example.com']

const limiter = rateLimit({
  windowMs: 60000,
  max: (req) => {
    // const gethost = req.protocol + '://' + req.get('host') + req.originalUrl
    if (!allowlist.includes(req.headers["origin"])) return process.env.RATE_LIMIT || 300
    else return 0
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
    // const gethost = req.protocol + '://' + req.get('host') + req.originalUrl
    allowlist.includes(req.headers["origin"])
  }
});

const app = express();
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "ok",
    info: {
      devstat: "IN DEVELOPMENT | NEVER USE (api/v2) FOR PRODUCTIONS",
      cache: "All of our endpoints are cached via REDIS (7 days MAX)",
      rate_limit: "300 req per minute",
      rate_info : "Due to massive ammount of request, we have drop to 300 req per minute."
    },
    swaggerdocs: '/docs',
    endpoint: {
      V1: "/api/v1 | Gogoanime Based (Slower)",
      V2: "/api/v2 | Anilist + Gogo (Faster)",
    },
  });
});


app.get("/api", (req, res) => {
  res.json({
    status: 200,
    message: "ok",
  });
});

app.get("/robots.txt", (req, res) => {
  res.setHeader("content-type", "text/plain");
  res.send("User-agent: SemrushBot\nDisallow: /")
})

app.use('/api/', limiter)
app.use("/api/v1", api);
app.use("/api/v2", apiv2);
app.use("/docs", swaggerdocs)
// app.use(function(err, req, res, next) {
//   if (!err.statusCode) err.statusCode = 500;
//   res.status(err.statusCode).json({
//     status : err.statusCode,
//     message : err.message
//   });
//   next();
// });
app.use(notFound)
app.use(errorHandler)

export default app;
