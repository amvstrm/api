/* eslint-disable no-console */
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

export const schema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("production"),
  RATE_LIMIT: z.string().default("180"),
  ALLOWLIST: z.string().default("https://example.com,https://example2.com"),
  PORT: z.string().default("8080"),
  BLOCK_WITH_CORS: z.string().default("false"),
  SENTRY_DSN_URL: z.optional(z.string()),
});

export const env = schema.safeParse(process.env);
