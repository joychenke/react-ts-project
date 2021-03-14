import { useEffect, useState } from "react";
export const clearParam = (obj: object) => {
  let result: object = {};
  Object.keys(obj).forEach((key) => {
    // @ts-ignore
    if (obj[key] !== "") {
      // @ts-ignore
      result[key] = obj[key];
    }
  });
  return result;
};

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
  }, []);
};

// 输入param，隔一段时间再才输出这个值
// 当param改变时，使用定时器控制
export const useDebounce = (param: object, time?: number) => {
  const [debounceValue, setDebouncesValue] = useState(param);
  useEffect(() => {
    let timeOut = setTimeout(() => {
      setDebouncesValue(param);
    }, time);
    // 每次执行 useEffect，会先去执行return后面返回的函数
    return () => clearTimeout(timeOut);
  }, [param, time]);
  return debounceValue;
};
