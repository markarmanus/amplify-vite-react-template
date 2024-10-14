import bcrypt from "bcryptjs/dist/bcrypt";

class Helper {
  salt = bcrypt.genSaltSync(10);

  static filterObj(obj, filter) {
    let result = {};
    for (let [key, value] of Object.entries(filter)) {
      if (obj[key] !== undefined) {
        if (typeof filter[key] === "object" && !Array.isArray(value)) {
          result[key] = this.filterObj(obj[key], value);
        } else if (Array.isArray(value)) {
          const formatedArray = [];
          obj[key].forEach((eachObj) => {
            formatedArray.push(this.filterObj(eachObj, value[0]));
          });
          result[key] = formatedArray;
        } else {
          result[key] = obj[key];
        }
      }
    }
    return result;
  }

  static hashPassword(pass) {
    return bcrypt.hashSync(pass.toString(), this.salt);
  }

  static formatMovies(movies) {
    const movieFilter = {
      id: true,
      title: true,
      overview: true,
      poster_path: true,
      genres: true,
      vote_average: true,
    };
    const moviesList = [];
    movies.forEach((movie) => {
      if (typeof movie.genres === "string")
        movie.genres = JSON.parse(movie.genres);
      moviesList.push(this.filterObj(movie, movieFilter));
    });
    return moviesList;
  }

  static formatMovieToSave(movie) {
    const movieFilter = {
      id: true,
      title: true,
      overview: true,
      poster_path: true,
      vote_average: true,
      genres: true,
    };

    return this.filterObj(movie, movieFilter);
  }
  // Will check if the movie is in the list of user movies and add watched or added to the object.
  static mergeMoviesWithUserHistory(
    userAddedMovies,
    userWatchedMovies,
    formatedMovies
  ) {
    return formatedMovies.map((movie) => {
      const movieIdString = movie.id.toString();
      const added = userAddedMovies.includes(movieIdString);
      const watched = userWatchedMovies.includes(movieIdString);
      return {
        ...movie,
        isAdded: added,
        watched: watched,
      };
    });
  }

  static formatMovie(movie) {
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
    return this.filterObj(movie, movieExtraInfoFilter);
  }

  static filterWatchLaterMovie(movie) {
    const watchLaterFilter = { watched: "true", rating: "true" };
    return this.filterObj(movie, watchLaterFilter);
  }
}
export default Helper;
