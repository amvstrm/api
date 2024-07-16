export type SeasonList = "FALL" | "WINTER" | "SUMMER" | "SPRING";

export type GenreList =
  | "action"
  | "adventure"
  | "cars"
  | "comedy"
  | "dementia"
  | "demons"
  | "mystery"
  | "drama"
  | "ecchi"
  | "fantasy"
  | "game"
  | "hentai"
  | "historical"
  | "horror"
  | "kids"
  | "magic"
  | "martial-arts"
  | "mecha"
  | "music"
  | "parody"
  | "samurai"
  | "romance"
  | "school"
  | "sci-fi"
  | "shoujo"
  | "shoujo-ai"
  | "shounen"
  | "shounen-ai"
  | "space"
  | "sports"
  | "super-power"
  | "vampire"
  | "yaoi"
  | "yuri"
  | "harem"
  | "slice-of-life"
  | "supernatural"
  | "military"
  | "police"
  | "psychological"
  | "thriller"
  | "seinen"
  | "josei";

export type TypeReleases = "all" | "sub" | "dub" | "cn";

export interface defaultResponse {
  results: Result[];
}

export interface Result {
  title: string;
  id: string;
  image_url: string;
  released: string | null;
  latestEp: number | null;
  genres: string[] | null;
  status: string | null;
}

export interface Season {
  season: SeasonList;
  year: number;
  page: number;
}

export interface Episode {
  title: string;
  id: string;
  episode: number;
}

export interface Anime {
  title: string;
  id: string;
  season: string;
  released: string;
  status: string;
  genres: string[];
  otherNames: string[];
  synopsis: string;
  image_url: string;
  totalEpisodes: string;
}
