import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import UserIcon from "./UserIcon";
import MyListIcon from "./MyListIcon";
import AppButton from "./Button";
import SearchBar from "./SearchBar";

import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import API from "../APIs/API";

const StyledNavBar = styled.div`
  z-index: 2;
  background-color: black;
  height: 50px;
  display: flex;
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  padding: 5px 20px;
  justify-content: space-between;
`;

const StyledLogo = styled.img`
  align-self: center;
  display: flex;
  margin: 5px;
`;

const DisplayedUsername = styled.span`
  color: white;
  align-items: center;
  transform: translate(0, 30%);
`;

const RightNavBarItems = styled.div`
  display: flex;
  width: 450px;
  justify-content: flex-end;
`;

const LeftNavBarItems = styled.div`
  display: flex;
  width: 450px;
  justify-content: flex-start;
`;

const MyListIconDiv = styled.div`
  position: relative;
  top: 10px;
  left: 10px;
`;

interface NavBarProps {
  showMyListIcon?: boolean;
  listCount?: number;
  showLoginButton?: boolean;
  showSignUpButton?: boolean;
  showLogOutButton?: boolean;
  showSearchBar?: boolean;
  username?: string;
  onSearchbarChange?: (searchValue: string) => void;
}

const NavBar: React.FC<NavBarProps> = (props) => {
  const Logo = "../MovieLogo.png";
  const navigate = useNavigate();
  const myListIcon = props.showMyListIcon ? (
    <Link to="/my-list">
      <MyListIconDiv>
        <MyListIcon myListNo={props.listCount} />
      </MyListIconDiv>
    </Link>
  ) : null;

  const handleLogout = async () => {
    await API.logout(() => {
      navigate("/login");
    });
  };

  const userNameDisplay = localStorage.getItem("guest")
    ? "Welcome Guest User"
    : props.username;

  const usernameAndAvatar = props.username ? (
    <div style={{ display: "flex", minWidth: "fit-content" }}>
      <UserIcon username={props.username} />
      <DisplayedUsername>{userNameDisplay}</DisplayedUsername>
    </div>
  ) : null;

  const buttonsList: Array<{
    icon: React.ReactNode;
    text: string;
    linkTo: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }> = [];
  if (props.showLoginButton)
    buttonsList.push({
      icon: <LoginOutlined style={{ color: "white", marginRight: "8px" }} />,
      text: "Login",
      linkTo: "/login",
    });

  if (props.showSignUpButton)
    buttonsList.push({
      icon: <LoginOutlined style={{ color: "white", marginRight: "8px" }} />,
      text: "Sign Up",
      linkTo: "/signup",
    });

  if (props.showLogOutButton)
    buttonsList.push({
      icon: <LogoutOutlined style={{ color: "white", marginRight: "8px" }} />,
      text: "Logout",
      linkTo: "/login",
      onClick: handleLogout,
    });

  return (
    <StyledNavBar>
      <LeftNavBarItems>
        <Link style={{ display: "flex" }} to="/">
          <StyledLogo src={Logo} alt="oops" width="auto" height="34px" />
        </Link>
        {myListIcon}
      </LeftNavBarItems>
      {props.showSearchBar && (
        <SearchBar
          onInputChange={(searchValue) =>
            props.onSearchbarChange?.(searchValue)
          }
        />
      )}
      <RightNavBarItems>
        {buttonsList.map((button) => (
          <Link to={button.linkTo} key={button.linkTo}>
            <AppButton
              text={button.text}
              icon={button.icon}
              height={"32px"}
              width={"95px"}
              color={"white"}
              onClick={button.onClick}
              fontSize={"14px"}
              backgroundColor={"rgba(0,0,0,0)"}
              border={"1px solid white"}
            />
          </Link>
        ))}
        {usernameAndAvatar}
      </RightNavBarItems>
    </StyledNavBar>
  );
};

export default NavBar;
