import { z } from "zod";
// @ts-ignore
import toBoolean from "to-boolean";

const envVariables = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.string().default("8000"),
  ALLOWED_HOSTS: z.string().default(""),
  BLOCK_WITH_CORS: z.preprocess(toBoolean, z.boolean()).default(false),
  RATE_LIMIT: z.string().default("80"),
  SET_GLOBAL_CACHE: z.string().default("30 minutes"),
  PROXY_URL: z.string().default(""),
});

export const env = envVariables.parse(process.env);
