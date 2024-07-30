/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import axios from "axios";
import httpStatus from "http-status";
import dotenv from "dotenv";
import { ANIME } from "@consumet/extensions";
import { ofetch } from "ofetch";

import {
  InfoQuery,
  SearchQ,
  RecommendationsQuery,
  TrendingQuery,
  PopularQuery,
} from "../model/aniquery.js";
import { incorrectDataID } from "../utils/incorrectData.js";

dotenv.config();

const Gogo = new ANIME.Gogoanime();
const Zoro = new ANIME.Zoro();
const NineAnime = new ANIME.NineAnime();
const AnimePahe = new ANIME.AnimePahe();

const FetchAnilist = axios.create({
  baseURL: "https://graphql.anilist.co",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const FetchMappingData = async (id, useMalBackup = false) => {
  const malBackupData = await ofetch(
    `https://raw.githubusercontent.com/bal-mackup/mal-backup/master/anilist/anime/${id}.json`,
    {
      cache: "force-cache",
      responseType: "json",
    }
  ).catch((err) => err);

  if (
    malBackupData === "404 Not Found" ||
    malBackupData.statusCode === 404 ||
    Object.keys(malBackupData.Sites).length === 0 ||
    malBackupData.Sites.Gogoanime === undefined
  ) {
    const malBackupData_2 = await ofetch(
      `https://api-mappings.madara.live/anime/${id}`,
      {
        cache: "force-cache",
      }
    ).catch((err) => err);
    return malBackupData_2.mappings.malSync;
  } else if (useMalBackup) {
    return malBackupData;
  }

  return malBackupData;
};

const getIDeachProvider = async (json, id) => {
  let idGogo = "";
  let idGogoDub = "";
  let idZoro = "";
  let id9anime = "";
  let idPahe = "";

  for (const animePage in json.Sites) {
    const animeInfo = json.Sites[animePage];
    for (const animeId in animeInfo) {
      const anime = animeInfo[animeId];
      if (animePage === "Gogoanime") {
        idGogo = Object.values(json.Sites[animePage])[0]?.identifier || "";
        idGogoDub = Object.values(json.Sites[animePage])[1]?.identifier || "";
      } else if (animePage === "Zoro") {
        idZoro = anime.url.includes("https://zoro.to/")
          ? anime.url.replace("https://zoro.to/", "")
          : anime.url.replace("https://hianime.to/", "");
      } else if (animePage === "9anime") {
        id9anime = anime.url.includes("https://aniwave.to/")
          ? anime.url.replace("https://aniwave.to/watch/", "")
          : anime.url.replace("https://9anime.to/watch/", "");
      } else if (animePage === "animepahe") {
        idPahe = anime.identifier;
      }
    }
  }

  if (incorrectDataID().find((item) => item.id === id)) {
    return {
      idGogo: incorrectDataID().find((item) => item.id === id).idGogo,
      idGogoDub: incorrectDataID().find((item) => item.id === id).idGogoDub,
      idZoro: incorrectDataID().find((item) => item.id === id).idZoro,
      id9anime: incorrectDataID().find((item) => item.id === id).id9anime,
      idPahe: incorrectDataID().find((item) => item.id === id).idPahe,
    };
  }

  return {
    idGogo,
    idGogoDub,
    idZoro,
    id9anime,
    idPahe,
  };
};

const AnimeInfo = async (id) => {
  const query = InfoQuery(id);
  try {
    const { data } = await FetchAnilist.post("", {
      query,
    });

    const masdata = await FetchMappingData(id, true);
    let idprovider;
    let isDub = false;
    if (!masdata || masdata === null || masdata === undefined) {
      idprovider = null;
    } else if (!masdata.Sites?.Gogoanime) {
      idprovider = null;
      isDub = false;
    } else {
      idprovider = await getIDeachProvider(masdata, id);
      if (masdata.Sites?.Gogoanime) {
        if (JSON.stringify(masdata.Sites.Gogoanime).includes("dub")) {
          isDub = true;
        }
      }
    }

    const relations = data.data.Media.relations.edges.map((node) => node.node);

    return {
      id: data.data.Media.id,
      idMal: data.data.Media.idMal,
      id_provider: idprovider,
      title: data.data.Media.title,
      dub: isDub,
      description: data.data.Media.description,
      coverImage: data.data.Media.coverImage,
      bannerImage: data.data.Media.bannerImage,
      genres: data.data.Media.genres,
      tags: data.data.Media.tags,
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
      relation: relations,
    };
  } catch (err) {
    console.log(err);
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      };
    }
    throw err;
  }
};

const AnimeSearch = async (query, page, limit) => {
  const querys = SearchQ();
  try {
    const data = await FetchAnilist.post("", {
      query: querys,
      variables: {
        search: query,
        page,
        size: limit,
        type: "ANIME",
      },
    });
    return {
      pageInfo: data.data.data.Page.pageInfo,
      results: data.data.data.Page.media,
    };
  } catch (err) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      };
    }
    throw err;
  }
};

const AnimeAdvancedSearch = async (req_data) => {
  const querys = SearchQ();
  try {
    const data = await FetchAnilist.post("", {
      query: querys,
      variables: req_data,
    });
    return {
      pageInfo: data.data.data.Page.pageInfo,
      results: data.data.data.Page.media,
    };
  } catch (err) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      };
    }
    throw err;
  }
};

const SimilarAnime = async (id, page = 1, limit = 12) => {
  const query = RecommendationsQuery(id, page, limit);
  try {
    const Recndtdata = await FetchAnilist.post("", {
      query,
    });
    const data = Recndtdata.data.data.Media;
    const recommendations =
      Recndtdata.data.data.Media.recommendations.nodes.map(
        (node) => node.mediaRecommendation
      );
    return {
      info: {
        id: data.id,
        idMal: data.idMal,
        title: data.title,
      },
      results: recommendations,
    };
  } catch (err) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      };
    }
    throw err;
  }
};

const AnimeAiringSchedule = async ({ page = 1, perPage = 12 }) => {
  try {
    const currentDate = new Date();

    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay() + 1);

    const weekEnd = new Date(currentDate);
    weekEnd.setDate(currentDate.getDate() - currentDate.getDay() + 8);

    const query = `
      query {
        Page(page: ${page}, perPage: ${perPage}) {
          pageInfo {
            hasNextPage
            total
          }
          airingSchedules(airingAt_greater: ${Math.round(
            weekStart.getTime() / 1000
          )}, airingAt_lesser: ${Math.round(weekEnd.getTime() / 1000)}) {
            airingAt
            episode
            media {
              id
              description
              idMal
              title {
                romaji
                english
                userPreferred
                native
              }
              countryOfOrigin
              description
              popularity
              bannerImage
              coverImage {
                extraLarge
                large
                medium
                color
              }
              episodes
              nextAiringEpisode {
                airingAt
                timeUntilAiring
                episode
              }
              genres
              averageScore
              seasonYear
              format
            }
          }
        }
      }
    `;
    const data = await axios.post("https://graphql.anilist.co", {
      query,
    });
    return {
      pageInfo: data.data.data.Page.pageInfo,
      results: data.data.data.Page.airingSchedules.map((item) => ({
        id: item.media.id.toString(),
        malId: item.media.idMal,
        episode: item.episode,
        airingAt: item.airingAt,
        title: item.media.title,
        episodes: item.media.episodes,
        nextair: item.media.nextAiringEpisode,
        country: item.media.countryOfOrigin,
        coverImage: item.media.coverImage,
        description: item.media.description,
        bannerImage: item.media.bannerImage,
        genres: item.media.genres,
        color: item.media.coverImage.color,
        rating: item.media.averageScore,
        releaseDate: item.media.seasonYear,
        type: item.media.format,
      })),
    };
  } catch (err) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      };
    }
    throw err;
  }
};

const AniSkipData = async (id, ep_id) => {
  try {
    const url = "https://api.aniskip.com/v2";
    const ani_id = await AnimeInfo(id);
    const { data } = await axios.get(
      `${url}/skip-times/${ani_id.idMal}/${ep_id}?types[]=ed&types[]=mixed-ed&types[]=mixed-op&types[]=op&types[]=recap&episodeLength=`
    );
    return data;
  } catch (err) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      };
    }
    throw err;
  }
};

const AniTrendingData = async (page, limit) => {
  try {
    const data = await FetchAnilist.post("", {
      query: TrendingQuery(page, limit),
    });
    return {
      pageInfo: data.data.data.Page.pageInfo,
      results: data.data.data.Page.media,
    };
  } catch (err) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      };
    }
    throw err;
  }
};

const AniPopularData = async (page, limit) => {
  try {
    const data = await FetchAnilist.post("", {
      query: PopularQuery(page, limit),
    });
    return {
      pageInfo: data.data.data.Page.pageInfo,
      results: data.data.data.Page.media,
    };
  } catch (err) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      };
    }
    throw err;
  }
};

const RandoAni = async (time = 1) => {
  try {
    const { data } = await axios.get(
      "https://raw.githubusercontent.com/5H4D0WILA/IDFetch/main/ids.txt"
    );
    const ids = data.split("\n");
    const result = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < time; i++) {
      const randomIndex = Math.floor(Math.random() * ids.length);
      result.push(ids[randomIndex]);
    }

    return result;
  } catch (err) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      };
    }
    throw err;
  }
};

// Multistream & AniEpisodeList are still in development!

// const AniRecent = async (page) => {
//   try {
//     const { data } = await axios.get(
//       `https://api.anify.tv/schedule?type=anime`
//     );

//     return data.map((item) => {
//       const idGogo = () => {
//         const gogoanimeMappings = item.mappings.filter(
//           (mapping) => mapping.providerId === "gogoanime"
//         );
//         return gogoanimeMappings.length > 0
//           ? gogoanimeMappings.map((mapping) =>
//               mapping.id.replace("/category/", "")
//             )[0]
//           : null;
//       };

//       const id9anime = () => {
//         const nineanimeMappings = item.mappings.filter(
//           (mapping) => mapping.providerId === "9anime"
//         );
//         return nineanimeMappings.length > 0
//           ? nineanimeMappings.map((mapping) =>
//               mapping.id.replace("/watch/", "")
//             )[0]
//           : null;
//       };

//       const idZoro = () => {
//         const zanimeMappings = item.mappings.filter(
//           (mapping) => mapping.providerId === "zoro"
//         );
//         return zanimeMappings.length > 0
//           ? zanimeMappings.map(
//               (mapping) => mapping.id.split("/")[1].split("?")[0]
//             )[0]
//           : null;
//       };

//       const getcoverImg = item.artwork.filter(
//         (item) =>
//           item.providerId === "anilist" &&
//           item.type === "poster" &&
//           (item.img.includes("/medium/") || item.img.includes("/large/"))
//       );

//       const getbannerImg = item.artwork.filter(
//         (item) => item.providerId === "anilist" && item.type === "banner"
//       );

//       return {
//         id: item.id,
//         title: item.title,
//         id_provider: {
//           idGogo: idGogo(),
//           idZoro: idZoro(),
//           id9anime: id9anime(),
//         },
//         coverImage: {
//           large:
//             getcoverImg.find((item) => item.img.includes("/large/"))?.img || "",
//           medium:
//             getcoverImg.find((item) => item.img.includes("/medium/"))?.img ||
//             "",
//           color: item.color,
//         },
//         bannerImage:
//           getbannerImg.find((item) => item.img.includes("/banner/"))?.img || "",
//         status: item.status,
//         season: item.season,
//         currentEpisode: item.currentEpisode,
//         year: item.year,
//         totalEpisodes: item.totalEpisodes,
//         type: item.type,
//         format: item.format,
//         genres: item.genres,
//         tags: item.tags,
//       };
//     });
//   } catch (err) {
//     if (err.response) {
//       return {
//         code: err.response.status,
//         message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
//       };
//     }
//     throw err;
//   }
// };

const multiStream = async ({
  providerId,
  watchId,
  episodeNumber,
  id,
  subType,
  server,
}) => {
  try {
    const { data } = await axios.post(`https://api.anify.tv/sources`, {
      providerId,
      watchId: providerId === "zoro" ? `/watch/${watchId}` : watchId,
      episodeNumber,
      id,
      subType,
      server,
    });
    return {
      info: {
        skiptime: {
          intro: data.intro,
          outro: data.outro,
        },
      },
      stream: {
        multi:
          data.sources.find(
            (item) => item.quality === "auto" || item.quality === "default"
          ) ||
          data.sources[0] ||
          null,
        backup:
          data.sources.find((item) => item.quality === "backup") ||
          data.sources[0] ||
          null,
        track:
          data.subtitles.find((track) => track.lang === "Thumbnails") || {},
        subtitles:
          data.subtitles.filter((track) => track.lang !== "Thumbnails") || [],
      },
      headers: data.headers,
    };
  } catch (err) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      };
    }
    throw err;
  }
};

const AniEpisodeList = async ({ id, provider }) => {
  try {
    const { data } = await axios.get(`https://api.anify.tv/episodes/${id}`);
    if (provider === "all") {
      const transformedData = [];
      // eslint-disable-next-line no-restricted-syntax, no-shadow
      for (const provider of data) {
        const episodes = Array.from(provider.episodes, (episode) => ({
          id:
            // eslint-disable-next-line no-nested-ternary
            provider.providerId === "gogoanime"
              ? episode.id.replace("/", "")
              : provider.providerId === "zoro"
              ? episode.id.replace("/watch/", "")
              : episode.id,
          episode: episode.number,
          title: episode.title,
          isFiller: episode.isFiller,
          isDub: episode.hasDub,
          image: episode.img,
        }));

        transformedData.push({
          providerId: provider.providerId,
          episodes,
        });
      }
      return transformedData;
    }
    const result = data.find((item) => item.providerId === provider);
    if (result) {
      const episodes = Array.from(result.episodes, (episode) => ({
        id:
          // eslint-disable-next-line no-nested-ternary
          provider === "gogoanime"
            ? episode.id.replace("/", "")
            : provider === "zoro"
            ? episode.id.replace("/watch/", "")
            : episode.id,
        episode: episode.number,
        title: episode.title,
        isFiller: episode.isFiller,
        isDub: episode.hasDub,
        image: episode.img,
      }));
      return {
        providerId: result.providerId,
        episodes,
      };
    }
  } catch (err) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      };
    }
    throw err;
  }
};

// eslint-disable-next-line default-param-last, no-unused-vars
const AniEpisodeMapper = async (id, provider = "gogoanime", dub) => {
  const json = await FetchMappingData(id);
  const getID = await getIDeachProvider(json);
  let data;

  if (provider === "gogoanime") {
    data = (await Gogo.fetchAnimeInfo(getID.idGogo)).episodes;
  } else if (
    provider === "zoro" ||
    provider === "aniwatch" ||
    provider === "hianime"
  ) {
    data = (await Zoro.fetchAnimeInfo(getID.idZoro)).episodes;
  } else if (provider === "aniwave" || provider === "9anime") {
    data = (await NineAnime.fetchAnimeInfo(getID.id9anime)).episodes;
  } else if (provider === "animepahe") {
    data = (await AnimePahe.fetchAnimeInfo(getID.idPahe)).episodes;
  }

  return data;
};

export default {
  AnimeInfo,
  AnimeSearch,
  SimilarAnime,
  AnimeAdvancedSearch,
  AnimeAiringSchedule,
  AniSkipData,
  AniTrendingData,
  AniPopularData,
  RandoAni,
  multiStream,
  AniEpisodeList,
  AniEpisodeMapper,
};
