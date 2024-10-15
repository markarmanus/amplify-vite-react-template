import React, { useState, useEffect } from "react";
import OnImagesLoaded from "react-on-images-loaded";
import Helper, { TransformedMovie } from "../APIs/Helper";
import MovieCard from "../UI/MovieCard";
import BlurDiv from "../UI/BlurDiv";
import MovieModal from "../UI/MovieModal";
import NavBar from "../UI/NavBar";
import ExpandingDivider from "../UI/ExpandingDivider";
import MovieFilters from "../UI/Fliters/MovieFliters";
import API from "../APIs/API";
import { useNavigate } from "react-router";
import Logger from "../modules/Logger";
import LoadingSpinner from "../UI/LoadingSpinner";
import { GenreFilter } from "../UI/Fliters/types"; // Assuming these are your defined types
import { ExtendedFilteredMovie } from "../APIs/TMBDApi/TMBDTypes";

const MyList: React.FC = () => {
  const [activeGenreFilters, setActiveGenreFilters] = useState<GenreFilter>({});
  const [activeWatchedFilter, setActiveWatchedFilter] = useState<string>("All");
  const [movieList, setMovieList] = useState<ExtendedFilteredMovie[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<TransformedMovie | undefined>(
    undefined
  );
  const [username, setUsername] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [showMoviePosters, setShowMoviePosters] = useState<boolean>(false);
  const navigate = useNavigate();

  const checkLoginStatus = async () => {
    const isLoggedIn = await API.isLoggedIn();
    if (isLoggedIn) {
      const storedUser = await API.getUser();
      if (storedUser?.username) setUsername(storedUser?.username);
      await updateList();
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const updateGenreFilters = (newFilters: GenreFilter) => {
    Logger.log(newFilters);
    setActiveGenreFilters(newFilters);
  };

  const updateWatchedFilters = (newFilters: string) => {
    setActiveWatchedFilter(newFilters);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const showModalHandler = async (movieId: number) => {
    const movieDetails = await API.movieDetails(movieId);
    const strigifiedMovie = Helper.stringifyMovie(movieDetails.data);
    setShowModal(true);
    setModalData(strigifiedMovie);
  };

  const filterByGenre = (movies: ExtendedFilteredMovie[]) => {
    if (!Object.keys(activeGenreFilters).length) return movies;
    return movies.filter((movie) =>
      movie.genres.some(
        (genre) => activeGenreFilters[genre.name as keyof GenreFilter]
      )
    );
  };

  const updateList = async () => {
    const myList = await API.getMyList();
    Logger.log(myList, "updateList");
    if (myList?.data?.length) {
      setMovieList(myList.data);
    }
    setLoading(false);
  };

  const filterByWatched = (movies: ExtendedFilteredMovie[]) => {
    if (activeWatchedFilter === "All") {
      return movies;
    }
    return movies.filter((movie) =>
      activeWatchedFilter === "Watched" ? movie.watched : !movie.watched
    );
  };

  const renderMovieCards = () => {
    let filteredMovies = filterByGenre(movieList);
    filteredMovies = filterByWatched(filteredMovies);

    return filteredMovies.map((movie) => (
      <MovieCard
        key={movie.id}
        movieID={movie.id}
        showModal={showModalHandler}
        movieRating={movie.vote_average}
        posterPath={movie.poster_path}
        title={movie.title}
        updateOnChange={false}
        isInList={true}
        isWatched={movie.watched}
        updateList={updateList}
      />
    ));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <BlurDiv blurDegree={showModal ? 10 : 0} isBlur={showModal}>
        <NavBar
          showLogOutButton={true}
          username={username}
          showMyListIcon={true}
          listCount={movieList.length}
        />
        <BlurDiv blurDegree={loading ? 3 : 0}>
          <ExpandingDivider
            lineColor={"#606060"}
            titleColor={"#dbdbdb"}
            openable={true}
            fontSize={21}
            title={"Filters"}
          >
            <MovieFilters
              onUpdateGenreFilter={updateGenreFilters}
              onUpdateWatchedFilter={updateWatchedFilters}
            />
          </ExpandingDivider>
          <OnImagesLoaded
            onLoaded={() => setShowMoviePosters(true)}
            onTimeout={() => setShowMoviePosters(true)}
            timeout={1000}
          >
            <div
              style={{
                display: showMoviePosters ? "flex" : "none",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {renderMovieCards()}
            </div>
          </OnImagesLoaded>
        </BlurDiv>
      </BlurDiv>
      {showModal && !loading && modalData && (
        <MovieModal closeModal={closeModal} {...modalData} />
      )}
    </div>
  );
};

export default MyList;
