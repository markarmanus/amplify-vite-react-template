export type MovieImages = {
  id: number;
  backdrops: MovieImage[];
  posters: MovieImage[];
};

export type MovieImage = {
  aspect_ratio: number;
  file_path: string;
  height: number;
  iso_639_1: string;
  vote_average: number;
  vote_count: number;
  width: number;
};

export type SearchOptions = {
  query: string;
  language?: string | undefined;
};

export type InfoOptions = {
  id: number;
  language?: string | undefined;
};

export type SearchResults = {
  page: number;
  results: SearchResult[];
  total_Pages: number;
  total_results: number;
};

export type SearchResult = {
  adult: boolean;
  backdrop_path: string;
  id: number;
  original_title: string;
  release_date: string;
  poster_path: string;
  popularity: number;
  title: string;
  vote_average: number;
  vote_count: number;
};

export type VideoData = {
  d: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
};

export type PersonInfo = {
  adult: false;
  credit_id: string;
  department: string;
  gender: number;
  id: number;
  job: string;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path?: null | "string";
};

// When requesting Details of a single Movie
export type DetailedMovie = {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: object;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: number;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  videos: { results: VideoData[] };
  credits: { cast: PersonInfo[]; crew: PersonInfo[] };
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  vote_average: number;
  vote_count: number;
};

// When requesting Multiple Movies
export type Movie = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

// Properties of a Movie we care about
export type FilteredMovie = Pick<
  Movie,
  "id" | "title" | "overview" | "poster_path" | "genre_ids" | "vote_average"
>;

// Properties of a single Movie Request we care about.
export type FilteredDetailedMovie = Pick<
  DetailedMovie,
  | "id"
  | "title"
  | "overview"
  | "poster_path"
  | "genres"
  | "vote_average"
  | "videos"
  | "credits"
  | "release_date"
  | "runtime"
>;

export type ExtendedFilteredMovie = FilteredMovie & {
  isAdded: boolean;
  watched: boolean;
  genres: Genre[];
  runtime?: number;
  release_date?: Date;
  videos?: { results: VideoData[] };
  credits?: { cast: PersonInfo[]; crew: PersonInfo[] };
};
``;

export type Genre = {
  id: number;
  name: string;
};

export type ProductionCompany = {
  id: number;
  name: string;
};

export type ProductionCountry = {
  iso_3166_1: number;
  name: string;
};

export type SpokenLanguage = {
  iso_639_1: number;
  name: string;
};
