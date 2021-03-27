import qs from "qs";
import * as auth from "auth-provider";
import { useAuth } from "context/auth-context";

const apiUrl = process.env.REACT_APP_API_URL;
// data 和 token属性不是RequestInit中的属性，要加到 RequestInit 中
// 可选属性 ?:
interface Config extends RequestInit {
  token?: string;
  data?: object;
}
// endpoint: 链接后缀
// 加 ={}，让参数成为一个可选参数
export const http = async (
  endpoint: string,
  { data, token, headers, ...customConfig }: Config = {}
) => {
  const config = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-type": data ? "application/json" : "",
    },
    ...customConfig,
  };
  let urlParam = `${apiUrl}/${endpoint}`;
  // get 请求，参数拼在链接里；非get请求，(post, delete)请求等，参数放在body里
  const method = config.method.toUpperCase();
  if (method === "GET") {
    urlParam = `${urlParam}?${qs.stringify(data)}`;
  } else {
    Object.assign(config, { body: JSON.stringify(data || {}) });
  }
  return window.fetch(urlParam, config).then(async (response) => {
    if (response.status === 401) {
      await auth.logout();
      window.location.reload();
      return Promise.reject({ messag: "请重新登录" });
    }
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return Promise.reject(data);
    }
  });
};

// 函数要使用其他hook，它本身也是hook
export const useHttp = () => {
  const { user } = useAuth();
  // 传参和http的传参相同
  return (...[endpoint, config]: Parameters<typeof http>) => {
    return http(endpoint, { ...config, token: user?.token });
  };
};
