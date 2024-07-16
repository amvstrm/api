import type {
  SeasonList,
  GenreList,
  TypeReleases,
  Result,
  Episode,
} from "../src/types/v1";

import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { rateLimit } from "elysia-rate-limit";
import { Logestic } from "logestic";
import { helmet } from "elysia-helmet";
import { httpError } from "elysia-http-error";
import { HttpStatusCode } from "elysia-http-status-code";

import v1 from "./modules/v1";
import v2 from "./modules/v2";

import { env } from "./utils/env";
import { extract } from "./utils/gogostream";
import { base64encode } from "./utils/base64";

const app = new Elysia()
  .use(
    cors({
      origin: "*",
    })
  )
  .use(
    swagger({
      autoDarkMode: true,
      documentation: {
        info: {
          title: "amvstrm's API",
          description: `
          amvstrm's API is a collection of APIs that provide data from various sources. Please noted that this API is still in beta that missing some of the routes, functions and may be subject to change in the future.
          `,
          termsOfService: "https://docs.amvstrm.com/api/usage",
          version: "3.0.0 Beta",
          contact: {
            name: "amvstrm",
            url: "https://amvstr.me",
            email: "amvstrm@skiff.com",
          },
          license: {
            name: "GPL-3.0",
            url: "https://github.com/amvstrm/api/blob/master/LICENSE",
          },
        },
        externalDocs: {
          url: "https://docs.amvstrm.com/api/usage",
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
              "V2 endpoints provided data from Anilist & Gogoanime including other sources",
          },
        ],
      },
      exclude: ["/"],
      scalarConfig: {
        layout: "modern",
        proxy: "",
      },
    })
  )
  .use(
    rateLimit({
      duration: 60000,
      max: 80,
      headers: true,
      scoping: "global",
      skip: (req, key) => {
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
          "script-src": ["'self'", "https://cdn.jsdelivr.net/"],
        },
      },
    })
  )
  .use(Logestic.preset("fancy"))
  .use(httpError())
  .use(HttpStatusCode())
  .onError(({ code, httpStatus, error }) => {
    if (code === "NOT_FOUND") {
      return {
        code: httpStatus.HTTP_404_NOT_FOUND,
        message: error.message,
      };
    }

    if (code === "INTERNAL_SERVER_ERROR") {
      return {
        code: httpStatus.HTTP_500_INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  })
  .get("/", () => {
    return {
      code: 200,
      message: "Hello World!",
    };
  })
  .group("/api/v1", (app) =>
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
        async ({ query: { q, page } }) => {
          const data = await v1.search(q ?? "", page ? parseInt(page) : 1);
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
        async ({ query: { season, page } }) => {
          const data = await v1.season(season as SeasonList, parseInt(page));
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
          const data = await v1.recentReleaseEpisodesType(
            parseInt(query.p) ?? 1,
            params.type as TypeReleases
          );
          console.log(params.type);
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
            p: t.Optional(t.Number()),
          }),
          tags: ["v1"],
        }
      )
  )
  .group("/api/v2", (app) =>
    app
      .get(
        "/info/:id",
        async ({ params, set }) => {
          try {
            const data = await v2.AnimeInfo(parseInt(params.id));
            if (data?.error) {
              set.status = 500;
              return { code: 500, message: "error", ...data.error };
            }
            return { code: 200, message: "success", ...data };
          } catch (error) {
            set.status = 500;
            return { code: 500, message: "error", ...error };
          }
        },
        {
          params: t.Object({
            id: t.String({ description: "Anilist anime id" }),
          }),
          tags: ["v2"],
        }
      )
      .get(
        "/recommendations/:id",

        async ({ params, query, set }) => {
          try {
            const { pageInfo, results } = await v2.SimilarAnime(
              parseInt(params.id),
              parseInt(query.page),
              parseInt(query.limit)
            );
            return { status: 200, message: "success", info: pageInfo, results };
          } catch (error) {
            set.status = 500;
            return { code: 500, message: "error", data: error };
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
            set.status = 500;
            return { code: 500, message: "error", data: error };
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
            set.status = 500;
            return { code: 500, message: "error", data: error };
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
                    } || null,
            };
          } catch (error) {
            set.status = 500;
            return {
              code: 500,
              message: "error",
            };
          }
        },
        {
          params: t.Object({
            id: t.String({ description: "Gogoanime id" }),
            ep: t.String({ description: "Episode number" }),
          }),
          tags: ["v2"],
        }
      )
      .get(
        "/stream/skiptimes/:id/:ep",
        async ({ params, query, set }) => {
          try {
            const data = await v2.AniSkipData(
              params.id,
              params.ep,
              query.source as "1" | "2"
            );
            return {
              code: 200,
              results: data,
            };
          } catch (error) {
            set.status = 500;
            return {
              code: 500,
              message: "error",
            };
          }
        },
        {
          params: t.Object({
            id: t.String({ description: "Anilist id" }),
            ep: t.String({ description: "Episode number" }),
          }),
          query: t.Object({
            source: t.Optional(
              t.String({
                description: "Source provider (Aniskip & Zoro)",
                default: "1",
              })
            ),
          }),
          tags: ["v2"],
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
            set.status = 500;
            return { code: 500, message: "error", data: error };
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
            set.status = 500;
            return { code: 500, message: "error", data: error };
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
            onList: t.Optional(t.Boolean({ default: undefined })),
            yearLesser: t.Optional(t.Number({ default: undefined })),
            yearGreater: t.Optional(t.Number({ default: undefined })),
            episodeLesser: t.Optional(t.Number({ default: undefined })),
            episodeGreater: t.Optional(t.Number({ default: undefined })),
            durationLesser: t.Optional(t.Number({ default: undefined })),
            durationGreater: t.Optional(t.Number({ default: undefined })),
            chapterLesser: t.Optional(t.Number({ default: undefined })),
            chapterGreater: t.Optional(t.Number({ default: undefined })),
            volumeLesser: t.Optional(t.Number({ default: undefined })),
            volumeGreater: t.Optional(t.Number({ default: undefined })),
            licensedBy: t.Optional(
              t.Array(t.String({ default: undefined }), { default: undefined })
            ),
            isLicensed: t.Optional(t.Boolean({ default: undefined })),
            excludedGenres: t.Optional(
              t.Array(t.String({ default: undefined }), { default: undefined })
            ),
            excludedTags: t.Optional(
              t.Array(t.String({ default: undefined }), { default: undefined })
            ),
            minimumTagRank: t.Optional(t.Number({ default: undefined })),
          }),
          tags: ["v2"],
        }
      )
  );

app.listen(5000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
