import { useLocation } from "react-router";
import { useProjectDetail } from "utils/project";

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

export const useKanbansQueryKey = () => ["kanbans", useKanbanSearchParams];

export const useTasksSearchParams = () => ({ projectId: useProjectIdInUrl() });

export const useTasksQueryKey = () => ["tasks", useTasksSearchParams];
