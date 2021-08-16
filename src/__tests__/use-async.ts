import { useAsync } from "utils/use-async";
import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-dom/test-utils";

// useAsync 的返回值类型
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

  const { result } = renderHook(() => useAsync());

  // result.current 是useAsync的返回值；啥都没干，是初始状态
  expect(result.current).toEqual(defaultState);

  let p: Promise<any>;
  // 安全的获取setState后的值，用act把操作包起来
  act(() => {
    p = result.current.run(promise);
  });
  expect(result.current).toEqual(loadingState);

  const resolvedValue = { mockedValue: "resolved" };
  await act(async () => {
    resolve(resolvedValue);
    await p;
  });

  expect(result.current).toEqual({
    ...successState,
    data: resolvedValue,
  });
});
