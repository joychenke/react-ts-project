import { AuthenticatedApp } from "authenticated-app";
import { ErrorBoundry } from "components/error-boundry";
import { FullPageErrorFallback } from "components/lib";
import { useAuth } from "context/auth-context";
import { UnauthenticatedApp } from "unauthenticated-app";
import "./App.css";

// 根据是否有user属性，来判断展示登录页面还是注册页面
function App() {
  const { user } = useAuth();
  return (
    <div className="App">
      <ErrorBoundry fallbackRender={FullPageErrorFallback}>
        {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      </ErrorBoundry>
    </div>
  );
}

export default App;
