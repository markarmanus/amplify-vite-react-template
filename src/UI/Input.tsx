import React, { Component } from "react";
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

interface GenericInputState {
  showPassword: boolean;
}

class GenericInput extends Component<GenericInputProps, GenericInputState> {
  state: GenericInputState = {
    showPassword: false,
  };

  toggleShowPassword = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  getInputPasswordIcon = () => {
    if (this.props.inputType === "password") {
      return this.state.showPassword ? (
        <EyeOutlined
          style={passwordIconStyling}
          onClick={this.toggleShowPassword}
        />
      ) : (
        <EyeInvisibleOutlined
          style={passwordIconStyling}
          onClick={this.toggleShowPassword}
        />
      );
    }
    return null;
  };

  render() {
    return (
      <OuterDiv>
        <div style={{ marginRight: "3px", display: "flex" }}>
          {this.props.icon}
        </div>
        <StyledInput
          placeholder={this.props.placeholderValue}
          type={this.state.showPassword ? "text" : this.props.inputType}
          onChange={this.props.onInputChange}
          onBlur={this.props.onInputBlur}
          value={this.props.inputValue}
        />
        <div>{this.getInputPasswordIcon()}</div>
      </OuterDiv>
    );
  }
}

export default GenericInput;
