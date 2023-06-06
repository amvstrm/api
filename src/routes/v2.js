import { Router } from "express";
import CryptoJS from "crypto-js";
import { META } from "@consumet/extensions";

import v1 from "../module/v1.js";
import v2 from "../module/v2.js";

import { successRes, errorRes } from "../model/res.js";

const AnilistModule = new META.Anilist();
const router = Router();

function base64encode(string) {
  const encodedWord = CryptoJS.enc.Utf8.parse(string);
  const encoded = CryptoJS.enc.Base64.stringify(encodedWord);
  return encoded;
}

router.get("/stream/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const cors = req.query.cors;

    const data = await v1.getStreamHLS(id);
    const mainstrm =
      data.sources.find((item) => item.quality === "default") ||
      data.sources[0].url;
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
          main: `https://player.nscdn.ml/player.html?p=${base64encode(
            `&title=${id}&file=${ mainstrm.url }&thumbnails=${
              dtatrack.file
            }`
          )}`,
          backup: `https://player.nscdn.ml/player.html?p=${base64encode(
            `&title=${id}&file=${ bkstrm.url }&thumbnails=${
              dtatrack.file
            }`
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
    res.json(successRes(200, "success", data));
  } catch (error) {
    next(error);
  }
});

router.get("/recommendations/:id", async (req, res, next) => {
  try {
    const data = await v2.AnimeRecommendations(req.params.id);
    res.status(200).json(successRes(200, "success", { results: data }));
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

// airing schedule
router.get("/airing", async (req, res, next) => {
  try {
    const { p, limit, wstart, wend, shownotair } = req.query;

    // const data = await v2.AnimeAiringSchedule({
    //   page: p,
    //   perPage: limit,
    //   weekStart: wstart || (new Date().getDay() + 1) % 7 / 1000,
    //   weekEnd: wend || (new Date().getDay() + 1) % 7 / 1000,
    //   notYetAired: shownotair || false
    // });
    const data = await AnilistModule.fetchAiringSchedule(
      p,
      limit,
      wstart || undefined,
      wend || undefined,
      shownotair
    );
    res.status(200).json(
      successRes(200, "success", {
        page: {
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          hasNextPage: data.hasNextPage,
          totalResults: data.totalResults,
        },
        results: data.results,
      })
    );
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
    res.json(successRes(200, "success", data));
  } catch (error) {
    next(error);
  }
});

router.post("/search", async (req, res, next) => {
  try {
    const body_data = req.body;
    const data = await v2.AnimeAdvancedSearch(body_data);
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

export default router;
