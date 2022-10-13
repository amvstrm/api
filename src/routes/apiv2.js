/* eslint-disable no-unused-vars */
import express from "express";
import axios from "axios";
import apicache from "apicache";
import { createClient } from "@redis/client";
import { META, ANIME } from "@consumet/extensions";
import dotenv from "dotenv";
import CryptoJS from "crypto-js";
import validator from "jsonschema";

import api from "../utils/scrapper.js";
import { InfoQuery, SearchQ, RecommendationsQuery } from "../utils/query.js";
import { searchvalid } from "../model/schema.js";

import clist from "../utils/clist.js";

dotenv.config();
const router = express.Router();

const cache = apicache.middleware;

// IF YOU HAVE REDIS DB YOU CAN USE IT TO CACHE THE DATA

// const redisClient = createClient({
//   host: process.env.REDIS_URL,
//   port: process.env.REDIS_PORT,
//   password: process.env.REDIS_PASSWORD,
// });

// const cache = apiCache.options({
//   redisClient,
// }).middleware;

const metaprovider = new META.Anilist();
const gogoprovider = new ANIME.Gogoanime();

const gql = `https://graphql.anilist.co`;

const getotherprovd = async (malid) => {
  const data = axios
    .get(`https://api.malsync.moe/mal/anime/${malid}`)
    .catch((err) => {
      return err.message;
    });
  return data;
};

function base64encode(string) {
  const encodedWord = CryptoJS.enc.Utf8.parse(string);
  const encoded = CryptoJS.enc.Base64.stringify(encodedWord);
  return encoded;
}

router.get("/info/:id", cache("7 days"), async (req, res, next) => {
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
    res.status(200).json({
      status: 200,
      data: {
        id: 113813,
        idMal: 40839,
        title: data.data.Media.title,
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
        startIn : data.data.Media.startDate,
        endIn : data.data.Media.endDate,
        nextair: data.data.Media.nextAiringEpisode,
        score: {
          averageScore: data.data.Media.averageScore,
          decimalScore: data.data.Media.averageScore / 10,
        },
        popularity: data.data.Media.popularity,
        siteUrl: data.data.Media.siteUrl,
        trailer: data.data.Media.trailer,
        studios: data.data.Media.studios.nodes,
      },
      otherSite: gogo.data.Sites,
    });
  } catch (error) {
    res.status(error.response.status).json({
      status: error.response.status,
      message: error.message,
    });
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

router.get("/stream", cache("30 minutes"), async (req, res, next) => {
  try {
    const id = req.query.id;
    const malid = req.query.mal || null;
    const aniid = req.query.ani || null;
    const slug = id.split("-episode-")[0];
    const data = await gogoprovider.fetchEpisodeSources(id);
    let streamurl;
    for (let i = 0; i < data.sources.length; i++) {
      switch (data.sources[i].isM3U8) {
        case data.sources[0].isM3U8 === true:
          streamurl = data.sources[0].url;
          break;
        case data.sources[1].isM3U8 === true:
          streamurl = data.sources[1].url;
          break;
        case data.sources[2].isM3U8 === true:
          streamurl = data.sources[2].url;
          break;
        case data.sources[0].isM3U8 === false:
          streamurl = "";
          break;
        case data.sources[1].isM3U8 === false:
          streamurl = "";
          break;
        case data.sources[2].isM3U8 === false:
          streamurl = "";
          break;
      }
    }
    console.log();
    res.json({
      id: {
        mal: malid,
        ani: aniid,
        gogo_id: id,
      },
      episodes: id.split("-episode-")[1],
      stream: data.sources,
      iframe: data.headers.Referer,
      player: {
        plyr: {
          main: `https://plyr.link/p/player.html#${base64encode(streamurl)}`,
          backup: `https://plyr.link/p/player.html#${base64encode(
            data.sources[1].url === undefined ? null : data.sources[1].url
          )}`,
        },
        nspl: {
          main: `https://player.nscdn.ml/player.html?p=${base64encode(
            `&title=${id}&file=${streamurl}`
          )}`,
          backup: `https://player.nscdn.ml/player.html?p=${base64encode(
            `&title=${id}&file=${
              data.sources[1].url === undefined ? null : data.sources[1].url
            }`
          )}`,
        },
      },
    });
  } catch (error) {
    next();
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

router.get("/trending", cache("7 days"), async (req, res) => {
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

router.get("/popular", cache("7 days"), async (req, res, next) => {
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
    next();
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

router.get("/schedule", cache("7 days"), async (req, res) => {
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

router.get("/episode/:id", cache("1 hour"), async (req, res, next) => {
  try {
    const id = req.params.id;
    const dub = req.query.dub || false;
    await metaprovider.fetchEpisodesListById(id, dub).then((data) => {
      res.status(200).json(data);
    });
  } catch (error) {
    next();
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
