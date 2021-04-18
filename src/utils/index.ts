import { useEffect, useRef } from "react";

export const useDocumentTitle = (
  title: string,
  keepOnUnmount: boolean = true
) => {
  const oldTitle = useRef(document.title).current;
  console.log("渲染时的oldTitle的值：", oldTitle);
  useEffect(() => {
    document.title = title;
  }, [title]);

  // 组件销毁时执行下面方法
  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        console.log("卸载时的oldTitle的值：", oldTitle);
        document.title = oldTitle;
      }
    };
  }, [keepOnUnmount, oldTitle]);
};

// 重置路由状态 + 刷新整个页面
export const resetRoute = () => (window.location.href = window.location.origin);
