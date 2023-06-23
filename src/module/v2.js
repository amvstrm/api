import axios from "axios";
import {
  InfoQuery,
  SearchQ,
  RecommendationsQuery,
  airingScheduleQuery,
} from "../model/aniquery.js";

const FetchAnilist = axios.create({
  baseURL: "https://graphql.anilist.co",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const FetchMalSyncData = async (malid) => {
  const data = axios
    .get(`https://api.malsync.moe/mal/anime/${malid}`)
    .catch((err) => err.message);
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
        .replace("https://9anime.pl/watch/", "") || "";
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

const AnimeInfo = async (id) => {
  const query = InfoQuery(id);
  try {
    const { data } = await FetchAnilist.post("", {
      query,
    });
    const masdata = await FetchMalSyncData(data.data.Media.idMal);

    let idprovider;
    let isDub = false;
    if (!masdata || !masdata.data || !masdata.data.Sites) {
      idprovider = null;
    } else {
      idprovider = await getIDeachProvider(masdata);
      if (masdata.data.Sites.Gogoanime) {
        if (JSON.stringify(masdata.data.Sites.Gogoanime).includes("dub")) {
          isDub = true;
        }
      }
    }

    const res = {
      id: data.data.Media.id,
      idMal: data.data.Media.idMal,
      id_provider: idprovider,
      title: data.data.Media.title,
      dub: isDub,
      description: data.data.Media.description,
      coverImage: data.data.Media.coverImage,
      bannerImage: data.data.Media.bannerImage,
      genres: data.data.Media.genres,
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
    };
    return res;
  } catch (err) {
    if (err.response) {
      return {
        code: err.response.status,
        message: err.message,
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
        page: page,
        size: limit,
        type: "ANIME",
      },
    });
    const res = {
      pageInfo: data.data.data.Page.pageInfo,
      data: data.data.data.Page.media,
    };
    return res;
  } catch (err) {
    if (err.response) {
      return {
        code: err.response.status,
        message: err.message,
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
    console.log({
      variables: {
        req_data,
      },
    });
    const res = {
      pageInfo: data.data.data.Page.pageInfo,
      data: data.data.data.Page.media,
    };
    return res;
  } catch (err) {
    if (err.response) {
      return {
        code: err.response.status,
        message: err.message,
      };
    }
    throw err;
  }
};

const AnimeRecommendations = async (id, page = 1, limit = 12) => {
  const query = RecommendationsQuery(id, page, limit);
  try {
    const Recndtdata = await FetchAnilist.post("", {
      query,
    });
    const data = Recndtdata.data.data.Media
    const recommendations =
      Recndtdata.data.data.Media.recommendations.nodes.map((node) => {
        return node.mediaRecommendation;
      });
    return {
      info: {
        id: data.id,
        idMal: data.idMal,
        title: data.title,
      },
      results: recommendations
    };
  } catch (err) {
    if (err.response) {
      return {
        code: err.response.status,
        message: err.message,
      };
    }
    console.log(err);
    throw err;
  }
};

const AnimeAiringSchedule = async ({
  page,
  perPage,
  weekStart,
  weekEnd,
  notYetAired,
}) => {
  const query = airingScheduleQuery({
    page,
    perPage,
    weekStart,
    weekEnd,
    notYetAired,
  });
  try {
    const { data } = await FetchAnilist.post("", {
      query,
    });
    const res = {
      pageInfo: data.data.Page.pageInfo,
      data: data.data.Page.airingSchedules,
    };
    return res;
  } catch (err) {
    if (err.response) {
      return {
        code: err.response.status,
        message: err.message,
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
        message: err.message,
      };
    }
    throw err;
  }
};

export default {
  AnimeInfo,
  AnimeSearch,
  AnimeRecommendations,
  AnimeAdvancedSearch,
  AnimeAiringSchedule,
  AniSkipData,
};
