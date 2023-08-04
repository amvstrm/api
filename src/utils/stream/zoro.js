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
  const subOrDub = episodeId.split("$")?.pop() === "dub" ? "dub" : "sub";
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

export const rapidExtract = async (videoLink) => {
  const videoUrl = new URL(videoLink);
  const fallbackKey = "c1d17096f2ca11b7";
  const host = "https://rapid-cloud.co";

  const result = {
    sources: [],
    meta: {},
    subtitles: [],
  };

  let res = null;

  const id = videoUrl.href.split("/").pop()?.split("?")[0];
  const options = {
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  };

  res = await axios.get(
    `https://${videoUrl.hostname}/embed-2/ajax/e-1/getSources?id=${id}`,
    options
  );

  let {
    data: { sources, tracks, intro, encrypted },
  } = res;

  let decryptKey = await (
    await axios.get("https://github.com/enimax-anime/key/blob/e6/key.txt")
  ).data;

  decryptKey = substringBefore(
    substringAfter(decryptKey, '"blob-code blob-code-inner js-file-line">'),
    "</td>"
  );

  if (!decryptKey) {
    decryptKey = await (
      await axios.get(
        "https://raw.githubusercontent.com/enimax-anime/key/e6/key.txt"
      )
    ).data;
  }

  if (!decryptKey) decryptKey = fallbackKey;

  try {
    if (encrypted) {
      const sourcesArray = sources.split("");
      let extractedKey = "";

      for (const index of decryptKey) {
        for (let i = index[0]; i < index[1]; i++) {
          extractedKey += sources[i];
          sourcesArray[i] = "";
        }
      }

      decryptKey = extractedKey;
      sources = sourcesArray.join("");
      const decrypt = CryptoJS.AES.decrypt(sources, decryptKey);
      sources = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
    }
  } catch (err) {
    return err;
  }
  sources = sources?.map((s) => ({
    url: s.file,
    isM3U8: s.file.includes(".m3u8"),
  }));

  result.sources.push(...sources);

  if (videoUrl.href.includes(new URL(host).host)) {
    result.sources = [];
    sources = [];
    for (const source of sources) {
      const { data } = await client.get(source.file, options);
      const m3u8data = data
        .split("\n")
        .filter(
          (line) => line.includes(".m3u8") && line.includes("RESOLUTION=")
        );

      const secondHalf = m3u8data.map((line) =>
        line.match(/RESOLUTION=.*,(C)|URI=.*/g)?.map((s) => s.split("=")[1])
      );

      const TdArray = secondHalf.map((s) => {
        const f1 = s[0].split(",C")[0];
        const f2 = s[1].replace(/"/g, "");

        return [f1, f2];
      });
      for (const [f1, f2] of TdArray) {
        sources.push({
          url: `${source.file?.split("master.m3u8")[0]}${f2.replace(
            "iframes",
            "index"
          )}`,
          quality: f1.split("x")[1] + "p",
          isM3U8: f2.includes(".m3u8"),
        });
      }
      result.sources.push(...sources);
    }
    if (intro.end > 1) {
      result.intro = {
        start: intro.start,
        end: intro.end,
      };
    }
  }

  result.subtitles = res.data.tracks
    .filter((track) => track.kind === "captions")
    .map((subtitle) => {
      return {
        file: subtitle.file,
        label: subtitle.label,
      };
    });

  result.meta = {
    intro: res.data.intro || null,
    outro: res.data.outro || null,
    thumbnails: res.data.tracks.find((track) => track.kind === "thumbnails")
      .file,
  };
  return result;
};

export default {
  rapidExtract,
};
