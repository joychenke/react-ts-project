// 当一个组件中有多个export的项，可以导出为*
import * as auth from "auth-provider";
import { FullPageErrorFallback, FullPageLoading } from "components/lib";
import { default as React, ReactNode, useCallback } from "react";
import { User } from "screens/project-list/search-panel";
import { useMount } from "screens/project-list/util";
import { http } from "utils/http";
import { useAsync } from "utils/use-async";
import * as authStore from "store/auth.slice";
import { useDispatch, useSelector } from "react-redux";

export interface AuthForm {
  username: string;
  password: string;
}

// 用type定义类型别名
// type authForm = {username: string, password: string}
// 类型别名和interface一般等价使用，但是 在或操作符、utility type时，只能用类型别名实现

export const bootstrapUser = async () => {
  let user = null;
  const token = auth.getToken();
  if (token) {
    let data = await http("me", { token });
    user = data.user;
  }
  return user;
};

// 一层一层包裹，向上传递，AuthProvider -> AppProvider -> 顶层index.tsx，这样确保了页面在渲染时，就会执行此处AuthProvider方法体中定义的方法
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { error, isLoading, isIdle, isError, run } = useAsync<User | null>();

  const dispatch: (...args: unknown[]) => Promise<User> = useDispatch();
  useMount(() => {
    run(dispatch(authStore.bootstrap()));
  });

  if (isIdle || isLoading) {
    return <FullPageLoading></FullPageLoading>;
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  return <div>{children}</div>;
};

// 其他组件要访问login等，直接通过调用useAuth()访问
export const useAuth = () => {
  const dispatch: (...args: unknown[]) => Promise<User> = useDispatch();
  const user = useSelector(authStore.selectUser);
  // 当返回一个函数时，记得加上useCallback
  const login = useCallback(
    (form: AuthForm) => dispatch(authStore.login(form)),
    [dispatch]
  );
  const register = useCallback(
    (form: AuthForm) => dispatch(authStore.register(form)),
    [dispatch]
  );
  const logout = useCallback(() => dispatch(authStore.logout()), [dispatch]);
  return {
    user,
    login,
    register,
    logout,
  };
};
