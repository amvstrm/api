import { Elysia } from "elysia";
import { setupMiddleware } from "./middlewares";
import { setupRoutes } from "./routes";
import { env } from "./utils/env";

const app = new Elysia();
setupMiddleware(app);
setupRoutes(app);

app.listen(env.PORT);

console.log(
  `API is running at http://${app.server?.hostname}:${app.server?.port}\nAPI Docs : http://${app.server?.hostname}:${app.server?.port}/swagger`
);
