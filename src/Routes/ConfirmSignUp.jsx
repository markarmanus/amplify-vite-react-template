import { useLocation, useNavigate } from "react-router";
import { KeyOutlined } from "@ant-design/icons";
import GenericInput from "../UI/Input";
import { useState } from "react";
import styled from "styled-components";
import NavBar from "../UI/NavBar";
import BlurDiv from "../UI/BlurDiv";
import backgroundImage from "../StarsBG.jpg";
import AppButton from "../UI/Button";
import API from "../API/API";
import Modal from "../UI/Modal";
import { message } from "antd";

const iconStyling = {
  color: "#c1c1c1",
  fontSize: "18px",
  marginLeft: "8px",
};

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const ConfirmSignUp = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log(state?.email);
  const [code, setCode] = useState("");
  const onSubmitCode = () => {
    API.validateSignUp(
      { code, email: state.email },
      () => {
        message.success(
          "You'r account has been verefied. Login Now to Access the App",
          3000
        );
        navigate("/");
      },
      () => {
        message.error("The Code is Incorrect!");
      }
    );
  };

  return (
    <div style={{ height: "100%" }}>
      <NavBar
        username={null}
        showMyListIcon={false}
        showSearchBar={false}
        showLoginButton={true}
        showSignUpButton={false}
        showLogOutButton={false}
      />
      <BlurDiv style={{ height: "100%" }} blurDegree={"3px"}>
        <StyledImage src={backgroundImage} alt="oops" />
      </BlurDiv>
      <div>
        <Modal closable={false}>
          <h1 style={{ color: "#c1c1c1", marginLeft: "10px" }}>
            Confirm Your Code
          </h1>
          <GenericInput
            inputType={"text"}
            icon={<KeyOutlined style={iconStyling} />}
            placeholderValue={"Email Confirmation Code"}
            inputValue={code}
            onInputChange={(event) => setCode(event.target.value)}
          />
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <AppButton
              text={"Submit"}
              height={"53px"}
              width={"165px"}
              color={"#c1c1c1"}
              fontSize={"24px"}
              backgroundColor={"#303030"}
              onClick={onSubmitCode}
              disabled={code.length < 1}
              disabledColor={"#505050"}
              disabledBackgroundColor={"#262626"}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ConfirmSignUp;
