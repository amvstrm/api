// CODE FROM CONSUMET.TS WITH MODIFICATION CHANGES
// THE MODULE DID NOT WORK ON THIS CODE EVEN SELF-HOSTED, SO I DECIDED TO REWRITE IT

import CryptoJS from "crypto-js";
import axios from "axios";
import { load } from "cheerio";

const baseUrl = "https://aniwatch.to";

const substringAfter = (str, toFind) => {
  const index = str.indexOf(toFind);
  return index == -1 ? "" : str.substring(index + toFind.length);
};

const substringBefore = (str, toFind) => {
  const index = str.indexOf(toFind);
  return index == -1 ? "" : str.substring(0, index);
};

const retrieveServerId = ($, index, subOrDub) => {
  return $(
    `div.ps_-block.ps_-block-sub.servers-${subOrDub} > div.ps__-list > div`
  )
    .map((i, el) => ($(el).attr("data-server-id") == `${index}` ? $(el) : null))
    .get()[0]
    .attr("data-id");
};

export const get_stream = async (episodeId, server = "vidcloud") => {
  if (!episodeId.includes("$episode$")) throw new Error("Invalid episode id");
  const subOrDub = episodeId.split("$").pop() === "dub" ? "dub" : "sub";
  episodeId = `${baseUrl}/watch/${episodeId
    .replace("$episode$", "?ep=")
    .replace(/\$auto|\$sub|\$dub/gi, "")}`;
  try {
    const { data } = await axios.get(
      `${baseUrl}/ajax/v2/episode/servers?episodeId=${
        episodeId.split("?ep=")[1]
      }`
    );

    const $ = load(data.html);

    let serverId = "";
    serverId = retrieveServerId($, 1, subOrDub);
    if (!serverId) throw new Error("RapidCloud not found");

    const { data: link } = await axios.get(
      `${baseUrl}/ajax/v2/episode/sources?id=${serverId}`
    );
    return await rapidExtract(link.link);
  } catch (err) {
    throw err;
  }
};

export const extractVidCloud = async (url, result) => {
  const host = "https://megacloud.tv";
  const id = url.split("/").pop().split("?")[0];

  const request = await fetch(`${host}/embed-2/ajax/e-1/getSources?id=${id}`, {
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  const reqData = await request.json();
  const { tracks, intro, outro } = reqData;
  let { sources } = reqData;

  const decryptKey = (await (await fetch("https://zoro.anify.tv/key/6")).json())
    .key;
  const encryptedURLTemp = sources.split("");

  let key = "";

  for (const index of JSON.parse(decryptKey)) {
    for (let i = Number(index[0]); i < Number(index[1]); i++) {
      key += encryptedURLTemp[i];
      encryptedURLTemp[i] = "";
    }
  }

  sources = encryptedURLTemp.filter((x) => x !== "").join("");

  try {
    sources = JSON.parse(
      CryptoJS.AES.decrypt(sources, key).toString(CryptoJS.enc.Utf8)
    );
  } catch (e) {
    console.error(e);
    sources = "";
  }

  if (!sources || sources === "") {
    return result;
  }

  for (const source of sources) {
    if (source.type === "hls") {
      const data = await (await fetch(source.file)).text();

      const resolutions = data.match(/(RESOLUTION=)(.*)(\s*?)(\s*.*)/g);

      resolutions?.forEach((res) => {
        const index = source.file.lastIndexOf("/");
        const quality = res.split("\n")[0].split("x")[1].split(",")[0];
        const url = source.file.slice(0, index);

        result.sources.push({
          url: url + "/" + res.split("\n")[1],
          quality: quality + "p",
        });
      });
    }

    if (intro.end > 1) {
      result.intro = {
        start: intro.start,
        end: intro.end,
      };
    }
    if (outro.end > 1) {
      result.outro = {
        start: outro.start,
        end: outro.end,
      };
    }
  }

  result.sources.push({
    url: sources[0].file,
    quality: "auto",
  });

  result.subtitles = tracks?.map((s) => ({
    url: s.file,
    lang: s.label ? s.label : "Thumbnails",
  }));

  return result;
};

export default {
  rapidExtract,
};
