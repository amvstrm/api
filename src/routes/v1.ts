import { Elysia, t } from "elysia";
import v1 from "../modules/v1";
import type { SeasonList, TypeReleases } from "../types/v1";

export const v1Routes = (app: Elysia) => {
  app.group("/api/v1", (app) =>
    app
      .get(
        "/info/:id",
        async ({ params: { id } }) => {
          const data = await v1.animeInfo(id);
          return data;
        },
        {
          params: t.Object({
            id: t.String({ description: "Gogoanime id" }),
          }),
          tags: ["v1"],
        }
      )
      .get(
        "/search",
        async ({ query: { q, p } }) => {
          const page = p ? parseInt(p) : 1;
          const data = await v1.search(q ?? "", page);
          return data;
        },
        {
          query: t.Object({
            q: t.String({ description: "Search query" }),
            p: t.Optional(t.String({ description: "Page number" })),
          }),
          tags: ["v1"],
        }
      )
      .get(
        "/season",
        async ({ query: { season, p } }) => {
          const page = p ? parseInt(p) : 1;
          const data = await v1.season(season as SeasonList, page);
          return data;
        },
        {
          query: t.Object({
            season: t.Enum({
              WINTER: "winter",
              SPRING: "spring",
              SUMMER: "summer",
              FALL: "fall",
            }),
            p: t.Optional(t.String({ description: "Page number" })),
          }),
          tags: ["v1"],
        }
      )
      .get(
        "/episode/:id",
        async ({ params: { id } }) => {
          const data = await v1.getEplist(id);
          return data;
        },
        {
          params: t.Object({
            id: t.String({ description: "Gogoanime id" }),
          }),
          tags: ["v1"],
        }
      )
      .get(
        "/stream/:id/:ep",
        async ({ params: { id, ep } }) => {
          const data = await v1.getStream(id, ep);
          return data;
        },
        {
          params: t.Object({
            id: t.String({ description: "Gogoanime id" }),
            ep: t.String({ description: "Episode number" }),
          }),
          tags: ["v1"],
        }
      )
      .get(
        "/recent/:type",
        async ({ params, query }) => {
          const page = query.p ? parseInt(query.p) : 1;
          const data = await v1.recentReleaseEpisodesType(
            page,
            params.type as TypeReleases
          );
          return data;
        },
        {
          params: t.Object({
            type: t.Enum({
              SUB: "sub",
              DUB: "dub",
              CN: "cn",
              ALL: "all",
            }),
          }),
          query: t.Object({
            p: t.Optional(t.String()),
          }),
          tags: ["v1"],
        }
      )
  );
}
