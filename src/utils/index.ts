import { useEffect, useRef } from "react";

export const useDocumentTitle = (
  title: string,
  keepOnUnmount: boolean = true
) => {
  const oldTitle = useRef(document.title).current;
  useEffect(() => {
    document.title = title;
  }, [title]);

  // 组件销毁时执行下面方法
  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        document.title = oldTitle;
      }
    };
  }, [keepOnUnmount, oldTitle]);
};

// 重置路由状态 + 刷新整个页面
export const resetRoute = () => (window.location.href = window.location.origin);

/**
 * 返回组件的挂载状态，如果还没挂载，或 已经卸载，返回false；否则，返回true
 */
export const useMountedRef = () => {
  const mountedRef = useRef(false);
  useEffect(() => {
    // 挂载成功，是true
    mountedRef.current = true;
    // 卸载
    return () => {
      mountedRef.current = false;
    };
  });
  return mountedRef;
};
