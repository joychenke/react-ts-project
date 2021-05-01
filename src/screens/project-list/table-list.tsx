import { Table, TableProps } from "antd";
import dayjs from "dayjs";
import { User } from "./search-panel";
import { Link } from "react-router-dom";
export interface List {
  id: number;
  name: string;
  personId: number;
  organization: string;
  created: number;
}
// 用添加isLoading的方式加loading，这个extends是最重要的
interface TableListProps extends TableProps<List> {
  users: User[];
}
// 将表格替换为antd组件形式
// 剩下的键值都放在props里, 如果用类型别名定义props的类型则如下PropsType：
// type PropsType = Omit<TableListProps, 'users'>
export const TableList = ({ users, ...props }: TableListProps) => {
  return (
    <Table
      columns={[
        {
          title: "名称",
          dataIndex: "name",
          sorter: (a, b) => a.name.localeCompare(b.name),
          render(value, project) {
            return <Link to={String(project.id)}>{project.name}</Link>;
          },
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
      {...props}
    ></Table>
  );
};
