/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Checkbox } from "antd";
import styled from "styled-components";
import { GenreFilter } from "./types";
const StyledCheckBox = styled(Checkbox)`
  color: white;
  margin: 5px;
`;

const FiltersGroupDiv = styled.div`
  display: flex;
  height: 120px;
  padding: 10px;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

interface FiltersGroupProps {
  filters: string[];
  onUpdateFilter: (activeFilters: GenreFilter) => void;
}

const FiltersGroup: React.FC<FiltersGroupProps> = ({
  filters,
  onUpdateFilter,
}) => {
  const onChange = (selectedFilters: string[]) => {
    const newActiveFilters: any = {};
    selectedFilters.forEach((filter) => {
      newActiveFilters[filter] = true;
    });
    onUpdateFilter(newActiveFilters);
  };

  const genreFilters = filters.map((element, i) => (
    <StyledCheckBox key={i} value={element}>
      {element}
    </StyledCheckBox>
  ));

  return (
    <Checkbox.Group onChange={onChange}>
      <FiltersGroupDiv>{genreFilters}</FiltersGroupDiv>
    </Checkbox.Group>
  );
};

export default FiltersGroup;
