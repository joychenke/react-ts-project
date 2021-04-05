import { useEffect } from "react";
import { List } from "screens/project-list/table-list";
import { clearParam } from "screens/project-list/util";
import { useHttp } from "./http";
import { useAsync } from "./use-async";

// 获取列表信息的hook
export const useProject = (param?: Partial<List>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<List[]>();
  useEffect(() => {
    run(client("projects", { data: clearParam(param || {}) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);
  return result;
};
