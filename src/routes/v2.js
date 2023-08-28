import { Router } from "express";
import CryptoJS from "crypto-js";
import { META } from "@consumet/extensions";

import v2 from "../module/v2.js";
import { extract } from "../utils/stream/gogo.js";
import { get_stream } from "../utils/stream/zoro.js";

import { successRes, errorRes } from "../model/res.js";

const AnilistModule = new META.Anilist();

const router = Router();

function base64encode(string) {
  const encodedWord = CryptoJS.enc.Utf8.parse(string);
  const encoded = CryptoJS.enc.Base64.stringify(encodedWord);
  return encoded;
}

router.get("/stream/:id", async (req, res, next) => {
  const { data_src } = req.query;
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
              info: {
                skipTime: {
                  intro: data.meta.intro,
                  outro: data.meta.outro,
                },
              },
              stream: {
                multi: {
                  main: mainstrm,
                  backup: bkstrm,
                },
                tracks: data.meta.thumbnails,
                subtitles: data.subtitles,
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


// IN DEVELOPMENT
router.get("/stream/multi/:id", async (req, res, next) => {
  const { anify_api_key, data_src, episode, ani_id, isdub, server } = req.query;
  const { id } = req.params;
  try {
    if (anify_api_key == "" || anify_api_key == undefined) {
      return res.status(400).json(errorRes(400, "require Anify API KEY"));
    }
    const data = await v2.multiStream({
      apiKey: anify_api_key,
      providerId: data_src,
      watchId: id,
      episode: parseInt(episode),
      id: parseInt(ani_id),
      subType: isdub ? "dub": "sub",
      server
    });

    res.status(200).json(successRes(200, data_src == "gogoanime" ? "not recommend" : "", data));
  } catch (error) {
    next(error)
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
    );
    res.status(200).json(successRes(200, "success", { episodes: data }));
  } catch (error) {
    next(error);
  }
});

// IN DEVELOPMENT
router.get("/episode/multi/:id", async (req, res, next) => {
  try {
    if (req.query.anify_api_key == "" || req.query.anify_api_key == undefined) {
      return res.status(400).json(
        errorRes(400, "require Anify API KEY")
      )
    }
    const data = await v2.AniEpisodeList(req.params.id, req.query.data_src, req.query.anify_api_key);
    res.status(200).json(successRes(200, "success", { episodes: data }));
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
