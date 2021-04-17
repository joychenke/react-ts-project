import { useState } from "react";
import { SearchPanel } from "./search-panel";
import { TableList } from "./table-list";
import { useDebounce } from "./util";
import styled from "@emotion/styled";
import { Typography } from "antd";
import { useProject } from "utils/project";
import { useUser } from "utils/user";
import { Helmet } from "react-helmet";
export const ProjectList = () => {
  const [param, setParam] = useState({
    name: "",
    personId: "",
  });
  const debouncedParam = useDebounce(param, 500);
  const { isLoading, error, data: list } = useProject(debouncedParam);
  const { data: users } = useUser();
  return (
    <Container>
      <Helmet>
        <title>项目列表</title>
      </Helmet>
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

const Container = styled.div`
  padding: 3.2rem;
`;
