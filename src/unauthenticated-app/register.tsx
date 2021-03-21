import { useAuth } from "context/auth-context";
import { FormEvent } from "react";
export const RegisterScreen = () => {
  const { register } = useAuth();
  const handleSumbit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = (event.currentTarget.elements[0] as HTMLFormElement).value;
    const password = (event.currentTarget.elements[1] as HTMLFormElement).value;
    register({ username, password });
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
      <button type="submit">注册</button>
    </form>
  );
};
