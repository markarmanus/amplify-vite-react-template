import React, { useEffect, useRef, useState } from "react";
import OnImagesLoaded from "react-on-images-loaded";
import API from "../APIs/API";
import Helper from "../Helper";
import LoadingSpinner from "../UI/LoadingSpinner";
import ExpandingDivider from "../UI/ExpandingDivider";
import BlurDiv from "../UI/BlurDiv";
import NavBar from "../UI/NavBar";
import MovieCard from "../UI/MovieCard";
import MovieModal from "../UI/MovieModal";
import { message } from "antd";
import debounce from "lodash/debounce";
import { useNavigate } from "react-router";
import Logger from "../modules/Logger";

const Home = () => {
  const [user, setUser] = useState(API.getUser());
  const [movieList, setMovieList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(undefined);
  const [showMoviePosters, setShowMoviePosters] = useState(false);
  const [index, setIndex] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [mylistCount, setMylistCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const lastMovie = useRef(null);
  const navigate = useNavigate();
  const handleScroll = debounce(() => {
    if (lastMovie.current) {
      const boundingRect = lastMovie.current.getBoundingClientRect();
      if (Math.abs(boundingRect.bottom - window.innerHeight) < 50 && !loading) {
        setLoading(true);
        loadNextPage();
      }
    }
  }, 200);

  const closeModal = () => {
    setShowModal(false);
  };

  const showModalHandler = async (movieId) => {
    const movieDetails = await API.movieDetails(movieId);
    const transformedMovie = Helper.movieTransformer(
      movieDetails.data,
      movieId
    );
    setShowModal(true);
    setModalData(transformedMovie);
  };

  const updateList = async () => {
    const myList = await API.getMyList();
    if (myList && myList.data.length) {
      setMylistCount(myList.data.length);
    }
  };

  useEffect(() => {
    const mainContainer = document.getElementById("mainContainer");
    mainContainer?.addEventListener("scroll", handleScroll);

    return () => {
      mainContainer?.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    const checkLogin = async () => {
      message.config({
        top: 60,
        duration: 0.85,
      });
      const isLoggedIn = await API.isLoggedIn();
      if (isLoggedIn) {
        const storedUser = await API.getUser();
        Logger.log(storedUser);
        setUser(storedUser);
        await updateList();
        await getRecommendations();
        setLoading(false);
      } else {
        navigate("/login");
      }
    };
    checkLogin();
  }, [navigate]); // Removed user from dependencies

  const loadNextPage = async () => {
    setCurrentPage((prev) => prev + 1);
    if (searchValue === "") {
      await getRecommendations();
    } else {
      await onSearch(searchValue);
    }
  };

  const onSearch = async (searchValue) => {
    if (searchValue === "") {
      setCurrentPage(1);
      setMovieList([]);
      getRecommendations();
    } else {
      const res = await API.search(searchValue, currentPage);
      if (res?.data) {
        if (currentPage > 1) {
          setMovieList((prev) => prev.concat(res.data));
          setLoading(false);
        } else {
          setMovieList(res.data);
          setShowMoviePosters(false);
          setIndex((prev) => prev + 1);
          setLoading(true);
        }
      }
    }
  };

  const getRecommendations = async () => {
    const popularMovies = await API.getRecommendations(currentPage);
    if (popularMovies?.data) {
      if (currentPage > 1) {
        setMovieList((prev) => prev.concat(popularMovies.data));
        setLoading(false);
      } else {
        setMovieList(popularMovies.data);
        setShowMoviePosters(false);
        setIndex((prev) => prev + 1);
        setLoading(true);
      }
    }
  };

  const renderMovieCards = () => {
    return movieList.map((movie) => (
      <div ref={lastMovie} key={movie.id}>
        <MovieCard
          movieID={movie.id}
          showModal={() => showModalHandler(movie.id)}
          movieRating={movie.vote_average}
          posterPath={movie.poster_path}
          title={movie.title}
          isInList={movie.isAdded}
          isWatched={movie.watched}
          updateOnChange={true}
          updateList={updateList}
        />
      </div>
    ));
  };
  if (!movieList.length) return <LoadingSpinner />;
  return (
    <div>
      {loading && <LoadingSpinner />}
      <BlurDiv blurDegree={showModal ? 10 : 0} isBlur={showModal}>
        <NavBar
          onSearchbarChange={(value) => {
            const newState = { searchValue: value };
            if (searchValue === "" && value !== "") {
              newState.currentPage = 1;
              newState.movieList = [];
            }
            setSearchValue(value);
            onSearch(value);
          }}
          showLogOutButton={true}
          username={user?.username}
          showMyListIcon={true}
          showSearchBar={true}
          listCount={mylistCount}
        />
        <BlurDiv blurDegree={loading ? 3 : 0}>
          <ExpandingDivider
            lineColor={"#606060"}
            titleColor={"#dbdbdb"}
            fontSize={21}
            title={searchValue === "" ? "Recommendations" : "Results"}
          />
          <OnImagesLoaded
            key={index}
            onLoaded={() => {
              setShowMoviePosters(true);
              setLoading(false);
            }}
            onTimeout={() => {
              setShowMoviePosters(true);
              setLoading(false);
            }}
            timeout={2}
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
      {showModal && !loading && (
        <MovieModal closeModal={closeModal} {...modalData} />
      )}
    </div>
  );
};

export default Home;
