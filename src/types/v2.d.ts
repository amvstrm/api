interface AnimeInfo {
  error?: any | null;
  id: number;
  idMal: number;
  id_provider: {
    idGogo: string;
    idGogoDub: string;
    idZoro: string;
    id9anime: string;
    idPahe: string;
  };
  title: string;
  dub: boolean;
  description: string;
  coverImage: string;
  bannerImage: string;
  genres: string[];
  tags: string[];
  status: string;
  format: string;
  episodes: number;
  year: number;
  season: string;
  duration: number;
  startIn: string;
  endIn: string;
  nextair: {
    airingAt: string;
    timeUntilAiring: string;
    episode: number;
  } | null;
  score: {
    averageScore: number;
    decimalScore: number;
  };
  popularity: number;
  siteUrl: string;
  trailer: string | null;
  studios: { nodes: any[] };
  relation: any[];
}

interface PageInfo {
  hasNextPage: boolean;
  total: number;
}

interface AnimeSearchData {
  pageInfo: PageInfo;
  results: any[];
}

interface AnimeResult {
  pageInfo: PageInfo;
  results: {
    id: string;
    malId: number;
    episode: number;
    airingAt: string;
    title: {
      romaji: string;
      english: string;
      userPreferred: string;
      native: string;
    };
    episodes: number;
    nextair: {
      airingAt: string;
      timeUntilAiring: string;
      episode: number;
    };
    country: string;
    coverImage: {
      extraLarge: string;
      large: string;
      medium: string;
      color: string;
    } | null;
    description: string;
    bannerImage: string;
    genres: string[];
    color: string | null;
    rating: number;
    releaseDate: number;
    type: string;
  }[];
}

export interface AniSkipDataResult {
  code: number;
  message: string;
  found: boolean;
  results: Results;
}

export interface Results {
  op: OPEDdata;
  ed: OPEDdata;
}

export interface OPEDdata {
  interval: Interval;
  skipType: string;
  skipId: string;
  episodeLength: number;
}

export interface Interval {
  startTime: number;
  endTime: number;
}
