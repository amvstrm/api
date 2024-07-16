import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import httpStatus from "http-status";
import { ofetch } from "ofetch";

import {
  InfoQuery,
  SearchQ,
  RecommendationsQuery as SimilarAnimeQuery,
  SortedAnimeQuery,
} from "../utils/aniquery";
import { AnimeInfo, AnimeResult } from "../types/v2";
import { incorrectDataID } from "../utils/incorrectData";
import { IDProvider } from "../types";

const FetchAnilist = axios.create({
  baseURL: "https://graphql.anilist.co",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const FetchMappingData = async (id: number, useMalsync: boolean) => {
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
  }

  if (useMalsync === true) {
    const malBackupData_3 = await ofetch(
      `https://reverseproxy.adgstudios.co.za/?url=https://api.malsync.moe/mal/anime/anilist:${id}`,
      {
        cache: "force-cache",
        responseType: "json",
      }
    );

    return malBackupData_3;
  }

  return malBackupData;
};

const getIDeachProvider = async (json: any, id: number): Promise<IDProvider> => {
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
        idZoro = new URL(anime.url).pathname.replace("/", "");
      } else if (animePage === "9anime") {
        id9anime = new URL(anime.url).pathname.replace("/watch/", "");
      } else if (animePage === "animepahe") {
        idPahe = anime.identifier;
      }
    }
  }

  if (incorrectDataID().find((item) => item.id === id)) {
    return {
      id: id,
      idGogo: incorrectDataID().find((item) => item.id === id).idGogo,
      idGogoDub: incorrectDataID().find((item) => item.id === id).idGogoDub,
      idZoro: incorrectDataID().find((item) => item.id === id).idZoro,
      id9anime: incorrectDataID().find((item) => item.id === id).id9anime,
      idPahe: incorrectDataID().find((item) => item.id === id).idPahe,
    };
  }

  return {
    id,
    idGogo,
    idGogoDub,
    idZoro,
    id9anime,
    idPahe,
  };
};

const AnimeInfo = async (id: number): Promise<AnimeInfo> => {
  const query = InfoQuery(id);
  try {
    const { data }: AxiosResponse<{ data: { Media: any } }> =
      await FetchAnilist.post("", {
        query,
      });

    const masdata = await FetchMappingData(id, true);
    let idprovider: IDProvider;
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
    if (err.response) {
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
): Promise<AnimeResult> => {
  const querys = SimilarAnimeQuery(id, page, limit);
  try {
    const { data }: AxiosResponse<{ data: { Page: any } }> =
      await FetchAnilist.post("", {
        query: querys,
        variables: {
          id: id,
          page: page,
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

const AniSkipData = async (
  id: number | string,
  ep_id: number | string,
  source: "1" | "2" = "1"
) => {
  try {
    const url = [
      "https://api.aniskip.com/v2",
      "https://aniskip.saanservers.com/skiptimes",
    ];
    const ani_id = (await FetchMappingData(id as number, true)).malId;
    console.log(source, id, ep_id);
    console.log(`${url[1]}?id=${id}&episode=${ep_id}`);
    if (source === "1") {
      const { data } = await axios.get(
        `${url[0]}/skip-times/${ani_id}/${ep_id}?types[]=ed&types[]=mixed-ed&types[]=mixed-op&types[]=op&types[]=recap&episodeLength=`
      );
      return data.results
        ? {
            op: data.results.find((item: any) => item.skipType === "op")
              .interval,
            ed: data.results.find((item: any) => item.skipType === "ed")
              .interval,
          }
        : {
            op: null,
            ed: null,
          };
    } else if (source === "2") {
      const { data } = await axios.get(`${url[1]}?id=${id}&episode=${ep_id}`);

      return data.length > 0 ||
        data !== "404 Not Found" ||
        data !== "Anime not found"
        ? {
            op: data.find((item: any) => item.text === "Intro"),
            ed: data.find((item: any) => item.text === "Outro"),
          }
        : {
            op: null,
            ed: null,
          };
    }
  } catch (err) {
    console.log(err.response.data);
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

export default {
  AnimeInfo,
  AnimeSearch,
  AnimeAdvancedSearch,
  SimilarAnime,
  AniSkipData,
  Trending,
  Popular,
};
