import { z } from "zod";

const envVariables = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.string().default("8000"),
  ALLOWED_HOSTS: z.string().default("*"),
  BLOCK_WITH_CORS: z.preprocess(Boolean, z.boolean()).default(false),
  RATE_LIMIT: z.string().default("80"),
  RATE_LIMIT_DURATION: z.string().default("60000"),
  PROXY_URL: z.string().default(""),
  GOGOANIME_PROXY: z.string().default("https://anitaku.pe"),
  ANILIST_PROXY: z.string().default("https://graphql.anilist.co"),
  HASH_IP: z.preprocess(Boolean, z.boolean()).default(false),
});

export const env = envVariables.parse(process.env);
