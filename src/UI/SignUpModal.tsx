import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import validator from "validator";
import passwordValidator from "password-validator";
import styled from "styled-components";
import API from "../APIs/API";
import AppButton from "./Button";
import GenericInput from "./Input";
import Modal from "./Modal";
import ValidationNotice from "./ValidityNotice";
import { UserOutlined, KeyOutlined, MailOutlined } from "@ant-design/icons";
import Logger from "../modules/Logger";

const iconStyling = {
  color: "#c1c1c1",
  fontSize: "18px",
  marginLeft: "8px",
};

const NoticeContainer = styled.div`
  margin-left: 20px;
  height: 18px;
`;

const passwordLength = new passwordValidator().is().min(8);
const passwordLetters = new passwordValidator()
  .has()
  .uppercase()
  .has()
  .lowercase();
const passwordNumbers = new passwordValidator().has().digits();

const SignUpModal: React.FC = () => {
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [usernameValid, setUsernameValid] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>("");
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [passwordLen, setPasswordLen] = useState<boolean>(false);
  const [passwordLetter, setPasswordLetter] = useState<boolean>(false);
  const [passwordNumber, setPasswordNumber] = useState<boolean>(false);
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>("");
  const [confirmPasswordMatched, setConfirmPasswordMatched] =
    useState<boolean>(false);
  const [signUpValid, setSignUpValid] = useState<boolean>(false);
  const [emailValidityString, setEmailValidityString] = useState<string>("");
  const [usernameValidityString, setUsernameValidityString] =
    useState<string>("");
  const [confirmPasswordValidityString, setConfirmPasswordValidityString] =
    useState<string>("");

  const navigate = useNavigate();

  const checkSignupValidity = () => {
    setSignUpValid(
      usernameValid &&
        emailValid &&
        passwordLen &&
        passwordLetter &&
        passwordNumber &&
        confirmPasswordMatched
    );
  };

  const onInputChangeHandler = (
    value: string,
    setFunction: React.Dispatch<React.SetStateAction<string>>,
    validationFunction: () => void
  ) => {
    setFunction(value);
    validationFunction();
  };

  const isUsernameValid = (username: string) => {
    return username.length > 0;
  };

  const emailValidate = () => {
    const isValid = validator.isEmail(emailInput);
    setEmailValid(isValid);
    setEmailValidityString(isValid ? "Email is Valid!" : "Email is Invalid!");
    checkSignupValidity();
  };

  const usernameValidate = () => {
    const isValid = isUsernameValid(usernameInput);
    setUsernameValid(isValid);
    setUsernameValidityString(isValid ? "" : "");
    checkSignupValidity();
  };

  const passwordValidate = () => {
    setPasswordLen(passwordLength.validate(passwordInput) as boolean);
    setPasswordLetter(passwordLetters.validate(passwordInput) as boolean);
    setPasswordNumber(passwordNumbers.validate(passwordInput) as boolean);
    checkSignupValidity();
  };

  const confirmPasswordValidate = () => {
    const isMatched = confirmPasswordInput === passwordInput;
    setConfirmPasswordMatched(isMatched);
    setConfirmPasswordValidityString(
      isMatched ? "Password Matches!" : "Password does not match!"
    );
    checkSignupValidity();
  };

  const onSignup = () => {
    API.signUp(
      {
        username: usernameInput,
        email: emailInput,
        password: passwordInput,
      },
      (res) => {
        const data = res?.data;
        if (data?.nextStep === "CONFIRM_SIGN_UP") {
          navigate("/confirm-sign-up", { state: { email: emailInput } });
        } else {
          navigate("/");
        }
      },
      (e) => {
        Logger.error(e);
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

  const createValidityNotice = (noticeMessage: string, isValid: boolean) => {
    return <ValidationNotice noticeMessage={noticeMessage} isValid={isValid} />;
  };

  return (
    <div>
      <Modal closable={false}>
        <h1 style={{ color: "#c1c1c1", marginLeft: "10px" }}>Sign Up</h1>
        <GenericInput
          inputType={"text"}
          icon={<UserOutlined style={iconStyling} />}
          placeholderValue={"Username"}
          inputValue={usernameInput}
          onInputChange={(event) =>
            onInputChangeHandler(
              event.target.value,
              setUsernameInput,
              usernameValidate
            )
          }
        />
        <NoticeContainer>
          {usernameValidityString &&
            createValidityNotice(usernameValidityString, usernameValid)}
        </NoticeContainer>

        <GenericInput
          inputType={"email"}
          icon={<MailOutlined style={iconStyling} />}
          placeholderValue={"Email"}
          inputValue={emailInput}
          onInputChange={(event) =>
            onInputChangeHandler(
              event.target.value,
              setEmailInput,
              emailValidate
            )
          }
        />
        <NoticeContainer>
          {emailValidityString &&
            createValidityNotice(emailValidityString, emailValid)}
        </NoticeContainer>

        <GenericInput
          inputType={"password"}
          icon={<KeyOutlined style={iconStyling} />}
          placeholderValue={"Password"}
          inputValue={passwordInput}
          onInputChange={(event) => {
            onInputChangeHandler(
              event.target.value,
              setPasswordInput,
              passwordValidate
            );
          }}
        />
        <div style={{ marginLeft: "20px" }}>
          {createValidityNotice("More Than 8 Characters", passwordLen)}
          {createValidityNotice(
            "At least 1 uppercase and 1 lowercase letters",
            passwordLetter
          )}
          {createValidityNotice("At least 1 number", passwordNumber)}
        </div>

        <GenericInput
          inputType={"password"}
          icon={<KeyOutlined style={iconStyling} />}
          placeholderValue={"Confirm Password"}
          inputValue={confirmPasswordInput}
          onInputChange={(event) =>
            onInputChangeHandler(
              event.target.value,
              setConfirmPasswordInput,
              confirmPasswordValidate
            )
          }
        />
        <NoticeContainer>
          {confirmPasswordValidityString &&
            createValidityNotice(
              confirmPasswordValidityString,
              confirmPasswordMatched
            )}
        </NoticeContainer>

        <div style={{ textAlign: "center", marginTop: "35px" }}>
          <AppButton
            text={"Join"}
            height={"53px"}
            width={"165px"}
            color={"#c1c1c1"}
            fontSize={"24px"}
            backgroundColor={"#303030"}
            onClick={onSignup}
            disabled={!signUpValid}
            disabledColor={"#505050"}
            disabledBackgroundColor={"#262626"}
          />
        </div>
        <div>
          <span style={{ color: "#c1c1c1" }}>
            Try the application using our
          </span>
          <Link to="/signup" onClick={loginWithDemoAccount}>
            Demo
          </Link>
          <span style={{ color: "#c1c1c1" }}> account</span>
        </div>
        <div>
          <span style={{ color: "#c1c1c1" }}>Already have an account?</span>
          <Link to={"/login"}> Login</Link>
        </div>
      </Modal>
    </div>
  );
};

export default SignUpModal;
