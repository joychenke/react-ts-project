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

  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        console.log("卸载时的oldTitle的值：", oldTitle);
        document.title = oldTitle;
      }
    };
  }, []);
};
