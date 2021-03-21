import { useAuth } from "context/auth-context";
import { FormEvent } from "react";
export const LoginScreen = () => {
  const { login, user } = useAuth();
  const handleSumbit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = (event.currentTarget.elements[0] as HTMLFormElement).value;
    const password = (event.currentTarget.elements[1] as HTMLFormElement).value;
    login({ username, password });
  };
  return (
    <form onSubmit={handleSumbit}>
      <div>
        <label htmlFor="username">姓名</label>
        <input name="username" type="input"></input>
      </div>
      <div>
        <label htmlFor="passowrd">密码</label>
        <input name="password" type="password"></input>
      </div>
      <button>登录</button>
    </form>
  );
};
