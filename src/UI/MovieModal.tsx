import React from "react";
import styled from "styled-components";
import YouTube from "react-youtube";
import Modal from "./Modal";
import IMDbRating from "./IMDbRating";

interface MovieModalProps {
  closeModal: () => void;
  poster: string;
  movieTitle: string;
  IMDb: number;
  runTime: number;
  genres: string;
  releaseDate: string;
  cast: string;
  info: string;
  trailerID: string;
}

const OuterDiv = styled.div`
  display: flex;
  width: 1060px;
  height: 680px;
  margin: -15px 0px;
`;

const AllInfoDiv = styled.div`
  width: 100%;
  padding: 10px;
  padding-top: 15px;
`;

const AddAndIMDbDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0px 35px;
`;

const IMDbInfoDiv = styled.div`
  height: 280px;
  color: #c1c1c1;
  font-size: 18px;
  padding-top: 10px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-thumb {
    background: #303030;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const StaffInfoDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #828282;
  font-size: 14px;
  margin: 10px;
`;

const VideoDiv = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;

const StyledPoster = styled.img`
  align-self: center;
  margin: 10px;
`;

const MovieModal: React.FC<MovieModalProps> = (props) => {
  const opts = {
    height: "230",
    width: "409",
    playerVars: {
      autoplay: 0,
    },
  };

  const _onReady = (event: { target: { pauseVideo: () => void } }) => {
    event.target.pauseVideo();
  };

  return (
    <Modal closable={true} closeModal={props.closeModal}>
      <OuterDiv>
        <StyledPoster
          src={props.poster}
          alt="Movie Poster"
          width="auto"
          height="632px"
        />
        <AllInfoDiv>
          <h1
            style={{ color: "#c1c1c1", marginBottom: "0px", fontSize: "32px" }}
          >
            {props.movieTitle}
          </h1>
          <AddAndIMDbDiv>
            <IMDbRating rating={props.IMDb} />
          </AddAndIMDbDiv>
          <IMDbInfoDiv>
            <div style={{ textAlign: "center" }}>
              {props.runTime} minutes | {props.genres} | {props.releaseDate}
            </div>
            <StaffInfoDiv>
              <div style={{ marginLeft: "23px" }}>Cast: {props.cast}</div>
            </StaffInfoDiv>
            <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
              {props.info}
            </div>
          </IMDbInfoDiv>
          <VideoDiv>
            <YouTube
              style={{ position: "relative" }}
              videoId={props.trailerID}
              opts={opts}
              onReady={_onReady}
            />
          </VideoDiv>
        </AllInfoDiv>
      </OuterDiv>
    </Modal>
  );
};

export default MovieModal;
