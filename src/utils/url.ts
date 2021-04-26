import { useMemo } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { clearParam } from "screens/project-list/util";

// 返回页面url中，指定键的参数值
// 泛型：不指定类型；根据传入的值，来动态判断习惯
// <K extends string> 声明泛型，并用extends加以限制
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams, setSearchParams] = useSearchParams();
  return [
    // useMemo的改写: 只有searchParams改变的时候，才去进行reduce所在方法的运算
    useMemo(
      () =>
        keys.reduce((pre, key) => {
          return { ...pre, [key]: searchParams.get(key) || "" };
          // in 操作符
        }, {} as { [key in K]: string }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [searchParams]
    ),
    // params里面的参数
    (params: Partial<{ [key in K]: unknown }>) => {
      // Object.fromEntries(iterator)将iterator转化为对象
      // 强制指定为URLSearchParamsInit，使调用 setSearchParams(o) 时，不报错
      // Object.fromEntries(searchParams)： 将现在的url参数，转化为普通的对象
      const o = clearParam({
        ...Object.fromEntries(searchParams),
        ...params,
      }) as URLSearchParamsInit;
      return setSearchParams(o);
    },
  ] as const;
};

// 比较 a和 b 的类型定义的区别
/* const a = ["jack", 12, {gender: 'male'}]
const b = ["jack", 12, {gender: 'male'}] as const */
