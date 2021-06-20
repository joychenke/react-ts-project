import { useMemo } from "react";
import { useLocation } from "react-router";
import { useProjectDetail } from "utils/project";
import { useUrlQueryParam } from "utils/url";

export const useProjectIdInUrl = () => {
  const { pathname } = useLocation();
  // pathname.match('/projects\/{\d+}') 返回数组，第0项，是/projects/11，第1项是子项
  const id = pathname.match(/projects\/(\d+)/)?.[1];
  return Number(id);
};

export const useProjectInUrl = () => {
  return useProjectDetail(useProjectIdInUrl());
};

export const useKanbanSearchParams = () => ({ projectId: useProjectIdInUrl() });

// useKanbansQueryKey如果取值不对，则react-query的key不对，这会导致用到QueryKey的地方，也会不对，比如 useAddConfig 会失效
export const useKanbansQueryKey = () => ["kanbans", useKanbanSearchParams()];

export const useTasksSearchParams = () => {
  const [param] = useUrlQueryParam(["name", "typeId", "processorId", "tagId"]);
  const projectId = useProjectIdInUrl();
  return useMemo(
    () => ({
      projectId,
      typeId: Number(param.typeId) || undefined,
      processorId: Number(param.processorId) || undefined,
      tagId: Number(param.tagId) || undefined,
      name: param.name,
    }),
    [projectId, param]
  );
};

export const useTasksQueryKey = () => ["tasks", useTasksSearchParams()];
