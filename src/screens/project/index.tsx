import { Link } from "react-router-dom";
import { Route, Routes, Navigate, useLocation } from "react-router";
import { EpicScreen } from "screens/epic";
import { KanbanScreen } from "screens/kanban";
import styled from "@emotion/styled";
import { Menu } from "antd";

const useRouteType = () => {
  const units = useLocation().pathname.split("/");
  return units[units.length - 1];
};
export const ProjectScreen = () => {
  const routeType = useRouteType();
  return (
    <Container>
      <Aside>
        <Menu mode={"inline"} selectedKeys={[routeType]}>
          <Menu.Item key={"kanban"}>
            <Link to={"kanban"}>看板</Link>
          </Menu.Item>
          <Menu.Item key={"epic"}>
            <Link to={"epic"}>任务组</Link>
          </Menu.Item>
        </Menu>
      </Aside>
      <Main>
        <Routes>
          {/* Route中定义的路由，会自动加到当前组件的路由后面，即新路由是： /projects/:projectId/kanban */}
          <Route path={"/kanban"} element={<KanbanScreen />} />
          <Route path={"/epic"} element={<EpicScreen />} />
          {/* 默认跳转到 /projects/:projectId/kanban  */}
          {/* 不加replace时，往后跳，到的是projects/:projectId，上面两项都不符合，又到了默认路由，所以页面上看到的是，跳转时，页面没动 */}
          <Navigate
            to={window.location.pathname + "/kanban"}
            replace={true}
          ></Navigate>
        </Routes>
      </Main>
    </Container>
  );
};

const Aside = styled.aside`
  background-color: rgb(244, 245, 247);
  display: flex;
`;

// main里面hidden，TaskContainer里scroll, 滚动条出现在taskContainer里
const Main = styled.div`
  box-shadow: -5px 0 5px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
`;

// 左边 16rem，右边自动往右扩展
const Container = styled.div`
  display: grid;
  grid-template-columns: 16rem 1fr;
`;
