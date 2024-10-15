import React, { useState } from "react";
import { Radio, RadioChangeEvent } from "antd";
import styled from "styled-components";

const StyledRadio = styled(Radio)`
  color: white;
  margin: 5px;
  width: 130px;
`;

const FiltersGroupDiv = styled.div`
  display: flex;
  height: 120px;
  padding: 10px;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

interface RadioFiltersProps {
  defaultValue: string;
  filters: string[];
  onUpdateFilter: (activeFilters: string) => void;
}

const RadioFilters: React.FC<RadioFiltersProps> = ({
  defaultValue,
  filters,
  onUpdateFilter,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>(defaultValue);

  const onChange = (picked: RadioChangeEvent) => {
    setActiveFilter(picked.target.value);
    onUpdateFilter(picked.target.value);
  };

  return (
    <Radio.Group onChange={onChange} value={activeFilter}>
      <FiltersGroupDiv>
        {filters.map((element, i) => (
          <StyledRadio key={i} value={element}>
            {element}
          </StyledRadio>
        ))}
      </FiltersGroupDiv>
    </Radio.Group>
  );
};

export default RadioFilters;
