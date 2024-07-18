/* eslint-disable no-nested-ternary */
import express, { json, urlencoded } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import * as Sentry from "@sentry/node";

import { notFound, errorHandler } from "./middlewares.js";
import api from "./routes/index.js";
import { env } from "./utils/env.js";

const app = express();

app.use(
  cors({
    origin:
      env.data.BLOCK_WITH_CORS === "true" && env.data.ALLOWLIST
        ? env.data.ALLOWLIST.split(",")
        : "*",
    exposedHeaders: [
      "x-amv-trueIP",
      "x-amv-trueHost",
      "x-amv-trueUA",
      "x-amv-info",
    ],
  })
);
app.use(morgan("dev"));
app.use(helmet());
app.use(json());
app.use(urlencoded({ extended: true }));

app.set("trust proxy", 1);

Sentry.init({
  environment: env.data.NODE_ENV,
  dsn: env.data.SENTRY_DSN_URL,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],
  tracesSampleRate: 0,
  sampleRate: 0.1,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.get("/", (req, res) => {
  res.json({
    code: 200,
    message: "success",
    docs: "https://amvdocs.pages.dev/api/introduction",
  });
});

app.use("/api", api);

app.use(Sentry.Handlers.errorHandler());

app.use(notFound);
app.use(errorHandler);

export default app;
