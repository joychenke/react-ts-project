// 当一个组件中有多个export的项，可以导出为*
import * as auth from "auth-provider";
import { default as React, ReactNode, useState } from "react";
import { User } from "screens/project-list/search-panel";
import { useMount } from "screens/project-list/util";
import { http } from "utils/http";

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // useState会查看initstate的类型,user会保持和initstate类型一致，因为user可以为User类型或null，因此useState的传参要定义泛型 <User | null>
  // <User | null>, User |(或) null, 组成联合类型
  const [user, setUser] = useState<User | null>(null);
  // then方法里,setUser 等价于 (user) => setUser(user); 函数式编程的point free概念
  const login = (form: AuthForm) => auth.login(form).then(setUser);
  const register = (form: AuthForm) => auth.register(form).then(setUser);
  const logout = () => auth.logout().then(() => setUser(null));

  // 整个App加载的时候，去获取用户数据
  useMount(() => {
    bootstrapUser().then(setUser);
  });
  return (
    <AuthContext.Provider
      children={children}
      value={{ user, login, register, logout }}
    />
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth必须在AuthProvider中使用");
  }
  return context;
};
