import { useEffect } from "react";

export const useDocumentTitle = (
  title: string,
  keepOnUnmount: boolean = true
) => {
  const oldTitle = document.title;
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
  }, []);
};
