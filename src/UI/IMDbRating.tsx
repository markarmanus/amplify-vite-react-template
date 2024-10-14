import styled from "styled-components";

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
`;

const StyledRating = styled.div`
  font-size: 18px;
  color: #c1c1c1;
`;

const StyledIcon = styled.img`
  align-self: center;
  margin: 5px;
  margin-right: 15px;
`;

interface IMDbRatingProps {
  rating?: number | null;
}

const IMDbRating: React.FC<IMDbRatingProps> = ({ rating }) => {
  return (
    <StyledDiv>
      <StyledIcon
        src="/IMDb-Icon.png"
        alt="IMDb Icon"
        width="auto"
        height="20px"
      />
      <StyledRating>{rating ? `${rating} / 10` : "N/A"}</StyledRating>
    </StyledDiv>
  );
};

export default IMDbRating;
