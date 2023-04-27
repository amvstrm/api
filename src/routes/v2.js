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
    let setcors = "";
    const data = await v1.getStreamHLS(id);
    const mainstrm =
      data.sources.find((item) => item.quality === "default") ||
      data.sources[0].url;
    const bkstrm = data.sources.find((item) => item.quality === "backup") || null;
    const dtatrack = !data.tracks ? "" : data.tracks[0];
    if (cors === "s1") {
      setcors = "https://cors-stream.amvstr.ml/";
    }
    if (cors === "s2") {
      setcors = "https://cors-stream-2.amvstr.ml/";
    }
    if (cors !== "cors1" && cors !== "cors2") {
      const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
      if (urlRegex.test(req.query.cors) === false) {
        setcors = "https://cors-stream.amvstr.ml/";
      }
      setcors = req.query.cors
    }
    res.status(200).json(
      successRes(200, `${cors ? 'CORS ' + setcors + ' APPLIED TO THE EMBEDED PLAYER' : 'success'}`, {
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
            setcors + mainstrm.url
          )}`,
          backup: `https://plyr.link/p/player.html#${base64encode(
            setcors + bkstrm.url
          )}`,
        },
        nspl: {
          main: `https://player.nscdn.ml/player.html?p=${base64encode(
            `&title=${id}&file=${setcors + mainstrm.url}&thumbnails=${
              dtatrack.file
            }`
          )}`,
          backup: `https://player.nscdn.ml/player.html?p=${base64encode(
            `&title=${id}&file=${setcors + bkstrm.url}&thumbnails=${
              dtatrack.file
            }`
          )}`,
        },
      })
    );
  } catch (error) {
    next(error)
  }
});

router.get("/info/:id", async (req, res, next) => {
  try {
    const data = await v2.AnimeInfo(req.params.id);
    res.json(successRes(200, "success", data));
  } catch (error) {
    next(error)
  }
});

router.get("/recommendations/:id", async (req, res, next) => {
  try {
    const data = await v2.AnimeRecommendations(req.params.id);
    res.status(200).json(successRes(200, "success", {results: data}));
  } catch (error) {
    next(error)
  }
});

router.get("/trending", async (req, res, next) => {
  try {
    const data = await AnilistModule.fetchTrendingAnime(req.query.p, req.query.limit)
    res.status(200).json(successRes(200, "success", {results: data}));
  } catch (error) {
    next(error)
  }
});

router.get("/popular", async (req, res, next) => {
  try {
    const data = await AnilistModule.fetchPopularAnime(req.query.p, req.query.limit)
    res.status(200).json(successRes(200, "success", {results: data}));
  } catch (error) {
    next(error)
  }
});

router.get("/popular", async (req, res, next) => {
  try {
    const data = await AnilistModule.
    res.status(200).json(successRes(200, "success", {results: data}));
  } catch (error) {
    next(error)
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const data = await v2.AnimeSearch(req.query.q, req.query.p, req.query.limit);
    res.json(successRes(200, "success", data));
  } catch (error) {
    next(error)
  }
});

router.post("/search", async (req, res, next) => {
  try {
    const body_data = req.body;
    const data = await v2.AnimeAdvancedSearch(body_data);
    res.json(successRes(200, "success", data));
    } catch (error) {
      next(error)
    }
})

router.get("/episode/:id", async (req, res, next) => {
  try {
    const data = await AnilistModule.fetchEpisodesListById(req.params.id, req.query.dub, true)
    res.status(200).json(successRes(200, "success", {episode : data}));
  } catch (error) {
    next(error)
  }
});


export default router;
