import { Form, Input } from "antd";
import { useAuth } from "context/auth-context";
import { LongButton } from "./index";
// 调用RegisterScreen时，用到了onError, onError有个传参error，返回值是void类型
export const RegisterScreen = ({
  onError,
}: {
  onError: (error: Error) => void;
}) => {
  const { register } = useAuth();
  const handleSumbit = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      await register(values);
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
      <Form.Item>
        <LongButton htmlType={"submit"} type={"primary"}>
          注册
        </LongButton>
      </Form.Item>
    </Form>
  );
};
