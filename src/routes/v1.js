import { Router } from "express";
import v1 from "../module/v1.js";

const router = Router();

router.get("/info/:id", async (req, res, next) => {
  try {
    const data = await v1.animeInfo(req.params.id);
    if (data.error) {
      next(data.error);
    } else {
      res.status(200).json({ code: 200, message: "", ...data });
    }
  } catch (error) {
    next(error);
  }
});

// Route to search
router.get("/search", async (req, res, next) => {
  try {
    const data = await v1.search(req.query.q, req.query.p);
    if (data.error) {
      next(data.error);
    }
    res.status(200).json({ code: 200, message: "", results: data });
  } catch (error) {
    next(error);
  }
});

// Route to get episode info for a specific ID
router.get("/episode/:id", async (req, res, next) => {
  try {
    const data = await v1.getEplist(req.params.id);
    if (data.error) {
      next(data.error);
    }
    res.status(200).json({ code: 200, message: "", ...data });
  } catch (error) {
    next(error);
  }
});

// Route to get recent episodes of a specific type
router.get("/recentepisode/:type", async (req, res, next) => {
  try {
    const type = req.params.type;
    const data = await v1.recentReleaseEpisodesType(
      req.query.p,
      type == "all" ? 1 : type == "dub" ? 2 : type == "cn" ? 3 : 1
    );
    if (data.error) {
      next(data.error);
    }
    res.status(200).json({ code: 200, message: "", results: data });
  } catch (error) {
    next(error);
  }
});

// Route to get the top air times
router.get("/topair", async (req, res, next) => {
  try {
    const data = await v1.topair(req.query.p || 1);
    if (data.error) {
      next(data.error);
    }
    res.status(200).json({ code: 200, message: "", results: data });
  } catch (error) {
    next(error);
  }
});

// Route to stream a specific ID
router.get("/stream/:id", async (req, res, next) => {
  try {
    const data = await v1.getStreamHLS(req.params.id);
    if (data.error) {
      next(data.error);
    }
    res.status(200).json({ code: 200, message: "", ...data });
  } catch (error) {
    next(error);
  }
});

router.get("/genres", async (req, res, next) => {
  try {
    res.status(200).json({
      genres: [
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
      ],
    });
  } catch (error) {
    next(error);
  }
});

// Route to get genres for a specific ID
router.get("/genres/:id", async (req, res, next) => {
  try {
    const data = await v1.genres(req.params.id, req.query.p || 1);
    if (data.error) {
      next(data.error);
    }
    res.status(200).json({ code: 200, message: "", results: data });
  } catch (error) {
    next(error);
  }
});

// Route to get seasons for a specific ID
router.get("/season/:season/:year", async (req, res, next) => {
  try {
    const { season, year } = req.params;
    const data = await v1.season(`${season}-${year}-anime`, req.query.p || 1);
    if (data.error) {
      next(data.error);
    }
    res.status(200).json({ code: 200, message: "", results: data });
  } catch (error) {
    next(error);
  }
});

// Route to get movies for a specific page
router.get("/movies/:page", async (req, res, next) => {
  try {
    const page = req.params.page;
    const data = await v1.movies(page);
    if (data.error) {
      next(data.error);
    }
    res.status(200).json({ code: 200, message: "", results: data });
  } catch (error) {
    next(error);
  }
});

// Route to get popular movies for a specific page
router.get("/popular/:page", async (req, res, next) => {
  try {
    const page = req.params.page;
    const data = await v1.popular(page);
    if (data.error) {
      next(data.error);
    }
    res.status(200).json({ code: 200, message: "", results: data });
  } catch (error) {
    next(error);
  }
});

// Route to download a specific ID
router.get("/download/:id", async (req, res, next) => {
  try {
    const data = await v1.dllink(req.params.id);
    if (req.query.redirect === "true") {
      return res.redirect(data.download);
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
});

export default router;
