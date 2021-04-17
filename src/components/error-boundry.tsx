import React from "react";

// 错误边界必须是class组件，且这个class组件中定义了 static getDerivedStateFromError() 或者 static componentDidCatch()方法

// 定义一个类型别名： FallbackRender
type FallbackRender = (props: { error: Error | null }) => React.ReactElement;
// PropsWithChildren是联合类型，将children和fallbackRender结合成一个类型
export class ErrorBoundry extends React.Component<
  React.PropsWithChildren<{ fallbackRender: FallbackRender }>,
  { error: Error | null }
> {
  state = {
    error: null,
  };
  // 当ErrorBoundry的子组件发生错误后，getDerivedStateFromError就会被调用，值会赋给state的error
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    const { error } = this.state;
    const { fallbackRender, children } = this.props;
    if (error) {
      return fallbackRender({ error });
    }
    return children;
  }
}
