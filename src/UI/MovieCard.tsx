import React, { useState } from "react";
import styled from "styled-components";
import {
  PlusOutlined,
  CheckOutlined,
  MinusOutlined,
  InfoCircleFilled,
  EyeOutlined,
} from "@ant-design/icons";
import API from "../APIs/API";
import IMDbRating from "./IMDbRating";
import { Typography, Popover, message } from "antd";
import Logger from "../modules/Logger";

const { Text } = Typography;

const MOVIE_STATE = {
  ADD: "add",
  REMOVE: "remove",
};

const PosterStyle = styled.img`
  height: auto;
  box-shadow: 0 2px 5px #000;
  width: 100%;
  height: 100%;
  border-radius: 7px;
  object-fit: cover;
`;

const HoverDiv = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
  top: 0%;
  position: absolute;
  width: 100%;
  border-radius: 7px;
  box-shadow: 0 2px 5px #000;
`;

const TitleContainer = styled.div`
  margin-top: 10px;
  font-family: Roboto;
  width: 100%;
`;

const IMDBContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0%;
  width: 100%;
`;

const MainContainer = styled.div`
  position: relative;
  width: fit-content;
  margin: 15px;
  height: 320px;
  width: 200px;
  border-radius: 7px;
`;

const CardContainer = styled.div`
  width: 100%;
  border-radius: 7px;
  position: relative;
  box-shadow: 0 2px 5px #000;
  height: 95%;
`;

const ButtonsContainer = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  justify-content: space-around;
  padding: 30%;
  align-items: center;
`;

const IconStyling = {
  fontSize: "60px",
  color: "white",
};

const StyledInfoIcon = styled(InfoCircleFilled)`
  position: absolute;
  font-size: 30px;
  right: 7%;
  top: 5%;
  color: white;
`;

interface MovieCardProps {
  isInList: boolean;
  isWatched: boolean;
  movieID: number;
  posterPath?: string;
  movieRating: number;
  title: string;
  updateList: () => void;
  showModal: (movieID: number) => void;
  updateOnChange?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = (props) => {
  const [movieState, setMovieState] = useState(
    props.isInList ? MOVIE_STATE.ADD : MOVIE_STATE.REMOVE
  );
  const [isHovering, setIsHovering] = useState(false);
  const [isWatched, setIsWatched] = useState(props.isWatched);

  const noPoster = "/NoPoster.jpg";

  const toggleHover = (value: boolean) => {
    setIsHovering(value);
  };

  const handleWatchedToggle = () => {
    const newWatchedState = !isWatched;
    API.setMoviedWatched(
      props.movieID,
      newWatchedState,
      () => {
        setIsWatched(newWatchedState);
        message.success(newWatchedState ? "Watched" : "Not Watched");
        props.updateList();
      },
      (e) => {
        Logger.error(e);
        console.error(e, "Toggle Watched");
        message.error(
          newWatchedState
            ? "Failed To Mark as Watched"
            : "Failed To Mark as Not Watched"
        );
      }
    );
  };

  const handleAddMovie = () => {
    API.addMovieToUserList(
      props.movieID,
      () => {
        message.success("You Added This Movie To Your List");
        setMovieState(MOVIE_STATE.ADD);
        if (props.updateOnChange) props.updateList();
      },
      () => {
        message.error("Failed To Add This Movie To Your List");
      }
    );
  };

  const handleRemoveMovie = () => {
    API.removeMovieFromMyList(
      props.movieID,
      () => {
        message.success("You Removed This Movie From Your List");
        setIsWatched(false);
        setMovieState(MOVIE_STATE.REMOVE);
        if (props.updateOnChange) props.updateList();
      },
      () => {
        message.error("Failed To Remove This Movie From Your List");
      }
    );
  };

  const hoverDiv = isHovering && (
    <HoverDiv>
      <StyledInfoIcon
        onClick={() => {
          props.showModal(props.movieID);
        }}
      />
      <ButtonsContainer>
        {movieState === MOVIE_STATE.REMOVE ? (
          <>
            <PlusOutlined style={IconStyling} onClick={handleAddMovie} />
          </>
        ) : (
          <>
            {isWatched ? (
              <CheckOutlined
                style={IconStyling}
                onClick={handleWatchedToggle}
              />
            ) : (
              <EyeOutlined style={IconStyling} onClick={handleWatchedToggle} />
            )}
            <MinusOutlined style={IconStyling} onClick={handleRemoveMovie} />
          </>
        )}
      </ButtonsContainer>
    </HoverDiv>
  );

  return (
    <MainContainer>
      <CardContainer
        onMouseEnter={() => toggleHover(true)}
        onMouseLeave={() => toggleHover(false)}
      >
        <PosterStyle
          draggable={false}
          src={
            props.posterPath
              ? "https://image.tmdb.org/t/p/original/" + props.posterPath
              : noPoster
          }
        />
        {hoverDiv}
        <IMDBContainer>
          <IMDbRating rating={props.movieRating} />
        </IMDBContainer>
      </CardContainer>
      <TitleContainer>
        <Popover placement="bottom" content={props.title}>
          <Text ellipsis={true} style={{ width: "200px", color: "#c1c1c1" }}>
            {props.title}
          </Text>
        </Popover>
      </TitleContainer>
    </MainContainer>
  );
};

export default MovieCard;
