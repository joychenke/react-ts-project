import { useState } from "react";
import { SearchPanel } from "./search-panel";
import { TableList } from "./table-list";
import { useDebounce } from "./util";
import styled from "@emotion/styled";
import { Typography } from "antd";
import { useProject } from "utils/project";
import { useUser } from "utils/user";
import { useDocumentTitle } from "utils";
import { useUrlQueryParam } from "utils/url";
export const ProjectList = () => {
  // 基本类型，可以放到依赖里;组件状态，可以放到依赖里；非组件状态的对象，绝对不可以放到依赖里
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);
  console.log("param:", param);
  // 每次渲染时，都会重新创建了一个新对象；导致两次渲染传入useDebounce的对象不一样，导致了useDebounce一直在执行
  const debouncedParam = useDebounce(param, 500);
  const { isLoading, error, data: list } = useProject(debouncedParam);
  const { data: users } = useUser();
  useDocumentTitle("项目列表", false);

  // console.log(useUrlQueryParam(['name']))
  // const test = useUrlQueryParam(['name'])

  return (
    <Container>
      {/* 泛型，不指定类型，根据传入的值，动态判断类型 */}
      <SearchPanel param={param} users={users || []} setParam={setParam} />
      {error ? (
        <Typography.Text type={"danger"}>{error.message}</Typography.Text>
      ) : null}
      {/* dataSource,loading, users，透传给了TableList组件，除了users，其他两个都被TableList组件以props属性接收 */}
      {/* 从useAsync的定义中可知，list有可能是null，因此是 list || [] */}
      <TableList
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
