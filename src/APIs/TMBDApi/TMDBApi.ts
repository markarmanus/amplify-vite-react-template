import axios from "axios";
import Logger from "../../modules/Logger";
import { Movie } from "./TMBDTypes";
const API_URL = "https://api.themoviedb.org/3/";
const API_KEY = "29de87d3f58e703ce82ba34e2460edcd";

class TMDBApi {
  private static formatPramaters(params: object) {
    let formatedParams = "";
    for (const [param, value] of Object.entries(params)) {
      formatedParams = `${formatedParams}&${param}=${value}`;
    }
    return formatedParams;
  }
  static async discoverForRecommendations(
    with_genres = [],
    without_genres = [],
    page = 1
  ): Promise<undefined | { movies: Movie[]; hasMore: boolean }> {
    const url = `${API_URL}discover/movie?api_key=${API_KEY}&without_genres=${without_genres.join(
      ","
    )}&with_genres=${with_genres.join(",")}&page=${page}`;
    return await axios
      .get(url)
      .then((res) => {
        return { movies: res.data.results, hasMore: res.data.page < page };
      })
      .catch((err) => {
        Logger.error(err);
        return undefined;
      });
  }

  static async searchMovies(
    query: string,
    peramateres = {}
  ): Promise<undefined | Movie[]> {
    const url = `${API_URL}search/movie?api_key=${API_KEY}&query=${query}${this.formatPramaters(
      peramateres
    )}`;
    return await axios
      .get(url)
      .then((res) => {
        return res.data.results;
      })
      .catch((err) => {
        Logger.error(err);
        return undefined;
      });
  }

  static async movieDetails(
    movieId: number,
    extraMovieInfo = []
  ): Promise<undefined | Movie> {
    const url = `${API_URL}movie/${movieId}?api_key=${API_KEY}&append_to_response=${extraMovieInfo.join(
      ","
    )}`;
    return await axios
      .get(url)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        Logger.error(err);
        return undefined;
      });
  }
}

export default TMDBApi;
