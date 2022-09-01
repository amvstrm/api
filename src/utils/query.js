export const advancedSearchQ = () =>
  `query ($page: Int = 1, $id: Int, $type: MediaType, $isAdult: Boolean = false, $search: String, $format: [MediaFormat], $status: MediaStatus, $size: Int, $countryOfOrigin: CountryCode, $source: MediaSource, $season: MediaSeason, $seasonYear: Int, $year: String, $onList: Boolean, $yearLesser: FuzzyDateInt, $yearGreater: FuzzyDateInt, $episodeLesser: Int, $episodeGreater: Int, $durationLesser: Int, $durationGreater: Int, $chapterLesser: Int, $chapterGreater: Int, $volumeLesser: Int, $volumeGreater: Int, $licensedBy: [String], $isLicensed: Boolean, $genres: [String], $excludedGenres: [String], $tags: [String], $excludedTags: [String], $minimumTagRank: Int, $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]) {
    Page(page: $page, perPage: $size) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      media(id: $id, type: $type, season: $season, format_in: $format, status: $status, countryOfOrigin: $countryOfOrigin, source: $source, search: $search, onList: $onList, seasonYear: $seasonYear, startDate_like: $year, startDate_lesser: $yearLesser, startDate_greater: $yearGreater, episodes_lesser: $episodeLesser, episodes_greater: $episodeGreater, duration_lesser: $durationLesser, duration_greater: $durationGreater, chapters_lesser: $chapterLesser, chapters_greater: $chapterGreater, volumes_lesser: $volumeLesser, volumes_greater: $volumeGreater, licensedBy_in: $licensedBy, isLicensed: $isLicensed, genre_in: $genres, genre_not_in: $excludedGenres, tag_in: $tags, tag_not_in: $excludedTags, minimumTagRank: $minimumTagRank, sort: $sort, isAdult: $isAdult) {
        id
        idMal
        status(version: 2)
        title {
          userPreferred
          romaji
          english
          native
        }
        bannerImage
        coverImage {
          extraLarge
          large
          medium
          color
        }
        episodes
        season
        format
        seasonYear
        averageScore
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
      }
    }
  }
`;
export const SearchQuery = (query, page, perPage) =>
  `query ($page: Int, $id: Int, $type: MediaType, $search: String, $isAdult: Boolean, $size: Int) {
    Page(page: ${page}, perPage: ${perPage}) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      media(id: $id, type: $type, search: ${query}, isAdult: $isAdult) {
        id
        idMal
        status(version: 2)
        title {
          userPreferred
          romaji
          english
          native
        }
        bannerImage
        coverImage {
          extraLarge
          large
          medium
          color
        }
        episodes
        format
        season
        seasonYear
        averageScore
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
      }
    }
  }
  `;
export const InfoQuery = (id) => `
query Query {
  Media (id: ${id}, type: ANIME) {
    id
    idMal
    title {
      romaji
      english
      native
      userPreferred
    }
    description
    coverImage {
      large
      medium
      color
    }
    bannerImage
    genres
    status
    episodes
    duration
    averageScore
    popularity
    siteUrl
    trailer {
      id
      site
      thumbnail
    }
    studios {
      nodes {
        name
      }
    }
  }
}
`

export const RecommendationsQuery = (id) =>`
query Query {
  Media(id: ${id}, type: ANIME) {
    id
    idMal
    recommendations {
      nodes {
        mediaRecommendation {
          id
          idMal
          title {
            romaji
            english
            native
            userPreferred
          }
          type
          format
          status
          episodes
          duration
          averageScore
        }
      }
    }
  }
}`
