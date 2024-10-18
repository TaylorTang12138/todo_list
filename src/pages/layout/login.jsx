import styled from "@emotion/styled";
import { Button } from "@mui/material";

const LoginWrapper = styled.div`
  padding-top: 25px;
  height: 100vh;
  position: relative;
  text-align: center;

  .header_bg {
    position: absolute;
    width: 100%;
    height: 70%;
    top: 0;
    background-image: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0),
        rgba(255, 255, 255, 1)
      ),
      url(${require("../../assets/images/head/head.png")});
    background-size: cover;
    background-position: center;
  }

  .name {
    position: absolute;
    top: 75%;
    font-size: 20px;
    text-align: center;
    width: 85%;
    left: 7.5%;
    font-weight: bold;
    /* border: 1px solid red; */
  }

  button {
    font-size: 18px;
    position: absolute;
    top: 85%;
    left: 15%;
    width: 70%;
    -webkit-app-region: no-drag;
  }
`;

const LoginPanel = (props) => {
  const { onLogin } = props;
  return (
    <LoginWrapper>
      <div className="header_bg"></div>
      <div className="name">Development✨</div>
      <Button variant="contained" onClick={onLogin}>
        进入日程
      </Button>
    </LoginWrapper>
  );
};

export default LoginPanel;
