import { User } from "types/User";
import { clearParam, useMount } from "screens/project-list/util";
import { useHttp } from "./http";
import { useAsync } from "./use-async";

// 获取用户信息的hook
export const useUser = (param?: Partial<User>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<User[]>();
  useMount(() => {
    run(client("users", { data: clearParam(param || {}) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });
  return result;
};
