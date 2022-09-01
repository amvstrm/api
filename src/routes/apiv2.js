/* eslint-disable no-unused-vars */
import express from 'express';
import axios from 'axios';
import apicache from "apicache";
import { createClient } from '@redis/client';
import { META, ANIME } from '@consumet/extensions';
import dotenv from 'dotenv';
import CryptoJS from 'crypto-js';

import api from '../utils/scrapper.js';
import {
  InfoQuery,
  SearchQuery,
  advancedSearchQ,
  RecommendationsQuery,
  // TrendingQuery,
  // PopularQuery,
  // ScheduleQuery,
  // StatQuery
} from '../utils/query.js';

dotenv.config();
const router = express.Router();

const cache = apicache.middleware;

const redisClient = createClient({
  host: process.env.REDIS_URL,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

// const cache = apiCache.options({
//   redisClient,
// }).middleware;

const metaprovider = new META.Anilist()
const animeprovider = new ANIME.Gogoanime()

const getotherprovd = async (malid) => {
  const data = axios.get(`https://api.malsync.moe/mal/anime/${malid}`).catch((err) => {
    return err.message
  });
  return data;
}

function base64encode(string) {
  const encodedWord = CryptoJS.enc.Utf8.parse(string); // encodedWord Array object
  const encoded = CryptoJS.enc.Base64.stringify(encodedWord)
  return encoded;
}

router.get('/info/:id', cache('7 days'), async (req, res, next) => {
  const id = req.params.id;
  if (!id){
    res.status(400).json({
      status: 400,
      message: 'no id specified',
    })
  }
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    query: InfoQuery(id),
  }
  try {
    const { data } = await axios.post(`https://graphql.anilist.co`, options)
    const gogo = await getotherprovd(data.data.Media.idMal)
    res.status(200).json({
      status: 200,
      data: data.data.Media,
      otherSite: gogo.data.Sites,
    });
  } catch (error) {
    res.status(error.response.status).json({
      status: error.response.status,
      message : error.message,
    })
  }
});

router.get('/download/:id', cache('7 days'), async (req, res) => {
  const id = req.params.id;

  api.dllink(id).then(anime => {
    res.redirect(anime[0].download)
  })
  .catch((error) => {
    res.status(error.response.status).json({
      status: error.response.status,
      message : error.message
    });
  })
})

router.get('/stream', cache('30 minutes'), async (req, res) => {
  const id = req.query.id;
  const malid = req.query.mal || null
  const aniid = req.query.ani || null
  await animeprovider.fetchEpisodeSources(id).then((data) => {
    let streamurl
    for (let i = 0; i < data.sources.length; i++){
      switch(data.sources[i].isM3U8){
        case data.sources[0].isM3U8 === true:
          streamurl = data.sources[0].url
          break;
        case data.sources[1].isM3U8 === true:
          streamurl = data.sources[1].url
          break
        case data.sources[2].isM3U8 === true:
          streamurl = data.sources[2].url
          break
        case data.sources[0].isM3U8 === false:
          streamurl = ''
          break;
        case data.sources[1].isM3U8 === false:
          streamurl = ''
          break
        case data.sources[2].isM3U8 === false:
          streamurl = ''
          break
      }
    }
    res.json({
      id: {
        mal : malid,
        ani : aniid
      },
      gogo_id: id,
      episodes : id.split("-episode-")[1],
      stream: {
        goload: data.sources,
      },
      iframe: data.headers.Referer,
      player: {
        info: 'gogo stream only',
        plyr: `https://plyr.link/p/player.html#${base64encode(streamurl)}`,
        nspl: `https://player.nscdn.ml/player.html?p=${base64encode(`&title=${id}&file=${streamurl}`)}`
      }
    })
  }).catch((err) => {
    res.status(err.response.status).json({
      status: err.response.status,
      message: err.message
    })
  })
})

router.get('/recommendations/:id', cache('7 days'), async (req, res) => {
  const id = req.params.id;
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    query: RecommendationsQuery(id)
  };
  await axios.post(`https://graphql.anilist.co`, options).then((data) => {
    res.status(200).json({
      status: 200,
      data: data.data.data.Media.recommendations.nodes.map(node => node.mediaRecommendation)
    });
  }).catch((err) => {
    res.status(err.response.status).json({
      status: err.response.status,
      message: err.message
    })
  });
});

router.get('/trending', cache('7 days'), async (req, res) => {
  const page = req.query.page || 1;
  const perpage = req.query.limit || 10;
  await metaprovider.fetchTrendingAnime(page, perpage).then((data) => {
    res.status(200).json({
      status: 200,
      page: {
        currentPage: data.currentPage,
        hasNextPage: data.hasNextPage
      },
      results: data.results
    })
  }).catch((err) => {
    res.status(err.response.status).json({
      status: err.response.status,
      message: err.message
    })
  })
})

router.get('/popular', cache('7 days'), async (req, res) => {
  const page = req.query.page || 1;
  const perpage = req.query.limit || 10;
  await metaprovider.fetchPopularAnime(page, perpage).then((data) => {
    res.status(200).json({
      status: 200,
      page: {
        currentPage: data.currentPage,
        hasNextPage: data.hasNextPage
      },
      results: data.results
    })
  }).catch((err) => {
    res.status(err.response.status).json({
      status: err.response.status,
      message: err.message
    })
  })
})

router.get('/random', async (req, res) => {
  await metaprovider.fetchRandomAnime().then((data) => {
    res.status(200).json({
      status: 200,
      data: data
    })
  }).catch((err) => {
    res.status(err.response.status).json({
      status: err.response.status,
      message: err.message
    })
  })
})

router.get('/schedule', cache('7 days'), async (req, res) => {
  const page = req.query.page || 1;
  const perpage = req.query.limit || 10;
  const weekstart = req.query.w_start
  const weekend = req.query.w_end
  const notyetair = req.query.shownotair || false

  await metaprovider.fetchAiringSchedule(page, perpage, weekstart, weekend, notyetair).then((data) => {
    res.status(200).json({
      status: 200,
      page: {
        currentPage: data.currentPage,
        hasNextPage: data.hasNextPage
      },
      results: data.results
    })
  }).catch((err) => {
    res.status(err.response.status).json({
      status: err.response.status,
      message: err.message
    })
  })
})

router.get('/episode/:id', cache('1 hour'), async (req, res) => {
  const id = req.params.id;
  const dub = req.query.dub || false
  await metaprovider.fetchEpisodesListById(id, dub).then((data) => {
    res.json(data);
  }).catch((err) => {
    res.status(err.response.status).json({
      status: err.response.status,
      message: err.message
    })
  })
})

router.get('/search', cache('10 minutes'), async (req, res) => {
  const query = req.query.q;
  const page = req.query.p;
  const perPage = req.query.limit;
  await metaprovider.search(query, page, perPage).then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    res.status(err.response.status).json({
      status: err.response.status,
      message: err.message
    })
  })
});

router.post('/search', async (req, res) => {
  const gql = `https://graphql.anilist.co`;
  // const query = `
  //   query ($page: Int = 1, $id: Int, $type: MediaType, $isAdult: Boolean = false, $search: String, $format: [MediaFormat], $status: MediaStatus, $size: Int, $countryOfOrigin: CountryCode, $source: MediaSource, $season: MediaSeason, $seasonYear: Int, $year: String, $onList: Boolean, $yearLesser: FuzzyDateInt, $yearGreater: FuzzyDateInt, $episodeLesser: Int, $episodeGreater: Int, $durationLesser: Int, $durationGreater: Int, $chapterLesser: Int, $chapterGreater: Int, $volumeLesser: Int, $volumeGreater: Int, $licensedBy: [String], $isLicensed: Boolean, $genres: [String], $excludedGenres: [String], $tags: [String], $excludedTags: [String], $minimumTagRank: Int, $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]) {
  //     Page(page: $page, perPage: $size) {
  //       pageInfo {
  //         total
  //         perPage
  //         currentPage
  //         lastPage
  //         hasNextPage
  //       }
  //       media(id: $id, type: $type, season: $season, format_in: $format, status: $status, countryOfOrigin: $countryOfOrigin, source: $source, search: $search, onList: $onList, seasonYear: $seasonYear, startDate_like: $year, startDate_lesser: $yearLesser, startDate_greater: $yearGreater, episodes_lesser: $episodeLesser, episodes_greater: $episodeGreater, duration_lesser: $durationLesser, duration_greater: $durationGreater, chapters_lesser: $chapterLesser, chapters_greater: $chapterGreater, volumes_lesser: $volumeLesser, volumes_greater: $volumeGreater, licensedBy_in: $licensedBy, isLicensed: $isLicensed, genre_in: $genres, genre_not_in: $excludedGenres, tag_in: $tags, tag_not_in: $excludedTags, minimumTagRank: $minimumTagRank, sort: $sort, isAdult: $isAdult) {
  //         id
  //         idMal
  //         status(version: 2)
  //         title {
  //           userPreferred
  //           romaji
  //           english
  //           native
  //         }
  //         bannerImage
  //         coverImage {
  //           extraLarge
  //           large
  //           medium
  //           color
  //         }
  //         episodes
  //         season
  //         format
  //         studios
  //         seasonYear
  //         averageScore
  //         nextAiringEpisode {
  //           airingAt
  //           timeUntilAiring
  //           episode
  //         }
  //       }
  //     }
  //   }
  // `
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
    sort: req.body.sort
  }
  await axios.post(gql, {
    query: advancedSearchQ(variables),
    variables
  }).then((data) => {
    res.status(200).json({
      status: 200,
      page: data.data.data.Page.pageInfo,
      results: data.data.data.Page.media
    });
  }).catch((err) => {
    res.status(err.response.status).json({
      status: err.response.status,
      message: err.message
    })
  })
})

export default router