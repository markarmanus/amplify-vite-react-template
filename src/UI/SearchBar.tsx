import React, { useState } from "react";
import styled from "styled-components";
import { SearchOutlined } from "@ant-design/icons";

const searchIconStyling = {
  color: "#c1c1c1",
  fontSize: "14px",
  marginRight: "8px",
  marginLeft: "4px",
};

const StyledInput = styled.input<{ backgroundColor?: string }>`
  background-color: ${(props) =>
    props.backgroundColor === undefined
      ? "rgba(0,0,0,0)"
      : props.backgroundColor};
  color: #c1c1c1;
  width: 200px;
  border: none;
  outline: none;
  font-size: 14px;
`;

const OuterDiv = styled.div<{ backgroundColor?: string }>`
  background-color: ${(props) =>
    props.backgroundColor === undefined
      ? "rgba(0,0,0,0)"
      : props.backgroundColor};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  border-radius: 8px;
  width: 255px;
  height: fit-content;
  margin: 10px;
`;

interface SearchBarProps {
  backgroundColor?: string;
  onInputChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  backgroundColor,
  onInputChange,
}) => {
  const [searchValue, setSearchValue] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    onInputChange(value);
  };

  return (
    <OuterDiv backgroundColor={backgroundColor}>
      <SearchOutlined style={searchIconStyling} />
      <StyledInput
        backgroundColor={backgroundColor}
        placeholder="Search"
        type="text"
        value={searchValue}
        onChange={handleInputChange}
      />
    </OuterDiv>
  );
};

export default SearchBar;
