import styled from "styled-components";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Routes/Login";
import Home from "./Routes/Home";
import MyList from "./Routes/MyList";
import SignUp from "./Routes/SignUp";
import ConfirmSignUp from "./Routes/ConfirmSignUp";

const ContainerDiv = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #333333;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 6px;
    position: fixed;
  }
  ::-webkit-scrollbar-thumb {
    background: #454545;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;
const App = () => {
  const navigate = useNavigate();
  return (
    <ContainerDiv id="mainContainer">
      <Routes>
        <Route path="/" element={<Home navigate={navigate} />} />
        <Route path="/my-list" element={<MyList navigate={navigate} />} />
        <Route path="/signup" element={<SignUp navigate={navigate} />} />
        <Route path="/confirm-sign-up" element={<ConfirmSignUp />} />
        <Route path="/login" element={<Login navigate={navigate} />} />
      </Routes>
    </ContainerDiv>
  );
};

export default App;
