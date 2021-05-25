import { useMutation, useQuery, useQueryClient } from "react-query";
import { List } from "screens/project-list/table-list";
import { useHttp } from "./http";

// 获取列表信息的hook
export const useProject = (param?: Partial<List>) => {
  const client = useHttp();
  // 指定返回值的类型： useQuery<List[], Error>(['projects', param]...
  return useQuery<List[]>(["projects", param], () =>
    client("projects", { data: param })
  );
};

export const useEditProject = () => {
  const client = useHttp();
  const queryClient = useQueryClient();
  return useMutation(
    (params: Partial<List>) =>
      client(`projects/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    {
      // 上面的PATCH方法执行完后，去执行key包含projects的 useQuery
      onSuccess: () => queryClient.invalidateQueries("projects"),
    }
  );
};

export const useAddProject = () => {
  const client = useHttp();
  const queryClient = useQueryClient();
  return useMutation(
    (params: Partial<List>) =>
      client(`projects/${params.id}`, {
        data: params,
        method: "POST",
      }),
    {
      onSuccess: () => queryClient.invalidateQueries("projects"),
    }
  );
};
