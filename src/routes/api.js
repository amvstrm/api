import { Router } from "express";
// import Redis from "ioredis";
import apicache from "apicache-plus";
import dotenv from "dotenv";

import api from "../utils/scraper/gogo.js";

const router = Router();
dotenv.config();

// const cache = apicache.middleware;

// IF YOU HAVE REDIS DB YOU CAN USE IT TO CACHE THE DATA
// const redisClient = createClient({
//   host: process.env.REDIS_URL,
//   port: process.env.REDIS_PORT,
//   password: process.env.REDIS_PASSWORD,
//   legacyMode: true
// });

const cache = apicache.options({
  statusCodes: {
    exclude: [400, 401, 404, 500, 503],
    include: [200, 201, 300, 301, 302, 304],
  },
  afterHit: (req, res) => {
    console.log('HIT');
  },
})

router.get("/search/:query", cache("5 minutes"), (req, res) => {
  const query = req.params.query;
  api
    .search(query)
    .then((search) => {
      res.status(200).json({
        search,
      });
    })
    .catch(() => {
      res.status(404).json({
        error: "Not Found",
      });
    });
});

router.get("/topairing", cache("30 minutes"), async (req, res) => {
  const page = req.query.p;
  await api.topair({ page: page }).then((topairing) => {
    res.status(200).json({
      topairing,
    });
  });
});

router.get("/search", cache("5 minutes"), (req, res) => {
  const query = req.query.q;
  api
    .search(query)
    .then((search) => {
      res.status(200).json({
        search,
      });
    })
    .catch(() => {
      res.status(404).json({
        error: "Not Found",
      });
    });
});

router.get("/anime/episode/:id", cache("24 hours"), async (req, res) => {
  const id = req.params.id;
  await api
    .animeEpisodeHandler(id)
    .then((anime) => {
      res.status(200).json({
        anime: anime[0],
      });
    })
    .catch(() => {
      res.status(404).json({
        error: "Episode Not Found",
      });
    });
});

router.get("/decodeurl/:id", async (req, res) => {
  const id = req.params.id;
  await api
    .getHls({ id: id })
    .then((hls) => {
      res.status(200).json({
        hls,
      });
    })
    .catch(() => {
      res.status(404).json({
        error: "Not Found",
      });
    });
});

router.get("/stream/play", async (req, res) => {
  const id = req.query.id;
  try {
    const hls = await api.getHls({ id: id });
    var stream = hls.sources[0].file;
    if (stream.includes("storage.googleapis.com")) {
      if (hls.sources_bk.length > 0) {
        stream = hls.sources_bk[0].file;
      }
    }
    res.status(200).json({
      url: `https://plyr.link/p/player.html#${base64encode(stream)}`,
      nspl_url: `https://player.nscdn.ml/player.html?p=${base64encode(
        "&file=" + stream
      )}`,
      id: id.split("-episode-")[0],
      episode: id.split("-episode-")[1],
    });
  } catch (error) {
    res.status(404).json({
      error: "Not Found",
    });
  }
});

router.get("/stream/iframe/:id", async (req, res) => {
  const id = req.params.id;
  await api
    .getIframe(id)
    .then((iframe) => {
      res.status(200).json(iframe[0]);
    })
    .catch(() => {
      res.status(404).json({
        error: "Not Found",
      });
    });
});

router.get("/anime/info/:id", cache("1 day"), (req, res) => {
  const id = req.params.id;
  api
    .animeInfo(id)
    .then((anime) => {
      res.status(200).json(anime[0]);
    })
    .catch((err) => {
      res.status(404).json({
        error: "Anime Not Found",
        message: err,
      });
    });
});

router.get("/anime/episodelist/:id", cache("30 minutes"), async (req, res) => {
  const id = req.params.id;
  await api.getEplist(id).then((episodes) => {
    res.status(200).json(episodes);
  });
});

router.get("/download/:id", (req, res) => {
  const id = req.params.id;
  api
    .dllink(id)
    .then((anime) => {
      res.redirect(anime[0].download);
    })
    .catch(() => {
      res.status(404).json({
        error: "Episode Not Found",
      });
    });
});

router.get("/recentrelease/:page", cache("10 minutes"), (req, res) => {
  const page = parseInt(req.params.page, 10);
  api
    .recentReleaseEpisodesType(page, 1)
    .then((anime) => {
      res.status(200).json({
        anime,
      });
    })
    .catch(() => {
      res.status(404).json({
        error: "Not Found",
      });
    });
});

router.get("/recentrelease/all/:page", cache("10 minutes"), (req, res) => {
  const page = parseInt(req.params.page, 10);
  api
    .recentReleaseEpisodesType(page, 4)
    .then((anime) => {
      res.status(200).json({
        anime,
      });
    })
    .catch(() => {
      res.status(404).json({
        error: "Not Found",
      });
    });
});

router.get("/recentrelease/cn/:page", cache("10 minutes"), (req, res) => {
  const page = parseInt(req.params.page, 10);
  api
    .recentReleaseEpisodesType(page, 3)
    .then((anime) => {
      res.status(200).json({
        anime,
      });
    })
    .catch(() => {
      res.status(404).json({
        error: "Not Found",
      });
    });
});

router.get(
  "/recentrelease/dub/:page",
  cache("10 minutes"),
  async (req, res) => {
    const page = parseInt(req.params.page, 10);
    await api
      .recentReleaseEpisodesType(page, 2)
      .then((anime) => {
        res.status(200).json({
          anime,
        });
      })
      .catch(() => {
        res.status(404).json({
          error: "Not Found",
        });
      });
  }
);

router.get("/recentseries", cache("10 minutes"), (req, res) => {
  api
    .recentlyAddedSeries()
    .then((anime) => {
      res.status(200).json({
        anime,
      });
    })
    .catch(() => {
      res.status(404).json({
        error: "Not Found",
      });
    });
});

router.get("/ongoing", cache("1 hour"), (req, res) => {
  api
    .ongoingSeries()
    .then((anime) => {
      res.status(200).json({
        anime,
      });
    })
    .catch(() => {
      res.status(404).json({
        error: "Not Found",
      });
    });
});

router.get("/alphabet/:letter/:page", cache("4 hour"), (req, res) => {
  const letter = req.params.letter.toUpperCase();
  const page = parseInt(req.params.page, 10);
  api
    .alphabetList(letter, page)
    .then((anime) => {
      res.status(200).json({
        anime,
      });
    })
    .catch(() => {
      res.status(404).json({
        error: "Not Found",
      });
    });
});

router.get("/newseasons/:page", cache("1 hour"), (req, res) => {
  const page = parseInt(req.params.page, 10);
  api
    .newSeasons(page)
    .then((anime) => {
      res.status(200).json({
        anime,
      });
    })
    .catch(() => {
      res.status(404).json({
        error: "Not Found",
      });
    });
});

router.get("/movies/:page", cache("2 days"), (req, res) => {
  const page = parseInt(req.params.page, 10);
  api
    .movies(page)
    .then((movies) => {
      res.status(200).json({
        movies,
      });
    })
    .catch(() => {
      res.status(404).json({
        error: "Not Found",
      });
    });
});

router.get("/popular/:page", cache("7 days"), (req, res) => {
  const page = parseInt(req.params.page, 10);
  api.popular(page).then((popular) => {
    res.status(200).json({
      popular,
    });
  });
});

router.get("/genre/:genre/:page", cache("4 hours"), (req, res) => {
  const genre = req.params.genre;
  const page = parseInt(req.params.page, 10);
  api
    .genres(genre, page)
    .then((anime) => {
      res.status(200).json({
        anime,
      });
    })
    .catch(() => {
      res.status(404).json({
        error: "Not Found",
      });
    });
});

export default router;
