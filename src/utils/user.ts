import { User } from "types/User";
import { useHttp } from "./http";
import { useQuery } from "react-query";

// 获取用户信息的hook
export const useUser = (param?: Partial<User>) => {
  const client = useHttp();
  return useQuery<User[]>(["users", param], () =>
    client("users", { data: param })
  );
};
