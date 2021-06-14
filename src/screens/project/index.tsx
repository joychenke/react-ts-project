import { Link } from "react-router-dom";
import { Route, Routes, Navigate } from "react-router";
import { EpicScreen } from "screens/epic";
import { KanbanScreen } from "screens/kanban";

export const ProjectScreen = () => {
  return (
    <div>
      <h1>ProjectScreen</h1>
      <Link to={"kanban"}>看板</Link>
      <Link to={"epic"}>任务组</Link>
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
    </div>
  );
};
