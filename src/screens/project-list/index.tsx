import { SearchPanel } from "./search-panel";
import { TableList } from "./table-list";
import { useDebounce, useProjectsSearchParams } from "./util";
import styled from "@emotion/styled";
import { Button, Typography } from "antd";
import { useProject } from "utils/project";
import { useUser } from "utils/user";
import { useDocumentTitle } from "utils";
import { Row } from "components/lib";
export const ProjectList = (props: {
  setProjectModalOpen: (isOpen: boolean) => void;
}) => {
  useDocumentTitle("项目列表", false);
  // 基本类型，可以放到依赖里;组件状态，可以放到依赖里；非组件状态的对象，绝对不可以放到依赖里
  const [param, setParam] = useProjectsSearchParams();
  const { isLoading, error, data: list, retry } = useProject(
    useDebounce(param, 500)
  );
  const { data: users } = useUser();

  return (
    <Container>
      <Row between={true}>
        <h1>项目列表</h1>
        <Button onClick={() => props.setProjectModalOpen(true)}>
          创建项目
        </Button>
      </Row>
      {/* 泛型，不指定类型，根据传入的值，动态判断类型 */}
      <SearchPanel param={param} users={users || []} setParam={setParam} />
      {error ? (
        <Typography.Text type={"danger"}>{error.message}</Typography.Text>
      ) : null}
      {/* dataSource,loading, users，透传给了TableList组件，除了users，其他两个都被TableList组件以props属性接收 */}
      {/* 从useAsync的定义中可知，list有可能是null，因此是 list || [] */}
      <TableList
        setProjectModalOpen={props.setProjectModalOpen}
        refresh={retry}
        dataSource={list || []}
        users={users || []}
        loading={isLoading}
      />
    </Container>
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
`;
