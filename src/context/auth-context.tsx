// 当一个组件中有多个export的项，可以导出为*
import * as auth from "auth-provider";
import { FullPageErrorFallback, FullPageLoading } from "components/lib";
import { default as React, ReactNode } from "react";
import { User } from "screens/project-list/search-panel";
import { useMount } from "screens/project-list/util";
import { http } from "utils/http";
import { useAsync } from "utils/use-async";

interface AuthForm {
  username: string;
  password: string;
}

// 用type定义类型别名
// type authForm = {username: string, password: string}
// 类型别名和interface一般等价使用，但是 在或操作符、utility type时，只能用类型别名实现

const bootstrapUser = async () => {
  let user = null;
  const token = auth.getToken();
  if (token) {
    let data = await http("me", { token });
    user = data.user;
  }
  return user;
};

// createContext 的传参要定义泛型，否则 value={{user, login, register, logout}} 会报错
const AuthContext = React.createContext<
  | {
      user: User | null;
      login: (form: AuthForm) => Promise<void>;
      register: (form: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);
AuthContext.displayName = "AuthContext";

// 一层一层包裹，向上传递，AuthProvider -> AppProvider -> 顶层index.tsx，这样确保了页面在渲染时，就会执行此处AuthProvider方法体中定义的方法
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    run,
    setData: setUser,
  } = useAsync<User | null>();
  // then方法里,setUser 等价于 (user) => setUser(user); 函数式编程的point free概念
  const login = (form: AuthForm) => auth.login(form).then(setUser);
  const register = (form: AuthForm) => auth.register(form).then(setUser);
  const logout = () => auth.logout().then(() => setUser(null));

  // 整个App加载的时候，去获取用户数据
  useMount(() => {
    run(bootstrapUser());
  });

  if (isIdle || isLoading) {
    return <FullPageLoading></FullPageLoading>;
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  return (
    <AuthContext.Provider
      children={children}
      value={{ user, login, register, logout }}
    />
  );
};

// 其他组件要访问login等，直接通过调用useAuth()访问
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth必须在AuthProvider中使用");
  }
  // 对象，包含四个属性：login,logout,user,register
  return context;
};
