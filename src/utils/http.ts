import qs from "qs";
import * as auth from "auth-provider";

const apiUrl = process.env.REACT_APP_API_URL;
// data 和 token属性不是RequestInit中的属性，要加到 RequestInit 中
// 可选属性 ?:
interface Config extends RequestInit {
  token?: string;
  data?: object;
}
// endpoint: 链接后缀
export const http = async (
  endpoint: string,
  { data, token, headers, ...customConfig }: Config
) => {
  const config = {
    method: "GET",
    header: {
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
    }
  });
};
