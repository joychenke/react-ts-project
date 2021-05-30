import { QueryKey, useMutation, useQuery } from "react-query";
import { List } from "screens/project-list/table-list";
import { useHttp } from "./http";
import {
  useAddConfig,
  useDeleteConfig,
  useEditConfig,
} from "./use-optimistic-options";

// 获取列表信息的hook
export const useProject = (param?: Partial<List>) => {
  const client = useHttp();
  // 指定返回值的类型： useQuery<List[], Error>(['projects', param]...
  return useQuery<List[]>(["projects", param], () =>
    client("projects", { data: param })
  );
};

export const useEditProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<List>) =>
      client(`projects/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    useEditConfig(queryKey)
  );
};

export const useAddProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<List>) =>
      client(`projects`, {
        data: params,
        method: "POST",
      }),
    useAddConfig(queryKey)
  );
};

export const useDeleteProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`projects/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
  );
};

export const useProjectDetail = (id?: number) => {
  const client = useHttp();
  console.log("useProjectDetail", id);
  return useQuery<List>(
    ["project", { id }],
    () => client(`projects/${id}`),
    // 一般设计api时，最后一个参数，会是配置参数
    {
      // id存在时，才会调用上面的获取详情接口
      enabled: !!id,
    }
  );
};
