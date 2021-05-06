import { useCallback, useReducer, useState } from "react";

/**
 * 同一个hook中有多个状态，并且，这些状态又是相互影响
 * 可以将这些状态整合到一起, 用一个state包裹住，useCallback里就不用添加太多依赖了
 */

const UNDO = "UNDO";
const REDO = "REDO";
const SET = "SET";
const RESET = "RESET";

type State<T> = {
  past: T[];
  present: T;
  future: T[];
};

type Action<T> = {
  newPresent?: T;
  type: typeof UNDO | typeof REDO | typeof SET | typeof RESET;
};

const undoReducer = <T>(state: State<T>, action: Action<T>) => {
  const { past, present, future } = state;
  const { newPresent, type } = action;
  //
  switch (type) {
    case UNDO: {
      if (past.length === 0) {
        return state;
      }
      // 将现在的，赋给未来；将过去的末尾，赋给现在；更新过去
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    }
    case REDO:
      if (future.length === 0) {
        return state;
      }
      // 将现在赋给过去；将未来的第一个元素，赋给现在；更新未来
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    case SET:
      if (newPresent !== present) {
        return state;
      }
      return {
        past: [...past, present],
        present: newPresent,
        future: [],
      };
    case RESET:
      return {
        past: [],
        present: newPresent,
        future: [],
      };
    default:
      break;
  }
  return state;
};

//用 useReducer,优化此处逻辑  https://coding.imooc.com/lesson/482.html#mid=41729
export const useUndo = <T>(initialPresent: T) => {
  const [state, dispatch] = useReducer(undoReducer, {
    past: [],
    present: initialPresent,
    future: [],
  } as State<T>);

  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;

  // undo: 时间向旧的方向倒退了一格
  const undo = useCallback(() => dispatch({ type: UNDO }), []);

  // redo: 时间向新的方向前进了一格
  const redo = useCallback(() => dispatch({ type: REDO }), []);

  // set: 设置新值
  const set = useCallback(
    (newPresent: T) => dispatch({ type: SET, newPresent }),
    []
  );

  // 更新现在的值，重置过去和未来
  const reset = useCallback(
    (newPresent: T) => dispatch({ type: RESET, newPresent }),
    []
  );

  return [state, { set, reset, undo, redo, canUndo, canRedo }] as const;
};

// 自定义hook中需要return函数，最好给函数包上useCallback
