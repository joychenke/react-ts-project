import { User } from "screens/project-list/search-panel";

// 如果使用的是firebase这种三方auth服务，不需要开发这个文件
const localStorageKey = "__auth_provider_token__";
export const getToken = () => window.localStorage.getItem(localStorageKey);
export const handleUserResponse = ({ user }: { user: User }) => {
  window.localStorage.setItem(localStorageKey, user.token || "");
  return user;
};
const apiUrl = process.env.REACT_APP_API_URL;

export const login = (data: { username: string; password: string }) => {
  return fetch(`${apiUrl}/login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (response: Response) => {
    // else语句保证了login方法返回的永远是 Promise
    if (response.ok) {
      return handleUserResponse(await response.json());
    } else {
      return Promise.reject(data);
    }
  });
};

export const register = (data: { username: string; password: string }) => {
  return fetch(`${apiUrl}/register`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (response: Response) => {
    if (response.ok) {
      return handleUserResponse(await response.json());
    } else {
      return Promise.reject(data);
    }
  });
};

// 加 async 是为了 logout 的返回值是 Promise 类型
export const logout = async () =>
  window.localStorage.removeItem(localStorageKey);
