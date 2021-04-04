import { useEffect, useState } from "react";
const isFalsy = (value: unknown) => (value === 0 ? false : !value);
/* 
let b:{[key: string]: unknown}
b = {name: 'cc'}
b = () => {} //报错 
*/
// obj是键值对，键是string类型key，值unknown
export const clearParam = (obj: { [key: string]: unknown }) => {
  const result = { ...obj };
  Object.keys(obj).forEach((key) => {
    if (isFalsy(obj[key])) {
      delete result[key];
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
export const useDebounce = <V>(param: V, time?: number) => {
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

export const useArray = <V>(persons: V[]) => {
  const [personList, setPersonList] = useState(persons);
  const add = (value: V) => {
    setPersonList([...personList, value]);
  };
  const clear = () => {
    setPersonList([]);
  };
  const removeIndex = (index: number) => {
    const list = [...personList];
    list.splice(index, 1);
    setPersonList(list);
  };
  return { value: personList, clear, removeIndex, add };
};
