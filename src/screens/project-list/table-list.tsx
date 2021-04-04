import { Table } from "antd";
import dayjs from "dayjs";
import { User } from "./search-panel";
interface List {
  id: number;
  name: string;
  personId: number;
  organization: string;
  created: number;
}
interface TableListProps {
  list: List[];
  users: User[];
}
// 将表格替换为antd组件形式
export const TableList = ({ list, users }: TableListProps) => {
  return (
    <Table
      dataSource={list}
      columns={[
        {
          title: "名称",
          dataIndex: "name",
          sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
          title: "部门",
          dataIndex: "organization",
        },
        {
          title: "负责人",
          render(value, project) {
            return (
              users.find((user: User) => user.id === project.personId)?.name ||
              "未知"
            );
          },
        },
        {
          title: "创建时间",
          render(value, project) {
            return (
              <span>
                {project.created
                  ? dayjs(project.created).format("YYYY-MM-DD HH:mm:ss")
                  : "--"}
              </span>
            );
          },
        },
      ]}
      pagination={false}
      rowKey={(record) => record.id}
    ></Table>
  );
};
