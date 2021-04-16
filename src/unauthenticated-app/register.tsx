import { Form, Input } from "antd";
import { useAuth } from "context/auth-context";
import { useAsync } from "utils/use-async";
import { LongButton } from "./index";
// 调用RegisterScreen时，用到了onError, onError有个传参error，返回值是void类型
export const RegisterScreen = ({
  onError,
}: {
  onError: (error: Error) => void;
}) => {
  const { register } = useAuth();
  const { run, isLoading } = useAsync(undefined, { throwOnError: true });
  // cpassword不参与接口调用
  const handleSumbit = async ({
    cpassword,
    ...values
  }: {
    username: string;
    password: string;
    cpassword: string;
  }) => {
    if (cpassword !== values.password) {
      onError(new Error("两次输入密码请保持一致"));
      return;
    }
    // 同步和异步混用的时候，用try catch
    try {
      await run(register(values));
    } catch (error) {
      // 调用接收的onError参数，其实也就是调用了父组件的setError
      onError(error);
    }
  };
  return (
    <Form onFinish={handleSumbit}>
      <Form.Item
        name={"username"}
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input placeholder={"用户名"} type="text" id={"username"}></Input>
      </Form.Item>
      <Form.Item
        name={"password"}
        rules={[{ required: true, message: "请输入密码" }]}
      >
        <Input placeholder={"密码"} type="password" id={"password"}></Input>
      </Form.Item>
      <Form.Item
        name={"cpassword"}
        rules={[{ required: true, message: "请确认密码" }]}
      >
        <Input
          placeholder={"确认密码"}
          type="cpassword"
          id={"cpassword"}
        ></Input>
      </Form.Item>
      <Form.Item>
        <LongButton loading={isLoading} htmlType={"submit"} type={"primary"}>
          注册
        </LongButton>
      </Form.Item>
    </Form>
  );
};
