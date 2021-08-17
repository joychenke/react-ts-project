import { useAsync } from "utils/use-async";
import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-dom/test-utils";

// useAsync 的返回值类型
// expect.any(Function) 任意函数， expect.any() 参数是构造函数
const defaultState: ReturnType<typeof useAsync> = {
  stat: "idle",
  data: null,
  error: null,

  isIdle: true,
  isLoading: false,
  isError: false,
  isSuccess: false,

  run: expect.any(Function),
  setData: expect.any(Function),
  setError: expect.any(Function),
  retry: expect.any(Function),
};

// 只有 stat， isIdle,isLoading，属性右边，其他属性和defaultState 相同
const loadingState: ReturnType<typeof useAsync> = {
  ...defaultState,
  stat: "loading",
  isIdle: false,
  isLoading: true,
};

const successState: ReturnType<typeof useAsync> = {
  ...defaultState,
  stat: "success",
  isIdle: false,
  isSuccess: true,
};

test("useAsync 可以异步处理", async () => {
  let resolve: any, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  // renderHook的解释参考：https://blog.csdn.net/weixin_39305620/article/details/107513052
  // renderHook(callback, options?) 第一个参数是对hook的调用，第二个参数是{initialProps, wrapper }
  const { result } = renderHook(() => useAsync());

  // result.current 是useAsync的返回值；啥都没干，是初始状态
  expect(result.current).toEqual(defaultState);

  let p: Promise<any>;
  // run 方法里用到了 safeDispatch 更改loading的值，其实用到了setState，而setState 是异步的
  // 安全的获取setState后的值，用act把操作包起来
  act(() => {
    p = result.current.run(promise);
  });
  expect(result.current).toEqual(loadingState);

  const resolvedValue = { mockedValue: "resolved" };
  // 异步的操作放在 act 方法里
  await act(async () => {
    resolve(resolvedValue);
    await p;
  });

  expect(result.current).toEqual({
    ...successState,
    data: resolvedValue,
  });
});
