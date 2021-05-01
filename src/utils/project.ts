import { useEffect } from "react";
import { List } from "screens/project-list/table-list";
import { clearParam } from "screens/project-list/util";
import { useHttp } from "./http";
import { useAsync } from "./use-async";

// 获取列表信息的hook
export const useProject = (param?: Partial<List>) => {
  const client = useHttp();
  // useAsync方法里的<D>是<List[]>
  const { run, ...result } = useAsync<List[]>();
  useEffect(() => {
    run(client("projects", { data: clearParam(param || {}) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);
  return result;
};

export const useEditProject = () => {
  const { run, ...asyncResult } = useAsync();
  const client = useHttp();
  const mutate = (params: Partial<List>) => {
    return run(
      client(`projects/${params.id}`, {
        data: params,
        method: "PATCH",
      })
    );
  };
  return {
    mutate,
    ...asyncResult,
  };
};

export const useAddProject = () => {
  const { run, ...asyncResult } = useAsync();
  const client = useHttp();
  const mutate = (params: Partial<List>) => {
    return run(
      client(`projects/${params.id}`, {
        data: params,
        method: "POST",
      })
    );
  };
  return {
    mutate,
    ...asyncResult,
  };
};
