import { FormEvent } from "react";
const apiUrl = process.env.REACT_APP_API_URL;
export const LoginScreen = () => {
  const login = (params: { username: string; password: string }) => {
    fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(params),
    }).then(async (response) => {
      if (response.ok) {
      }
    });
  };
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
