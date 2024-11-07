export interface AnimeInfo {
  error?: any | null;
  id: number;
  idMal: number;
  id_provider: {
    idGogo: string;
    idGogoDub: string;
    idZoro: string;
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

export interface PageInfo {
  hasNextPage: boolean;
  total: number;
}

export interface AnimeSearchData {
  pageInfo: PageInfo;
  results: any[];
}
export interface AnimeRecommendationData {
  info: {
    id: number;
    idMal: number;
    title: {
      romaji: string;
      english: string;
      native: string;
      userPreferred: string;
    };
  };
  results: {
    id: number;
    idMal: number;
    title: {
      romaji: string;
      english: string;
      native: string;
      userPreferred: string;
    };
    coverImage: {
      large: string;
      medium: string;
      color: string;
    };
    bannerImage: string;
    genres: string[];
    tags: {
      id: string;
      name: string;
    }[];
    type: string;
    format: string;
    status: string;
    episodes: string;
    duration: string;
    averageScore: number;
    duration: number;
    season: string;
  }[];
}
export interface AnimeResult {
  code?: number;
  message?: string;
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

export interface RecommendationsType {
  Media: {
    id: number;
    idMal: number;
    title: {
      romaji: string;
      english: string;
      native: string;
      userPreferred: string;
    };
    recommendations: {
      nodes: {
        mediaRecommendation: {
          id: number;
          idMal: number;
          title: {
            romaji: string;
            english: string;
            native: string;
            userPreferred: string;
          };
          coverImage: {
            large: string;
            medium: string;
            color: string;
          };
          bannerImage: string;
          genres: string[];
          tags: {
            id: string;
            name: string;
          }[];
          type: string;
          format: string;
          status: string;
          episodes: string;
          duration: string;
          averageScore: number;
          duration: number;
          season: string;
        };
      }[];
    };
  };
}

export interface AniSkipDataResult {
  code: number;
  message: string;
  found: boolean;
  results: {
    op: OPEDdata;
    ed: OPEDdata;
  };
}

export interface OPEDdata {
  interval: {
    startTime: number;
    endTime: number;
  };
  skipType: string;
  skipId: string;
  episodeLength: number;
}
