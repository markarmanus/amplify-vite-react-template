import React, { useEffect } from "react";
import styled from "styled-components";
import NavBar from "../UI/NavBar";
import LoginModal from "../UI/LoginModal";
import BlurDiv from "../UI/BlurDiv";
import API from "../APIs/API";
import { useNavigate } from "react-router";

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Login: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkLogin = async () => {
      const isLoggedIn = await API.isLoggedIn();
      if (isLoggedIn) {
        navigate("/");
      }
    };

    checkLogin();
  }, [navigate]);

  const backgroundImage = "../StarsBG.jpg";

  return (
    <div style={{ height: "100%" }}>
      <NavBar
        username={undefined}
        showMyListIcon={false}
        showSearchBar={false}
        showLoginButton={false}
        showSignUpButton={true}
        showLogOutButton={false}
      />
      <BlurDiv style={{ height: "100%" }} blurDegree={"3px"}>
        <StyledImage src={backgroundImage} alt="oops" />
      </BlurDiv>

      <LoginModal />
    </div>
  );
};

export default Login;
