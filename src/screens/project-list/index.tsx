import { useState, useEffect } from "react";
import { SearchPanel } from "./search-panel.jsx";
import { TableList } from "./table-list.jsx";
import qs from "qs";
import { clearParam, useMount, useDebounce } from "./util";
const apiUrl = process.env.REACT_APP_API_URL;
export const ProjectList = () => {
  const [param, setParam] = useState({
    name: "",
    personId: "",
  });
  const [users, setUsers] = useState([]);
  const [list, setList] = useState([]);
  const debouncedParam = useDebounce(param, 2000);
  // param改变的时候，获取项目列表，接口代码
  useEffect(() => {
    fetch(`${apiUrl}/projects?${qs.stringify(clearParam(param))}`).then(
      async (response) => {
        if (response.ok) {
          setList(await response.json());
        }
      }
    );
  }, [debouncedParam]);

  useMount(() => {
    fetch(`${apiUrl}/users`).then(async (response) => {
      if (response.ok) {
        setUsers(await response.json());
      }
    });
  });
  return (
    <div>
      <SearchPanel param={param} users={users} setParam={setParam} />
      <TableList list={list} users={users} />
    </div>
  );
};
