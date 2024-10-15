/* eslint-disable @typescript-eslint/no-explicit-any */

import { Schema } from "../../amplify/data/resource";
import {
  FilteredMovie,
  ExtendedFilteredMovie,
  Movie,
  DetailedMovie,
  FilteredDetailedMovie,
  PersonInfo,
  Genre,
} from "./TMBDApi/TMBDTypes";

export type StringifiedMovie = {
  title: string;
  poster: string;
  vote_average: string;
  runTime: string;
  genres: string;
  releaseDate: string;
  cast: string;
  info: string;
  trailerID: string;
  movieID: string;
};

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

  static getFirstNCast(cast: PersonInfo[], n: number): string {
    const castList: string[] = [];
    const castNumber = Math.min(cast.length, n);
    for (let i = 0; i < castNumber; i++) {
      castList.push(cast[i].name);
    }
    return castList.length > 0 ? castList.join(", ") : "N/A";
  }

  static stringifyMovie(movieDetails: DetailedMovie): StringifiedMovie {
    const movieData = {
      title: movieDetails.title,
      poster: movieDetails.poster_path
        ? "https://image.tmdb.org/t/p/original/" + movieDetails.poster_path
        : "./NoPoster.jpg",
      vote_average: movieDetails.vote_average.toString(),
      runTime: movieDetails.runtime.toString(),
      genres: movieDetails.genres.map((each) => each.name).join(", "),
      releaseDate: movieDetails.release_date,
      cast: this.getFirstNCast(movieDetails.credits.cast, 5),
      info: movieDetails.overview,
      trailerID: movieDetails.videos.results[0]?.key || "NA",
      movieID: movieDetails.id.toString(),
    };
    return movieData;
  }

  static formatMovies(
    movies: Movie[],
    allGenres: Genre[],
    userEntity: Schema["User"]["type"]
  ): ExtendedFilteredMovie[] {
    return movies.map((movie) =>
      this.formatMovie(movie, allGenres, userEntity)
    );
  }
  private static genreIdsToGenres(
    genreIds: number[],
    allGenres: Genre[]
  ): Genre[] {
    if (genreIds?.length && allGenres?.length) {
      const movieGenres = genreIds.map((id) => {
        return allGenres.find((genre) => genre.id === id);
      });
      return movieGenres.filter((genre) => genre) as Genre[];
    }
    return [];
  }

  static formatDetailedMove(
    movie: DetailedMovie,
    userEntity: Schema["User"]["type"]
  ): ExtendedFilteredMovie {
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
    const filterdMovie = this.filterObj(
      movie,
      movieExtraInfoFilter
    ) as FilteredDetailedMovie;

    const extendedObject: ExtendedFilteredMovie = {
      ...filterdMovie,
      isAdded: !userEntity.movies?.find(
        (id) => id === filterdMovie.id?.toString()
      ),
      watched: !userEntity.watched?.find(
        (id) => id === filterdMovie.id?.toString()
      ),
      genre_ids: filterdMovie.genres.map((genre) => genre.id),
    };
    return extendedObject;
  }

  static formatMovie(
    movie: Movie,
    allGenres: Genre[],
    userEntity: Schema["User"]["type"]
  ): ExtendedFilteredMovie {
    const movieExtraInfoFilter = {
      id: true,
      title: true,
      overview: true,
      poster_path: true,
      genre_ids: true,
      vote_average: true,
    };

    const filterdMovie = this.filterObj(
      movie,
      movieExtraInfoFilter
    ) as FilteredMovie;

    const extendedObject: ExtendedFilteredMovie = {
      ...filterdMovie,
      isAdded:
        userEntity.movies?.find((id) => id === filterdMovie.id?.toString()) !==
        undefined,
      watched:
        userEntity.watched?.find((id) => id === filterdMovie.id?.toString()) !==
        undefined,
      genres: this.genreIdsToGenres(filterdMovie.genre_ids!, allGenres),
    };
    return extendedObject;
  }
}

export default Helper;
