import type {
  SeasonList,
  GenreList,
  TypeReleases,
  Result,
  Episode,
} from "../types/v1";

import axios from "axios";
import { load } from "cheerio";
import httpStatus from "http-status";

import { extract } from "../utils/gogostream";
import { getGogoCookie } from "../utils/gogoauth";
import { env } from "../utils/env";

const BASE_URL = "https://anitaku.bz/";
const ajax_url = "https://ajax.gogocdn.net/";
const popular_ongoing_url = `${ajax_url}ajax/page-recent-release-ongoing.html`;
const recent_release_url = `${ajax_url}ajax/page-recent-release.html`;
const list_episodes_url = `${ajax_url}ajax/load-list-episode`;

const genres_list = [
  "action",
  "adventure",
  "cars",
  "comedy",
  "crime",
  "dementia",
  "demons",
  "drama",
  "dub",
  "ecchi",
  "family",
  "fantasy",
  "game",
  "gourmet",
  "harem",
  "hentai",
  "historical",
  "horror",
  "josei",
  "kids",
  "magic",
  "martial-arts",
  "mecha",
  "military",
  "Mmusic",
  "mystery",
  "parody",
  "police",
  "psychological",
  "romance",
  "samurai",
  "school",
  "sci-fi",
  "seinen",
  "shoujo",
  "shoujo-ai",
  "shounen",
  "shounen-ai",
  "slice-of-Life",
  "space",
  "sports",
  "super-power",
  "supernatural",
  "suspense",
  "thriller",
  "vampire",
  "yaoi",
  "yuri",
  "isekai",
];

axios.defaults.headers.common["Accept-Encoding"] = "gzip";

const season = async (season: SeasonList, year: number, page: number) => {
  try {
    const list: Result[] = [];
    const season_page = await axios.get(
      `${BASE_URL}sub-category/${season}-${year}-anime?page=${page}`
    );
    const $ = load(season_page.data);

    $("div.last_episodes > ul > li").each((_i, el) => {
      const href = $(el).find("div > a").attr("href");

      list.push({
        title: $(el)?.find("div > a")?.attr("title") ?? "",
        id: href ? href.split("/")[2] : "",
        image_url: $(el).find("div > a > img").attr("src") ?? "",
        released: $(el)
          .find("p.released")
          .text()
          .replace("Released: ", "")
          .trim(),
        latestEp: null,
        genres: null,
        status: null,
      });
    });
    return list;
  } catch (err: any) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      };
    }
    throw err;
  }
};

const topair = async (page = 1) => {
  try {
    const list: Result[] = [];
    if (page === -1) {
      let pageNum = 1;
      let hasMore = true;
      while (hasMore) {
        const popular_page = await axios.get(`
            ${popular_ongoing_url}?page=${pageNum}
            `);
        const $ = load(popular_page.data);

        if ($("div.added_series_body.popular > ul > li").length === 0) {
          hasMore = false;
        }
        // eslint-disable-next-line no-loop-func
        $("div.added_series_body.popular > ul > li").each((_i, el) => {
          const genres: string[] = [];
          $(el)
            .find("p.genres > a")
            .each((_i, el) => {
              genres.push($(el).attr("title") ?? "");
            });
          list.push({
            title: $(el).find("a:nth-child(1)").attr("title") ?? "",
            id: $(el).find("a:nth-child(1)").attr("href")?.split("/")[2] ?? "",
            image_url:
              $(el)
                .find("a:nth-child(1) > div")
                .attr("style")
                ?.match("(https?://.*.(?:png|jpg|jpeg|webp))")?.[0] ?? "",
            latestEp: parseInt($(el).find("p:nth-child(4) > a").text().trim()),
            genres: genres as unknown as string[],
            released: null,
            status: null,
          });
        });
        // eslint-disable-next-line no-plusplus
        pageNum++;
      }
      return list;
    }

    const popular_pg = await axios.get(`
    ${popular_ongoing_url}?page=${page}
    `);
    const $ = load(popular_pg.data);

    $("div.added_series_body.popular > ul > li").each((_i, el) => {
      const genres: string[] = [];
      $(el)
        .find("p.genres > a")
        .each((_i, el) => {
          genres.push($(el).attr("title") ?? "");
        });
      list.push({
        title: $(el).find("a:nth-child(1)").attr("title") ?? "",
        id: $(el).find("a:nth-child(1)").attr("href")?.split("/")[2] ?? "",
        image_url:
          $(el)
            .find("a:nth-child(1) > div")
            .attr("style")
            ?.match("(https?://.*.(?:png|jpg|jpeg|webp))")?.[0] ?? "",
        latestEp: parseInt($(el).find("p:nth-child(4) > a").text().trim()) ?? 0,
        genres,
        released: null,
        status: null,
      });
    });

    return list;
  } catch (err: any) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      };
    }
    throw err;
  }
};

const search = async (query: string, page: number) => {
  try {
    const list: Result[] = [];
    const searchPage = await axios.get(
      `${BASE_URL}search.html?keyword=${query}&page=${page}`
    );
    const $ = load(searchPage.data);

    $("div.last_episodes > ul > li").each((_i, el) => {
      list.push({
        title: $(el).find("p.name > a").attr("title") ?? "",
        id: $(el).find("p.name > a").attr("href")?.split("/")[2] ?? "",
        image_url: $(el).find("div > a > img").attr("src") ?? "",
        status: $(el)
          .find("p.released")
          .text()
          .trim()
          .replace("Released: ", ""),
        released: null,
        latestEp: null,
        genres: null,
      });
    });
    return list;
  } catch (err: any) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      };
    }
    throw err;
  }
};

const genres = async (genre: GenreList, page = 1) => {
  const list: Result[] = [];
  try {
    genre = genre.trim().replace(/ /g, "-").toLowerCase() as GenreList;
    if (genres_list.indexOf(genre) > -1) {
      const grepg = await axios.get(`${BASE_URL}genre/${genre}?page=${page}`);
      const $ = load(grepg.data);

      $("div.last_episodes > ul > li").each((_i, elem) => {
        list.push({
          id: $(elem).find("p.name > a").attr("href")?.split("/")[2] || "",
          title: $(elem).find("p.name > a").attr("title") || "",
          image_url: $(elem).find("div > a > img").attr("src") || "",
          released: $(elem)
            .find("p.released")
            .text()
            .replace("Released: ", "")
            .trim(),
          latestEp: null,
          genres: null,
          status: null,
        });
      });
      return list;
    }
    return {
      code: 404,
      message: "Genre not found",
    };
  } catch (err: any) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      };
    }
    throw err;
  }
};

const newSeasons = async (page = 1) => {
  try {
    const list: Result[] = [];
    const newsspg = await axios.get(`${BASE_URL}new-season.html?page=${page}`);
    const $ = load(newsspg.data);
    $("div.last_episodes > ul > li").each((_i, el) => {
      list.push({
        title: $(el).find("p.name > a").attr("title") || "",
        id: $(el).find("p.name > a").attr("href")?.split("/")[2] || "",
        image_url: $(el).find("div > a > img").attr("src") || "",
        released: $(el)
          .find("p.released")
          .text()
          .replace("Released: ", "")
          .trim(),
        latestEp: null,
        genres: null,
        status: null,
      });
    });
    return list;
  } catch (err: any) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      };
    }
    throw err;
  }
};

const movies = async (_aphab: string, page: number = 1) => {
  try {
    const list: any[] = [];
    const moviepg = await axios.get(
      `${BASE_URL}/anime-movies.html?aph=&page=${page}`
    );
    const $ = load(moviepg.data);

    $("div.last_episodes > ul > li").each((_i, el) => {
      list.push({
        title: $(el).find("p.name > a").attr("title") || "",
        id: $(el).find("p.name > a").attr("href")?.split("/")[2] || "",
        image_url: $(el).find("div > a > img").attr("src") || "",
        released: $(el)
          .find("p.released")
          .text()
          .replace("Released: ", "")
          .trim(),
      });
    });
    return list;
  } catch (err: any) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      };
    }
    throw err;
  }
};

const popular = async (page = 1) => {
  try {
    const list: any[] = [];
    const popularpg = await axios.get(`${BASE_URL}/popular.html?page=${page}`);
    const $ = load(popularpg.data);

    $("div.last_episodes > ul > li").each((_i, el) => {
      list.push({
        title: $(el).find("p.name > a").attr("title") || "",
        id: $(el).find("p.name > a").attr("href")?.split("/")[2] || "",
        image_url: $(el).find("div > a > img").attr("src") || "",
        released: $(el)
          .find("p.released")
          .text()
          .replace("Released: ", "")
          .trim(),
      });
    });
    return list;
  } catch (err: any) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      };
    }
    throw err;
  }
};

const recentReleaseEpisodesType = async (page = 1, type: TypeReleases) => {
  try {
    const list: any[] = [];
    const dataType =
      type === "sub" ? "1" : type === "dub" ? "2" : type === "cn" ? "3" : "4";
    const recntpage = await axios.get(
      `${recent_release_url}?page=${page}&type=${dataType}`
    );
    const $ = load(recntpage.data);

    $("div.last_episodes.loaddub > ul > li").each((_i, el) => {
      list.push({
        title: $(el).find("p.name > a").attr("title") || "",
        id:
          $(el)
            .find("p.name > a")
            .attr("href")
            ?.split("/")[1]
            .split("-episode-")[0] || "",
        episode: $(el).find("p.episode").text().replace("Episode ", "").trim(),
        episode_id: $(el).find("p.name > a").attr("href")?.split("/")[1] || "",
        subOrdub:
          $(el).find("div > a > div").attr("class")?.replace("type ic-", "") ||
          "",
        image_url: $(el).find("div > a > img").attr("src") || "",
      });
    });
    return list;
  } catch (err: any) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      };
    }
    throw err;
  }
};

const dllink = async (id: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/${id}`);
    const body = await res.data;
    const data: any = {};
    const $ = load(body);
    $("div#wrapper_bg").each((_index, element) => {
      const $element = $(element);
      const id = $element
        .find("div.anime_video_body div.anime_video_body_cate div.anime-info a")
        .attr("href")
        ?.split("/")[2];
      const episode = $element
        .find("div.anime_name div.title_name h2")
        .text()
        .trim()
        .split("Episode ")[1]
        .split(" ")[0];
      const download = $element
        .find(
          "div.anime_video_body div.anime_video_body_cate div.favorites_book ul li a"
        )
        .attr("href");

      data.id = id;
      data.episode = episode;
      data.download = download;
    });
    return data;
  } catch (err: any) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      };
    }
    throw err;
  }
};

const animeInfo = async (id: string) => {
  try {
    const genres: string[] = [];
    const { data } = await axios.get(`${BASE_URL}category/${id}`);
    const $ = load(data);
    const animeTitle = $("div.anime_info_body_bg > h1").text();
    const animeImage = $("div.anime_info_body_bg > img").attr("src");
    const type = $("div.anime_info_body_bg > p:nth-child(4) > a").text();
    const desc = $("div.anime_info_body_bg > .description")
      .text()
      .replace("Plot Summary: ", "");
    const releasedDate = $("div.anime_info_body_bg > p:nth-child(8)")
      .text()
      .replace("Released: ", "");
    const status = $("div.anime_info_body_bg > p:nth-child(9) > a").text();
    const otherName = $("div.anime_info_body_bg > p:nth-child(10)")
      .text()
      .replace("Other name: ", "")
      .trim();

    $("div.anime_info_body_bg > p:nth-child(7) > a").each((_i, elem) => {
      genres.push($(elem)?.attr("title")?.trim() as string);
    });
    const ep_end = $("#episode_page > li").last().find("a").attr("ep_end");

    return {
      title: animeTitle.toString(),
      id,
      season: type.toString().replace("Anime", ""),
      released: releasedDate.toString(),
      status: status.toString(),
      genres,
      otherNames: otherName.split(","),
      synopsis: desc.toString(),
      image_url: animeImage?.toString() ?? "",
      totalEpisodes: ep_end,
    };
  } catch (err: any) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      };
    }
    throw err;
  }
};

const getEplist = async (id: string) => {
  try {
    const epList: Episode[] = [];
    const pgeplist = await axios.get(`${BASE_URL}category/${id}`);
    const $ = load(pgeplist.data);
    const animeTitle = $("div.anime_info_body_bg > h1").text();
    const ep_start = $("#episode_page > li").first().find("a").attr("ep_start");
    const ep_end = $("#episode_page > li").last().find("a").attr("ep_end");
    const movie_id = $("#movie_id").attr("value");
    const alias = $("#alias_anime").attr("value");
    const html = await axios.get(
      `${list_episodes_url}?ep_start=${ep_start}&ep_end=${ep_end}&id=${movie_id}&default_ep=${0}&alias=${alias}`
    );
    const $$ = load(html.data);
    $$("#episode_related > li").each((_i, el) => {
      const href = $(el).find("a").attr("href");
      if (href) {
        const episodeNumber = href.split("/")[1].split("-episode-")[1];
        epList.push({
          title: `${animeTitle} Episode ${episodeNumber}`,
          id: $(el).find("a").attr("href")?.split("/")[1] ?? "",
          episode: parseInt(episodeNumber),
        });
      }
    });
    return {
      title: animeTitle,
      id,
      totalEpisodes: ep_end,
      episodes: epList,
    };
  } catch (err: any) {
    if (err.response) {
      return {
        code: err.response.status,
        message: httpStatus[`${err.response.status}_MESSAGE`] || err.message,
      };
    }

    throw err;
  }
};

const getStream = async (id: string, ep: string) => {
  try {
    const data = (await extract(`${id}-episode-${ep}`)) as any;
    return data;
  } catch (error: any) {
    if (error.response) {
      return {
        code: error.response.status || 500,
        message: error.message,
      };
    }
    throw error;
  }
};

const getDownloadLinks = async (id: string) => {
  try {
    let res = {
      downloadLink: "",
      raw: [],
    };
    let resol = {};
    const { data } = await axios.get(`${BASE_URL}${id}`, {
      headers: {
        Cookie: `auth=${await getGogoCookie()}`,
      },
    });

    const $ = load(data);
    $("div#wrapper_bg").each((_index, element) => {
      const $element = $(element);
      const download = $element
        .find(
          "div.anime_video_body div.anime_video_body_cate div.favorites_book ul li a"
        )
        .attr("href");
      res.downloadLink = download;
    });
    console.log(res.downloadLink)
    const links = $("div.cf-download").find("a");
    links.each((i, link) => {
      const a = $(link);
      resol[a.text().trim()] = a.attr("href").trim();
    });

    res.raw = Object.entries(resol).map(([resolution, url]) => ({
      url,
      resolution,
    }));

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  animeInfo,
  season,
  topair,
  getEplist,
  recentReleaseEpisodesType,
  dllink,
  newSeasons,
  movies,
  popular,
  search,
  genres,
  getStream,
  getDownloadLinks,
};
