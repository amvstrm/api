// SCRAPE CODE by riimuru/gogoanime and ChrisMichaelPerezSantiago/gogoanime (REWORKED)

import axios from "axios";
import { load } from "cheerio";

import {
  generateEncryptedAjaxParams,
  decryptAjaxData,
} from "../stream/gogo.js";

const BASE_URL = "https://www1.gogoanime.bid/";
const ajax_url = "https://ajax.gogo-load.com/";
const popular_ongoing_url = `${ajax_url}ajax/page-recent-release-ongoing.html`;
const recent_release_url = `${ajax_url}ajax/page-recent-release.html`;
const list_episodes_url = `${ajax_url}ajax/load-list-episode`;

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36";

const ongoingSeries = async () => {
  const res = await axios.get(`${BASE_URL}`);
  const body = await res.data;
  const $ = load(body);
  const promises = [];

  $("div.main_body div.series nav.menu_series ul li").each((index, element) => {
    const $element = $(element);
    const id = $element.find("a").attr("href").split("/")[2];
    const title = $element.find("a").text().trim();
    promises.push({
      title: title ? title : null,
      id: id ? id : null,
    });
  });
  return await Promise.all(promises);
};

const topaired = async ({ list = [], page = 1 }) => {
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
        continue;
      }
      $("div.added_series_body.popular > ul > li").each((i, el) => {
        let genres = [];
        $(el)
          .find("p.genres > a")
          .each((i, el) => {
            genres.push($(el).attr("title"));
          });
        list.push({
          animeId: $(el).find("a:nth-child(1)").attr("href").split("/")[2],
          animeTitle: $(el).find("a:nth-child(1)").attr("title"),
          // eslint-disable-next-line no-useless-escape
          animeImg: $(el)
            .find("a:nth-child(1) > div")
            .attr("style")
            .match("(https?://.*.(?:png|jpg))")[0],
          latestEp: $(el).find("p:nth-child(4) > a").text().trim(),
          animeUrl: BASE_URL + "/" + $(el).find("a:nth-child(1)").attr("href"),
          genres: genres,
        });
      });
      pageNum++;
    }
    return list;
  }
  const popular_page = await axios.get(`
        ${popular_ongoing_url}?page=${page}
        `);
  const $ = load(popular_page.data);
  $("div.added_series_body.popular > ul > li").each((i, el) => {
    let genres = [];
    $(el)
      .find("p.genres > a")
      .each((i, el) => {
        genres.push($(el).attr("title"));
      });
    list.push({
      id: $(el).find("a:nth-child(1)").attr("href").split("/")[2],
      title: $(el).find("a:nth-child(1)").attr("title"),
      // eslint-disable-next-line no-useless-escape
      img: $(el)
        .find("a:nth-child(1) > div")
        .attr("style")
        .match("(https?://.*.(?:png|jpg))")[0],
      latestep: $(el).find("p:nth-child(4) > a").text().trim(),
      genres: genres,
    });
  });
  return list;
};

const topair = async ({ page }) => {
  try {
    const res = await axios.get(`${popular_ongoing_url}?page=${page}`);
    const $ = load(res.data);
    const topAiring = [];

    $("div.added_series_body.popular > ul > li").each((i, el) => {
      topAiring.push({
        id: $(el).find("a:nth-child(1)").attr("href").split("/")[2],
        title: $(el).find("a:nth-child(1)").attr("title"),
        image: $(el)
          .find("a:nth-child(1) > div")
          .attr("style")
          .match("(https?://.*.(?:png|jpg))")[0],
        genres: $(el)
          .find("p.genres > a")
          .map((i, el) => $(el).attr("title"))
          .get(),
      });
    });
    const hasNextPage = $("div.anime_name.comedy > div > div > ul > li")
      .last()
      .hasClass("selected");
    return {
      currentPage: page,
      hasNextPage: hasNextPage,
      results: topAiring,
    };
  } catch (err) {
    throw new Error("Something went wrong. Please try again later.");
  }
};

const search = async (query) => {
  const res = await axios.get(`${BASE_URL}/search.html?keyword=${query}`);
  const body = await res.data;
  const $ = load(body);
  const promises = [];

  $("div.main_body div.last_episodes ul.items li").each((index, element) => {
    const $element = $(element);
    //find id then trim /category/
    const id = $element.find("a").attr("href").split("/")[2];
    const title = $element.find("a").text().trim();
    const img = $element.find("img").attr("src");
    promises.push({
      title: title ? title : null,
      img: img ? img : null,
      id: id ? id : null,
    });
  });
  return await Promise.all(promises);
};

const genres = async (genre, page) => {
  const res = await axios.get(`${BASE_URL}/genre/${genre}?page=${page}`);
  const body = await res.data;
  const $ = load(body);
  const promises = [];

  $("div.main_body div.last_episodes ul.items li").each((index, element) => {
    const $element = $(element);
    const id = $element.find("a").attr("href").split("/")[2];
    const title = $element.find("a").text().trim();
    const img = $element.find("img").attr("src");
    promises.push({
      title: title ? title : null,
      img: img ? img : null,
      id: id ? id : null,
    });
  });
  return await Promise.all(promises);
};

const alphabetList = async (letter, page) => {
  const res = await axios.get(`${BASE_URL}/anime-list-${letter}?page=${page}`);
  const body = await res.data;
  const $ = load(body);
  const promises = [];

  $("div.main_body div.anime_list_body ul.listing li").each(
    (index, element) => {
      const $element = $(element);
      const id = $element.find("a").attr("href").split("/")[2];
      const title = $element.find("a").text().trim();
      promises.push({
        title: title ? title : null,
        id: id ? id : null,
      });
    }
  );
  return await Promise.all(promises);
};

const newSeasons = async (page) => {
  const res = await axios.get(`${BASE_URL}/new-season.html?page=${page}`);
  const body = await res.data;
  const $ = load(body);
  const promises = [];

  $("div.main_body div.last_episodes ul.items li").each((index, element) => {
    const $element = $(element);
    const id = $element.find("a").attr("href").split("/")[2];
    const title = $element.find("a").text().trim();
    const img = $element.find("img").attr("src");
    promises.push({
      title: title ? title : null,
      img: img ? img : null,
      id: id ? id : null,
    });
  });
  return await Promise.all(promises);
};

const movies = async (page) => {
  const res = await axios.get(`${BASE_URL}/anime-movies.html?page=${page}`);
  const body = await res.data;
  const $ = load(body);
  const data = [];
  $("div.main_body div.last_episodes ul.items li").each((index, element) => {
    const $element = $(element);
    const id = $element.find("a").attr("href").split("/")[2];
    const title = $element.find("a").text().trim();
    const img = $element.find("img").attr("src");
    data.push({
      title: title ? title : null,
      img: img ? img : null,
      id: id ? id : null,
    });
  });

  return await Promise.all(data);
};

const popular = async (page) => {
  const res = await axios.get(`${BASE_URL}/popular.html?page=${page}`);
  const body = await res.data;
  const $ = load(body);
  const promises = [];

  $("div.main_body div.last_episodes ul.items li").each((index, element) => {
    const $element = $(element);
    const id = $element.find("a").attr("href").split("/")[2];
    const title = $element.find("a").text().trim();
    const img = $element.find("img").attr("src");
    promises.push({
      title: title ? title : null,
      img: img ? img : null,
      id: id ? id : null,
    });
  });
  return await Promise.all(promises);
};

const recentlyAddedSeries = async () => {
  const res = await axios.get(`${BASE_URL}`);
  const body = await res.data;
  const $ = load(body);
  const promises = [];

  $("div.main_body.none div.added_series_body ul.listing li").each(
    (index, element) => {
      const $element = $(element);
      const id = $element.find("a").attr("href").split("/")[2];
      const title = $element.find("a").text().trim();
      promises.push({
        title: title ? title : null,
        id: id ? id : null,
      });
    }
  );
  return await Promise.all(promises);
};

const recentReleaseEpisodesType = async (page, type) => {
  try {
    const mainPage = await axios.get(`
        ${recent_release_url}?page=${page}&type=${type}
        `);
    const $ = load(mainPage.data);
    const list = [];
    $("div.last_episodes.loaddub > ul > li").each((i, el) => {
      list.push({
        episode_id: $(el).find("p.name > a").attr("href").split("/")[1],
        title: $(el).find("p.name > a").attr("title"),
        subOrDub: $(el)
          .find("div > a > div")
          .attr("class")
          .replace("type ic-", ""),
        episode: $(el).find("p.episode").text().replace("Episode ", "").trim(),
        img: $(el).find("div > a > img").attr("src"),
      });
    });
    return list;
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

const dllink = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  const body = await res.data;
  const $ = load(body);
  const promises = [];
  $("div#wrapper_bg").each((index, element) => {
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
    promises.push({
      id: id ? id : null,
      episode: episode ? episode : null,
      download: download ? download : null,
    });
  });
  return await Promise.all(promises);
};

const animeInfo = async (id) => {
  const res = await axios.get(`${BASE_URL}category/${id}`);
  const body = await res.data;
  const $ = load(body);
  var rating = "XXX";
  var mal_url = "http://myanimelist.net";
  const promises = [];
  $("div#wrapper_bg").each((index, element) => {
    const $element = $(element);
    const img = $element.find("div.anime_info_body_bg img").attr("src");
    const synopsis = $element
      .find("div.anime_info_body_bg p.type")
      .eq(1)
      .text()
      .replace("Plot Summary:", "")
      .trim();
    const title = $element.find("div.anime_info_body_bg h1").text();
    const genres = [];
    $element
      .find("div.anime_info_body_bg p.type")
      .eq(2)
      .find("a")
      .each((j, el) => {
        const $el = $(el);
        const genre = $el.attr("href").split("/")[4];
        genres.push(genre);
      });
    const released = parseInt(
      $element.find("div.anime_info_body_bg p.type").eq(3).text().match(/\d+/g),
      10
    );
    const status = $element
      .find("div.anime_info_body_bg p.type")
      .eq(4)
      .text()
      .replace("Status:", "")
      .trim();
    const otherName = $element
      .find("div.anime_info_body_bg p.type")
      .eq(5)
      .text()
      .replace("Other name:", "")
      .trim();
    const liTotal = $("div.anime_video_body ul#episode_page li").length;
    var totalEpisodes = parseInt(
      $("div.anime_video_body ul#episode_page li")
        .eq(liTotal - 1)
        .find("a")
        .text()
        .split("-")[1],
      10
    );
    if (!totalEpisodes) {
      totalEpisodes = parseInt(
        $("div.anime_video_body ul#episode_page li")
          .eq(liTotal - 1)
          .find("a")
          .text(),
        10
      );
    }
    // let episodes = Array.from({ length: totalEpisodes }, (v, k) => {
    //   const animeId = `${id}-episode-${k + 1}`;
    //   return {
    //     id: animeId
    //   }
    // });
    const pushh = {
      anime_id: id,
      title: title,
      img: img,
      synopsis: synopsis,
      genres: genres,
      released: released,
      status: status,
      rating: rating,
      otherName: otherName,
      totalEpisodes: totalEpisodes,
      mal_url: mal_url,
      // episodes: episodes
    };
    promises.push(pushh);
  });
  return await Promise.all(promises);
};

const getIframe = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  const body = await res.data;
  const $ = load(body);
  const promises = [];
  $("div#wrapper_bg").each((index, element) => {
    const $element = $(element);
    const servers = [];
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
    $element.find("div.anime_muti_link ul li").each((j, el) => {
      const $el = $(el);
      const name = $el
        .find("a")
        .text()
        .substring(0, $el.find("a").text().lastIndexOf("C"))
        .trim();
      let iframe = $el.find("a").attr("data-video");
      if (iframe.startsWith("//")) {
        iframe = $el.find("a").attr("data-video").slice(2);
        if (iframe.indexOf("goload.pro") !== -1) {
          iframe = `https://${iframe}`;
        }
      }
      servers.push({
        name: name,
        iframe: iframe,
      });
    });
    const pushh = {
      servers: servers,
      id: id,
      episode: episode,
    };
    promises.push(pushh);
  });
  return await Promise.all(promises);
};

const getHls = async ({ id }) => {
  try {
    let sources = [];
    let sources_bk = [];
    let epPage, server, $, serverUrl;
    epPage = await axios.get(`${BASE_URL}` + id);
    $ = load(epPage.data);
    
    server = $("#load_anime > div > div > iframe").attr("src");
    serverUrl = new URL("https:" + server);
    const goGoServerPage = await axios.get(serverUrl.href, {
      headers: { "User-Agent": USER_AGENT },
    });
    console.log(epPage, server, serverUrl, )
    const $$ = load(goGoServerPage.data);
    const params = await generateEncryptedAjaxParams(
      $$,
      serverUrl.searchParams.get("id")
    );
    const fetchRes = await axios.get(
      `
          ${serverUrl.protocol}//${serverUrl.hostname}/encrypt-ajax.php?${params}`,
      {
        headers: {
          "User-Agent": USER_AGENT,
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );
    const res = decryptEncryptAjaxResponse(fetchRes.data);
    if (!res.source)
      return { error: "No sources found!! Try different source." };
    res.source.forEach((source) => sources.push(source));
    res.source_bk.forEach((source) => sources_bk.push(source));
    return { sources, sources_bk, serverUrl };
  } catch (err) {
    return { error: "hls sources not available" };
  }
};

const getEplist = async (id) => {
  let epList = [];
  const animePageTest = await axios.get(`https://www1.gogoanime.bid/category/${id}`);
  const $ = load(animePageTest.data);
  const animeTitle = $("div.anime_info_body_bg > h1").text();
  const ep_start = $("#episode_page > li").first().find("a").attr("ep_start");
  const ep_end = $("#episode_page > li").last().find("a").attr("ep_end");
  const movie_id = $("#movie_id").attr("value");
  const alias = $("#alias_anime").attr("value");
  const html = await axios.get(
    `${list_episodes_url}?ep_start=${ep_start}&ep_end=${ep_end}&id=${movie_id}&default_ep=${0}&alias=${alias}`
  );
  const $$ = load(html.data);
  $$("#episode_related > li").each((i, el) => {
    epList.push({
      id: $(el).find("a").attr("href").split("/")[1],
    });
  });
  return {
    title: animeTitle,
    id: id,
    totalEpisodes: ep_end,
    episodes: epList,
  };
};

export default {
  animeInfo,
  topaired,
  topair,
  getHls,
  getIframe,
  getEplist,
  recentReleaseEpisodesType,
  dllink,
  recentlyAddedSeries,
  ongoingSeries,
  alphabetList,
  newSeasons,
  movies,
  popular,
  search,
  genres,
};
