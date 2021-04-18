import styled from "@emotion/styled";
import { Row } from "components/lib";
import { useAuth } from "context/auth-context";
import { ProjectList } from "screens/project-list";
import { ReactComponent as SoftwareLogo } from "assets/software-logo.svg";
import { Button, Dropdown, Menu } from "antd";
import { Navigate, Route, Routes } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { ProjectScreen } from "screens/project";
import { resetRoute } from "utils";

/**
 * grid和flex应用的场景
 * 1，是一维布局还是二维布局
 * 一维的意思是，仅仅是一个方向(横或纵), 二维的意思是，两个方向都有(横和纵)。一般来说，一维布局用flex，二维布局用grid
 *  2，是从内容出发，还是从布局出发
 * 从内容出发：先有一组内容（数量不固定），内容均匀分布在容器中，由内容自己大小决定容器的大小
 * 从布局出发：先规划网格（数量一般比较固定）,然后把元素往里填充
 * 从内容出发用flex，从布局出发用grid
 */

export const AuthenticatedApp = () => {
  return (
    <Container>
      <PageHeader />
      <Main>
        <Router>
          {/* 在react-router 6中路由都用Routes包裹起来 */}
          <Routes>
            <Route path={"/projects"} element={<ProjectList />}></Route>
            {/* 不加 * 的话，projects/1/kanban 将不会渲染 */}
            <Route
              path={"/projects/:projectId/*"}
              element={<ProjectScreen />}
            ></Route>
            {/* 默认跳转到 /projects */}
            <Navigate to={"/projects"}></Navigate>
          </Routes>
        </Router>
      </Main>
    </Container>
  );
};

// 将header部分的内容抽离出来
const PageHeader = () => {
  const { logout, user } = useAuth();
  return (
    <Header between={true}>
      <HeaderLeft gap={1}>
        <Button type={"link"} onClick={resetRoute}>
          <SoftwareLogo width={"18rem"} color={"rgb(38, 132, 255)"} />
        </Button>
        <h2>项目</h2>
        <h2>用户</h2>
      </HeaderLeft>
      <HeaderRight>
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key={"logout"}>
                <Button type={"link"} onClick={logout}>
                  登出
                </Button>
              </Menu.Item>
            </Menu>
          }
        >
          <Button type={"link"} onClick={(e) => e.preventDefault()}>
            Hi, {user?.name}
          </Button>
        </Dropdown>
      </HeaderRight>
    </Header>
  );
};

const Container = styled.div`
  height: 100vh;
`;

// 有两种方式，一种通过Header传参between，一种通过将样式写在Header的定义中
const Header = styled(Row)`
  /* justify-content: space-between; */
  padding: 3.2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
`;
const HeaderLeft = styled(Row)``;
const HeaderRight = styled.div``;
const Main = styled.main``;
