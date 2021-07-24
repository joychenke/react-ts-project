// import { AuthenticatedApp } from "authenticated-app";
import { ErrorBoundry } from "components/error-boundry";
import { FullPageErrorFallback, FullPageLoading } from "components/lib";
import { useAuth } from "context/auth-context";
import React from "react";
import "./App.css";

// 动态引入 authenticated-app 和 unauthenticated-app
const AuthenticatedApp = React.lazy(() => import("authenticated-app"));
const UnauthenticatedApp = React.lazy(() => import("unauthenticated-app"));

// npm run build --profiler  在生产环境中，使用profiler

// 根据是否有user属性，来判断展示登录页面还是注册页面
function App() {
  const { user } = useAuth();
  return (
    <div className="App">
      <ErrorBoundry fallbackRender={FullPageErrorFallback}>
        <React.Suspense fallback={<FullPageLoading />}>
          {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
        </React.Suspense>
      </ErrorBoundry>
    </div>
  );
}

export default App;
