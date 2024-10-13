import { Elysia } from "elysia";
import { v1Routes } from "./v1";
import { v2Routes } from "./v2";

export function setupRoutes(app: Elysia) {
  app
    .get("/", () => ({
      code: 200,
      message: "",
    }), {
      tags: [""],
    })
    .get("/health", async () => "ok", {
      tags: [""],
    });
  v1Routes(app);
  v2Routes(app);
}
