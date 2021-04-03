import { useState, useEffect } from "react";
import { SearchPanel } from "./search-panel";
import { TableList } from "./table-list";
import { clearParam, useMount, useDebounce } from "./util";
import { useHttp } from "utils/http";
import styled from "@emotion/styled";
export const ProjectList = () => {
  const [param, setParam] = useState({
    name: "",
    personId: "",
  });
  const [users, setUsers] = useState([]);
  const [list, setList] = useState([]);
  const debouncedParam = useDebounce(param, 2000);
  const client = useHttp();
  // param改变的时候，获取项目列表，接口代码
  useEffect(() => {
    client("projects", { data: clearParam(debouncedParam) }).then(setList);
  }, [debouncedParam]);

  useMount(() => {
    client("users").then(setUsers);
  });
  return (
    <Container>
      <SearchPanel param={param} users={users} setParam={setParam} />
      <TableList list={list} users={users} />
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`;
