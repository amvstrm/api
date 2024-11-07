import { Elysia, t } from "elysia";
import { META } from "@consumet/extensions";

import v2 from "../modules/v2";
import { extract } from "../utils/gogostream";
import { base64encode } from "../utils/base64";
import { SeasonList } from "../types/v1";
import { env } from "../utils/env";

const meta = new META.Anilist();

export const v2Routes = (app: Elysia) => {
  app.group("/api/v2", (app) =>
    app
      .get(
        "/info/:id",
        async ({ params, query, set }) => {
          try {
            const data = await v2.AnimeInfo(
              parseInt(params.id)
            );
            return { code: 200, message: "success", ...data };
          } catch (error) {
            set.status = error.code || 500;
            return error;
          }
        },
        {
          params: t.Object({
            id: t.String({ description: "Anilist anime id" }),
          }),
          tags: ["v2"],
          detail: {
            description: "Get anime info from Anilist with provider",
          }
        }
      )
      .get(
        "/recommendations/:id",
        async ({ params, query, set }) => {
          try {
            const results = await v2.SimilarAnime(
              parseInt(params.id),
              parseInt(query.page),
              parseInt(query.limit)
            );
            return { code: 200, message: "success", ...results };
          } catch (error) {
            set.status = error.code || 500;
            return error;
          }
        },
        {
          params: t.Object({
            id: t.String({ description: "Anilist anime id" }),
          }),
          query: t.Object({
            page: t.Optional(t.String({ description: "Page number" })),
            limit: t.Optional(
              t.String({ description: "Number of results per page" })
            ),
          }),
          tags: ["v2"],
          detail: {
            description: "Get similar anime from Anilist",
          }
        }
      )
      .get(
        "/trending",
        async ({ query, set }) => {
          try {
            const data = await v2.Trending(
              query.p ? parseInt(query.p) : 1,
              query.limit ? parseInt(query.limit) : 20
            );
            return {
              code: 200,
              message: "success",
              page: data.pageInfo,
              results: data.results,
            };
          } catch (error) {
            set.status = error.code || 500;
            return error;
          }
        },
        {
          query: t.Object({
            p: t.Optional(t.String({ description: "Page number" })),
            limit: t.Optional(
              t.String({ description: "Number of results per page" })
            ),
          }),
          tags: ["v2"],
          detail: {
            description: "Get trending anime from Anilist",
          }
        }
      )
      .get(
        "/popular",
        async ({ query, set }) => {
          try {
            const data = await v2.Popular(
              query.p ? parseInt(query.p) : 1,
              query.limit ? parseInt(query.limit) : 20
            );
            return {
              code: 200,
              message: "success",
              page: data.pageInfo,
              results: data.results,
            };
          } catch (error) {
            set.status = error.code || 500;
            return error;
          }
        },
        {
          query: t.Object({
            p: t.Optional(t.String({ description: "Page number" })),
            limit: t.Optional(
              t.String({ description: "Number of results per page" })
            ),
          }),
          tags: ["v2"],
          detail: {
            description: "Get popular anime from Anilist",
          }
        }
      )
      .get(
        "/season/:season/:year",
        async ({ params, query, set }) => {
          try {
            const data = await v2.Season(
              params.season.toLocaleUpperCase() as SeasonList,
              parseInt(params.year),
              parseInt(query.p) ?? 1,
              parseInt(query.limit) ?? 20
            );
            return {
              code: 200,
              message: "success",
              page: data.pageInfo,
              results: data.results,
            };
          } catch (error) {
            set.status = error.code || 500;
            return error;
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
            year: t.String({ description: "Year of the season" }),
          }),
          query: t.Object({
            p: t.Optional(t.String({ description: "Page number" })),
            limit: t.Optional(
              t.String({ description: "Number of results per page" })
            ),
          }),
          tags: ["v2"],
          detail: {
            description: "Get seasonal anime from Anilist",
          }
        }
      )
      .get(
        "/episodes/:id",
        async ({ params, query, set }) => {
          try {
            const data = await meta.fetchEpisodesListById(
              params.id,
              Boolean(query.dub),
              Boolean(query.getFiller)
            );
            return {
              code: 200,
              message: "success",
              results: data,
            };
          } catch (error) {
            set.status = 500;
            return {
              code: 500,
              message: "error",
              data: error,
            };
          }
        },
        {
          params: t.Object({
            id: t.String({ description: "Anilist id" }),
          }),
          query: t.Object({
            dub: t.Optional(
              t.Boolean({ description: "Get dub episodes", default: false })
            ),
            getFiller: t.Optional(
              t.Boolean({ description: "Get filler episodes", default: false })
            ),
          }),
          tags: ["v2"],
          detail: {
            description: "Get gogoanime episode list with Anilist ID",
          }
        }
      )
      .get(
        "/stream/:id/:ep",
        async ({ params: { id, ep }, set }) => {
          try {
            const data = await extract(`${id}-episode-${ep}`);

            if (data.code === 404) {
              return {
                code: 404,
                message: "Not Found",
              };
            }

            const mainstrm =
              data.sources === null
                ? null
                : data.sources.find(
                    (item: any) => item.quality === "default"
                  ) ||
                  data.sources[0].url ||
                  null;
            const bkstrm =
              data.sources === null
                ? null
                : data.sources.find((item: any) => item.quality === "backup") ||
                  null;

            const dtatrack =
              data.sources === null ? null : !data.tracks ? "" : data.tracks[0];

            return {
              info: data.info,
              stream: {
                multi: {
                  main: mainstrm,
                  backup: bkstrm,
                },
                tracks: dtatrack,
              },
              iframe: data.iframe,
              plyr:
                data.sources === null
                  ? null
                  : {
                      main: `https://plyr.link/p/player.html#${base64encode(
                        mainstrm.url
                      )}`,
                      backup: `https://plyr.link/p/player.html#${base64encode(
                        bkstrm.url
                      )}`,
                    },
              nspl:
                data.sources === null
                  ? null
                  : {
                      main: `https://nspl.nyt92.eu.org/player?p=${base64encode(
                        `&title=${id}&file=${mainstrm.url}&thumbnails=${dtatrack.file}`
                      )}`,
                      backup: `https://nspl.nyt92.eu.org/player?p=${base64encode(
                        `&title=${id}&file=${bkstrm.url}&thumbnails=${dtatrack.file}`
                      )}`,
                    },
            };
          } catch (error) {
            set.status = error.code || 500;
            return {
              code: error.code || 500,
              message: error.message || "error",
            };
          }
        },
        {
          params: t.Object({
            id: t.String({ description: "Gogoanime id" }),
            ep: t.String({ description: "Episode number" }),
          }),
          tags: ["v2"],
          detail: {
            description: "Get gogoanime's stream link from gogoanime's ID and episode number",
          }
        }
      )
      .get(
        "/stream/skiptimes/:id/:ep",
        async ({ params, set }) => {
          try {
            const data = await v2.AniSkipData(params.id, params.ep);
            return {
              code: 200,
              results: data,
            };
          } catch (error) {
            set.status = error.code || 500;
            return error;
          }
        },
        {
          params: t.Object({
            id: t.String({ description: "Anilist id" }),
            ep: t.String({ description: "Episode number" }),
          }),
          tags: ["v2"],
          detail: {
            description: "Get Aniskip data with Anilist ID and episode number",
          }
        }
      )
      .get(
        "/search",
        async ({ query, set }) => {
          try {
            const data = await v2.AnimeSearch(
              query.q ?? "",
              parseInt(query.page) ?? 1,
              parseInt(query.limit) ?? 20
            );
            return {
              code: 200,
              message: "success",
              page: data.pageInfo,
              results: data.results,
            };
          } catch (error) {
            set.status = error.code || 500;
            return error;
          }
        },
        {
          query: t.Object({
            q: t.String({ description: "Search query" }),
            p: t.Optional(t.String({ description: "Page number" })),
            limit: t.Optional(
              t.String({ description: "Number of results per page" })
            ),
          }),
          tags: ["v2"],
          detail: {
            description: "Query anime with Anilist",
          }
        }
      )
      .post(
        "/search",
        async ({ body, set }) => {
          try {
            const data = await v2.AnimeAdvancedSearch(body);
            return {
              code: 200,
              message: "success",
              page: data.pageInfo,
              results: data.results,
            };
          } catch (error) {
            set.status = error.code || 500;
            return error;
          }
        },
        {
          type: "application/json",
          body: t.Object({
            search: t.String({ description: "Search query" }),
            id: t.Optional(
              t.String({ description: "Anilist anime id", default: undefined })
            ),
            type: t.Optional(
              t.String({ description: "Anime type", default: undefined })
            ),
            size: t.Optional(
              t.Number({
                description: "Number of results per page",
                default: undefined,
              })
            ),
            page: t.Optional(
              t.Number({ description: "Page number", default: undefined })
            ),
            nsfw: t.Optional(
              t.Boolean({ description: "Filter NSFW", default: undefined })
            ),
            genres: t.Optional(
              t.Array(t.String({ description: "Genres" }), {
                default: undefined,
              })
            ),
            tags: t.Optional(
              t.Array(t.String({ description: "Tags" }), { default: undefined })
            ),
            sort: t.Optional(
              t.Array(
                t.String({
                  description: "Sorting options",
                  default: undefined,
                }),
                { default: undefined }
              )
            ),
            format: t.Optional(
              t.Array(t.String({ description: "Formats" }), {
                default: undefined,
              })
            ),
            status: t.Optional(
              t.String({ description: "Status", default: undefined })
            ),
            countryOfOrigin: t.Optional(t.String({ default: undefined })),
            source: t.Optional(t.String({ default: undefined })),
            season: t.Optional(t.String({ default: undefined })),
            seasonYear: t.Optional(t.Number({ default: undefined })),
            year: t.Optional(t.String({ default: undefined })), 
          }),
          tags: ["v2"],
          detail: {
            description: "Search anime with Anilist with advanced search",
          }
        }
      )
  );
};
