/* eslint-disable no-shadow */
/* eslint-disable no-await-in-loop */
// SCRAPE CODE by riimuru/gogoanime and ChrisMichaelPerezSantiago/gogoanime (REWORKED)

import axios from "axios";
import { load } from "cheerio";

import { extract } from "../utils/stream/gogo.js";
import httpStatus from "http-status";

const BASE_URL = "https://anitaku.to/";
const ajax_url = "https://ajax.gogo-load.com/";
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

const season = async (season, page = 1) => {
  try {
    const list = [];
    const season_page = await axios.get(
      `${BASE_URL}sub-category/${season}?page=${page}`
    );
    const $ = load(season_page.data);

    $("div.last_episodes > ul > li").each((i, el) => {
      list.push({
        title: $(el).find("div > a").attr("title"),
        id: $(el).find("div > a").attr("href").split("/")[2],
        image_url: $(el).find("div > a > img").attr("src"),
        released: $(el)
          .find("p.released")
          .text()
          .replace("Released: ", "")
          .trim(),
      });
    });
    return list;
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

const topair = async (page) => {
  try {
    const list = [];
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
          const genres = [];
          $(el)
            .find("p.genres > a")
            .each((_i, el) => {
              genres.push($(el).attr("title"));
            });
          list.push({
            title: $(el).find("a:nth-child(1)").attr("title"),
            id: $(el).find("a:nth-child(1)").attr("href").split("/")[2],
            image_url: $(el)
              .find("a:nth-child(1) > div")
              .attr("style")
              .match("(https?://.*.(?:png|jpg))")[0],
            latestEp: $(el).find("p:nth-child(4) > a").text().trim(),
            genres,
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
      const genres = [];
      $(el)
        .find("p.genres > a")
        .each((_i, el) => {
          genres.push($(el).attr("title"));
        });
      list.push({
        title: $(el).find("a:nth-child(1)").attr("title"),
        id: $(el).find("a:nth-child(1)").attr("href").split("/")[2],
        image_url: $(el)
          .find("a:nth-child(1) > div")
          .attr("style")
          .match("(https?://.*.(?:png|jpg))")[0],
        latestEp: $(el).find("p:nth-child(4) > a").text().trim(),
        genres,
      });
    });

    return list;
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

const search = async (query, page = 1) => {
  try {
    const list = [];
    const searchPage = await axios.get(
      `${BASE_URL}search.html?keyword=${query}&page=${page}`
    );
    const $ = load(searchPage.data);

    $("div.last_episodes > ul > li").each((_i, el) => {
      list.push({
        title: $(el).find("p.name > a").attr("title"),
        id: $(el).find("p.name > a").attr("href").split("/")[2],
        image_url: $(el).find("div > a > img").attr("src"),
        status: $(el)
          .find("p.released")
          .text()
          .trim()
          .replace("Released: ", ""),
      });
    });
    return list;
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

const genres = async (genre, page) => {
  const list = [];
  try {
    genre = genre.trim().replace(/ /g, "-").toLowerCase();
    if (genres_list.indexOf(genre) > -1) {
      const grepg = await axios.get(`${BASE_URL}genre/${genre}?page=${page}`);
      const $ = load(grepg.data);

      $("div.last_episodes > ul > li").each((i, elem) => {
        list.push({
          id: $(elem).find("p.name > a").attr("href").split("/")[2],
          title: $(elem).find("p.name > a").attr("title"),
          image_url: $(elem).find("div > a > img").attr("src"),
          released: $(elem)
            .find("p.released")
            .text()
            .replace("Released: ", "")
            .trim(),
        });
      });
      return list;
    }
    return {
      code: 404,
      message: "Genre not found",
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

const newSeasons = async (page) => {
  try {
    const list = [];
    const newsspg = await axios.get(`
    ${BASE_URL}new-season.html?page=${page}
    `);
    const $ = load(newsspg.data);
    $("div.last_episodes > ul > li").each((i, el) => {
      list.push({
        title: $(el).find("p.name > a").attr("title"),
        id: $(el).find("p.name > a").attr("href").split("/")[2],
        image_url: $(el).find("div > a > img").attr("src"),
        released: $(el)
          .find("p.released")
          .text()
          .replace("Released: ", "")
          .trim(),
      });
    });
    return list;
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

const movies = async (aphab, page) => {
  try {
    const list = [];
    const moviepg = await axios.get(`
    ${BASE_URL}/anime-movies.html?aph=&page=${page}
    `);
    const $ = load(moviepg.data);

    $("div.last_episodes > ul > li").each((i, el) => {
      list.push({
        title: $(el).find("p.name > a").attr("title"),
        id: $(el).find("p.name > a").attr("href").split("/")[2],
        image_url: $(el).find("div > a > img").attr("src"),
        released: $(el)
          .find("p.released")
          .text()
          .replace("Released: ", "")
          .trim(),
      });
    });
    return list;
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

const popular = async (page) => {
  try {
    const list = [];
    const popularpg = await axios.get(`
    ${BASE_URL}/popular.html?page=${page}
   `);
    const $ = load(popularpg.data);

    $("div.last_episodes > ul > li").each((i, el) => {
      list.push({
        title: $(el).find("p.name > a").attr("title"),
        id: $(el).find("p.name > a").attr("href").split("/")[2],
        image_url: $(el).find("div > a > img").attr("src"),
        released: $(el)
          .find("p.released")
          .text()
          .replace("Released: ", "")
          .trim(),
      });
    });
    return list;
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

const recentReleaseEpisodesType = async (page, type) => {
  try {
    const list = [];
    const recntpage = await axios.get(`
    ${recent_release_url}?page=${page}&type=${type}
    `);
    const $ = load(recntpage.data);

    $("div.last_episodes.loaddub > ul > li").each((i, el) => {
      list.push({
        title: $(el).find("p.name > a").attr("title"),
        id: $(el)
          .find("p.name > a")
          .attr("href")
          .split("/")[1]
          .split("-episode-")[0],
        episode: $(el).find("p.episode").text().replace("Episode ", "").trim(),
        episode_id: $(el).find("p.name > a").attr("href").split("/")[1],
        subOrdub: $(el)
          .find("div > a > div")
          .attr("class")
          .replace("type ic-", ""),
        image_url: $(el).find("div > a > img").attr("src"),
      });
    });
    return list;
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

const dllink = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/${id}`);
    const body = await res.data;
    const data = {};
    const $ = load(body);
    $("div#wrapper_bg").each((_index, element) => {
      const $element = $(element);
      const id = $element
        .find("div.anime_video_body div.anime_video_body_cate div.anime-info a")
        .attr("href")
        .split("/")[2];
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

      data.id = id || null;
      data.episode = episode || null;
      data.download = download || null;
    });
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

const animeInfo = async (id) => {
  try {
    const genres = [];
    const { data } = await axios.get(`${BASE_URL}category/${id}`);
    const $ = load(data);
    const animeTitle = $("div.anime_info_body_bg > h1").text();
    const animeImage = $("div.anime_info_body_bg > img").attr("src");
    const type = $("div.anime_info_body_bg > p:nth-child(4) > a").text();
    const desc = $("div.anime_info_body_bg > p:nth-child(5)")
      .text()
      .replace("Plot Summary: ", "");
    const releasedDate = $("div.anime_info_body_bg > p:nth-child(7)")
      .text()
      .replace("Released: ", "");
    const status = $("div.anime_info_body_bg > p:nth-child(8) > a").text();
    const otherName = $("div.anime_info_body_bg > p:nth-child(9)")
      .text()
      .replace("Other name: ", "")
      .replace(/;/g, ",");

    $("div.anime_info_body_bg > p:nth-child(6) > a").each((_i, elem) => {
      genres.push($(elem).attr("title").trim());
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
      image_url: animeImage.toString(),
      totalEpisodes: ep_end,
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

const getStreamHLS = async (id) => {
  try {
    const data = await extract(id);
    return data;
  } catch (error) {
    if (error.response) {
      return {
        code: error.response.status || 500,
        message: error.message,
      };
    }
    throw error;
  }
};

const getEplist = async (id) => {
  try {
    const epList = [];
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
      epList.push({
        title: `${animeTitle} Episode ${
          $(el).find("a").attr("href").split("/")[1].split("-episode-")[1]
        }`,
        id: $(el).find("a").attr("href").split("/")[1],
      });
    });
    return {
      title: animeTitle,
      id,
      totalEpisodes: ep_end,
      episodes: epList,
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

export default {
  animeInfo,
  season,
  topair,
  getStreamHLS,
  getEplist,
  recentReleaseEpisodesType,
  dllink,
  // recentlyAddedSeries,
  // ongoingSeries,
  // alphabetList,
  newSeasons,
  movies,
  popular,
  search,
  genres,
};
