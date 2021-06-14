import { useQuery } from "react-query";
import { Task } from "types/task";
import { useHttp } from "./http";

// 获取任务信息的hook
export const useTasks = (param?: Partial<Task>) => {
  const client = useHttp();
  return useQuery<Task[]>(["tasks", param], () =>
    client("tasks", { data: param })
  );
};
