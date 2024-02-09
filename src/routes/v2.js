import { Router } from "express";
import CryptoJS from "crypto-js";
import { ANIME, META } from "@consumet/extensions";
import axios from "axios";

import v2 from "../module/v2.js";
import { extract } from "../utils/stream/gogo.js";

import { successRes, errorRes } from "../model/res.js";

const AnilistModule = new META.Anilist();
const AnifyModule = new ANIME.Anify();

const router = Router();

function base64encode(string) {
  const encodedWord = CryptoJS.enc.Utf8.parse(string);
  const encoded = CryptoJS.enc.Base64.stringify(encodedWord);
  return encoded;
}

// IN DEVELOPMENT
router.get("/stream/multi", async (req, res, next) => {
  const { id, data_src, episode, ani_id, subType, server } = req.query;
  try {
    const data = await AnifyModule.fetchEpisodeSources(id, episode, ani_id);
    // const { data } = await axios.post(`https://api.anify.tv/sources`, {
    //   providerId: data_src,
    //   watchId: data_src === "zoro" ? `/watch/${id}` : id,
    //   episodeNumber: episode,
    //   id: ani_id,
    //   subType,
    //   server,
    // });
    res
      .status(200)
      .json(
        successRes(200, data_src == "gogoanime" ? "not recommend" : "", data)
      );
  } catch (error) {
    next(error);
  }
});

router.get("/stream/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const data = await extract(id);
    if (data.code == 404) {
      return res.status(404).json(errorRes(404));
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
          main: `https://plyr.link/p/player.html#${base64encode(mainstrm.url)}`,
          backup: `https://plyr.link/p/player.html#${base64encode(bkstrm.url)}`,
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
    const data = await v2.SimilarAnime(
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
    const data = await v2.AniTrendingData(req.query.p, req.query.limit);
    res.status(200).json(
      successRes(200, "success", {
        page: data.pageInfo,
        results: data.results,
      })
    );
  } catch (error) {
    next(error);
  }
});

router.get("/popular", async (req, res, next) => {
  try {
    const data = await v2.AniPopularData(req.query.p, req.query.limit);
    res.status(200).json(
      successRes(200, "success", {
        page: data.pageInfo,
        results: data.results,
      })
    );
  } catch (error) {
    next(error);
  }
});

// router.get("/recent", async (req, res, next) => {
//   try {
//     const data = await v2.AniRecent(1);
//     res.json(data);
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// });

// router.get("/schedule", async (req, res, next) => {
//   const { p = 1, limit } = req.query;
//   try {
//     const data = await v2.AnimeAiringSchedule({
//       page: p,
//       perPage: limit,
//     });
//     if (data.error) {
//       next(data.error);
//     }
//     res.json(successRes(200, "success", data));
//   } catch (error) {
//     next(error);
//   }
// });

router.get("/schedule", async (req, res, next) => {
  try {
    const { data } = await axios.post("https://api.anify.tv/schedule", {
      fields: [
        "id",
        "idMal",
        "title",
        "coverImage",
        "bannerImage",
        "mappings",
        "description",
        "countryOfOrigin",
        "year",
        "color",
        "format",
        "type",
        "genres",
        "tags",
        "airingAt",
        "aringEpisode",
        "totalEpisode",
        "season",
        "status",
        "currentEpisode",
      ],
      type: "anime",
    });

    res.status(200).json(successRes(200, "success", { results: data }));
  } catch (error) {
    next(error);
  }
});

router.get("/season/:season/:year", async (req, res, next) => {
  try {
    if (!req.params.season || !req.params.year) {
      return res.status(400).json(errorRes(400));
    }
    const { data } = await axios.post("https://graphql.anilist.co", {
      query: `query(
        $season: MediaSeason!,
        $year: Int,
        $page: Int,
        $limit: Int
      ) {
        Page(page: $page, perPage: $limit) {
          pageInfo 
          { 
            total 
            perPage 
            currentPage 
            lastPage 
            hasNextPage 
          } 
          media(season: $season, seasonYear: $year, type: ANIME) {
            id
            idMal
            title {
              romaji
              english
              native
              userPreferred
            }
            coverImage {
              extraLarge
              large
              medium
              color
            }
            bannerImage
            description
            countryOfOrigin
            seasonYear
            format
            type
            genres
            tags {
              id
            }
            season
            status
      			nextAiringEpisode {
      				airingAt
              timeUntilAiring
              episode
            }
          }
        }
      }`,
      variables: {
        season: req.params.season,
        year: parseInt(req.params.year),
        page: parseInt(req.query.p) || 1,
        limit: parseInt(req.query.limit) || 20,
      },
    });
    res
      .status(200)
      .json(successRes(200, "success", { results: data.data.Page.media }));
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

// router.get("/episode/:id", async (req, res, next) => {
//   try {
//     const data = await AnifyModule.fetchAnimeInfoByAnilistId(req.params.id, "gogoanime");
//     res.status(200).json(successRes(200, "success", { episodes: data.episodes }));
//   } catch (error) {
//     next(error);
//   }
// });

router.get("/episode/:id", async (req, res, next) => {
  try {
    const data = await v2.AniEpisodeList(req.params.id, req.query.data_src);
    res
      .status(200)
      .json(
        successRes(
          200,
          "success",
          req.query.data_src == "all" ? { episodes: data } : { episodes: data.episodes }
        )
      );
  } catch (error) {
    next(error);
  }
});

router.get("/random", async (req, res, next) => {
  try {
    const generated_ammt = req.query.generated || 1;
    const data = await v2.RandoAni(generated_ammt);

    if (generated_ammt > 40) {
      return res.status(403).json(errorRes(403));
    }

    res.status(200).json(
      successRes(200, "success", {
        id: data,
      })
    );
  } catch (err) {
    next(error);
  }
});

export default router;
