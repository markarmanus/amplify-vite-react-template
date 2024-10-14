class Helper {
  static getFirstNCast(obj: { name: string }[], n: number): string {
    const castList: string[] = [];
    const castNumber = Math.min(obj.length, n);
    for (let i = 0; i < castNumber; i++) {
      castList.push(obj[i].name);
    }
    return castList.length > 0 ? castList.join(", ") : "N/A";
  }

  static movieTransformer(
    movieDetails: {
      title: string;
      poster_path: string | null;
      vote_average: number;
      runtime: number;
      genres: { name: string }[];
      release_date: string;
      credits: { cast: { name: string }[] };
      overview: string;
      videos: { results: { key: string }[] };
    },
    id: string
  ): {
    movieTitle: string;
    poster: string;
    IMDb: number;
    runTime: number;
    genres: string;
    releaseDate: string;
    cast: string;
    info: string;
    trailerID: string;
    movieID: string;
  } {
    const noPoster = "./NoPoster.jpg";
    const movieData = {
      movieTitle: movieDetails.title,
      poster: movieDetails.poster_path
        ? "https://image.tmdb.org/t/p/original/" + movieDetails.poster_path
        : noPoster,
      IMDb: movieDetails.vote_average,
      runTime: movieDetails.runtime,
      genres: movieDetails.genres.map((each) => each.name).join(", "),
      releaseDate: movieDetails.release_date,
      cast: this.getFirstNCast(movieDetails.credits.cast, 5),
      info: movieDetails.overview,
      trailerID: movieDetails.videos.results[0]?.key || "NA",
      movieID: id,
    };
    return movieData;
  }
}

export default Helper;
