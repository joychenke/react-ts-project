/* @jsxImportSource @emotion/react */
import { Form, Input } from "antd";
import { UserSelect } from "components/user-select";
import { List } from "./table-list";

export interface User {
  id: number;
  name: string;
  token: string;
}
interface SearchPanelProps {
  users: User[];
  param: Partial<Pick<List, "name" | "personId">>;
  setParam: (param: SearchPanelProps["param"]) => void;
}
export const SearchPanel = ({ param, setParam, users }: SearchPanelProps) => {
  console.log("users:", users);
  return (
    // emotion行内样式
    <Form css={{ marginBottom: "2rem" }} layout={"inline"}>
      <Form.Item>
        <Input
          type="text"
          value={param.name}
          onChange={(evt) =>
            setParam({
              ...param,
              name: evt.target.value,
            })
          }
        />
      </Form.Item>
      <Form.Item>
        <UserSelect
          defaultOptionName={"负责人"}
          value={param.personId}
          onChange={(value) =>
            setParam({
              ...param,
              personId: value,
            })
          }
        ></UserSelect>
      </Form.Item>
    </Form>
  );
};
