import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppButton from "./Button";
import GenericInput from "./Input";
import Modal from "./Modal";
import ValidationNotice from "./ValidityNotice";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import { message } from "antd";
import API from "../APIs/API";

const iconStyling = {
  color: "#c1c1c1",
  fontSize: "18px",
  marginLeft: "8px",
};
const LoginModal: React.FC = () => {
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [incorrectLogin, setIncorrectLogin] = useState<boolean>(false);
  const navigate = useNavigate();
  const usernameInputChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUsernameInput(event.target.value);
  };

  const passwordInputChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordInput(event.target.value);
  };

  const continueButtonClick = () => {
    API.login(
      { email: usernameInput, password: passwordInput },
      () => {
        navigate("/");
      },
      (err) => {
        if (err?.error === "CONFIRM_SIGN_UP") {
          navigate("/confirm-sign-up", {
            state: { email: usernameInput },
          });
        } else {
          setIncorrectLogin(true);
        }
      }
    );
  };

  const loginWithDemoAccount = () => {
    API.loginWithDemoAccount(
      () => {
        navigate("/");
      },
      () => message.error("Something Went Wrong :(")
    );
  };

  return (
    <Modal closable={false}>
      <h1 style={{ color: "#c1c1c1", marginLeft: "10px" }}>Login</h1>
      <GenericInput
        inputType="text"
        icon={<UserOutlined style={iconStyling} />}
        placeholderValue="Email"
        inputValue={usernameInput}
        onInputChange={usernameInputChangeHandler}
      />
      <GenericInput
        inputType="password"
        icon={<KeyOutlined style={iconStyling} />}
        placeholderValue="Password"
        inputValue={passwordInput}
        onInputChange={passwordInputChangeHandler}
      />
      <div style={{ height: "20px", paddingLeft: "20px" }}>
        {incorrectLogin && (
          <ValidationNotice
            isValid={!incorrectLogin}
            noticeMessage="Incorrect email or password"
          />
        )}
      </div>
      <div style={{ textAlign: "center" }}>
        <AppButton
          text="Continue"
          height="53px"
          width="165px"
          disabled={false}
          color="#c1c1c1"
          fontSize="24px"
          backgroundColor="#303030"
          onClick={continueButtonClick}
        />
      </div>
      <div>
        <span style={{ color: "#c1c1c1" }}>Don't have an account?</span>
        <Link to="/signup"> Sign Up</Link>
        <span style={{ color: "#c1c1c1" }}> or login with the </span>
        <Link to={"/login"} onClick={loginWithDemoAccount}>
          Demo Account
        </Link>
      </div>
    </Modal>
  );
};

export default LoginModal;
