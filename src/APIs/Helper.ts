/* eslint-disable @typescript-eslint/no-explicit-any */
import { Movie } from "./TMBDApi/TMBDTypes";

type FilteredMovie = Pick<
  Movie,
  "id" | "title" | "overview" | "poster_path" | "genres" | "vote_average"
>;

class Helper {
  static filterObj(obj: any, filter: any): Partial<Movie> {
    const result: any = {};

    for (const [key, value] of Object.entries(filter)) {
      if (obj[key] !== undefined) {
        if (typeof value === "object" && !Array.isArray(value)) {
          result[key] = this.filterObj(obj[key], value); // Recursive call
        } else if (Array.isArray(value)) {
          const formattedArray = obj[key].map((eachObj: any) =>
            this.filterObj(eachObj, value[0])
          );
          result[key] = formattedArray; // Set formatted array
        } else {
          result[key] = obj[key]; // Direct assignment
        }
      }
    }

    return result as Partial<Movie>;
  }

  // Formats an array of movies, filtering their properties
  static formatMovies(movies: Movie[]): FilteredMovie[] {
    const movieFilter = {
      id: true,
      title: true,
      overview: true,
      poster_path: true,
      genres: true,
      vote_average: true,
    };
    return movies.map((movie) => {
      if (typeof movie.genres === "string") {
        movie.genres = JSON.parse(movie.genres);
      }
      return this.filterObj(movie, movieFilter) as FilteredMovie; // Type assertion here
    });
  }

  // Merges user movie history into formatted movies
  static mergeMoviesWithUserHistory(
    userAddedMovies: string[],
    userWatchedMovies: string[],
    formattedMovies: FilteredMovie[]
  ): (FilteredMovie & { isAdded: boolean; watched: boolean })[] {
    return formattedMovies.map((movie) => {
      const movieIdString = movie.id?.toString();
      const added = userAddedMovies.includes(movieIdString || "");
      const watched = userWatchedMovies.includes(movieIdString || "");
      return {
        ...movie,
        isAdded: added,
        watched: watched,
      };
    });
  }

  // Formats an individual movie, filtering its properties
  static formatMovie(movie: Movie): FilteredMovie {
    const movieExtraInfoFilter = {
      id: true,
      title: true,
      overview: true,
      poster_path: true,
      release_date: true,
      genres: true,
      runtime: true,
      vote_average: true,
      videos: { results: [{ key: true }] },
      credits: { cast: [{ name: true }] },
    };
    return this.filterObj(movie, movieExtraInfoFilter) as FilteredMovie; // Type assertion here
  }
}

export default Helper;
