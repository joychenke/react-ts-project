import { useMemo } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProjectDetail } from "utils/project";
import { useUrlQueryParam } from "utils/url";
// null,undefined,空字符串都是没有意义的，删除
const isVoid = (value: unknown) =>
  value === null || value === undefined || value === "";
/* 
let b:{[key: string]: unknown}
b = {name: 'cc'}
b = () => {} //报错 
*/
// obj是键值对，键是string类型key，值unknown
export const clearParam = (obj: { [key: string]: unknown }) => {
  const result = { ...obj };
  Object.keys(obj).forEach((key) => {
    if (isVoid(obj[key])) {
      delete result[key];
    }
  });
  return result;
};

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
    // 依赖项里加callback，会造成无限循环，这和useCallback和useMemo有关
    // eslint的报错信息不一定对
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return () => clearTimeout(timeOut);
    // param 是非状态的对象，每次传入，都会触发useEffect函数执行
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

// 项目列表搜索参数
export const useProjectsSearchParams = () => {
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);
  return [
    // 依然是解决无限循环、获取数据的问题
    useMemo(
      () => ({ ...param, personId: Number(param.personId) || undefined }),
      [param]
    ),
    setParam,
  ] as const;
};

export const useProjectsQueryKey = () => {
  const [params] = useProjectsSearchParams();
  return ["projects", params];
};

/**
 * 管理模态框状态的hook
 * @returns projectModalOpen: 开关状态; open: 打开模态框方法; close: 关闭模态框方法
 */
export const useProjectModal = () => {
  const [{ projectCreate }, setProjectCreate] = useUrlQueryParam([
    "projectCreate",
  ]);

  const [{ editingProjectId }, setEditintProjectId] = useUrlQueryParam([
    "editingProjectId",
  ]);

  const [_, setUrlParams] = useSearchParams();
  const { data: editingProject, isLoading } = useProjectDetail(
    Number(editingProjectId)
  );
  const open = () => setProjectCreate({ projectCreate: true });
  const close = () => setUrlParams({ projectCreate: "", editingProjectId: "" });
  const startEdit = (id: number) =>
    setEditintProjectId({ editingProjectId: id });

  return {
    // 从 url 获取到的变量，都是string类型
    projectModalOpen: projectCreate === "true" || !!editingProjectId,
    open,
    close,
    startEdit,
    editingProject,
    isLoading,
  };
};
