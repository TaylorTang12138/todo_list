import SideBar from "./components/sideBar";
import MainPanel from "./components/mainPanel";
import styled from "@emotion/styled";

const MainContainer = styled.div`
  display: flex;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
`;

// import './index.scss'

const MainLayout = () => {
  return (
    <MainContainer>
      <SideBar />
      <MainPanel />
    </MainContainer>
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
