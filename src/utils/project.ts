import { useMutation, useQuery, useQueryClient } from "react-query";
import { List } from "screens/project-list/table-list";
import { useProjectsSearchParams } from "screens/project-list/util";
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
  const [searchParams] = useProjectsSearchParams();
  const queryKey = ["projects", searchParams];
  return useMutation(
    (params: Partial<List>) =>
      client(`projects/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    {
      // 上面的PATCH方法执行完后，去执行key包含projects的 useQuery
      onSuccess: () => queryClient.invalidateQueries("projects"),
      async onMutate(target: Partial<List>) {
        const previousItems = queryClient.getQueryData(queryKey);
        queryClient.setQueryData(queryKey, (old?: List[]) => {
          return (
            old?.map((project) =>
              project.id === target.id ? { ...project, ...target } : project
            ) || []
          );
        });
        return { previousItems };
      },
      // 回滚
      onError(error, newItem, context) {
        queryClient.setQueryData(
          queryKey,
          (context as { previousItems: List[] }).previousItems
        );
      },
    }
  );
};

export const useAddProject = () => {
  const client = useHttp();
  const queryClient = useQueryClient();
  return useMutation(
    (params: Partial<List>) =>
      client(`projects`, {
        data: params,
        method: "POST",
      }),
    {
      onSuccess: () => queryClient.invalidateQueries("projects"),
    }
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
