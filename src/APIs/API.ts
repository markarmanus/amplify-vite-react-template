/* eslint-disable @typescript-eslint/no-explicit-any */
// Disabling Entire File TS check until migration from JS is done.
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import Helper from "./Helper";
import TMDBApi from "./TMBDApi/TMDBApi";
import { V6Client } from "@aws-amplify/api-graphql";
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import Logger from "../modules/Logger";
import {
  signUp,
  signIn,
  signOut,
  fetchAuthSession,
  getCurrentUser,
  confirmSignUp,
} from "aws-amplify/auth";
import {
  DetailedMovie,
  ExtendedFilteredMovie,
  FilteredMovie,
} from "./TMBDApi/TMBDTypes";

type SuccessCallBackFn = (response: any) => void;
type ErrorCallBackFn = (error?: any) => void;
interface UserBasicData {
  username: string;
  email: string;
  password: string;
}
const client: V6Client<Schema> = generateClient<Schema>();

class API {
  private static cognitoUserId: string;
  private static user: Schema["User"]["type"] | null;
  private static movieGenres;
  private static async getUserId() {
    if (this.cognitoUserId) return this.cognitoUserId;
    const { userId } = await getCurrentUser();
    this.cognitoUserId = userId;
    return userId;
  }

  private static async getMovieGenres() {
    if (this.movieGenres) return this.movieGenres;
    const movieGenres = await TMDBApi.getGenres();
    this.movieGenres = movieGenres;
    return movieGenres;
  }
  private static async createUserEntity(
    email: string,
    username: string,
    cognitoUserId: string
  ) {
    const { errors } = await client.models.User.create(
      {
        email: email,
        userId: cognitoUserId,
        username,
        movies: [],
        watched: [],
      },
      { authMode: "userPool" }
    );
    if (errors) throw errors;
  }
  private static async getUserEntity(cognitoUserId: string) {
    if (this.user) return this.user;
    const { data, errors } = await client.models.User.get(
      {
        userId: cognitoUserId,
      },
      { authMode: "userPool" }
    );
    if (errors) throw errors;
    this.user = data;
    return data;
  }

  private static async updateUserEntity(
    cognitoUserId: string,
    newData: Omit<Schema["User"]["updateType"], "userId">
  ) {
    const { data, errors } = await client.models.User.update(
      {
        ...newData,
        userId: cognitoUserId,
      },
      {
        authMode: "userPool",
      }
    );
    if (errors) throw errors;
    this.user = data;
    return data;
  }

  private static async createMovieEntity(data: Schema["Movie"]["createType"]) {
    const { errors } = await client.models.Movie.create({
      ...data,
    });
    if (errors) throw errors;
  }

  private static async getMoviesEntities(movieIds: string[]) {
    const movies = await Promise.all(
      movieIds?.map(async (movieId) => {
        const { data } = await client.models.Movie.get({ id: movieId });
        return data;
      })
    );
    return movies.filter((movie) => movie);
  }
  static async signUp(
    data: UserBasicData,
    onSuccess: SuccessCallBackFn,
    onFail: ErrorCallBackFn
  ) {
    const { username, email, password } = data;
    await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          username,
        },
      },
    })
      .then(({ userId, nextStep }) => {
        if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
          onSuccess({ data: { nextStep: "CONFIRM_SIGN_UP", userId } });
        } else {
          onFail({});
        }
      })
      .catch(onFail);
  }

  static async validateSignUp(
    data: { code: string; email: string },
    onSuccess: SuccessCallBackFn,
    onFail: ErrorCallBackFn
  ) {
    const { code, email } = data;
    await confirmSignUp({
      username: email,
      confirmationCode: code,
    })
      .then(async ({ isSignUpComplete }) => {
        if (isSignUpComplete) {
          onSuccess();
        }
      })
      .catch(onFail);
  }

  static async login(
    data: UserBasicData,
    onSuccess: SuccessCallBackFn,
    onFail: ErrorCallBackFn
  ) {
    const { email, password, username } = data;

    await signIn({
      username: email,
      password,
    })
      .then(async (data) => {
        if (data.nextStep.signInStep === "CONFIRM_SIGN_UP") {
          onFail({ error: "CONFIRM_SIGN_UP" });
        } else {
          const userId = await this.getUserId();
          const userEntity = await this.getUserEntity(userId);
          if (!userEntity) {
            await this.createUserEntity(email, username, userId);
          }
          onSuccess({ data });
        }
      })
      .catch(onFail);
  }

  static async logout(onSuccess: SuccessCallBackFn) {
    await signOut({ global: true });
    onSuccess();
  }

  static async loginWithDemoAccount(
    onSuccess: SuccessCallBackFn,
    onFail: ErrorCallBackFn
  ) {
    const email = "markarmanus@gmail.com";
    const password = "DemoAccount1234";

    await this.login({ email, password }, onSuccess, onFail);
    const userId = await this.getUserId();

    await this.createUserEntity(email, userId);
  }

  static async isLoggedIn() {
    const session = await fetchAuthSession();
    return session?.tokens?.idToken && session.tokens.accessToken;
  }

  static async addMovieToUserList(
    movieId: number,
    onSuccess: SuccessCallBackFn,
    onFail: ErrorCallBackFn
  ) {
    const userId = await this.getUserId();
    const user = await this.getUserEntity(userId);
    const stringMovieId = movieId.toString();
    const newMoviesSet = new Set(user?.movies?.concat(stringMovieId));
    const movies = Array.from(newMoviesSet);

    try {
      const movieExists = await this.getMoviesEntities([stringMovieId]);
      if (!movieExists[0]) {
        const tmbdMovie = await TMDBApi.movieDetails(movieId);
        tmbdMovie.genre_ids = tmbdMovie.genres.map((genre) => genre.id);
        const movieExtraInfoFilter = {
          id: true,
          title: true,
          overview: true,
          poster_path: true,
          genre_ids: true,
          vote_average: true,
        };
        const filteredMovie = Helper.filterObj(
          tmbdMovie,
          movieExtraInfoFilter
        ) as FilteredMovie;
        await this.createMovieEntity(filteredMovie);
      }
      await this.updateUserEntity(userId, { movies });
      onSuccess();
    } catch (e) {
      console.log(e);
      onFail();
    }
  }

  static async movieDetails(movieId: number): { data: DetailedMovie } {
    const movie = await TMDBApi.movieDetails(movieId, ["videos", "credits"]);
    return { data: movie };
  }

  static async search(
    searchValue: string,
    page = 1
  ): { data: ExtendedFilteredMovie[] } {
    const respone = await TMDBApi.searchMovies(searchValue, { page });
    const userId = await this.getUserId();
    const user = await this.getUserEntity(userId);
    const movieGenres = await this.getMovieGenres();
    if (respone) {
      const movies = Helper.formatMovies(respone, movieGenres, user);
      return { data: movies };
    }
    return { data: [] };
  }

  static async removeMovieFromMyList(
    movieId: number,
    onSuccess: SuccessCallBackFn,
    onFail: ErrorCallBackFn
  ) {
    const userId = await this.getUserId();
    const user = await this.getUserEntity(userId);
    const newMoviesSet = new Set(user?.movies);
    const newWatchedSet = new Set(user?.watched);
    const stringMovieId = movieId.toString();
    newMoviesSet.delete(stringMovieId);
    newWatchedSet.delete(stringMovieId);

    const movies = Array.from(newMoviesSet);
    const watched = Array.from(newWatchedSet);
    try {
      await this.updateUserEntity(userId, { movies, watched });
      onSuccess();
    } catch (e) {
      console.log(e);
      onFail();
    }
  }

  static async setMoviedWatched(
    movieId: number,
    watchedMovie: boolean,
    onSuccess: SuccessCallBackFn,
    onFail: ErrorCallBackFn
  ) {
    const userId = await this.getUserId();
    const user = await this.getUserEntity(userId);
    const newWatchedSet = new Set(user?.watched);
    const stringMovieId = movieId.toString();
    if (watchedMovie) {
      newWatchedSet.add(stringMovieId);
    } else {
      newWatchedSet.delete(stringMovieId);
    }
    const watched = Array.from(newWatchedSet);
    try {
      await this.updateUserEntity(userId, { watched });
      onSuccess();
    } catch (e) {
      console.log(e);
      onFail();
    }
  }

  static async getRecommendations(page: number): {
    data: ExtendedFilteredMovie[];
  } {
    const { movies } = await TMDBApi.discoverForRecommendations([], [], page);
    const userId = await this.getUserId();
    const user = await this.getUserEntity(userId);
    const movieGenres = await this.getMovieGenres();
    const formatedMovies = Helper.formatMovies(movies, movieGenres, user);
    return { data: formatedMovies };
  }

  static async getMyList(): { data: ExtendedFilteredMovie[] } {
    const userId = await this.getUserId();
    const user = await this.getUserEntity(userId);
    if (user?.movies?.length) {
      const movies = await this.getMoviesEntities(user.movies as string[]);
      const movieGenres = await this.getMovieGenres();

      const formatedMovies = Helper.formatMovies(movies, movieGenres, user);
      return { data: formatedMovies };
    }
    return { data: [] };
  }
  static async getUser() {
    const userId = await this.getUserId();
    return await this.getUserEntity(userId);
  }
}
export default API;
