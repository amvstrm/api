import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
// import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
import middlewares from "./middlewares/index.js";
import api from "./routes/api.js";
import apiv2 from "./routes/apiv2.js";
import swaggerdocs from "./docs/index.js"

const limiter = rateLimit({
  windowMs: 60000,
  max: process.env.RATE_LIMIT,
  standardHeaders: false,
  legacyHeaders: true,
  message: async (req, res) => {
    res.status(429).json({
      status: 429,
      message: "Too many requests, please wait before sending another request.",
    });
  },
});

const app = express();
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("x-api-version", "v1.0.0 INDEV");
  next();
});

app.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "ok",
    info: {
      devstat: "IN DEVELOPMENT | NEVER USED IT FOR PRODUCTIONS",
      cache: "All of our endpoints are cached via REDIS (7 days MAX)",
      rate_limit: "500 req per minute",
      rate_info : "This API will cache the data so the rate limit can stay at 499 for a minute."
    },
    swaggerdocs: '/docs',
    endpoint: {
      V1: "/api/v1 | Gogoanime Based (Slower)",
      V2: "/api/v2 | Anilist + Gogo (Faster) (IN BETA)",
    },
  });
});

// YOU CAN ENABLE THIS IF YOU WANT TO MONITOR
// YOUR API/WEBSITE WITHOUT GOING TO THE DASHBOARD
// app.get("/status", (req, res) => {
//   const url = "https://api.checklyhq.com/v1/check-statuses";
//   const options = {
//     headers: {
//       "x-checkly-account": process.env.CHECKLY_ACCID,
//       Authorization: process.env.CHECKLY_AUTH,
//     },
//   };
//   axios.get(url, options).then((response) => {
//     res.json({
//       code: 200,
//       status: {
//         WEB: {
//           last_check: response.data[2].updated_at,
//           check: {
//             failure: response.data[2].hasFailures,
//             error: response.data[2].hasErrors,
//           },
//           down: response.data[2].isDegraded,
//         },
//         API_S1: {
//           last_check: response.data[1].updated_at,
//           check: {
//             failure: response.data[1].hasFailures,
//             error: response.data[1].hasErrors,
//           },
//           down: response.data[1].isDegraded,
//         },
//         API_S2: {
//           last_check: response.data[3].updated_at,
//           check: {
//             failure: response.data[3].hasFailures,
//             error: response.data[3].hasErrors,
//           },
//           down: response.data[3].isDegraded,
//         },
//       },
//     });
//   });
// });

app.get("/api", (req, res) => {
  res.json({
    status: 200,
    message: "ok",
  });
});

app.use('/api/', limiter)
app.use("/api/v1", api);
app.use("/api/v2", apiv2);
app.use("/docs", swaggerdocs)
app.use(function(err, req, res, next) {
  if (!err.statusCode) err.statusCode = 500; // Sets a generic server error status code if none is part of the err
  res.status(err.statusCode).json({
    status : err.statusCode,
    message : err.message
  });
  next();
  // If shouldRedirect is not defined in our error, sends our original err data
});
app.use(middlewares.middleware)

export default app;
