import { Elysia, t } from "elysia";
import v1 from "../modules/v1";
import type { SeasonList, TypeReleases } from "../types/v1";

export const v1Routes = (app: Elysia) => {
  app.group("/api/v1", (app) =>
    app
      .get(
        "/info/:id",
        async ({ params: { id }, set }) => {
          try {
            const data = await v1.animeInfo(id);
            return {
              code: 200,
              message: "Anime info retrieved successfully",
              ...data,
            };
          } catch (error) {
            set.status = error.code || 500;
            return {
              code: error.code || 500,
              message: error.message || "Failed to retrieve anime info",
            };
          }
        },
        {
          params: t.Object({
            id: t.String({ description: "Gogoanime id" }),
          }),
          tags: ["v1"],
          detail: {
            description: "Get anime info",
          },
        }
      )
      .get(
        "/search",
        async ({ query: { q, p }, set }) => {
          try {
            const page = p ? parseInt(p) : 1;
            const data = await v1.search(q ?? "", page);
            return {
              code: 200,
              message: "Search completed successfully",
              results: data,
            };
          } catch (error) {
            set.status = error.code || 500;
            return {
              code: error.code || 500,
              message: error.message || "Search failed",
            };
          }
        },
        {
          query: t.Object({
            q: t.String({ description: "Search query" }),
            p: t.Optional(t.String({ description: "Page number" })),
          }),
          tags: ["v1"],
          detail: {
            description: "Search anime",
          },
        }
      )
      .get(
        "/popular",
        async ({ query, set }) => {
          try {
            const data = await v1.popular(parseInt(query.p));
            return {
              code: 200,
              message: "Popular data retrieved successfully",
              results: data,
            };
          } catch (error) {
            set.status = error.code || 500;
            return {
              code: error.code || 500,
              message: error.message || "Failed to retrieve data",
            };
          }
        },
        {
          query: t.Object({
            p: t.Optional(t.String({ description: "Page number" })),
          }),
          tags: ["v1"],
        }
      )
      .get(
        "/topair",
        async ({ query, set }) => {
          try {
            const data = await v1.topair(parseInt(query.p));
            return {
              code: 200,
              message: "success",
              results: data,
            };
          } catch (error) {
            set.status = error.code || 500;
            return {
              code: error.code || 500,
              message: error.message || "Failed to retrieve data",
            };
          }
        },
        {
          query: t.Object({
            p: t.Optional(t.String({ description: "Page number" })),
          }),
          tags: ["v1"],
        }
      )
      .get(
        "/movies",
        async ({ query: { p }, set }) => {
          try {
            const data = await v1.movies("", parseInt(p));
            return {
              code: 200,
              message: "Movies retrieved successfully",
              results: data,
            };
          } catch (error) {}
        },
        {
          query: t.Object({
            p: t.Optional(t.String({ description: "Page number" })),
          }),
          tags: ["v1"],
        }
      )
      .get(
        "/season/:season/:year",
        async ({ params: { season, year, p }, set }) => {
          try {
            const page = p ? parseInt(p) : 1;
            const data = await v1.season(
              season as SeasonList,
              parseInt(year),
              page
            );
            return {
              code: 200,
              message: "Season data retrieved successfully",
              results: data,
            };
          } catch (error) {
            set.status = error.code || 500;
            return {
              code: error.code || 500,
              message: error.message || "Failed to retrieve data",
            };
          }
        },
        {
          params: t.Object({
            season: t.Enum({
              WINTER: "winter",
              SPRING: "spring",
              SUMMER: "summer",
              FALL: "fall",
            }),
            year: t.Number({
              description: "Years from 2014-2024",
            }),
            p: t.Optional(t.String({ description: "Page number" })),
          }),
          tags: ["v1"],
          detail: {
            description:
              "Get seasonal anime from Fall, Winter, Spring, and Summer",
          },
        }
      )
      .get(
        "/episode/:id",
        async ({ params: { id }, set }) => {
          try {
            const data = await v1.getEplist(id);
            return {
              code: 200,
              message: "Episode list retrieved successfully",
              ...data,
            };
          } catch (error) {
            set.status = error.code || 500;
            return {
              code: error.code || 500,
              message: error.message || "Failed to retrieve data",
            };
          }
        },
        {
          params: t.Object({
            id: t.String({ description: "Gogoanime id" }),
          }),
          tags: ["v1"],
          detail: {
            description: "Get gogoanime episode list",
          },
        }
      )
      .get(
        "/stream/:id/:ep",
        async ({ params: { id, ep }, set }) => {
          try {
            const data = await v1.getStream(id, ep);
            if (data.code !== 200) {
              set.status = data.code || 500;
              return {
                code: data.code || 500,
                message: data.message || "Failed to retrieve stream data",
              };
            }
            return {
              code: 200,
              message: "Stream data retrieved successfully",
              ...data,
            };
          } catch (error) {
            set.status = error.code || 500;
            return {
              code: error.code || 500,
              message: error.message || "Failed to retrieve data",
            };
          }
        },
        {
          params: t.Object({
            id: t.String({ description: "Gogoanime id" }),
            ep: t.String({ description: "Episode number" }),
          }),
          tags: ["v1"],
          detail: {
            description:
              "Get gogoanime's stream link from gogoanime' ID and episode number",
          },
        }
      )
      .get(
        "/recent/:type",
        async ({ params, query, set }) => {
          try {
            const page = query.p ? parseInt(query.p) : 1;
            const data = await v1.recentReleaseEpisodesType(
              page,
              params.type as TypeReleases
            );
            return {
              code: 200,
              message: "Recent episodes retrieved successfully",
              results: data,
            };
          } catch (error) {
            set.status = error.code || 500;
            return {
              code: error.code || 500,
              message: error.message || "Failed to retrieve stream data",
            };
          }
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
          detail: {
            description: "Get recent episodes from gogoanime",
          },
        }
      )
      .get(
        "/download/:id",
        async ({ params, set }) => {
          try {
            const data = await v1.getDownloadLinks(params.id);
            return {
              code: 200,
              message: "Download links retrieved successfully",
              ...data,
            };
          } catch (error) {
            set.status = error.code || 500;
            return {
              code: error.code || 500,
              message: error.message || "Failed to retrieve download links",
            };
          }
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          tags: ["v1"],
          detail: {
            description: "Get download links from gogoanime",
          },
        }
      )
  );
};
