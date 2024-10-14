import axios from "axios";
import Helper from "./Helper";
import TMDBApi from "./TMDBApi";

class API {
  static async signUp(username, email, password, onSuccess, onFail) {
    const token = "TOKEN_MOCK";
    const hashedPassword = Helper.hashPassword(password);
    const { errors, data } = await window.client.models.User.create({
      username,
      email,
      password: hashedPassword,
      tokens: [token],
      movies: [],
    });
    console.log();
    if (errors) {
      onFail(errors);
    } else {
      console.log(data);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));
      onSuccess(data);
    }
  }

  static isLoggedIn() {
    const token = localStorage.getItem("token");
    return token ? true : false;
  }

  static logout(onSuccess) {
    localStorage.clear();
    onSuccess();
  }

  static async getRecommendations(page) {
    const { movies } = await TMDBApi.discoverForRecommendations([], [], page);
    const user = JSON.parse(localStorage.getItem("user"));
    const formatedResponse = Helper.formatMovies(movies);
    const injectedFormatedMoveies = Helper.injectWatchedToMovies(
      user.movies,
      formatedResponse
    );

    return { data: injectedFormatedMoveies };
  }

  static async login(loginValue, password, onSuccess, onFail) {
    const token = "TOKEN_MOCK";
    const { errors, data } = await window.client.models.User.get({
      username: loginValue,
      id: loginValue,
      password: Helper.hashPassword(password),
    });
    if (errors || data.getUser) {
      onFail(errors);
    } else {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));
      onSuccess(data);
    }
  }

  static async loginAsGuest(onSuccess, onFail) {
    const randomID = Math.floor(Math.random() * 10000);
    const username = "Guest-" + randomID;
    const email = "Guest-" + randomID + "@guest.com";
    return this.signUp(username, email, "passwordo", onSuccess, onFail);
  }

  static async search(searchValue, page = 1) {
    const respone = await TMDBApi.searchMovies(searchValue, { page });
    const formatedResponse = Helper.formatMovies(respone);
    const injectedFormatedResponse = Helper.injectWatchedToMovies(
      [],
      formatedResponse
    );
    return { data: injectedFormatedResponse };
  }

  static async movieDetails(movieID) {
    const movie = await TMDBApi.movieDetails(movieID, ["videos", "credits"]);
    const formatedResponse = Helper.formatMovie(movie);
    return { data: formatedResponse };
  }

  static async addMovieToUserList(id) {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user.username);
      const { data } = await window.client.models.User.get({
        username: user.username,
      });
      const ids = data.movies.map((movie) => JSON.parse(movie).id);
      if (!ids.find((el) => el === id)) {
        await window.client.models.User.update({
          username: user.username,
          movies: data.movies.concat(JSON.stringify({ id, watched: false })),
        });
      }
      const { existingMove } = await window.client.models.Movie.get({ id });
      console.log(existingMove);
      if (!existingMove) {
        const movie = await TMDBApi.movieDetails(id);
        const formatedMovie = Helper.formatMovieToSave(movie);
        console.log(formatedMovie);
        await window.client.models.Movie.create({
          id: formatedMovie.id,
          tilte: formatedMovie.title,
          overview: formatedMovie.overview,
          poster_path: formatedMovie.poster_path,
          vote_average: formatedMovie.vote_average.toString(),
          geners: JSON.stringify(formatedMovie.genres),
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  static removeMovieFromMyList(id) {
    return axios.delete("http://localhost:5000/myFlex/api/v1/user/list", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
      data: {
        id,
      },
    });
  }

  static watched(id, watched) {
    return axios.patch(
      "http://localhost:5000/myFlex/api/v1/user/list",
      { id, watched },
      {
        headers: { Authorization: localStorage.getItem("token") },
      }
    );
  }

  static async getMyList() {
    const user = JSON.parse(localStorage.getItem("user"));
    const { data } = await window.client.models.User.get({
      username: user.username,
    });
    if (data) {
      const ids = data.movies.map((movie) => JSON.parse(movie).id);
      const moivesData = await Promise.all(
        ids.map(async (id) => {
          return await window.client.models.Movie.get({ id });
        })
      );
      const finalData = moivesData.map((res) => {
        return {
          genres: JSON.parse(res.data.geners),
          title: res.data.tilte,
          vote_average: Number(res.data.vote_average),
          ...res.data,
        };
      });
      console.log(finalData);
      return { data: finalData };
    }
    return { data: [] };
  }
}

export default API;
