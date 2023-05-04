export const swaggerData = {
  openapi: "3.0.0",
  info: {
    title: "amvstrm",
    version: "2.0 Beta",
    description:
      "(THIS DOCS IS NOT FINISHED BECAUSE THE API STILL IN BETA) amvstrm API is an open source API build with express + official Anilist and Consumet extension that run amvstrm website. \n\n(Warning) Every API route and json data will changed during the beta, please do not use it for production.",
    license: {
      name: "GPT-3.0",
      url: "https://spdx.org/licenses/GPL-3.0-or-later.html",
    },
    contact: {
      name: "amvstrm",
      url: "amvstr.ml",
      email: "admin@amvstr.ml",
    },
    termsOfService: "https://docs.amvstr.ml/license#api",
  },
  servers: [
    {
      url: "https://api.amvstr.ml/api/v2",
      description: "V2",
    },
    {
      url: "http://localhost:5000/api/v2",
      description: "LOCALHOST ONLY (V2)"
    }
  ],
  paths: {
    "/info/{id}": {
      parameters: [
        {
          schema: {
            type: "string",
          },
          name: "id",
          in: "path",
          required: true,
        },
      ],
      get: {
        summary: "/info",
        responses: {
          200: {
            description: "Retrieve anime information.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Anime_Info",
                },
                examples: {
                  "Get Anime ID 120377": {
                    value: {
                      status: 200,
                      data: {
                        id: 120377,
                        idMal: 42310,
                        title: {
                          romaji: "Cyberpunk: Edgerunners",
                          english: "CYBERPUNK: EDGERUNNERS",
                          native: "サイバーパンク エッジランナーズ",
                          userPreferred: "Cyberpunk: Edgerunners",
                        },
                        description:
                          "An original anime series set in in the universe of <i>Cyberpunk 2077</i>.<br>\n<br>\n<i>CYBERPUNK: EDGERUNNERS</i> tells a standalone, 10-episode story about a street kid trying to survive in a technology and body modification-obsessed city of the future. Having everything to lose, he chooses to stay alive by becoming an edgerunner—a mercenary outlaw also known as a cyberpunk.<br>\n<br>\n(Source: CD PROJEKT RED)<br>\n<br>\n<i>Note: The first episode received a pre-screening at Anime Expo on July 2, 2022. The first 3 dubbed episodes were streamed on Twitch as part of a co-stream promotion on September 12, a day before the show’s premiere.</i>",
                        coverImage: {
                          large:
                            "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx120377-p2PmPHb6Zwk0.jpg",
                          medium:
                            "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx120377-p2PmPHb6Zwk0.jpg",
                          color: "#86f150",
                        },
                        bannerImage:
                          "https://s4.anilist.co/file/anilistcdn/media/anime/banner/120377-c15oLS8CA31s.jpg",
                        genres: ["Action", "Drama", "Psychological", "Sci-Fi"],
                        status: "FINISHED",
                        format: "ONA",
                        episodes: 10,
                        year: 2022,
                        season: "SUMMER",
                        duration: 24,
                        startIn: {
                          year: 2022,
                          month: 9,
                          day: 13,
                        },
                        endIn: {
                          year: 2022,
                          month: 9,
                          day: 13,
                        },
                        nextair: {
                          airingAt: 1111111,
                          timeUntilAiring: 11111,
                          episode: 1,
                        },
                        score: {
                          averageScore: 86,
                          decimalScore: 8.6,
                        },
                        popularity: 92599,
                        siteUrl: "https://anilist.co/anime/120377",
                        trailer: {
                          id: "ax5YUmkWf_Y",
                          site: "youtube",
                          thumbnail:
                            "https://i.ytimg.com/vi/ax5YUmkWf_Y/hqdefault.jpg",
                        },
                        studios: [
                          {
                            name: "Trigger",
                          },
                        ],
                      },
                      otherSite: {
                        "9anime": {
                          lw0z: {
                            identifier: "lw0z",
                            image:
                              "https://static.bunnycdn.ru/i/cache/images/0/0e/0ef7533e098460c97d9afc29388e2801.jpg",
                            malId: 42310,
                            aniId: 120377,
                            page: "9anime",
                            title: "Cyberpunk: Edgerunners",
                            type: "anime",
                            url: "https://9anime.pl/watch/cyberpunk-edgerunners.lw0z",
                          },
                        },
                        Gogoanime: {
                          "cyberpunk-edgerunners": {
                            identifier: "cyberpunk-edgerunners",
                            image:
                              "https://gogocdn.net/cover/cyberpunk-edgerunners.png",
                            malId: 42310,
                            aniId: 120377,
                            page: "Gogoanime",
                            title: "Cyberpunk: Edgerunners",
                            type: "anime",
                            url: "https://gogoanime.tel/category/cyberpunk-edgerunners",
                          },
                          "cyberpunk-edgerunners-dub": {
                            identifier: "cyberpunk-edgerunners-dub",
                            image:
                              "https://gogocdn.net/cover/cyberpunk-edgerunners.png",
                            malId: 42310,
                            aniId: 120377,
                            page: "Gogoanime",
                            title: "Cyberpunk: Edgerunners (Dub)",
                            type: "anime",
                            url: "https://gogoanime.tel/category/cyberpunk-edgerunners-dub",
                          },
                        },
                        Tenshi: {
                          ck2nqzgj: {
                            identifier: "ck2nqzgj",
                            image:
                              "https://tenshi.moe/images/anime/qyuj8psv5-63258a8d08633844951391.jpg",
                            malId: 42310,
                            aniId: 120377,
                            page: "Tenshi",
                            title: "Cyberpunk: Edgerunners",
                            type: "anime",
                            url: "https://tenshi.moe/anime/ck2nqzgj",
                          },
                        },
                        animepahe: {
                          4913: {
                            identifier: "4913",
                            malId: 42310,
                            type: "anime",
                            page: "animepahe",
                            title: "Cyberpunk: Edgerunners",
                            url: "https://animepahe.com/a/4913",
                          },
                        },
                        AniMixPlay: {
                          42310: {
                            identifier: "42310",
                            malId: 42310,
                            type: "anime",
                            page: "AniMixPlay",
                            title: "Cyberpunk: Edgerunners",
                            url: "https://animixplay.to/anime/42310",
                          },
                        },
                        YugenAnime: {
                          15876: {
                            identifier: "15876",
                            malId: 42310,
                            type: "anime",
                            page: "YugenAnime",
                            title: "Cyberpunk: Edgerunners",
                            url: "https://yugen.to/anime/15876/cyberpunk-edgerunners/",
                          },
                        },
                        Zoro: {
                          15680: {
                            identifier: "15680",
                            malId: 42310,
                            type: "anime",
                            page: "Zoro",
                            title: "Cyberpunk: Edgerunners",
                            url: "https://zoro.to/cyberpunk-edgerunners-15680",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/400",
          },
          404: {
            $ref: "#/components/responses/404",
          },
          429: {
            $ref: "#/components/responses/429",
          },
          500: {
            $ref: "#/components/responses/500",
          },
        },
        operationId: "get_anime_info",
        description: "Retrieve the information of anime from anilist.",
        parameters: [],
        tags: ["anime data"],
      },
    },
    "/trending": {
      get: {
        summary: "/trending",
        tags: ["anime data"],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Anime_Default_Data",
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/400",
          },
          404: {
            $ref: "#/components/responses/404",
          },
          429: {
            $ref: "#/components/responses/429",
          },
          500: {
            $ref: "#/components/responses/500",
          },
        },
        operationId: "get-trending",
        description: "Get trending data from anilist.",
        parameters: [
          {
            schema: {
              type: "number",
            },
            in: "query",
            name: "limit",
          },
          {
            schema: {
              type: "number",
            },
            in: "query",
            name: "page",
          },
        ],
      },
    },
    "/popular": {
      get: {
        summary: "/popular",
        tags: ["anime data"],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Anime_Default_Data",
                  "x-examples": {
                    "Example 1": {
                      status: 200,
                      page: {
                        currentPage: 1,
                        hasNextPage: true,
                      },
                      results: [
                        {
                          id: "127230",
                          malId: 44511,
                          title: {
                            romaji: "Chainsaw Man",
                            english: "Chainsaw Man",
                            native: "チェンソーマン",
                            userPreferred: "Chainsaw Man",
                          },
                          image:
                            "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx127230-FlochcFsyoF4.png",
                          trailer: {
                            id: "v4yLeNt-kCU",
                            site: "youtube",
                            thumbnail:
                              "https://i.ytimg.com/vi/v4yLeNt-kCU/hqdefault.jpg",
                          },
                          description:
                            'Denji is a teenage boy living with a Chainsaw Devil named Pochita. Due to the debt his father left behind, he has been living a rock-bottom life while repaying his debt by harvesting devil corpses with Pochita.<br><br>\nOne day, Denji is betrayed and killed. As his consciousness fades, he makes a contract with Pochita and gets revived as "Chainsaw Man" — a man with a devil\'s heart.<br>\n<br>\n(Source: Crunchyroll)',
                          status: "Ongoing",
                          cover:
                            "https://s4.anilist.co/file/anilistcdn/media/anime/banner/127230-lf01ya5ny8aH.jpg",
                          rating: 87,
                          releaseDate: 2022,
                          genres: [
                            "Action",
                            "Comedy",
                            "Drama",
                            "Horror",
                            "Supernatural",
                          ],
                          totalEpisodes: 12,
                          duration: 25,
                          type: "TV",
                        },
                      ],
                    },
                  },
                },
                examples: {
                  "Get Trending": {
                    value: {
                      status: 200,
                      page: {
                        currentPage: 1,
                        hasNextPage: true,
                      },
                      results: [
                        {
                          id: "127230",
                          malId: 44511,
                          title: {
                            romaji: "Chainsaw Man",
                            english: "Chainsaw Man",
                            native: "チェンソーマン",
                            userPreferred: "Chainsaw Man",
                          },
                          image:
                            "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx127230-FlochcFsyoF4.png",
                          trailer: {
                            id: "v4yLeNt-kCU",
                            site: "youtube",
                            thumbnail:
                              "https://i.ytimg.com/vi/v4yLeNt-kCU/hqdefault.jpg",
                          },
                          description:
                            'Denji is a teenage boy living with a Chainsaw Devil named Pochita. Due to the debt his father left behind, he has been living a rock-bottom life while repaying his debt by harvesting devil corpses with Pochita.<br><br>\nOne day, Denji is betrayed and killed. As his consciousness fades, he makes a contract with Pochita and gets revived as "Chainsaw Man" — a man with a devil\'s heart.<br>\n<br>\n(Source: Crunchyroll)',
                          status: "Ongoing",
                          cover:
                            "https://s4.anilist.co/file/anilistcdn/media/anime/banner/127230-lf01ya5ny8aH.jpg",
                          rating: 87,
                          releaseDate: 2022,
                          genres: [
                            "Action",
                            "Comedy",
                            "Drama",
                            "Horror",
                            "Supernatural",
                          ],
                          totalEpisodes: 12,
                          duration: 25,
                          type: "TV",
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/400",
          },
          404: {
            $ref: "#/components/responses/404",
          },
          429: {
            $ref: "#/components/responses/429",
          },
          500: {
            $ref: "#/components/responses/500",
          },
        },
        operationId: "get-popular",
        description: "Get popular data from anilist.",
        parameters: [
          {
            schema: {
              type: "number",
            },
            in: "query",
            name: "limit",
          },
          {
            schema: {
              type: "number",
            },
            in: "query",
            name: "page",
          },
        ],
      },
      parameters: [],
    },
    "/schedule": {
      get: {
        summary: "/schedule",
        tags: ["anime data"],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  "x-examples": {
                    "Example 1": {
                      status: 200,
                      page: {
                        currentPage: 1,
                        hasNextPage: true,
                      },
                      results: [
                        {
                          id: "142730",
                          malId: 0,
                          episode: 136,
                          airingAt: 1666918800,
                          title: {
                            romaji: "Shen Wu Tianzun 2",
                            english: "The Legend of Sky Lord 2",
                            native: "神武天尊 第二季",
                            userPreferred: "Shen Wu Tianzun 2",
                          },
                          country: "CN",
                          image:
                            "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx142730-X3iXoiM0wE0c.png",
                          description:
                            "The second season of <i>Shen Wu Tianzun</i>.",
                          cover:
                            "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx142730-X3iXoiM0wE0c.png",
                          genres: ["Action", "Adventure", "Fantasy"],
                          color: "#28a1e4",
                          rating: 0,
                          releaseDate: 0,
                          type: "ONA",
                        },
                      ],
                    },
                  },
                  properties: {
                    status: {
                      type: "integer",
                    },
                    page: {
                      type: "object",
                      properties: {
                        currentPage: {
                          type: "integer",
                        },
                        hasNextPage: {
                          type: "boolean",
                        },
                      },
                    },
                    results: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                          },
                          malId: {
                            type: "integer",
                          },
                          episode: {
                            type: "integer",
                          },
                          airingAt: {
                            type: "integer",
                          },
                          title: {
                            type: "object",
                            properties: {
                              romaji: {
                                type: "string",
                              },
                              english: {
                                type: "string",
                              },
                              native: {
                                type: "string",
                              },
                              userPreferred: {
                                type: "string",
                              },
                            },
                          },
                          country: {
                            type: "string",
                          },
                          image: {
                            type: "string",
                          },
                          description: {
                            type: "string",
                          },
                          cover: {
                            type: "string",
                          },
                          genres: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                          },
                          color: {
                            type: "string",
                          },
                          rating: {
                            type: "integer",
                          },
                          releaseDate: {
                            type: "integer",
                          },
                          type: {
                            type: "string",
                          },
                          "": {
                            type: "string",
                          },
                        },
                      },
                    },
                  },
                },
                examples: {
                  "Get Schedule ": {
                    value: {
                      status: 200,
                      page: {
                        currentPage: 1,
                        hasNextPage: true,
                      },
                      results: [
                        {
                          id: "127230",
                          malId: 44511,
                          title: {
                            romaji: "Chainsaw Man",
                            english: "Chainsaw Man",
                            native: "チェンソーマン",
                            userPreferred: "Chainsaw Man",
                          },
                          image:
                            "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx127230-FlochcFsyoF4.png",
                          trailer: {
                            id: "v4yLeNt-kCU",
                            site: "youtube",
                            thumbnail:
                              "https://i.ytimg.com/vi/v4yLeNt-kCU/hqdefault.jpg",
                          },
                          description:
                            'Denji is a teenage boy living with a Chainsaw Devil named Pochita. Due to the debt his father left behind, he has been living a rock-bottom life while repaying his debt by harvesting devil corpses with Pochita.<br><br>\nOne day, Denji is betrayed and killed. As his consciousness fades, he makes a contract with Pochita and gets revived as "Chainsaw Man" — a man with a devil\'s heart.<br>\n<br>\n(Source: Crunchyroll)',
                          status: "Ongoing",
                          cover:
                            "https://s4.anilist.co/file/anilistcdn/media/anime/banner/127230-lf01ya5ny8aH.jpg",
                          rating: 87,
                          releaseDate: 2022,
                          genres: [
                            "Action",
                            "Comedy",
                            "Drama",
                            "Horror",
                            "Supernatural",
                          ],
                          totalEpisodes: 12,
                          duration: 25,
                          type: "TV",
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/400",
          },
          404: {
            $ref: "#/components/responses/404",
          },
          429: {
            $ref: "#/components/responses/429",
          },
          500: {
            $ref: "#/components/responses/500",
          },
        },
        operationId: "get-schedule",
        description: "Get schedule data from anilist.",
        parameters: [
          {
            schema: {
              type: "number",
            },
            in: "query",
            name: "limit",
          },
          {
            schema: {
              type: "number",
            },
            in: "query",
            name: "page",
          },
          {
            schema: {
              type: "number",
            },
            in: "query",
            name: "w_start",
            description: "Week start",
          },
          {
            schema: {
              type: "number",
            },
            in: "query",
            name: "w_end",
            description: "Week end",
          },
          {
            schema: {
              type: "boolean",
            },
            in: "query",
            name: "shownotair",
            description: "Show not airing in the list",
          },
        ],
      },
      parameters: [],
    },
    "/search": {
      get: {
        summary: "/search",
        tags: ["anime data"],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Anime_Search",
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/400",
          },
          404: {
            $ref: "#/components/responses/404",
          },
          429: {
            $ref: "#/components/responses/429",
          },
          500: {
            $ref: "#/components/responses/500",
          },
        },
        operationId: "get-search",
        description: "Get search data from anilist.",
        parameters: [
          {
            schema: {
              type: "string",
            },
            in: "query",
            name: "q",
            description: "query",
          },
          {
            schema: {
              type: "number",
            },
            in: "query",
            name: "page",
          },
          {
            schema: {
              type: "number",
            },
            in: "query",
            name: "limit",
          },
        ],
      },
      parameters: [],
      post: {
        summary: "",
        tags: ["anime data"],
        operationId: "post-search",
        responses: {
          200: {
            description: "OK",
          },
        },
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                  },
                  page: {
                    type: "integer",
                  },
                  size: {
                    type: "integer",
                  },
                  perPage: {
                    type: "integer",
                  },
                  isAdult: {
                    type: "boolean",
                  },
                  format: {
                    type: "string",
                  },
                  season: {
                    type: "string",
                  },
                  year: {
                    type: "string",
                  },
                  genres: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {},
                    },
                  },
                  tags: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {},
                    },
                  },
                  sort: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {},
                    },
                  },
                },
                "x-examples": {
                  "Example 1": {
                    query: "",
                    page: 1,
                    size: 1,
                    perPage: 1,
                    isAdult: false,
                    format: "",
                    season: "",
                    year: "",
                    genres: [],
                    tags: [],
                    sort: [],
                  },
                },
              },
              examples: {
                "Search Attack on titan on POST": {
                  value: {
                    search: "attack on titan",
                  },
                },
              },
            },
          },
          description: "",
        },
        description:
          "INFO : THE POST REQUEST IS NOT WORKING AT THE MOMENT, PLEASE USE NORMAL QUERY GET API ONE.",
      },
    },
    "/recommendations/{id}": {
      get: {
        summary: "/recommendations",
        tags: ["anime data"],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Anime_Recom",
                  "x-examples": {
                    "Example 1": {
                      status: 200,
                      page: {
                        currentPage: 1,
                        hasNextPage: true,
                      },
                      results: [
                        {
                          id: "127230",
                          malId: 44511,
                          title: {
                            romaji: "Chainsaw Man",
                            english: "Chainsaw Man",
                            native: "チェンソーマン",
                            userPreferred: "Chainsaw Man",
                          },
                          image:
                            "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx127230-FlochcFsyoF4.png",
                          trailer: {
                            id: "v4yLeNt-kCU",
                            site: "youtube",
                            thumbnail:
                              "https://i.ytimg.com/vi/v4yLeNt-kCU/hqdefault.jpg",
                          },
                          description:
                            'Denji is a teenage boy living with a Chainsaw Devil named Pochita. Due to the debt his father left behind, he has been living a rock-bottom life while repaying his debt by harvesting devil corpses with Pochita.<br><br>\nOne day, Denji is betrayed and killed. As his consciousness fades, he makes a contract with Pochita and gets revived as "Chainsaw Man" — a man with a devil\'s heart.<br>\n<br>\n(Source: Crunchyroll)',
                          status: "Ongoing",
                          cover:
                            "https://s4.anilist.co/file/anilistcdn/media/anime/banner/127230-lf01ya5ny8aH.jpg",
                          rating: 87,
                          releaseDate: 2022,
                          genres: [
                            "Action",
                            "Comedy",
                            "Drama",
                            "Horror",
                            "Supernatural",
                          ],
                          totalEpisodes: 12,
                          duration: 25,
                          type: "TV",
                        },
                      ],
                    },
                  },
                },
                examples: {
                  "Get Recommendations From ID 1": {
                    value: {
                      status: 200,
                      data: [
                        {
                          id: 6,
                          idMal: 6,
                          title: {
                            romaji: "TRIGUN",
                            english: "Trigun",
                            native: "TRIGUN",
                            userPreferred: "TRIGUN",
                          },
                          type: "ANIME",
                          format: "TV",
                          status: "FINISHED",
                          episodes: 26,
                          duration: 24,
                          averageScore: 79,
                        },
                        {
                          id: 329,
                          idMal: 329,
                          title: {
                            romaji: "Planetes",
                            english: "Planetes",
                            native: "プラネテス",
                            userPreferred: "Planetes",
                          },
                          type: "ANIME",
                          format: "TV",
                          status: "FINISHED",
                          episodes: 26,
                          duration: 25,
                          averageScore: 80,
                        },
                        {
                          id: 205,
                          idMal: 205,
                          title: {
                            romaji: "Samurai Champloo",
                            english: "Samurai Champloo",
                            native: "サムライチャンプルー",
                            userPreferred: "Samurai Champloo",
                          },
                          type: "ANIME",
                          format: "TV",
                          status: "FINISHED",
                          episodes: 26,
                          duration: 24,
                          averageScore: 84,
                        },
                        {
                          id: 400,
                          idMal: 400,
                          title: {
                            romaji: "Seihou Bukyou Outlaw Star",
                            english: "Outlaw Star",
                            native: "星方武侠アウトロースター",
                            userPreferred: "Seihou Bukyou Outlaw Star",
                          },
                          type: "ANIME",
                          format: "TV",
                          status: "FINISHED",
                          episodes: 24,
                          duration: 25,
                          averageScore: 74,
                        },
                        {
                          id: 2451,
                          idMal: 2451,
                          title: {
                            romaji: "Space Cobra",
                            english: "Space Adventure Cobra",
                            native: "スペースコブラ",
                            userPreferred: "Space Cobra",
                          },
                          type: "ANIME",
                          format: "TV",
                          status: "FINISHED",
                          episodes: 31,
                          duration: 24,
                          averageScore: 72,
                        },
                        {
                          id: 20057,
                          idMal: 20057,
                          title: {
                            romaji: "Space☆Dandy",
                            english: "Space Dandy",
                            native: "スペース☆ダンディ",
                            userPreferred: "Space☆Dandy",
                          },
                          type: "ANIME",
                          format: "TV",
                          status: "FINISHED",
                          episodes: 13,
                          duration: 24,
                          averageScore: 76,
                        },
                        {
                          id: 2025,
                          idMal: 2025,
                          title: {
                            romaji: "DARKER THAN BLACK: Kuro no Keiyakusha",
                            english: "Darker than Black",
                            native: "DARKER THAN BLACK -黒の契約者-",
                            userPreferred:
                              "DARKER THAN BLACK: Kuro no Keiyakusha",
                          },
                          type: "ANIME",
                          format: "TV",
                          status: "FINISHED",
                          episodes: 25,
                          duration: 24,
                          averageScore: 77,
                        },
                        {
                          id: 2251,
                          idMal: 2251,
                          title: {
                            romaji: "Baccano!",
                            english: "Baccano!",
                            native: "バッカーノ！",
                            userPreferred: "Baccano!",
                          },
                          type: "ANIME",
                          format: "TV",
                          status: "FINISHED",
                          episodes: 13,
                          duration: 25,
                          averageScore: 82,
                        },
                        {
                          id: 4087,
                          idMal: 4087,
                          title: {
                            romaji: "Michiko to Hatchin",
                            english: "Michiko & Hatchin",
                            native: "ミチコとハッチン",
                            userPreferred: "Michiko to Hatchin",
                          },
                          type: "ANIME",
                          format: "TV",
                          status: "FINISHED",
                          episodes: 22,
                          duration: 22,
                          averageScore: 76,
                        },
                        {
                          id: 20661,
                          idMal: 23283,
                          title: {
                            romaji: "Zankyou no Terror",
                            english: "Terror in Resonance",
                            native: "残響のテロル",
                            userPreferred: "Zankyou no Terror",
                          },
                          type: "ANIME",
                          format: "TV",
                          status: "FINISHED",
                          episodes: 11,
                          duration: 23,
                          averageScore: 78,
                        },
                        {
                          id: 522,
                          idMal: 522,
                          title: {
                            romaji: "Metropolis",
                            english: "",
                            native: "メトロポリス",
                            userPreferred: "Metropolis",
                          },
                          type: "ANIME",
                          format: "MOVIE",
                          status: "FINISHED",
                          episodes: 1,
                          duration: 109,
                          averageScore: 73,
                        },
                        {
                          id: 958,
                          idMal: 958,
                          title: {
                            romaji: "HeatGuy J",
                            english: "Heat Guy J",
                            native: "ヒートガイジェイ",
                            userPreferred: "HeatGuy J",
                          },
                          type: "ANIME",
                          format: "TV",
                          status: "FINISHED",
                          episodes: 25,
                          duration: 24,
                          averageScore: 63,
                        },
                        {
                          id: 474,
                          idMal: 474,
                          title: {
                            romaji: "Macross Plus",
                            english: "",
                            native: "マクロスプラス",
                            userPreferred: "Macross Plus",
                          },
                          type: "ANIME",
                          format: "OVA",
                          status: "FINISHED",
                          episodes: 4,
                          duration: 39,
                          averageScore: 74,
                        },
                        {
                          id: 1980,
                          idMal: 1980,
                          title: {
                            romaji: "TRAVA: FIST PLANET",
                            english: "",
                            native: "TRAVA FIST PLANET",
                            userPreferred: "TRAVA: FIST PLANET",
                          },
                          type: "ANIME",
                          format: "OVA",
                          status: "FINISHED",
                          episodes: 4,
                          duration: 13,
                          averageScore: 60,
                        },
                        {
                          id: 20727,
                          idMal: 24439,
                          title: {
                            romaji: "Kekkai Sensen",
                            english: "Blood Blockade Battlefront",
                            native: "血界戦線",
                            userPreferred: "Kekkai Sensen",
                          },
                          type: "ANIME",
                          format: "TV",
                          status: "FINISHED",
                          episodes: 12,
                          duration: 25,
                          averageScore: 74,
                        },
                        {
                          id: 1194,
                          idMal: 1194,
                          title: {
                            romaji: "Coyote Ragtime Show",
                            english: "Coyote Ragtime Show",
                            native: "コヨーテ ラグタイムショー",
                            userPreferred: "Coyote Ragtime Show",
                          },
                          type: "ANIME",
                          format: "TV",
                          status: "FINISHED",
                          episodes: 12,
                          duration: 24,
                          averageScore: 61,
                        },
                        {
                          id: 889,
                          idMal: 889,
                          title: {
                            romaji: "BLACK LAGOON",
                            english: "Black Lagoon",
                            native: "BLACK LAGOON",
                            userPreferred: "BLACK LAGOON",
                          },
                          type: "ANIME",
                          format: "TV",
                          status: "FINISHED",
                          episodes: 12,
                          duration: 24,
                          averageScore: 78,
                        },
                        {
                          id: 467,
                          idMal: 467,
                          title: {
                            romaji: "Koukaku Kidoutai: STAND ALONE COMPLEX",
                            english: "Ghost in the Shell: Stand Alone Complex",
                            native: "攻殻機動隊 STAND ALONE COMPLEX",
                            userPreferred:
                              "Koukaku Kidoutai: STAND ALONE COMPLEX",
                          },
                          type: "ANIME",
                          format: "TV",
                          status: "FINISHED",
                          episodes: 26,
                          duration: 25,
                          averageScore: 82,
                        },
                        {
                          id: 1412,
                          idMal: 1412,
                          title: {
                            romaji: "Lupin III",
                            english: "Lupin the 3rd",
                            native: "ルパン三世",
                            userPreferred: "Lupin III",
                          },
                          type: "ANIME",
                          format: "TV",
                          status: "FINISHED",
                          episodes: 23,
                          duration: 25,
                          averageScore: 73,
                        },
                        {
                          id: 650,
                          idMal: 650,
                          title: {
                            romaji: "Gunsmith Cats",
                            english: "Gunsmith Cats",
                            native: "ガンスミスキャッツ",
                            userPreferred: "Gunsmith Cats",
                          },
                          type: "ANIME",
                          format: "OVA",
                          status: "FINISHED",
                          episodes: 3,
                          duration: 29,
                          averageScore: 72,
                        },
                        {
                          id: 567,
                          idMal: 567,
                          title: {
                            romaji: "THE Big O",
                            english: "The Big O",
                            native: "THEビッグオー",
                            userPreferred: "THE Big O",
                          },
                          type: "ANIME",
                          format: "TV",
                          status: "FINISHED",
                          episodes: 13,
                          duration: 24,
                          averageScore: 73,
                        },
                        {
                          id: 411,
                          idMal: 411,
                          title: {
                            romaji: "Gun x Sword",
                            english: "Gun x Sword",
                            native: "ガン×ソード",
                            userPreferred: "Gun x Sword",
                          },
                          type: "ANIME",
                          format: "TV",
                          status: "FINISHED",
                          episodes: 26,
                          duration: 24,
                          averageScore: 69,
                        },
                        {
                          id: 25,
                          idMal: 25,
                          title: {
                            romaji: "Sunabouzu",
                            english: "Desert Punk",
                            native: "砂ぼうず",
                            userPreferred: "Sunabouzu",
                          },
                          type: "ANIME",
                          format: "TV",
                          status: "FINISHED",
                          episodes: 24,
                          duration: 24,
                          averageScore: 68,
                        },
                        {
                          id: 202,
                          idMal: 202,
                          title: {
                            romaji: "Wolf's Rain",
                            english: "Wolf's Rain",
                            native: "ウルフズレイン",
                            userPreferred: "Wolf's Rain",
                          },
                          type: "ANIME",
                          format: "TV",
                          status: "FINISHED",
                          episodes: 26,
                          duration: 23,
                          averageScore: 74,
                        },
                        {
                          id: 1462,
                          idMal: 1462,
                          title: {
                            romaji: "MEMORIES",
                            english: "Memories",
                            native: "MEMORIES",
                            userPreferred: "MEMORIES",
                          },
                          type: "ANIME",
                          format: "MOVIE",
                          status: "FINISHED",
                          episodes: 3,
                          duration: 37,
                          averageScore: 75,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/400",
          },
          404: {
            $ref: "#/components/responses/404",
          },
          429: {
            $ref: "#/components/responses/429",
          },
          500: {
            $ref: "#/components/responses/500",
          },
        },
        operationId: "get-recommendations",
        description: "Get recommendations data from anilist.",
        parameters: [],
        "x-internal": false,
      },
      parameters: [
        {
          schema: {
            type: "string",
          },
          name: "id",
          in: "path",
          required: true,
        },
      ],
    },
    "/episode/{id}": {
      get: {
        summary: "/episode",
        tags: ["anime data"],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Anime_Episode",
                },
                examples: {
                  "Get Episode from ID 1": {
                    value: [
                      {
                        id: "cowboy-bebop-episode-1",
                        title: "Asteroid Blues",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/229115/original.jpeg",
                        number: 1,
                        description:
                          "Spike and Jet head to Tijuana to track down an outlaw smuggling a dangerous drug known as blood-eye.  Jet wants the bounty, but Spike has eyes for a far prettier prize.",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-1",
                      },
                      {
                        id: "cowboy-bebop-episode-2",
                        title: "Stray Dog Strut",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/229114/original.jpeg",
                        number: 2,
                        description:
                          "Spike and Jet's next case takes them to Mars, where they'll to try apprehend a professional pet thief and a priceless data dog.",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-2",
                      },
                      {
                        id: "cowboy-bebop-episode-3",
                        title: "Honky Tonk Women",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/229113/original.jpeg",
                        number: 3,
                        description:
                          "A night at the casino lands Spike and Jet in hot water when they cross paths with Faye Valentine, a stunning con artist wanted by the law - and the bad guys.",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-3",
                      },
                      {
                        id: "cowboy-bebop-episode-4",
                        title: "Gateway Shuffle",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/229112/original.jpeg",
                        number: 4,
                        description:
                          "Faye teams up with Spike and Jet to track down a gang of space activists that plans on turning the human population into monkeys!",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-4",
                      },
                      {
                        id: "cowboy-bebop-episode-5",
                        title: "Ballad of Fallen Angels",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/228991/original.jpeg",
                        number: 5,
                        description:
                          "Spike aims to collect the bounty on a member of the Red Dragon Syndicate, but his mission leads him into a deadly showdown with a face from his past!",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-5",
                      },
                      {
                        id: "cowboy-bebop-episode-6",
                        title: "Sympathy for the Devil",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/228979/original.jpeg",
                        number: 6,
                        description:
                          "The latest case for the crew of the Bebop finds Spike pitted against a young boy with a talent for the harmonica - and murder.",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-6",
                      },
                      {
                        id: "cowboy-bebop-episode-7",
                        title: "Heavy Metal Queen",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/228994/original.jpeg",
                        number: 7,
                        description:
                          "The Bebop crew pursues a renegade explosives expert, and Spike crosses paths with a nameless space trucker that hates bounty hunters.",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-7",
                      },
                      {
                        id: "cowboy-bebop-episode-8",
                        title: "Waltz for Venus",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/228996/original.jpeg",
                        number: 8,
                        description:
                          "Spike gets involved with a fugitive who is willing to risk his own life to restore his sister's sight. Can the Bebop crew save the day before tragedy strikes?",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-8",
                      },
                      {
                        id: "cowboy-bebop-episode-9",
                        title: "Jamming with Edward",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/228989/original.jpeg",
                        number: 9,
                        description:
                          "The Bebop crew tries to crack the case of mysterious satellite drawings appearing on the Earth's surface, but they'll need help from a hacker know as Radical Edward to earn their bounty!",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-9",
                      },
                      {
                        id: "cowboy-bebop-episode-10",
                        title: "Ganymede Elegy",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/228981/original.jpeg",
                        number: 10,
                        description:
                          "When a case takes the Bebop crew to Jet's old stomping ground, the big man crosses paths with an old lover - and her wanted boyfriend.",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-10",
                      },
                      {
                        id: "cowboy-bebop-episode-11",
                        title: "Toys in the Attic",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/229000/original.jpeg",
                        number: 11,
                        description:
                          "When an unusual, blob-like space creature infects Ein, Faye, and Jet, Spike and Radical Edward must figure out a way to save their friends.",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-11",
                      },
                      {
                        id: "cowboy-bebop-episode-12",
                        title: "Jupiter Jazz (Part 1)",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/228983/original.jpeg",
                        number: 12,
                        description:
                          "Faye robs and abandons the Bebop crew, Spike goes in search of a woman he once knew, and Vicious makes another deadly appearance.",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-12",
                      },
                      {
                        id: "cowboy-bebop-episode-13",
                        title: "Jupiter Jazz (Part 2)",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/228995/original.jpeg",
                        number: 13,
                        description:
                          "Jet continues his mission to reunite his Bebop comrades, and Spike finds himself locked in a brutal dogfight with his old nemesis Vicious.",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-13",
                      },
                      {
                        id: "cowboy-bebop-episode-14",
                        title: "Bohemian Rhapsody",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/228990/original.jpeg",
                        number: 14,
                        description:
                          "The Bebop Crew embarks on a wild goose chase of a bounty hunt that leads them deep into space in search of an ancient chess master.",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-14",
                      },
                      {
                        id: "cowboy-bebop-episode-15",
                        title: "My Funny Valentine",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/228993/original.jpeg",
                        number: 15,
                        description:
                          "When Jet brings in a fugitive from Faye's past, the rebellious beauty must decide whether to turn him in – or give an old flame one last chance.",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-15",
                      },
                      {
                        id: "cowboy-bebop-episode-16",
                        title: "Black Dog Serenade",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/228984/original.jpeg",
                        number: 16,
                        description:
                          "Jet teams up with a former partner to settle the score with the man who took his arm, but he soon discovers that memories can be deceiving.",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-16",
                      },
                      {
                        id: "cowboy-bebop-episode-17",
                        title: "Mushroom Samba",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/228980/original.jpeg",
                        number: 17,
                        description:
                          "After the Bebop crash lands, Ed and Ein's search for food turns up some very expensive mushrooms with psychedelic side effects!",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-17",
                      },
                      {
                        id: "cowboy-bebop-episode-18",
                        title: "Speak Like a Child",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/228998/original.jpeg",
                        number: 18,
                        description:
                          "When a mysterious package arrives, Faye disappears on a gambling binge, and Spike and Jet embark on a frustrating search for ancient technology!",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-18",
                      },
                      {
                        id: "cowboy-bebop-episode-19",
                        title: "Wild Horses",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/228987/original.jpeg",
                        number: 19,
                        description:
                          "While Spike pays a visit to the man who built his ship, Faye and Jet go fishing for space pirates.",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-19",
                      },
                      {
                        id: "cowboy-bebop-episode-20",
                        title: "Pierrot le Fou",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/228986/original.jpeg",
                        number: 20,
                        description:
                          "Spike takes a beating during a chance encounter with an indestructible assassin. While Jet searches for the secret to the madman's power, Spike goes looking for payback!",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-20",
                      },
                      {
                        id: "cowboy-bebop-episode-21",
                        title: "Boogie Woogie Feng Shui",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/228985/original.jpeg",
                        number: 21,
                        description:
                          "Spurred by a cryptic email, Jet goes looking for an old friend, but finds his daughter – and a mysterious sun stone – instead.",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-21",
                      },
                      {
                        id: "cowboy-bebop-episode-22",
                        title: "Cowboy Funk",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/228997/original.jpeg",
                        number: 22,
                        description:
                          "Spike's attempts to apprehend the infamous Teddy Bear Bomber are maddeningly derailed by a mysterious – and clueless – cowboy!",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-22",
                      },
                      {
                        id: "cowboy-bebop-episode-23",
                        title: "Brain Scratch",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/228999/original.jpeg",
                        number: 23,
                        description:
                          "Faye goes undercover to collect the bounty on a deranged cult leader, but when the mysterious organization brainwashes her into a very deep sleep – she'll need a little help from her friends.",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-23",
                      },
                      {
                        id: "cowboy-bebop-episode-24",
                        title: "Hard Luck Woman",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/228988/original.jpeg",
                        number: 24,
                        description:
                          "Faye and Ed discover clues to their respective pasts that could send the crew of the Bebop heading in very different directions.",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-24",
                      },
                      {
                        id: "cowboy-bebop-episode-25",
                        title: "The Real Folk Blues (Part 1)",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/228982/original.jpeg",
                        number: 25,
                        description:
                          "Spike and Jet are ambushed by members of the syndicate, and Faye has an unexpected encounter with a woman from Spike's past.",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-25",
                      },
                      {
                        id: "cowboy-bebop-episode-26",
                        title: "The Real Folk Blues (Part 2)",
                        image:
                          "https://media.kitsu.io/episodes/thumbnails/229001/original.jpeg",
                        number: 26,
                        description:
                          "Spike finally finds the woman he's been searching for, and Faye makes a surprising return to the Bebop. With the syndicate in hot pursuit, Spike seeks to end the reign of Vicious.",
                        url: "https://www1.gogoanime.ee//cowboy-bebop-episode-26",
                      },
                    ],
                  },
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/400",
          },
          404: {
            $ref: "#/components/responses/404",
          },
          429: {
            $ref: "#/components/responses/429",
          },
          500: {
            $ref: "#/components/responses/500",
          },
        },
        operationId: "get-episode",
        description: "Get episode data with anilist ID.",
        parameters: [],
        "x-internal": false,
      },
      parameters: [
        {
          schema: {
            type: "string",
          },
          name: "id",
          in: "path",
          required: true,
        },
      ],
    },
    "/stream": {
      get: {
        summary: "/stream",
        tags: ["anime data"],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Anime_Stream",
                  "x-examples": {
                    "Example 1": {
                      status: 200,
                      page: {
                        currentPage: 1,
                        hasNextPage: true,
                      },
                      results: [
                        {
                          id: "127230",
                          malId: 44511,
                          title: {
                            romaji: "Chainsaw Man",
                            english: "Chainsaw Man",
                            native: "チェンソーマン",
                            userPreferred: "Chainsaw Man",
                          },
                          image:
                            "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx127230-FlochcFsyoF4.png",
                          trailer: {
                            id: "v4yLeNt-kCU",
                            site: "youtube",
                            thumbnail:
                              "https://i.ytimg.com/vi/v4yLeNt-kCU/hqdefault.jpg",
                          },
                          description:
                            'Denji is a teenage boy living with a Chainsaw Devil named Pochita. Due to the debt his father left behind, he has been living a rock-bottom life while repaying his debt by harvesting devil corpses with Pochita.<br><br>\nOne day, Denji is betrayed and killed. As his consciousness fades, he makes a contract with Pochita and gets revived as "Chainsaw Man" — a man with a devil\'s heart.<br>\n<br>\n(Source: Crunchyroll)',
                          status: "Ongoing",
                          cover:
                            "https://s4.anilist.co/file/anilistcdn/media/anime/banner/127230-lf01ya5ny8aH.jpg",
                          rating: 87,
                          releaseDate: 2022,
                          genres: [
                            "Action",
                            "Comedy",
                            "Drama",
                            "Horror",
                            "Supernatural",
                          ],
                          totalEpisodes: 12,
                          duration: 25,
                          type: "TV",
                        },
                      ],
                    },
                  },
                },
                examples: {
                  "Get stream from cowboy-bebop-episode-1": {
                    value: {
                      Info: "Some anime stream from .mp4 will not be available in this api. Refer to /api/v1/stream to get it",
                      player: {
                        id: {
                          mal: null,
                          ani: null,
                          gogo_id: "cowboy-bebop-episode-1",
                        },
                        episodes: "1",
                        stream: [
                          {
                            url: "https://wwwx11.gogocdn.stream/videos/hls...",
                            isM3U8: true,
                            quality: "360p",
                          },
                          {
                            url: "https://wwwx11.gogocdn.stream/videos/hls...",
                            isM3U8: true,
                            quality: "480p",
                          },
                          {
                            url: "https://wwwx11.gogocdn.stream/videos/hls...",
                            isM3U8: true,
                            quality: "720p",
                          },
                          {
                            url: "https://wwwx11.gogocdn.stream/videos/hls...",
                            isM3U8: true,
                            quality: "1080p",
                          },
                          {
                            url: "https://wwwx11.gogocdn.stream/videos/hls...",
                            isM3U8: true,
                            quality: "default",
                          },
                          {
                            url: "https://www11x.gogocdn.stream/videos/hls...",
                            isM3U8: true,
                            quality: "backup",
                          },
                        ],
                        iframe:
                          "https://gogohd.net/streaming.php?id=MTgzNTIw&title=Cowboy-Bebop-Episode-1",
                        plyr: {
                          main: "https://plyr.link/p/player.html#aH...",
                          backup: "https://plyr.link/p/player.html#aH...",
                        },
                        nspl: {
                          main: "https://player.nscdn.ml/player.html?p=JnR...",
                          backup:
                            "https://player.nscdn.ml/player.html?p=JnR...",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/400",
          },
          404: {
            $ref: "#/components/responses/404",
          },
          429: {
            $ref: "#/components/responses/429",
          },
          500: {
            $ref: "#/components/responses/500",
          },
        },
        operationId: "get-stream",
        description: "Get stream url data using GOGOANIME ID.",
        parameters: [
          {
            schema: {
              type: "string",
            },
            in: "query",
            name: "id",
            description: "GOGOANIME ID ( get it from /episode/{id} )",
            required: true,
          },
        ],
        "x-internal": false,
      },
      parameters: [],
    },
  },
  components: {
    schemas: {
      Anime_Info: {
        type: "object",
        "x-examples": {
          "Example 1": {
            status: 200,
            data: {
              id: 120377,
              idMal: 42310,
              title: {
                romaji: "Cyberpunk: Edgerunners",
                english: "CYBERPUNK: EDGERUNNERS",
                native: "サイバーパンク エッジランナーズ",
                userPreferred: "Cyberpunk: Edgerunners",
              },
              description:
                "An original anime series set in in the universe of <i>Cyberpunk 2077</i>.<br>\n<br>\n<i>CYBERPUNK: EDGERUNNERS</i> tells a standalone, 10-episode story about a street kid trying to survive in a technology and body modification-obsessed city of the future. Having everything to lose, he chooses to stay alive by becoming an edgerunner—a mercenary outlaw also known as a cyberpunk.<br>\n<br>\n(Source: CD PROJEKT RED)<br>\n<br>\n<i>Note: The first episode received a pre-screening at Anime Expo on July 2, 2022. The first 3 dubbed episodes were streamed on Twitch as part of a co-stream promotion on September 12, a day before the show’s premiere.</i>",
              coverImage: {
                large:
                  "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx120377-p2PmPHb6Zwk0.jpg",
                medium:
                  "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx120377-p2PmPHb6Zwk0.jpg",
                color: "#86f150",
              },
              bannerImage:
                "https://s4.anilist.co/file/anilistcdn/media/anime/banner/120377-c15oLS8CA31s.jpg",
              genres: ["Action", "Drama", "Psychological", "Sci-Fi"],
              status: "FINISHED",
              format: "ONA",
              episodes: 10,
              year: 2022,
              season: "SUMMER",
              duration: 24,
              startIn: {
                year: 2022,
                month: 9,
                day: 13,
              },
              endIn: {
                year: 2022,
                month: 9,
                day: 13,
              },
              nextair: "",
              score: {
                averageScore: 86,
                decimalScore: 8.6,
              },
              popularity: 92599,
              siteUrl: "https://anilist.co/anime/120377",
              trailer: {
                id: "ax5YUmkWf_Y",
                site: "youtube",
                thumbnail: "https://i.ytimg.com/vi/ax5YUmkWf_Y/hqdefault.jpg",
              },
              studios: [
                {
                  name: "Trigger",
                },
              ],
            },
            otherSite: {
              "9anime": {
                lw0z: {
                  identifier: "lw0z",
                  image:
                    "https://static.bunnycdn.ru/i/cache/images/0/0e/0ef7533e098460c97d9afc29388e2801.jpg",
                  malId: 42310,
                  aniId: 120377,
                  page: "9anime",
                  title: "Cyberpunk: Edgerunners",
                  type: "anime",
                  url: "https://9anime.pl/watch/cyberpunk-edgerunners.lw0z",
                },
              },
              Gogoanime: {
                "cyberpunk-edgerunners": {
                  identifier: "cyberpunk-edgerunners",
                  image: "https://gogocdn.net/cover/cyberpunk-edgerunners.png",
                  malId: 42310,
                  aniId: 120377,
                  page: "Gogoanime",
                  title: "Cyberpunk: Edgerunners",
                  type: "anime",
                  url: "https://gogoanime.tel/category/cyberpunk-edgerunners",
                },
                "cyberpunk-edgerunners-dub": {
                  identifier: "cyberpunk-edgerunners-dub",
                  image: "https://gogocdn.net/cover/cyberpunk-edgerunners.png",
                  malId: 42310,
                  aniId: 120377,
                  page: "Gogoanime",
                  title: "Cyberpunk: Edgerunners (Dub)",
                  type: "anime",
                  url: "https://gogoanime.tel/category/cyberpunk-edgerunners-dub",
                },
              },
              Tenshi: {
                ck2nqzgj: {
                  identifier: "ck2nqzgj",
                  image:
                    "https://tenshi.moe/images/anime/qyuj8psv5-63258a8d08633844951391.jpg",
                  malId: 42310,
                  aniId: 120377,
                  page: "Tenshi",
                  title: "Cyberpunk: Edgerunners",
                  type: "anime",
                  url: "https://tenshi.moe/anime/ck2nqzgj",
                },
              },
              animepahe: {
                4913: {
                  identifier: "4913",
                  malId: 42310,
                  type: "anime",
                  page: "animepahe",
                  title: "Cyberpunk: Edgerunners",
                  url: "https://animepahe.com/a/4913",
                },
              },
              AniMixPlay: {
                42310: {
                  identifier: "42310",
                  malId: 42310,
                  type: "anime",
                  page: "AniMixPlay",
                  title: "Cyberpunk: Edgerunners",
                  url: "https://animixplay.to/anime/42310",
                },
              },
              YugenAnime: {
                15876: {
                  identifier: "15876",
                  malId: 42310,
                  type: "anime",
                  page: "YugenAnime",
                  title: "Cyberpunk: Edgerunners",
                  url: "https://yugen.to/anime/15876/cyberpunk-edgerunners/",
                },
              },
              Zoro: {
                15680: {
                  identifier: "15680",
                  malId: 42310,
                  type: "anime",
                  page: "Zoro",
                  title: "Cyberpunk: Edgerunners",
                  url: "https://zoro.to/cyberpunk-edgerunners-15680",
                },
              },
            },
          },
        },
        title: "ANIME_INFO",
        properties: {
          status: {
            type: "integer",
          },
          data: {
            type: "object",
            properties: {
              id: {
                type: "integer",
              },
              idMal: {
                type: "integer",
              },
              title: {
                type: "object",
                properties: {
                  romaji: {
                    type: "string",
                  },
                  english: {
                    type: "string",
                  },
                  native: {
                    type: "string",
                  },
                  userPreferred: {
                    type: "string",
                  },
                },
              },
              description: {
                type: "string",
              },
              coverImage: {
                type: "object",
                properties: {
                  large: {
                    type: "string",
                  },
                  medium: {
                    type: "string",
                  },
                  color: {
                    type: "string",
                  },
                },
              },
              bannerImage: {
                type: "string",
              },
              genres: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              status: {
                type: "string",
              },
              format: {
                type: "string",
              },
              episodes: {
                type: "integer",
              },
              year: {
                type: "integer",
              },
              season: {
                type: "string",
              },
              duration: {
                type: "integer",
              },
              startIn: {
                type: "object",
                properties: {
                  year: {
                    type: "integer",
                  },
                  month: {
                    type: "integer",
                  },
                  day: {
                    type: "integer",
                  },
                },
              },
              endIn: {
                type: "object",
                properties: {
                  year: {
                    type: "integer",
                  },
                  month: {
                    type: "integer",
                  },
                  day: {
                    type: "integer",
                  },
                },
              },
              nextair: {
                type: "object",
                properties: {
                  airingAt: {
                    type: "integer",
                  },
                  timeUntilAiring: {
                    type: "integer",
                  },
                  episode: {
                    type: "integer",
                  },
                },
              },
              score: {
                type: "object",
                properties: {
                  averageScore: {
                    type: "integer",
                  },
                  decimalScore: {
                    type: "number",
                  },
                },
              },
              popularity: {
                type: "integer",
              },
              siteUrl: {
                type: "string",
              },
              trailer: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  site: {
                    type: "string",
                  },
                  thumbnail: {
                    type: "string",
                  },
                },
              },
              studios: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          otherSite: {
            type: "object",
          },
        },
      },
      Anime_Default_Data: {
        type: "object",
        properties: {
          status: {
            type: "integer",
          },
          page: {
            type: "object",
            properties: {
              currentPage: {
                type: "integer",
              },
              hasNextPage: {
                type: "boolean",
              },
            },
          },
          results: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
                malId: {
                  type: "integer",
                },
                title: {
                  type: "object",
                  properties: {
                    romaji: {
                      type: "string",
                    },
                    english: {
                      type: "string",
                    },
                    native: {
                      type: "string",
                    },
                    userPreferred: {
                      type: "string",
                    },
                  },
                },
                image: {
                  type: "string",
                },
                trailer: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },
                    site: {
                      type: "string",
                    },
                    thumbnail: {
                      type: "string",
                    },
                  },
                },
                description: {
                  type: "string",
                },
                status: {
                  type: "string",
                },
                cover: {
                  type: "string",
                },
                rating: {
                  type: "integer",
                },
                releaseDate: {
                  type: "integer",
                },
                genres: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                totalEpisodes: {
                  type: "integer",
                },
                duration: {
                  type: "integer",
                },
                type: {
                  type: "string",
                },
              },
            },
          },
        },
        "x-examples": {
          "Example 1": {
            status: 200,
            page: {
              currentPage: 1,
              hasNextPage: true,
            },
            results: [
              {
                id: "127230",
                malId: 44511,
                title: {
                  romaji: "Chainsaw Man",
                  english: "Chainsaw Man",
                  native: "チェンソーマン",
                  userPreferred: "Chainsaw Man",
                },
                image:
                  "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx127230-FlochcFsyoF4.png",
                trailer: {
                  id: "v4yLeNt-kCU",
                  site: "youtube",
                  thumbnail: "https://i.ytimg.com/vi/v4yLeNt-kCU/hqdefault.jpg",
                },
                description:
                  'Denji is a teenage boy living with a Chainsaw Devil named Pochita. Due to the debt his father left behind, he has been living a rock-bottom life while repaying his debt by harvesting devil corpses with Pochita.<br><br>\nOne day, Denji is betrayed and killed. As his consciousness fades, he makes a contract with Pochita and gets revived as "Chainsaw Man" — a man with a devil\'s heart.<br>\n<br>\n(Source: Crunchyroll)',
                status: "Ongoing",
                cover:
                  "https://s4.anilist.co/file/anilistcdn/media/anime/banner/127230-lf01ya5ny8aH.jpg",
                rating: 87,
                releaseDate: 2022,
                genres: ["Action", "Comedy", "Drama", "Horror", "Supernatural"],
                totalEpisodes: 12,
                duration: 25,
                type: "TV",
              },
            ],
          },
        },
        examples: [
          {
            status: 0,
            page: {
              currentPage: 0,
              hasNextPage: true,
            },
            results: [
              {
                id: "string",
                malId: 0,
                title: {
                  romaji: "string",
                  english: "string",
                  native: "string",
                  userPreferred: "string",
                },
                image: "string",
                trailer: {
                  id: "string",
                  site: "string",
                  thumbnail: "string",
                },
                description: "string",
                status: "string",
                cover: "string",
                rating: 0,
                releaseDate: 0,
                genres: ["string"],
                totalEpisodes: 0,
                duration: 0,
                type: "string",
              },
            ],
          },
        ],
        title: "",
      },
      Anime_Recom: {
        type: "object",
        properties: {
          status: {
            type: "integer",
          },
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                },
                idMal: {
                  type: "integer",
                },
                title: {
                  type: "object",
                  properties: {
                    romaji: {
                      type: "string",
                    },
                    english: {
                      type: "string",
                    },
                    native: {
                      type: "string",
                    },
                    userPreferred: {
                      type: "string",
                    },
                  },
                },
                type: {
                  type: "string",
                },
                format: {
                  type: "string",
                },
                status: {
                  type: "string",
                },
                episodes: {
                  type: "integer",
                },
                duration: {
                  type: "integer",
                },
                averageScore: {
                  type: "integer",
                },
              },
            },
          },
        },
        "x-examples": {
          "Example 1": {
            status: 200,
            data: [
              {
                id: 6,
                idMal: 6,
                title: {
                  romaji: "TRIGUN",
                  english: "Trigun",
                  native: "TRIGUN",
                  userPreferred: "TRIGUN",
                },
                type: "ANIME",
                format: "TV",
                status: "FINISHED",
                episodes: 26,
                duration: 24,
                averageScore: 79,
              },
            ],
          },
        },
        examples: [
          {
            status: 0,
            data: [
              {
                id: 0,
                idMal: 0,
                title: {
                  romaji: "string",
                  english: "string",
                  native: "string",
                  userPreferred: "string",
                },
                type: "string",
                format: "string",
                status: "string",
                episodes: 0,
                duration: 0,
                averageScore: 0,
              },
            ],
          },
        ],
      },
      Anime_Search: {
        type: "object",
        properties: {
          status: {
            type: "integer",
          },
          page: {
            type: "object",
            properties: {
              total: {
                type: "integer",
              },
              perPage: {
                type: "integer",
              },
              currentPage: {
                type: "integer",
              },
              lastPage: {
                type: "integer",
              },
              hasNextPage: {
                type: "boolean",
              },
            },
          },
          results: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                },
                idMal: {
                  type: "integer",
                },
                status: {
                  type: "string",
                },
                title: {
                  type: "object",
                  properties: {
                    userPreferred: {
                      type: "string",
                    },
                    romaji: {
                      type: "string",
                    },
                    english: {
                      type: "string",
                    },
                    native: {
                      type: "string",
                    },
                  },
                },
                bannerImage: {
                  type: "string",
                },
                coverImage: {
                  type: "object",
                  properties: {
                    extraLarge: {
                      type: "string",
                    },
                    large: {
                      type: "string",
                    },
                    medium: {
                      type: "string",
                    },
                    color: {
                      type: "string",
                    },
                  },
                },
                episodes: {
                  type: "integer",
                },
                season: {
                  type: "string",
                },
                format: {
                  type: "string",
                },
                seasonYear: {
                  type: "integer",
                },
                averageScore: {
                  type: "integer",
                },
                nextAiringEpisode: {
                  type: "object",
                  properties: {
                    airingAt: {
                      type: "integer",
                    },
                    timeUntilAiring: {
                      type: "integer",
                    },
                    episode: {
                      type: "integer",
                    },
                  },
                },
              },
            },
          },
        },
        "x-examples": {
          "Example 1": {
            status: 200,
            page: {
              total: 5000,
              perPage: 1,
              currentPage: 1,
              lastPage: 5000,
              hasNextPage: true,
            },
            results: [
              {
                id: 127230,
                idMal: 44511,
                status: "RELEASING",
                title: {
                  userPreferred: "Chainsaw Man",
                  romaji: "Chainsaw Man",
                  english: "Chainsaw Man",
                  native: "チェンソーマン",
                },
                bannerImage:
                  "https://s4.anilist.co/file/anilistcdn/media/anime/banner/127230-lf01ya5ny8aH.jpg",
                coverImage: {
                  extraLarge:
                    "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx127230-FlochcFsyoF4.png",
                  large:
                    "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx127230-FlochcFsyoF4.png",
                  medium:
                    "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx127230-FlochcFsyoF4.png",
                  color: "#6b1a1a",
                },
                episodes: 12,
                season: "FALL",
                format: "TV",
                seasonYear: 2022,
                averageScore: 87,
                nextAiringEpisode: {
                  airingAt: 1667314800,
                  timeUntilAiring: 344371,
                  episode: 4,
                },
              },
            ],
          },
        },
        examples: [
          {
            status: 0,
            page: {
              total: 0,
              perPage: 0,
              currentPage: 0,
              lastPage: 0,
              hasNextPage: true,
            },
            results: [
              {
                id: 0,
                idMal: 0,
                status: "string",
                title: {
                  userPreferred: "string",
                  romaji: "string",
                  english: "string",
                  native: "string",
                },
                bannerImage: "string",
                coverImage: {
                  extraLarge: "string",
                  large: "string",
                  medium: "string",
                  color: "string",
                },
                episodes: 0,
                season: "string",
                format: "string",
                seasonYear: 0,
                averageScore: 0,
                nextAiringEpisode: {
                  airingAt: 0,
                  timeUntilAiring: 0,
                  episode: 0,
                },
              },
            ],
          },
        ],
      },
      Anime_Episode: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            title: {
              type: "string",
            },
            image: {
              type: "string",
            },
            number: {
              type: "integer",
            },
            description: {
              type: "string",
            },
            url: {
              type: "string",
            },
          },
        },
        "x-examples": {
          "Example 1": [
            {
              id: "cowboy-bebop-episode-1",
              title: "Asteroid Blues",
              image:
                "https://media.kitsu.io/episodes/thumbnails/229115/original.jpeg",
              number: 1,
              description:
                "Spike and Jet head to Tijuana to track down an outlaw smuggling a dangerous drug known as blood-eye.  Jet wants the bounty, but Spike has eyes for a far prettier prize.",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-1",
            },
          ],
        },
        examples: [
          [
            {
              id: "cowboy-bebop-episode-1",
              title: "Asteroid Blues",
              image:
                "https://media.kitsu.io/episodes/thumbnails/229115/original.jpeg",
              number: 1,
              description:
                "Spike and Jet head to Tijuana to track down an outlaw smuggling a dangerous drug known as blood-eye.  Jet wants the bounty, but Spike has eyes for a far prettier prize.",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-1",
            },
            {
              id: "cowboy-bebop-episode-2",
              title: "Stray Dog Strut",
              image:
                "https://media.kitsu.io/episodes/thumbnails/229114/original.jpeg",
              number: 2,
              description:
                "Spike and Jet's next case takes them to Mars, where they'll to try apprehend a professional pet thief and a priceless data dog.",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-2",
            },
            {
              id: "cowboy-bebop-episode-3",
              title: "Honky Tonk Women",
              image:
                "https://media.kitsu.io/episodes/thumbnails/229113/original.jpeg",
              number: 3,
              description:
                "A night at the casino lands Spike and Jet in hot water when they cross paths with Faye Valentine, a stunning con artist wanted by the law - and the bad guys.",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-3",
            },
            {
              id: "cowboy-bebop-episode-4",
              title: "Gateway Shuffle",
              image:
                "https://media.kitsu.io/episodes/thumbnails/229112/original.jpeg",
              number: 4,
              description:
                "Faye teams up with Spike and Jet to track down a gang of space activists that plans on turning the human population into monkeys!",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-4",
            },
            {
              id: "cowboy-bebop-episode-5",
              title: "Ballad of Fallen Angels",
              image:
                "https://media.kitsu.io/episodes/thumbnails/228991/original.jpeg",
              number: 5,
              description:
                "Spike aims to collect the bounty on a member of the Red Dragon Syndicate, but his mission leads him into a deadly showdown with a face from his past!",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-5",
            },
            {
              id: "cowboy-bebop-episode-6",
              title: "Sympathy for the Devil",
              image:
                "https://media.kitsu.io/episodes/thumbnails/228979/original.jpeg",
              number: 6,
              description:
                "The latest case for the crew of the Bebop finds Spike pitted against a young boy with a talent for the harmonica - and murder.",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-6",
            },
            {
              id: "cowboy-bebop-episode-7",
              title: "Heavy Metal Queen",
              image:
                "https://media.kitsu.io/episodes/thumbnails/228994/original.jpeg",
              number: 7,
              description:
                "The Bebop crew pursues a renegade explosives expert, and Spike crosses paths with a nameless space trucker that hates bounty hunters.",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-7",
            },
            {
              id: "cowboy-bebop-episode-8",
              title: "Waltz for Venus",
              image:
                "https://media.kitsu.io/episodes/thumbnails/228996/original.jpeg",
              number: 8,
              description:
                "Spike gets involved with a fugitive who is willing to risk his own life to restore his sister's sight. Can the Bebop crew save the day before tragedy strikes?",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-8",
            },
            {
              id: "cowboy-bebop-episode-9",
              title: "Jamming with Edward",
              image:
                "https://media.kitsu.io/episodes/thumbnails/228989/original.jpeg",
              number: 9,
              description:
                "The Bebop crew tries to crack the case of mysterious satellite drawings appearing on the Earth's surface, but they'll need help from a hacker know as Radical Edward to earn their bounty!",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-9",
            },
            {
              id: "cowboy-bebop-episode-10",
              title: "Ganymede Elegy",
              image:
                "https://media.kitsu.io/episodes/thumbnails/228981/original.jpeg",
              number: 10,
              description:
                "When a case takes the Bebop crew to Jet's old stomping ground, the big man crosses paths with an old lover - and her wanted boyfriend.",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-10",
            },
            {
              id: "cowboy-bebop-episode-11",
              title: "Toys in the Attic",
              image:
                "https://media.kitsu.io/episodes/thumbnails/229000/original.jpeg",
              number: 11,
              description:
                "When an unusual, blob-like space creature infects Ein, Faye, and Jet, Spike and Radical Edward must figure out a way to save their friends.",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-11",
            },
            {
              id: "cowboy-bebop-episode-12",
              title: "Jupiter Jazz (Part 1)",
              image:
                "https://media.kitsu.io/episodes/thumbnails/228983/original.jpeg",
              number: 12,
              description:
                "Faye robs and abandons the Bebop crew, Spike goes in search of a woman he once knew, and Vicious makes another deadly appearance.",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-12",
            },
            {
              id: "cowboy-bebop-episode-13",
              title: "Jupiter Jazz (Part 2)",
              image:
                "https://media.kitsu.io/episodes/thumbnails/228995/original.jpeg",
              number: 13,
              description:
                "Jet continues his mission to reunite his Bebop comrades, and Spike finds himself locked in a brutal dogfight with his old nemesis Vicious.",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-13",
            },
            {
              id: "cowboy-bebop-episode-14",
              title: "Bohemian Rhapsody",
              image:
                "https://media.kitsu.io/episodes/thumbnails/228990/original.jpeg",
              number: 14,
              description:
                "The Bebop Crew embarks on a wild goose chase of a bounty hunt that leads them deep into space in search of an ancient chess master.",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-14",
            },
            {
              id: "cowboy-bebop-episode-15",
              title: "My Funny Valentine",
              image:
                "https://media.kitsu.io/episodes/thumbnails/228993/original.jpeg",
              number: 15,
              description:
                "When Jet brings in a fugitive from Faye's past, the rebellious beauty must decide whether to turn him in – or give an old flame one last chance.",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-15",
            },
            {
              id: "cowboy-bebop-episode-16",
              title: "Black Dog Serenade",
              image:
                "https://media.kitsu.io/episodes/thumbnails/228984/original.jpeg",
              number: 16,
              description:
                "Jet teams up with a former partner to settle the score with the man who took his arm, but he soon discovers that memories can be deceiving.",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-16",
            },
            {
              id: "cowboy-bebop-episode-17",
              title: "Mushroom Samba",
              image:
                "https://media.kitsu.io/episodes/thumbnails/228980/original.jpeg",
              number: 17,
              description:
                "After the Bebop crash lands, Ed and Ein's search for food turns up some very expensive mushrooms with psychedelic side effects!",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-17",
            },
            {
              id: "cowboy-bebop-episode-18",
              title: "Speak Like a Child",
              image:
                "https://media.kitsu.io/episodes/thumbnails/228998/original.jpeg",
              number: 18,
              description:
                "When a mysterious package arrives, Faye disappears on a gambling binge, and Spike and Jet embark on a frustrating search for ancient technology!",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-18",
            },
            {
              id: "cowboy-bebop-episode-19",
              title: "Wild Horses",
              image:
                "https://media.kitsu.io/episodes/thumbnails/228987/original.jpeg",
              number: 19,
              description:
                "While Spike pays a visit to the man who built his ship, Faye and Jet go fishing for space pirates.",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-19",
            },
            {
              id: "cowboy-bebop-episode-20",
              title: "Pierrot le Fou",
              image:
                "https://media.kitsu.io/episodes/thumbnails/228986/original.jpeg",
              number: 20,
              description:
                "Spike takes a beating during a chance encounter with an indestructible assassin. While Jet searches for the secret to the madman's power, Spike goes looking for payback!",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-20",
            },
            {
              id: "cowboy-bebop-episode-21",
              title: "Boogie Woogie Feng Shui",
              image:
                "https://media.kitsu.io/episodes/thumbnails/228985/original.jpeg",
              number: 21,
              description:
                "Spurred by a cryptic email, Jet goes looking for an old friend, but finds his daughter – and a mysterious sun stone – instead.",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-21",
            },
            {
              id: "cowboy-bebop-episode-22",
              title: "Cowboy Funk",
              image:
                "https://media.kitsu.io/episodes/thumbnails/228997/original.jpeg",
              number: 22,
              description:
                "Spike's attempts to apprehend the infamous Teddy Bear Bomber are maddeningly derailed by a mysterious – and clueless – cowboy!",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-22",
            },
            {
              id: "cowboy-bebop-episode-23",
              title: "Brain Scratch",
              image:
                "https://media.kitsu.io/episodes/thumbnails/228999/original.jpeg",
              number: 23,
              description:
                "Faye goes undercover to collect the bounty on a deranged cult leader, but when the mysterious organization brainwashes her into a very deep sleep – she'll need a little help from her friends.",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-23",
            },
            {
              id: "cowboy-bebop-episode-24",
              title: "Hard Luck Woman",
              image:
                "https://media.kitsu.io/episodes/thumbnails/228988/original.jpeg",
              number: 24,
              description:
                "Faye and Ed discover clues to their respective pasts that could send the crew of the Bebop heading in very different directions.",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-24",
            },
            {
              id: "cowboy-bebop-episode-25",
              title: "The Real Folk Blues (Part 1)",
              image:
                "https://media.kitsu.io/episodes/thumbnails/228982/original.jpeg",
              number: 25,
              description:
                "Spike and Jet are ambushed by members of the syndicate, and Faye has an unexpected encounter with a woman from Spike's past.",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-25",
            },
            {
              id: "cowboy-bebop-episode-26",
              title: "The Real Folk Blues (Part 2)",
              image:
                "https://media.kitsu.io/episodes/thumbnails/229001/original.jpeg",
              number: 26,
              description:
                "Spike finally finds the woman he's been searching for, and Faye makes a surprising return to the Bebop. With the syndicate in hot pursuit, Spike seeks to end the reign of Vicious.",
              url: "https://www1.gogoanime.ee//cowboy-bebop-episode-26",
            },
          ],
        ],
        description: "",
      },
      Anime_Stream: {
        type: "object",
        "x-examples": {
          "Example 1": {
            Info: "Some anime stream from .mp4 will not be available in this api. Refer to /api/v1/stream to get it",
            player: {
              id: {
                mal: 1,
                ani: 1,
                gogo_id: "paripi-koumei-episode-1",
              },
              episodes: "1",
              stream: [
                {
                  url: "https://wwwx11.gogocdn.stream/videos/hls/qxpMUhuHbIp6F3bnK2hSkg/1667153487/183520/628289d36c0cb18b5444068a366b683d/ep.1.1657689087.360.m3u8",
                  isM3U8: true,
                  quality: "360p",
                },
                {
                  url: "https://wwwx11.gogocdn.stream/videos/hls/qxpMUhuHbIp6F3bnK2hSkg/1667153487/183520/628289d36c0cb18b5444068a366b683d/ep.1.1657689087.480.m3u8",
                  isM3U8: true,
                  quality: "480p",
                },
                {
                  url: "https://wwwx11.gogocdn.stream/videos/hls/qxpMUhuHbIp6F3bnK2hSkg/1667153487/183520/628289d36c0cb18b5444068a366b683d/ep.1.1657689087.720.m3u8",
                  isM3U8: true,
                  quality: "720p",
                },
                {
                  url: "https://wwwx11.gogocdn.stream/videos/hls/qxpMUhuHbIp6F3bnK2hSkg/1667153487/183520/628289d36c0cb18b5444068a366b683d/ep.1.1657689087.1080.m3u8",
                  isM3U8: true,
                  quality: "1080p",
                },
                {
                  url: "https://wwwx11.gogocdn.stream/videos/hls/qxpMUhuHbIp6F3bnK2hSkg/1667153487/183520/628289d36c0cb18b5444068a366b683d/ep.1.1657689087.m3u8",
                  isM3U8: true,
                  quality: "default",
                },
                {
                  url: "https://www11x.gogocdn.stream/videos/hls/qxpMUhuHbIp6F3bnK2hSkg/1667153487/183520/628289d36c0cb18b5444068a366b683d/ep.1.1656254584.m3u8",
                  isM3U8: true,
                  quality: "backup",
                },
              ],
              iframe:
                "https://gogohd.net/streaming.php?id=MTgzNTIw&title=Paripi+Koumei+Episode+1",
              plyr: {
                main: "https://plyr.link/p/player.html#aHR0cHM6Ly93d3d4MTEuZ29nb2Nkbi5zdHJlYW0vdmlkZW9zL2hscy9xeHBNVWh1SGJJcDZGM2JuSzJoU2tnLzE2NjcxNTM0ODcvMTgzNTIwLzYyODI4OWQzNmMwY2IxOGI1NDQ0MDY4YTM2NmI2ODNkL2VwLjEuMTY1NzY4OTA4Ny5tM3U4",
                backup:
                  "https://plyr.link/p/player.html#aHR0cHM6Ly93d3d4MTEuZ29nb2Nkbi5zdHJlYW0vdmlkZW9zL2hscy9xeHBNVWh1SGJJcDZGM2JuSzJoU2tnLzE2NjcxNTM0ODcvMTgzNTIwLzYyODI4OWQzNmMwY2IxOGI1NDQ0MDY4YTM2NmI2ODNkL2VwLjEuMTY1NzY4OTA4Ny40ODAubTN1OA==",
              },
              nspl: {
                main: "https://player.nscdn.ml/player.html?p=JnRpdGxlPXBhcmlwaS1rb3VtZWktZXBpc29kZS0xJmZpbGU9aHR0cHM6Ly93d3d4MTEuZ29nb2Nkbi5zdHJlYW0vdmlkZW9zL2hscy9xeHBNVWh1SGJJcDZGM2JuSzJoU2tnLzE2NjcxNTM0ODcvMTgzNTIwLzYyODI4OWQzNmMwY2IxOGI1NDQ0MDY4YTM2NmI2ODNkL2VwLjEuMTY1NzY4OTA4Ny5tM3U4",
                backup:
                  "https://player.nscdn.ml/player.html?p=JnRpdGxlPXBhcmlwaS1rb3VtZWktZXBpc29kZS0xJmZpbGU9aHR0cHM6Ly93d3d4MTEuZ29nb2Nkbi5zdHJlYW0vdmlkZW9zL2hscy9xeHBNVWh1SGJJcDZGM2JuSzJoU2tnLzE2NjcxNTM0ODcvMTgzNTIwLzYyODI4OWQzNmMwY2IxOGI1NDQ0MDY4YTM2NmI2ODNkL2VwLjEuMTY1NzY4OTA4Ny40ODAubTN1OA==",
              },
            },
          },
        },
        properties: {
          Info: {
            type: "string",
          },
          player: {
            type: "object",
            properties: {
              id: {
                type: "object",
                properties: {
                  mal: {
                    type: ["integer", "null"],
                  },
                  ani: {
                    type: ["integer", "null"],
                  },
                  gogo_id: {
                    type: "string",
                  },
                },
              },
              episodes: {
                type: "string",
              },
              stream: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    url: {
                      type: "string",
                    },
                    isM3U8: {
                      type: "boolean",
                    },
                    quality: {
                      type: "string",
                    },
                  },
                },
              },
              iframe: {
                type: "string",
              },
              plyr: {
                type: "object",
                properties: {
                  main: {
                    type: "string",
                  },
                  backup: {
                    type: "string",
                  },
                },
              },
              nspl: {
                type: "object",
                properties: {
                  main: {
                    type: "string",
                  },
                  backup: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
    },
    responses: {
      400: {
        description: "Bad request error response",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: {
                  type: "integer",
                },
                message: {
                  type: "string",
                },
              },
              "x-examples": {
                "Example 1": {
                  status: 400,
                  message: "Request failed with status code 400",
                },
              },
            },
            examples: {
              "Bad Request": {
                value: {
                  status: 400,
                  message: "Request failed with status code 400",
                },
              },
            },
          },
        },
      },
      404: {
        description: "Not found error response",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: {
                  type: "integer",
                },
                message: {
                  type: "string",
                },
              },
              "x-examples": {
                "Example 1": {
                  status: 404,
                  message: "Request failed with status code 404",
                },
              },
            },
            examples: {
              "Not Found": {
                value: {
                  status: 404,
                  message: "Request failed with status code 404",
                },
              },
            },
          },
        },
      },
      429: {
        description: "Too many request response",
        content: {
          "application/json": {
            schema: {
              properties: {
                id: {
                  type: "string",
                },
              },
            },
            examples: {
              "Too many request": {
                value: {
                  status: 429,
                  message:
                    "Too Many Requests, please wait before sending another request.",
                },
              },
            },
          },
        },
      },
      500: {
        description: "Internal server error response",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: {
                  type: "integer",
                },
                message: {
                  type: "string",
                },
              },
              "x-examples": {
                "Example 1": {
                  status: 404,
                  message: "Request failed with status code 404",
                },
              },
            },
            examples: {
              "Server Error": {
                value: {
                  status: 500,
                  message: "Server failed",
                },
              },
            },
          },
        },
      },
    },
  },
  "x-swagger-test":
    "5ahswyp35zcjyayvdcs35f8fx9owz9moxqg55q3aqd5yd83o9e4onay67zo6qoog6ae63xbbiohb92fjw3th4pfofa6nzy8hmeakmx9fq98kx2kb2rayi4vwzhnfrim6",
};
