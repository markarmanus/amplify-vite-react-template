import React from "react";
import styled from "styled-components";
import FiltersGroup from "./FiltersGroup";
import RadioFilters from "./RadioFilters";
import { GenreFilter } from "./types";
const FiltersDiv = styled.div`
  display: flex;
  padding: 10px 50px;
  justify-content: space-between;
`;

const Title = styled.div`
  font-size: 22px;
  color: #c1c1c1;
`;

const DividerLine = styled.hr`
  height: 100%;
  width: 2px;
  margin: 5px;
  color: ${(props) => props.color};
`;

interface MovieFiltersProps {
  onUpdateGenreFilter: (activeFilters: GenreFilter) => void;
  onUpdateWatchedFilter: (activeFilters: string) => void;
}

const MovieFilters: React.FC<MovieFiltersProps> = ({
  onUpdateGenreFilter,
  onUpdateWatchedFilter,
}) => {
  const updateGenreFilter = (newActiveFilters: GenreFilter) => {
    onUpdateGenreFilter(newActiveFilters);
  };

  const updateWatchedFilter = (newActiveFilters: string) => {
    onUpdateWatchedFilter(newActiveFilters);
  };

  return (
    <FiltersDiv>
      <div>
        <Title>Genres</Title>
        <FiltersGroup
          onUpdateFilter={updateGenreFilter}
          filters={[
            "Action",
            "Adventure",
            "Animation",
            "Comedy",
            "Crime",
            "Documentary",
            "Drama",
            "Family",
            "Fantasy",
            "History",
            "Horror",
            "Music",
            "Mystery",
            "Romance",
            "Science Fiction",
            "Thriller",
            "War",
            "Western",
          ]}
        />
      </div>
      <div style={{ height: "100px" }}>
        <DividerLine color={"#505050"} />
      </div>

      <div style={{ float: "right" }}>
        <Title>Watched</Title>

        <RadioFilters
          defaultValue={"All"}
          onUpdateFilter={updateWatchedFilter}
          filters={["All", "Watched", "Not Watched"]}
        />
      </div>
    </FiltersDiv>
  );
};

export default MovieFilters;
