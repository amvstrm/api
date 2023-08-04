import { Router } from "express";
import CryptoJS from "crypto-js";
import { META, ANIME } from "@consumet/extensions";

import v1 from "../module/v1.js";
import v2 from "../module/v2.js";
import { extract } from "../utils/stream/gogo.js";
import { get_stream } from "../utils/stream/zoro.js";

import { successRes, errorRes } from "../model/res.js";
import axios from "axios";

const AnilistModule = new META.Anilist();
const ZoroModule = new ANIME.Zoro();

const router = Router();

function base64encode(string) {
  const encodedWord = CryptoJS.enc.Utf8.parse(string);
  const encoded = CryptoJS.enc.Base64.stringify(encodedWord);
  return encoded;
}

router.get("/stream/:id", async (req, res, next) => {
  const { data_src, z_server } = req.query;
  const { id } = req.params;
  switch (data_src) {
    case "zoro":
    case "z":
    case "aniwatch":
      try {
        if (!id.includes("$episode$")) {
          return res
            .status(400)
            .json(errorRes(400, "zoro id must have $episode$"));
        }

        let mainstrm;
        let ensub;
        const bkstrm = null;

        const data = await get_stream(id);

        mainstrm = data.sources[0].url || null;
        ensub = data.subtitles.find((sub) => sub.label === "English") || null;

        res.status(200).json(
          successRes(
            200,
            "zoro stream route still in beta, do not use it in your production",
            {
              stream: {
                multi: {
                  main: mainstrm,
                  backup: bkstrm,
                },
                tracks: data.meta.thumbnails,
                subtitles: data.subtitles,
              },
              skipTime: {
                intro: data.meta.intro,
                outro: data.meta.outro,
              },
              iframe: "",
              plyr: {
                main: `https://plyr.link/p/player.html#${base64encode(
                  mainstrm
                )}`,
                backup: null,
              },
              nspl: {
                main: `https://nspl.nyt92.eu.org/player?p=${base64encode(
                  `&title=${id}&file=${mainstrm}&thumbnails=${data.meta.thumbnails}&subtitle=${ensub.file}`
                )}`,
                backup: null,
              },
            }
          )
        );
      } catch (error) {
        next(error);
      }
      break;

    case "gogo":
    case "g":
      try {
        if (id.includes("$episode$")) {
          return res
            .status(400)
            .json(errorRes(400, "gogoanime id does not have $episode$"));
        }

        const data = await extract(id);

        if (data.code == 404) {
          return res.status(404).json(errorRes(404, "Not found"));
        }

        const mainstrm =
          data.sources.find((item) => item.quality === "default") ||
          data.sources[0].url ||
          null;
        const bkstrm =
          data.sources.find((item) => item.quality === "backup") || null;

        const dtatrack = !data.tracks ? "" : data.tracks[0];

        res.status(200).json(
          successRes(200, "success", {
            info: data.info,
            stream: {
              multi: {
                main: mainstrm,
                backup: bkstrm,
              },
              tracks: dtatrack,
            },
            iframe: data.iframe,
            plyr: {
              main: `https://plyr.link/p/player.html#${base64encode(
                mainstrm.url
              )}`,
              backup: `https://plyr.link/p/player.html#${base64encode(
                bkstrm.url
              )}`,
            },
            nspl: {
              main: `https://nspl.nyt92.eu.org/player?p=${base64encode(
                `&title=${id}&file=${mainstrm.url}&thumbnails=${dtatrack.file}`
              )}`,
              backup: `https://nspl.nyt92.eu.org/player?p=${base64encode(
                `&title=${id}&file=${bkstrm.url}&thumbnails=${dtatrack.file}`
              )}`,
            },
          })
        );
      } catch (error) {
        next(error);
      }
      break;

    default:
      try {
        if (id.includes("$episode$")) {
          return res
            .status(400)
            .json(errorRes(400, "gogoanime id does not have $episode$"));
        }
        const data = await extract(id);
        if (data.code == 404) {
          return res.status(404).json(errorRes(404, "Not found"));
        }

        const mainstrm =
          data.sources.find((item) => item.quality === "default") ||
          data.sources[0].url ||
          null;
        const bkstrm =
          data.sources.find((item) => item.quality === "backup") || null;

        const dtatrack = !data.tracks ? "" : data.tracks[0];

        res.status(200).json(
          successRes(200, "success", {
            info: data.info,
            stream: {
              multi: {
                main: mainstrm,
                backup: bkstrm,
              },
              tracks: dtatrack,
            },
            iframe: data.iframe,
            plyr: {
              main: `https://plyr.link/p/player.html#${base64encode(
                mainstrm.url
              )}`,
              backup: `https://plyr.link/p/player.html#${base64encode(
                bkstrm.url
              )}`,
            },
            nspl: {
              main: `https://nspl.nyt92.eu.org/player?p=${base64encode(
                `&title=${id}&file=${mainstrm.url}&thumbnails=${dtatrack.file}`
              )}`,
              backup: `https://nspl.nyt92.eu.org/player?p=${base64encode(
                `&title=${id}&file=${bkstrm.url}&thumbnails=${dtatrack.file}`
              )}`,
            },
          })
        );
      } catch (error) {
        next(error);
      }
      break;
  }
});

router.get("/stream/skiptime/:id/:ep_id", async (req, res, next) => {
  try {
    const data = await v2.AniSkipData(req.params.id, req.params.ep_id);
    if (data.error) {
      next(data.error);
    }
    res.status(200).json(
      successRes(200, "success", {
        found: data.found,
        results: {
          op: data.results?.find((item) => item.skipType === "op") || null,
          ed: data.results?.find((item) => item.skipType === "ed") || null,
        },
      })
    );
  } catch (error) {
    next(error);
  }
});

router.get("/info/:id", async (req, res, next) => {
  try {
    const data = await v2.AnimeInfo(req.params.id);
    if (data.error) {
      next(data.error);
    }
    res.json(successRes(200, "success", data));
  } catch (error) {
    next(error);
  }
});

router.get("/recommendations/:id", async (req, res, next) => {
  try {
    const data = await v2.AnimeRecommendations(
      req.params.id,
      req.query.page,
      req.query.limit
    );

    res.status(200).json(successRes(200, "success", data));
  } catch (error) {
    next(error);
  }
});

router.get("/trending", async (req, res, next) => {
  try {
    const data = await AnilistModule.fetchTrendingAnime(
      req.query.p,
      req.query.limit
    );
    res.status(200).json(
      successRes(200, "success", {
        page: {
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalResults: data.totalResults,
          hasNextPage: data.hasNextPage,
        },
        results: data.results,
      })
    );
  } catch (error) {
    next(error);
  }
});

router.get("/popular", async (req, res, next) => {
  try {
    const data = await AnilistModule.fetchPopularAnime(
      req.query.p,
      req.query.limit
    );
    res.status(200).json(
      successRes(200, "success", {
        page: {
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalResults: data.totalResults,
          hasNextPage: data.hasNextPage,
        },
        results: data.results,
      })
    );
  } catch (error) {
    next(error);
  }
});

router.get("/schedule", async (req, res, next) => {
  const { p = 1, limit, wstart, wend, shownotair = false } = req.query;
  const now = new Date();
  const start =
    new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
  const end =
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() /
    1000;
  try {
    const data = await v2.AnimeAiringSchedule({
      page: p,
      perPage: limit,
      w_start: wstart || start,
      w_end: wend || end,
      notYetAired: shownotair,
    });
    if (data.error) {
      next(data.error);
    }
    res.json(successRes(200, "success", data));
  } catch (error) {
    next(error);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const data = await v2.AnimeSearch(
      req.query.q,
      req.query.p,
      req.query.limit
    );
    if (data.error) {
      next(data.error);
    }
    res.json(successRes(200, "success", data));
  } catch (error) {
    next(error);
  }
});

router.post("/search", async (req, res, next) => {
  try {
    const body_data = req.body;
    const data = await v2.AnimeAdvancedSearch(body_data);
    if (data.error) {
      next(data.error);
    }
    res.json(successRes(200, "success", data));
  } catch (error) {
    next(error);
  }
});

router.get("/episode/:id", async (req, res, next) => {
  try {
    const data = await AnilistModule.fetchEpisodesListById(
      req.params.id,
      req.query.dub,
      true
    );
    res.status(200).json(successRes(200, "success", { episode: data }));
  } catch (error) {
    next(error);
  }
});

router.get("/genres", async (req, res, next) => {
  try {
    res.status(200).json({
      genres: [
        "Action",
        "Adventure",
        "Animation",
        "Anime",
        "Anime Influenced",
        "Avant Garde",
        "Award Winning",
        "Boys Love",
        "Cars",
        "Children",
        "Comedy",
        "Cooking",
        "Crime",
        "Dementia",
        "Demons",
        "Documentary",
        "Doujinshi",
        "Drama",
        "Ecchi",
        "Erotica",
        "Family",
        "Fantasy",
        "Food",
        "Friendship",
        "Game",
        "Game Show",
        "Gender Bender",
        "Girls Love",
        "Gore",
        "Gourmet",
        "Harem",
        "Hentai",
        "Historical",
        "History",
        "Home and Garden",
        "Horror",
        "Indie",
        "Isekai",
        "Josei",
        "Kids",
        "Law",
        "Magic",
        "Mahou Shoujo",
        "Mahou Shounen",
        "Martial Arts",
        "Mature",
        "Mecha",
        "Medical",
        "Military",
        "Mini-Series",
        "Music",
        "Musical",
        "Mystery",
        "News",
        "Parody",
        "Police",
        "Political",
        "Psychological",
        "Racing",
        "Reality",
        "Romance",
        "Samurai",
        "School",
        "Sci-Fi",
        "Science Fiction",
        "Seinen",
        "Shoujo",
        "Shoujo Ai",
        "Shounen",
        "Shounen Ai",
        "Slice Of Life",
        "Slice of Life",
        "Soap",
        "Space",
        "Sport",
        "Sports",
        "Super Power",
        "Supernatural",
        "Suspense",
        "Talk Show",
        "Thriller",
        "Tragedy",
        "Travel",
        "Vampire",
        "War",
        "Western",
        "Workplace",
        "Yaoi",
        "Youth",
        "Yuri",
        "Zombies",
      ],
    });
  } catch (error) {
    next(error);
  }
});


export default router;
