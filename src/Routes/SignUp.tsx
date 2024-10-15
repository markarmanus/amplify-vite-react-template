import React, { useEffect } from "react";
import styled from "styled-components";
import SignUpModal from "../UI/SignUpModal";
import BlurDiv from "../UI/BlurDiv";
import API from "../APIs/API";
import { useNavigate } from "react-router";
import NavBar from "../UI/NavBar";

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SignUp: React.FC = () => {
  const backgroundImage = "/StarsBG.jpg";

  const navigate = useNavigate();
  useEffect(() => {
    const checkLoginStatus = async () => {
      const isLoggedIn = await API.isLoggedIn();
      if (isLoggedIn) {
        navigate("/");
      }
    };
    checkLoginStatus();
  }, [navigate]);

  return (
    <div style={{ height: "100%" }}>
      <NavBar
        showMyListIcon={false}
        showSearchBar={false}
        showLoginButton={true}
        showSignUpButton={false}
        showLogOutButton={false}
      />
      <BlurDiv style={{ height: "100%" }} blurDegree={"3px"}>
        <StyledImage src={backgroundImage} alt="oops" />
      </BlurDiv>
      <SignUpModal />
    </div>
  );
};

export default SignUp;
