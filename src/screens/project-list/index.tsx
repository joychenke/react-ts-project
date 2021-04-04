import { useState, useEffect } from "react";
import { SearchPanel } from "./search-panel";
import { TableList } from "./table-list";
import { clearParam, useMount, useDebounce } from "./util";
import { useHttp } from "utils/http";
import styled from "@emotion/styled";
import { Typography } from "antd";
export const ProjectList = () => {
  const [isLoading, setIsLoading] = useState(false);
  // error 用了泛型定义error的类型
  const [error, setError] = useState<null | Error>(null);
  const [param, setParam] = useState({
    name: "",
    personId: "",
  });
  const [users, setUsers] = useState([]);
  const [list, setList] = useState([]);
  const debouncedParam = useDebounce(param, 500);
  const client = useHttp();
  // param改变的时候，获取项目列表，接口代码
  useEffect(() => {
    setIsLoading(true);
    client("projects", { data: clearParam(debouncedParam) })
      .then((data) => {
        setList(data);
        setError(null);
      })
      .catch((error) => {
        setList([]);
        setError(error);
      })
      .finally(() => setIsLoading(false));
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
      <TableList dataSource={list} users={users} loading={isLoading} />
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`;
