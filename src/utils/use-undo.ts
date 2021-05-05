import { useState } from "react";

export const useUndo = <T>(initialPresent: T) => {
  // past, present, future的顺序, past最后一个元素离现在最近，future第一个元素离现在最近
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState(initialPresent);
  const [future, setFuture] = useState<T[]>([]);

  const canUndo = past.length !== 0; // 向old跳
  const canRedo = future.length !== 0; // 向new跳

  // undo: 时间向旧的方向倒退了一格
  const undo = () => {
    if (!canUndo) {
      return;
    }
    // 将现在的，赋给未来；将过去的末尾，赋给现在；更新过去
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    setPast(newPast);
    setPresent(previous);
    setFuture([present, ...future]);
  };

  // redo: 时间向新的方向前进了一格
  const redo = () => {
    if (!canRedo) {
      return;
    }
    // 将现在赋给过去；将未来的第一个元素，赋给现在；更新未来
    const next = future[0];
    const newFuture = future.slice(1);
    setPast([...past, present]);
    setPresent(next);
    setFuture(newFuture);
  };

  // set: 设置新值
  const set = (newPresent: T) => {
    if (newPresent !== present) {
      return;
    }
    // 将现在赋给过去；新值赋给现在；未来置空
    setPast([...past, present]);
    setPresent(newPresent);
    setFuture([]);
  };

  // 更新现在的值，重置过去和未来
  const reset = (newPresent: T) => {
    setPast([]);
    setPresent(newPresent);
    setFuture([]);
  };

  return [
    { past, present, future },
    { set, reset, undo, redo, canUndo, canRedo },
  ] as const;
};

// 自定义hook中需要return函数，最好给函数包上useCallback
