import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import httpStatus from "http-status";
import { ofetch } from "ofetch";

import {
  InfoQuery,
  SearchQ,
  RecommendationsQuery as SimilarAnimeQuery,
  SortedAnimeQuery,
  SeasonQuery,
} from "../utils/aniquery";
import {
  AnimeInfo,
  AnimeRecommendationData,
  AnimeResult,
  RecommendationsType,
} from "../types/v2";
import { env } from "../utils/env";
import { SeasonList } from "../types/v1";
import customProviderData from "../utils/processCustomData";

interface IDProvider {
  id?: number;
  idGogo: string;
  idGogoDub: string;
  idZoro: string;
  idPahe: string;
}

const FetchAnilist = axios.create({
  baseURL: env.ANILIST_PROXY,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const FetchMappingData = async (id: number) => {
  const malBackupData = await ofetch(
    `https://raw.githubusercontent.com/bal-mackup/mal-backup/master/anilist/anime/${id}.json`,
    {
      cache: "force-cache",
      responseType: "json",
    }
  ).catch((err) => err);
  return malBackupData;
};

const getIDeachProvider = async (
  json: any,
  id: number
): Promise<IDProvider> => {
  let idGogo = "";
  let idGogoDub = "";
  let idZoro = "";
  let idPahe = "";

  for (const animePage in json.Sites) {
    const animeInfo = json.Sites[animePage];
    for (const animeId in animeInfo) {
      const anime = animeInfo[animeId];
      if (animePage === "Gogoanime") {
        // @ts-ignore
        idGogo = Object.values(json.Sites[animePage])[0]?.identifier || "";
        // @ts-ignore
        idGogoDub = Object.values(json.Sites[animePage])[1]?.identifier || "";
      } else if (animePage === "Zoro") {
        idZoro = new URL(anime.url).pathname.replace("/", "");
      } else if (animePage === "animepahe") {
        idPahe = anime.identifier;
      }
    }
  }

  // Check if the data is available in the customProviderData
  const customProviderItem = customProviderData.find(
    (item: any) => item.id === id
  );
  if (customProviderItem) {
    return {
      idGogo: customProviderItem.idGogo,
      idGogoDub: customProviderItem.idGogoDub,
      idZoro: customProviderItem.idZoro,
      idPahe: customProviderItem.idPahe,
    };
  } else {
    return {
      idGogo,
      idGogoDub,
      idZoro,
      idPahe,
    };
  }
};

const AnimeInfo = async (id: number): Promise<AnimeInfo> => {
  const query = InfoQuery(id);
  try {
    const { data }: AxiosResponse<{ data: { Media: any } }> =
      await FetchAnilist.post("", {
        query,
      });
    const malsyn_data = await FetchMappingData(id);
    let idprovider: IDProvider;
    let isDub = false;

    if (!malsyn_data || malsyn_data === null || malsyn_data === undefined) {
      idprovider = null;
    } else {
      idprovider = await getIDeachProvider(malsyn_data, id);
      if (malsyn_data.Sites?.Gogoanime) {
        if (JSON.stringify(malsyn_data.Sites.Gogoanime).includes("dub")) {
          isDub = true;
        }
      }
    }
    const relations = data.data.Media.relations.edges.map((node: any) => {
      return node.node;
    });

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
  } catch (err: any) {
    if (err.response || err.response.data) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      } as any;
    }
    throw err;
  }
};

const AnimeSearch = async (
  query: string,
  page: number,
  limit: number
): Promise<AnimeResult> => {
  try {
    const { data }: AxiosResponse<{ data: { Page: any } }> =
      await FetchAnilist.post("", {
        query: SearchQ(),
        variables: {
          search: query,
          page: page,
          size: limit,
          type: "ANIME",
        },
      });
    return {
      pageInfo: data.data.Page.pageInfo,
      results: data.data.Page.media,
    };
  } catch (err: any) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      } as any;
    }
    throw err;
  }
};

const AnimeAdvancedSearch = async (req_data: any): Promise<AnimeResult> => {
  try {
    const { data }: AxiosResponse<{ data: { Page: any } }> =
      await FetchAnilist.post("", {
        query: SearchQ(),
        variables: req_data,
      });
    return {
      pageInfo: data.data.Page.pageInfo,
      results: data.data.Page.media,
    };
  } catch (err: any) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      } as any;
    }
    throw err;
  }
};

const SimilarAnime = async (
  id: number,
  page: number,
  limit: number
): Promise<AnimeRecommendationData> => {
  const querys = SimilarAnimeQuery(id, (page = 1), (limit = 12));
  try {
    const { data }: AxiosResponse<{ data: RecommendationsType }> =
      await FetchAnilist.post("", {
        query: querys,
      });
    const recommendations = data.data.Media.recommendations.nodes;
    return {
      info: {
        id: data.data.Media.id,
        idMal: data.data.Media.idMal,
        title: data.data.Media.title,
      },
      results: recommendations.map((node: any) => node.mediaRecommendation),
    };
  } catch (err: any) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      } as any;
    }
    throw err;
  }
};

const AniSkipData = async (id: number | string, ep_id: number | string) => {
  try {
    const url = "https://api.aniskip.com/v2";
    const ani_id = (await FetchMappingData(id as number)).malId;

    const { data } = await axios.get(
      `${url}/skip-times/${ani_id}/${ep_id}?types[]=ed&types[]=mixed-ed&types[]=mixed-op&types[]=op&types[]=recap&episodeLength=`
    );
    return data.results
      ? {
          op: data.results.find((item: any) => item.skipType === "op"),
          ed: data.results.find((item: any) => item.skipType === "ed"),
        }
      : {
          op: null,
          ed: null,
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

const Trending = async (
  p: number = 1,
  limit: number = 20
): Promise<AnimeResult> => {
  try {
    const { data }: AxiosResponse<{ data: { Page: any } }> =
      await FetchAnilist.post("", {
        query: SortedAnimeQuery(),
        variables: {
          sort: ["TRENDING_DESC", "POPULARITY_DESC"],
          page: p,
          perPage: limit,
        },
      });

    return {
      pageInfo: data.data.Page.pageInfo,
      results: data.data.Page.media,
    };
  } catch (err: any) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      } as any;
    }
    throw err;
  }
};

const Popular = async (p: number, limit: number): Promise<AnimeResult> => {
  try {
    const { data }: AxiosResponse<{ data: { Page: any } }> =
      await FetchAnilist.post("", {
        query: SortedAnimeQuery(),
        variables: {
          sort: ["POPULARITY_DESC"],
          page: p,
          perPage: limit,
        },
      });
    return {
      pageInfo: data.data.Page.pageInfo,
      results: data.data.Page.media,
    };
  } catch (err: any) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      } as any;
    }
    throw err;
  }
};

const Season = async (
  season: SeasonList,
  year: number,
  page: number,
  limit: number
): Promise<AnimeResult> => {
  try {
    const { data }: AxiosResponse<{ data: { Page: any } }> =
      await FetchAnilist.post("", {
        query: SeasonQuery(),
        variables: {
          season,
          year,
          page,
          limit,
        },
      });
    return {
      pageInfo: data.data.Page.pageInfo,
      results: data.data.Page.media,
    };
  } catch (err: any) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      } as any;
    }
    throw err;
  }
};

export default {
  AnimeInfo,
  AnimeSearch,
  AnimeAdvancedSearch,
  Season,
  SimilarAnime,
  AniSkipData,
  Trending,
  Popular,
};
