import React from "react";
import styled from "styled-components";

interface AppButtonProps {
  height: string;
  width: string;
  color: string;
  fontSize: string;
  backgroundColor: string;
  border?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  disabledColor?: string;
  disabledBackgroundColor?: string;
  icon?: React.ReactNode;
  text: string;
}

const StyledButton = styled.button<{
  $disabled: boolean;
  $disabledColor?: string;
  $backgroundcolor: string;
  $disabledBackgroundColor?: string;
  $border?: string;
  height: string;
  width: string;
  fontSize: string;
}>`
  cursor: pointer;
  height: ${(props) => props.height};
  width: ${(props) => props.width};
  text-align: center;
  color: ${(props) => (props.$disabled ? props.$disabledColor : props.color)};
  font-size: ${(props) => props.fontSize};
  background-color: ${(props) =>
    props.$disabled ? props.$disabledBackgroundColor : props.$backgroundcolor};
  margin: 10px;
  border: ${(props) => (props.$border === undefined ? "none" : props.$border)};
  outline: none;
  cursor: ${(props) => (!props.$disabled ? "pointer" : "not-allowed")};
`;

const AppButton: React.FC<AppButtonProps> = ({
  height,
  width,
  color,
  fontSize,
  backgroundColor,
  border,
  onClick,
  disabled = false,
  disabledColor,
  disabledBackgroundColor,
  icon,
  text,
}) => (
  <StyledButton
    height={height}
    width={width}
    color={color}
    fontSize={fontSize}
    $backgroundcolor={backgroundColor}
    $border={border}
    onClick={onClick}
    $disabled={disabled}
    $disabledColor={disabledColor}
    $disabledBackgroundColor={disabledBackgroundColor}
  >
    {icon}
    {text}
  </StyledButton>
);

export default AppButton;
