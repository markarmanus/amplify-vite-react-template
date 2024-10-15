import React, { useState } from "react";
import styled from "styled-components";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const StyledInput = styled.input`
  color: #c1c1c1;
  background-color: #303030;
  width: 495px;
  border: none;
  outline: none;
  font-size: 16px;
`;

const OuterDiv = styled.div`
  background-color: #303030;
  display: flex;
  align-items: center;
  padding: 5px;
  padding-right: 10px;
  justify-content: left;
  width: 550px;
  margin: 10px;
`;

const passwordIconStyling: React.CSSProperties = {
  color: "#c1c1c1",
  fontSize: "18px",
  display: "flex",
};

interface GenericInputProps {
  icon?: React.ReactNode;
  placeholderValue: string;
  inputType: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  inputValue: string;
}

const GenericInput: React.FC<GenericInputProps> = ({
  icon,
  placeholderValue,
  inputType,
  onInputChange,
  onInputBlur,
  inputValue,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const getInputPasswordIcon = () => {
    if (inputType === "password") {
      return showPassword ? (
        <EyeOutlined style={passwordIconStyling} onClick={toggleShowPassword} />
      ) : (
        <EyeInvisibleOutlined
          style={passwordIconStyling}
          onClick={toggleShowPassword}
        />
      );
    }
    return null;
  };

  return (
    <OuterDiv>
      <div style={{ marginRight: "3px", display: "flex" }}>{icon}</div>
      <StyledInput
        placeholder={placeholderValue}
        type={showPassword ? "text" : inputType}
        onChange={onInputChange}
        onBlur={onInputBlur}
        value={inputValue}
      />
      <div>{getInputPasswordIcon()}</div>
    </OuterDiv>
  );
};

export default GenericInput;
