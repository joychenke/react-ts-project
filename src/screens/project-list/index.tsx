import { SearchPanel } from "./search-panel";
import { TableList } from "./table-list";
import { useDebounce, useProjectModal, useProjectsSearchParams } from "./util";
import styled from "@emotion/styled";
import { useProject } from "utils/project";
import { useUser } from "utils/user";
import { useDocumentTitle } from "utils";
import { ButtonNoPadding, ErrorBox, Row } from "components/lib";
import { Profiler } from "components/profiler";
// React.memo 包裹在组件外面，组件的props变了，or 组件里依赖的变量变了，才会重新渲染
// useMemo 包裹在方法外面，是给方法用的
export const ProjectList = () => {
  const { open } = useProjectModal();
  useDocumentTitle("项目列表", false);
  // 基本类型，可以放到依赖里;组件状态，可以放到依赖里；非组件状态的对象，绝对不可以放到依赖里
  const [param, setParam] = useProjectsSearchParams();
  // useProject 在调用时，传了queryKey
  const { isLoading, error, data: list } = useProject(useDebounce(param, 500));
  const { data: users } = useUser();

  return (
    <Profiler id={"projectList"} phases={["mount", "update"]}>
      <Container>
        <Row between={true}>
          <h1>项目列表</h1>
          <ButtonNoPadding onClick={open} type={"link"}>
            创建项目
          </ButtonNoPadding>
        </Row>
        {/* 泛型，不指定类型，根据传入的值，动态判断类型 */}
        <SearchPanel param={param} users={users || []} setParam={setParam} />
        <ErrorBox error={error}></ErrorBox>
        {/* dataSource,loading, users，透传给了TableList组件，除了users，其他两个都被TableList组件以props属性接收 */}
        {/* 从useAsync的定义中可知，list有可能是null，因此是 list || [] */}
        <TableList
          dataSource={list || []}
          users={users || []}
          loading={isLoading}
        />
      </Container>
    </Profiler>
  );
};

// 只跟踪 ProjectList 组件
ProjectList.whyDidYouRender = false;
/* // 上面的 ProjectList.whyDidYouRender = true 相当于下面的内容：
class ProjectList extends React.Component<any, any>{
  static whyDidYouRender = true
} */

const Container = styled.div`
  padding: 3.2rem;
  flex: 1;
`;
