import styled from "@emotion/styled";
import { Button, Card, Divider, Typography } from "antd";
import { useState } from "react";
import { LoginScreen } from "./login";
import { RegisterScreen } from "./register";
import logo from "assets/logo.svg";
import left from "assets/left.svg";
import right from "assets/right.svg";
import { Helmet } from "react-helmet";

export const UnauthenticatedApp = () => {
  const [isRegister, setIsRegister] = useState(false);
  // error变量是子组件改变父组件中变量的例子。onError属性绑定了setError方法传到了子组件
  const [error, setError] = useState<Error | null>(null);
  return (
    <Container>
      <Helmet>
        <title>请登录或注册以继续使用</title>
      </Helmet>
      <Header />
      <Background />
      <ShadowCard>
        <Title>{isRegister ? "请注册" : "请登录"}</Title>
        {error ? (
          <Typography.Text type={"danger"}>{error.message}</Typography.Text>
        ) : null}
        {isRegister ? (
          <RegisterScreen onError={setError} />
        ) : (
          <LoginScreen onError={setError} />
        )}
        <Divider></Divider>
        <Button type={"link"} onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "已经注册了? 直接登录" : "没有账号？注册新账号"}
        </Button>
      </ShadowCard>
    </Container>
  );
};

const Title = styled.h2`
  margin-bottom: 2.4rem;
  color: rgb(94, 108, 132);
`;

// 将两个背景图，通过background相关属性一次设置好
const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: left bottom, right bottom;
  background-size: calc(((100vw - 40rem) / 2) - 3.2rem),
    calc(((100vw - 40rem) / 2) - 3.2rem), cover;
  background-image: url(${left}), url(${right});
`;

// 反引号可参照魔法字符串传入参数
const Header = styled.header`
  background: url(${logo}) no-repeat center;
  padding: 5rem 0;
  background-size: 8rem;
  width: 100%;
`;

// styled后面必须跟html标签
// 渲染出来的是 class为css-1260ujn的div标签
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

// 变量名首字母大写，需要包装的antd标签作为styled的传参
const ShadowCard = styled(Card)`
  width: 40rem;
  min-height: 56rem;
  padding: 3.2rem 4rem;
  border-radius: 0.3rem;
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.1) 0 0 10px;
  text-align: center;
`;

export const LongButton = styled(Button)`
  width: 100%;
`;
