import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { DefaultContext, rateLimit } from "elysia-rate-limit";
import { Logestic } from "logestic";
import { helmet } from "elysia-helmet";
import { httpError } from "elysia-http-error";
import { HttpStatusCode } from "elysia-http-status-code";
import { ip } from "elysia-ip";

import type { SocketAddress } from "bun";
import type { Generator } from "elysia-rate-limit";

import { env } from "./utils/env";

const excludeRoutes = ["/", "/health", "/swagger"];

const ipGenerator: Generator<{ ip: SocketAddress }> = (
  _req: any,
  _serv: any,
  { ip }: any
) => {
  const hashedIP = Bun.hash(JSON.stringify(ip)).toString();

  if (env.HASH_IP) {
    return hashedIP;
  }

  return ip;
};

export const errorHandler = ({ code, httpStatus, error }) => {
  switch (code) {
    case "NOT_FOUND":
      return { code: httpStatus.HTTP_404_NOT_FOUND, message: error.message };
    case "BAD_REQUEST":
      return { code: httpStatus.HTTP_400_BAD_REQUEST, message: error.message };
    case "UNAUTHORIZED":
      return { code: httpStatus.HTTP_401_UNAUTHORIZED, message: error.message };
    case "FORBIDDEN":
      return { code: httpStatus.HTTP_403_FORBIDDEN, message: error.message };
    case "INTERNAL_SERVER_ERROR":
      return {
        code: httpStatus.HTTP_500_INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    default:
      return {
        code: httpStatus.HTTP_500_INTERNAL_SERVER_ERROR,
        message: "Something went wrong",
      };
  }
};

export function setupMiddleware(app: Elysia) {
  return app
    .use(
      cors({
        origin: env.ALLOWED_HOSTS.split(",") ?? "*",
        preflight: true,
      })
    )
    .use(
      swagger({
        autoDarkMode: true,
        scalarVersion: "1.25.50",
        documentation: {
          info: {
            title: "amvstrm's API",
            description:
              "amvstrm's API is a collection of APIs that provide data from various sources. Please noted that this API is still in beta that missing some of the routes, functions and may be subject to change in the future.",
            termsOfService: "https://docs.amvstr.me/docs/api/usage",
            version: "3.0.0 Beta",
            contact: {
              name: "amvstrm",
              url: "https://amvstr.me",
              email: "amvstrmkh@gmail.com",
            },
            license: {
              name: "GPL-3.0",
              url: "https://github.com/amvstrm/api/blob/master/LICENSE",
            },
          },
          externalDocs: {
            url: "https://docs.amvstr.me/docs/api/usage",
            description: "API Documentation",
          },
          tags: [
            {
              name: "v1",
              description: "V1 endpoints provided data from Gogoanime",
            },
            {
              name: "v2",
              description:
                "V2 endpoints provided data from Anilist & Gogoanime including other sources (Recommended)",
            },
          ],
        },
        scalarConfig: {
          layout: "classic",
          spec: {
            url: "/swagger/json",
          },
          theme: "deepSpace"
        },
      })
    )
    .use(
      rateLimit({
        duration: parseInt(env.RATE_LIMIT_DURATION) ?? 60000,
        max: parseInt(env.RATE_LIMIT) ?? 100,
        headers: true,
        scoping: "global",
        context: new DefaultContext(8000),
        generator: ipGenerator,
        skip: (req, key) => {
          console.log(
            req.url,
            excludeRoutes.some((route) => {
              return (
                new URL(req.url).pathname === route ||
                new URL(req.url).pathname.startsWith(route + "/")
              );
            })
          );
          if (
            excludeRoutes.some((route) => {
              return (
                new URL(req.url).pathname === route ||
                new URL(req.url).pathname.startsWith(route + "/")
              );
            })
          ) {
            return true;
          }
          if (env.ALLOWED_HOSTS.includes(req.headers?.get("host") as string)) {
            return true;
          }
          return false;
        },
      })
    )
    .use(
      helmet({
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            "script-src": ["'self'", "*", "https://cdn.jsdelivr.net"],
          },
        },
      })
    )
    .use(Logestic.preset("fancy"))
    .use(HttpStatusCode())
    .onError(errorHandler);
}
