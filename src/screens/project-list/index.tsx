import { useState, useEffect } from "react";
import { SearchPanel } from "./search-panel";
import { List, TableList } from "./table-list";
import { clearParam, useMount, useDebounce } from "./util";
import { useHttp } from "utils/http";
import styled from "@emotion/styled";
import { Typography } from "antd";
import { useAsync } from "utils/use-async";
export const ProjectList = () => {
  const [param, setParam] = useState({
    name: "",
    personId: "",
  });
  const [users, setUsers] = useState([]);
  const debouncedParam = useDebounce(param, 500);
  const client = useHttp();
  // <List[]>: 定义了use-async.ts中的泛型<D>是List数组类型，即List[]
  const { isLoading, error, data: list, run } = useAsync<List[]>();
  // param改变的时候，获取项目列表，接口代码
  useEffect(() => {
    run(client("projects", { data: clearParam(debouncedParam) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedParam]);

  useMount(() => {
    client("users").then(setUsers);
  });
  return (
    <Container>
      <SearchPanel param={param} users={users} setParam={setParam} />
      {error ? (
        <Typography.Text type={"danger"}>{error.message}</Typography.Text>
      ) : null}
      {/* dataSource,loading, users，透传给了TableList组件，除了users，其他两个都被TableList组件以props属性接收 */}
      {/* 从useAsync的定义中可知，list有可能是null，因此是 list || [] */}
      <TableList dataSource={list || []} users={users} loading={isLoading} />
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`;
