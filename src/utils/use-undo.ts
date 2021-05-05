import { useCallback, useState } from "react";

/**
 * 同一个hook中有多个状态，并且，这些状态又是相互影响
 * 可以将这些状态整合到一起, 用一个state包裹住，useCallback里就不用添加太多依赖了
 */
export const useUndo = <T>(initialPresent: T) => {
  // past, present, future的顺序, past最后一个元素离现在最近，future第一个元素离现在最近
  const [state, setState] = useState<{
    past: T[];
    present: T;
    future: T[];
  }>({
    past: [],
    present: initialPresent,
    future: [],
  });

  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;

  // undo: 时间向旧的方向倒退了一格
  const undo = useCallback(() => {
    setState((currentState) => {
      const { past, present, future } = currentState;
      if (past.length === 0) {
        return currentState;
      }
      // 将现在的，赋给未来；将过去的末尾，赋给现在；更新过去
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    });
  }, []);

  // redo: 时间向新的方向前进了一格
  const redo = useCallback(() => {
    setState((currentState) => {
      const { past, present, future } = currentState;
      if (future.length === 0) {
        return currentState;
      }
      // 将现在赋给过去；将未来的第一个元素，赋给现在；更新未来
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  // set: 设置新值
  const set = useCallback((newPresent: T) => {
    setState((currentState) => {
      const { present, past } = currentState;
      if (newPresent !== present) {
        return currentState;
      }
      return {
        past: [...past, present],
        present: newPresent,
        future: [],
      };
    });
  }, []);

  // 更新现在的值，重置过去和未来
  const reset = useCallback((newPresent: T) => {
    setState(() => {
      return {
        past: [],
        present: newPresent,
        future: [],
      };
    });
  }, []);

  return [state, { set, reset, undo, redo, canUndo, canRedo }] as const;
};

// 自定义hook中需要return函数，最好给函数包上useCallback
