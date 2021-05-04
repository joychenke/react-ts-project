import { useCallback, useEffect } from "react";
import { List } from "screens/project-list/table-list";
import { clearParam } from "screens/project-list/util";
import { useHttp } from "./http";
import { useAsync } from "./use-async";

// 获取列表信息的hook
export const useProject = (param?: Partial<List>) => {
  const client = useHttp();
  const fetchProjects = useCallback(
    () => client("projects", { data: clearParam(param || {}) }),
    // client被加到依赖里了，所以要修改useHttp，使useHttp只有在需要的时候，才返回一个新的client方法
    [client, param]
  );
  // useAsync方法里的<D>是<List[]>
  const { run, ...result } = useAsync<List[]>();
  useEffect(() => {
    run(fetchProjects(), {
      retry: fetchProjects,
    });
    // run, fetchProjects作为方法，能够放在依赖里的前提条件是，前面已经做过处理，给他们包上了useCallback
  }, [param, run, fetchProjects]);
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
