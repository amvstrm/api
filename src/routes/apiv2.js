/* eslint-disable no-unused-vars */
import express from "express";
import axios from "axios";
import apicache from "apicache-plus";
// import Redis from "ioredis";
import { META } from "@consumet/extensions";
import dotenv from "dotenv";
import CryptoJS from "crypto-js";
import validator from "jsonschema";

import api from "../utils/multi/gogo.js";
import { InfoQuery, SearchQ, RecommendationsQuery } from "../utils/query.js";
import { searchvalid } from "../model/schema.js";

import clist from "../utils/clist.js";
import schema from "../model/schema.js";
import gogostrm from "../utils/stream/gogo.js";

dotenv.config();
const router = express.Router();

// const cache = apicache.options({
//   trackPerformance : true
// }).middleware;

// IF YOU HAVE REDIS DB YOU CAN USE IT TO CACHE THE DATA
// const redisClient = createClient({
//   host: process.env.REDIS_URL,
//   port: process.env.REDIS_PORT,
//   password: process.env.REDIS_PASSWORD,
//   legacyMode: true,
// });

const cache = apicache.options({
  // redisClient: new Redis({
  //   host: process.env.REDIS_URL,
  //   port: process.env.REDIS_PORT,
  //   password: process.env.REDIS_PASSWORD,
  //   tls: {
  //     rejectUnauthorized: false,
  //   }
  // }),
  statusCodes: {
    exclude: [400, 401, 404, 500, 503],
    include: [200, 201, 300, 301, 302, 304],
  },
  afterHit: (req, res) => {
    console.log("HIT");
  },
});

const metaprovider = new META.Anilist();
const gql = `https://graphql.anilist.co`;

const getotherprovd = async (malid) => {
  const data = axios
    .get(`https://api.malsync.moe/mal/anime/${malid}`)
    .catch((err) => {
      return err.message;
    });
  return data;
};

const getIDeachProvider = async (json) => {
  let idGogo = '""';
  let idZoro = '""';
  let id9anime = '""';
  let idPahe = '""';

  if (json.data.Sites.Gogoanime) {
    idGogo =
      JSON.stringify(json.data.Sites.Gogoanime)
        .match(/"identifier":"(.*?)"/)[1]
        .match(/(.*)/)[0] || "";
  }
  if (json.data.Sites.Zoro) {
    idZoro =
      JSON.stringify(json.data.Sites.Zoro)
        .match(/"url":"(.*?)"/)[1]
        .match(/(.*)/)[0]
        .replace("https://zoro.to/", "") || "";
  }
  if (json.data.Sites["9anime"]) {
    id9anime =
      JSON.stringify(json.data.Sites["9anime"])
        .match(/"url":"(.*?)"/)[1]
        .match(/(.*)/)[0]
        .replace("https://9anime.to/watch/", "") || "";
  }
  if (json.data.Sites.animepahe) {
    idPahe =
      JSON.stringify(json.data.Sites.animepahe)
        .match(/"identifier":"(.*?)"/)[1]
        .match(/(.*)/)[0] || "";
  }

  return {
    idGogo,
    idZoro,
    id9anime,
    idPahe,
  };
};

function base64encode(string) {
  const encodedWord = CryptoJS.enc.Utf8.parse(string);
  const encoded = CryptoJS.enc.Base64.stringify(encodedWord);
  return encoded;
}

router.get("/info/:id", cache("1 hour"), async (req, res, next) => {
  const id = req.params.id;
  const options = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    query: InfoQuery(id),
  };
  try {
    const { data } = await axios.post(gql, options);
    const gogo = await getotherprovd(data.data.Media.idMal);
    let genres = data.data.Media.genres;
    // im just trolling...
    for (let i = 0; i < clist.cringelist.length; i++) {
      if (id === clist.cringelist[i]) {
        genres.push("Cringe");
      }
    }

    let isDub = false;
    if (gogo.data.Sites.Gogoanime) {
      if (JSON.stringify(gogo.data.Sites.Gogoanime).includes("dub")) {
        isDub = true;
      }
    }

    const idprovider = await getIDeachProvider(gogo);

    // let gogoID = '""';
    // if (gogo.data.Sites.Gogoanime) {
    //   gogoID = JSON.stringify(gogo.data.Sites.Gogoanime)
    //     .match(/"identifier":"(.*?)"/)[1]
    //     .match(/(.*)/)[0];
    //   console.log(gogoID);
    // }

    res.status(200).json(
      schema.resultresp(
        200,
        "Success // id_provider might be an empty string or return something else.",
        {
          id: data.data.Media.id,
          idMal: data.data.Media.idMal,
          id_provider: idprovider,
          title: data.data.Media.title,
          dub: isDub,
          description: data.data.Media.description,
          coverImage: data.data.Media.coverImage,
          bannerImage: data.data.Media.bannerImage,
          genres: genres,
          status: data.data.Media.status,
          format: data.data.Media.format,
          episodes: data.data.Media.episodes,
          year: data.data.Media.seasonYear,
          season: data.data.Media.season,
          duration: data.data.Media.duration,
          startIn: data.data.Media.startDate,
          endIn: data.data.Media.endDate,
          nextair: data.data.Media.nextAiringEpisode,
          score: {
            averageScore: data.data.Media.averageScore,
            decimalScore: data.data.Media.averageScore / 10,
          },
          popularity: data.data.Media.popularity,
          siteUrl: data.data.Media.siteUrl,
          trailer: data.data.Media.trailer,
          studios: data.data.Media.studios.nodes,
          otherSite: gogo.data.Sites,
        }
      )
    );
  } catch (error) {
    next(error);
  }
});

router.get("/download/:id", cache("7 days"), async (req, res) => {
  const id = req.params.id;
  api
    .dllink(id)
    .then((anime) => {
      res.redirect(anime[0].download);
    })
    .catch((error) => {
      res.status(error.response.status).json({
        status: error.response.status,
        message: error.message,
      });
    });
});

router.get("/cache", (req, res) => {
  res.setHeader("Cache-Control", "maxage=0");
  const devkey = req.query.devkey;
  if (!devkey) {
    res.status(401).json({
      status: 401,
      message: "Required dev_key",
    });
  } else if (devkey === process.env.API_KEY) {
    res.json({
      routes: apicache.getIndex(),
      performance: apicache.getPerformance(),
    });
  }
});

router.get("/stream", cache("0 second"), async (req, res, next) => {
  const id = req.query.id;
  try {
    const data = await gogostrm.extract(id);
    const mainstrm =
      data.sources.find((item) => item.quality === "default") ||
      data.sources[0].url;
    const bkstrm =
      data.sources.find((item) => item.quality === "backup") || null;
    const dtatrack = !data.tracks ? "" : data.tracks[0];
    res.status(200).json({
      status: 200,
      message:
        "IF CORS ERROR, USE https://cors-stream.amvstr.ml/ & https://cors-stream-2.amvstr.ml or any CORS-Anywhere server",
      id,
      episodes: id.split("-episode-")[1],
      stream: {
        multi: {
          main: mainstrm,
          backup: bkstrm,
        },
        tracks: dtatrack,
      },
      iframe: data.iframe.default,
      plyr: {
        main: `https://plyr.link/p/player.html#${base64encode(
          "https://cors-stream.amvstr.ml/" + mainstrm.url
        )}`,
        backup: `https://plyr.link/p/player.html#${base64encode(
          "https://cors-stream.amvstr.ml/" + bkstrm.url
        )}`,
      },
      nspl: {
        main: `https://player.nscdn.ml/player.html?p=${base64encode(
          `&title=${id}&file=${
            "https://cors-stream.amvstr.ml/" + mainstrm.url
          }&thumbnails=${dtatrack.file}`
        )}`,
        backup: `https://player.nscdn.ml/player.html?p=${base64encode(
          `&title=${id}&file=${
            "https://cors-stream.amvstr.ml/" + bkstrm.url
          }&thumbnails=${dtatrack.file}`
        )}`,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/stream/:id", cache("0 second"), async (req, res, next) => {
  const id = req.params.id;
  const cors = req.query.cors;
  let setcors = "";
  try {
    const data = await gogostrm.extract(id);
    const mainstrm =
      data.sources.find((item) => item.quality === "default") ||
      data.sources[0].url;
    const bkstrm =
      data.sources.find((item) => item.quality === "backup") || null;
    const dtatrack = !data.tracks ? "" : data.tracks[0];
    if (cors === "cors1") {
      setcors = "https://cors-stream.amvstr.ml/";
    }
    if (cors === "cors2") {
      setcors = "https://cors-stream-2.amvstr.ml/";
    }
    res.status(200).json(
      schema.resultresp(200, "", {
        id,
        episodes: id.split("-episode-")[1],
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
    return next(error);
  }
});

router.get("/recommendations/:id", cache("7 days"), async (req, res) => {
  const id = req.params.id;
  const options = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    query: RecommendationsQuery(id),
  };
  await axios
    .post(gql, options)
    .then((data) => {
      res.status(200).json({
        status: 200,
        data: data.data.data.Media.recommendations.nodes.map(
          (node) => node.mediaRecommendation
        ),
      });
    })
    .catch((err) => {
      res.status(err.response.status).json({
        status: err.response.status,
        message: err.message,
      });
    });
});

router.get("/trending", cache("1 days"), async (req, res) => {
  const page = req.query.page || 1;
  const perpage = req.query.limit || 10;
  await metaprovider
    .fetchTrendingAnime(page, perpage)
    .then((data) => {
      res.status(200).json({
        status: 200,
        page: {
          currentPage: data.currentPage,
          hasNextPage: data.hasNextPage,
        },
        results: data.results,
      });
    })
    .catch((err) => {
      res.status(err.response.status).json({
        status: err.response.status,
        message: err.message,
      });
    });
});

router.get("/popular", cache("1 days"), async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const perpage = req.query.limit || 10;
    const data = await metaprovider.fetchPopularAnime(page, perpage);
    res.status(200).json({
      status: 200,
      page: {
        currentPage: data.currentPage,
        hasNextPage: data.hasNextPage,
      },
      results: data.results,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/random", async (req, res) => {
  await metaprovider
    .fetchRandomAnime()
    .then((data) => {
      res.status(200).json({
        status: 200,
        data: data,
      });
    })
    .catch((err) => {
      res.status(err.response.status).json({
        status: err.response.status,
        message: err.message,
      });
    });
});

router.get("/schedule", cache("1 days"), async (req, res) => {
  const page = req.query.page || 1;
  const perpage = req.query.limit || 10;
  const weekstart = req.query.w_start;
  const weekend = req.query.w_end;
  const notyetair = req.query.shownotair || false;

  await metaprovider
    .fetchAiringSchedule(page, perpage, weekstart, weekend, notyetair)
    .then((data) => {
      res.status(200).json({
        status: 200,
        page: {
          currentPage: data.currentPage,
          hasNextPage: data.hasNextPage,
        },
        results: data.results,
      });
    })
    .catch((err) => {
      res.status(err.response.status).json({
        status: err.response.status,
        message: err.message,
      });
    });
});

router.get("/episode/:id", cache("20 minutes"), async (req, res, next) => {
  try {
    const id = req.params.id;
    const dub = req.query.dub || false;
    await metaprovider.fetchEpisodesListById(id, dub).then((data) => {
      res.status(200).json(data);
    });
  } catch (error) {
    next(error);
  }
});

router.get("/search", cache("10 minutes"), async (req, res) => {
  const variables = {
    search: req.query.q,
    page: req.query.p,
    size: req.query.limit,
  };
  await axios
    .post(gql, {
      query: SearchQ(variables),
      variables,
    })
    .then((data) => {
      res.status(200).json({
        status: 200,
        page: data.data.data.Page.pageInfo,
        results: data.data.data.Page.media,
      });
    })
    .catch((err) => {
      res.status(err.response.status).json({
        status: err.response.status,
        message: err.message,
        res: err,
      });
    });
});

router.post("/search", async (req, res) => {
  const variables = {
    search: req.body.query,
    page: req.body.page,
    size: req.body.perPage,
    type: req.body.type,
    isAdult: req.body.isAdult,
    format: req.body.format,
    season: req.body.season,
    year: req.body.year,
    genres: req.body.genres,
    tags: req.body.tags,
    sort: req.body.sort,
  };
  const valid = validator.Validator;
  const v = new valid();
  const check = v.validate(variables, searchvalid);
  if (check.valid === false) {
    await axios
      .post(gql, {
        query: SearchQ(variables),
        variables,
      })
      .then((data) => {
        res.status(200).json({
          status: 200,
          page: data.data.data.Page.pageInfo,
          results: data.data.data.Page.media,
        });
      })
      .catch((err) => {
        res.status(err.response.status).json({
          status: err.response.status,
          message: err.message,
        });
      });
  } else {
    res.status(400).json({
      status: 400,
      message: "Bad request",
    });
  }
});

export default router;
