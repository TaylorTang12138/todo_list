import { useState } from "react";

import LoginPanel from "./login";
import SideBar from "./components/sideBar";
import MainPanel from "./components/mainPanel";
import styled from "@emotion/styled";
import { staticGroup } from "./components/sideBar/conifg";

const MainContainer = styled.div`
  display: flex;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
`;

// import './index.scss'

const MainLayout = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [selectGroup, setSelectGroup] = useState({ ...staticGroup[0] });
  const [searchValue, setSearchValue] = useState("");

  // done:  登录
  const login = () => {
    setIsLogin(true);
    if (window.electronApi) {
      window.electronApi.invokeMethod("login-success");
    }
  };

  // done: 修改群组
  const changeGroup = (item) => {
    setSelectGroup(item);
  };

  return isLogin ? (
    <MainContainer>
      <SideBar
        changeGroup={changeGroup}
        changeSearchValue={(e) => setSearchValue(e)}
      />
      <MainPanel group={selectGroup} searchValue={searchValue} />
    </MainContainer>
  ) : (
    <LoginPanel onLogin={login}></LoginPanel>
  );
};

// const MainContainer = styled.div({
//   border: 1px solid red;
//   width: 100vw;
//   height: 100vh;

// * {
//   box-sizing: border-box;
// }
// })

export default MainLayout;
