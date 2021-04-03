import styled from "@emotion/styled";
import { Card } from "antd";
import { useState } from "react";
import { LoginScreen } from "./login";
import { RegisterScreen } from "./register";

export const UnauthenticatedApp = () => {
  const [isRegister, setIsRegister] = useState(false);
  return (
    <Container>
      <Card>
        {isRegister ? <RegisterScreen /> : <LoginScreen />}
        <button onClick={() => setIsRegister(!isRegister)}>
          切换到{isRegister ? "登录" : "注册"}
        </button>
      </Card>
    </Container>
  );
};

// styled后面必须跟html标签
// 渲染出来的是 class为css-1260ujn的div标签
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;
