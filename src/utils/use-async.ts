import { useState } from "react";
import { useMountedRef } from "utils";

interface State<D> {
  error: Error | null;
  data: D | null;
  stat: "idle" | "loading" | "error" | "success";
}
const defaultInitialState: State<null> = {
  stat: "idle",
  data: null,
  error: null,
};

// 某个变量的类型，就可以用 typeof
const defaultConfig = {
  throwOnError: false,
};

// 泛型<D>的入口，或者在调用useAsync时传入，或者在调用State时传入
export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  const config = { ...defaultConfig, ...initialConfig };
  // state的类型：<State<D>>
  const [state, setState] = useState<State<D>>({
    ...defaultInitialState,
    ...initialState,
  });

  const mountedRef = useMountedRef();

  const [retry, setRetry] = useState(() => () => {});

  // data是D类型
  const setData = (data: D) =>
    setState({
      data,
      stat: "success",
      error: null,
    });

  const setError = (error: Error) =>
    setState({
      error,
      stat: "error",
      data: null,
    });

  // run用来触发异步请求
  // Promise里包含的是D类型的数据
  const run = (
    promise: Promise<D>,
    runConfig?: { retry: () => Promise<D> }
  ) => {
    // 没传或者不是promise数据
    if (!promise || !promise.then) {
      throw new Error("请输入 Promise类型的数据");
    }
    setRetry(() => () => {
      // run(promise)时，setRetry更新的函数是run(promise)返回的结果，即新的newPromise，而不是run的入参promise。其实页面时重新渲染的，setData(data)走了一遍
      if (runConfig?.retry) {
        // 要想第一次retry之后，可以继续刷新，runConfig必传
        run(runConfig?.retry(), runConfig);
      }
    });
    setState({ ...state, stat: "loading" });
    return promise
      .then((data) => {
        if (mountedRef.current) setData(data);
        return data;
      })
      .catch((error) => {
        // catch会消化异常，如果不主动抛出异常，外面是接收不到的
        setError(error);
        if (config.throwOnError) {
          return Promise.reject(error);
        } else {
          return error;
        }
      });
  };
  return {
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isSuccess: state.stat === "success",
    isError: state.stat === "error",
    run,
    setData,
    setError,
    // 被调用时，重新跑一遍run，让state刷新一遍
    retry,
    ...state,
  };
};
