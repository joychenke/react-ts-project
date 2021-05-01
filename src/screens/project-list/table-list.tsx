import { Table, TableProps } from "antd";
import dayjs from "dayjs";
import { User } from "./search-panel";
import { Link } from "react-router-dom";
import { Pin } from "components/pin";
import { useEditProject } from "utils/project";
export interface List {
  id: number;
  name: string;
  personId: number;
  pin: boolean;
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
  // useEditProject是react hook，只能在顶层调用，而mutate是纯函数，不受此规则限制
  const { mutate } = useEditProject();
  // 函数式编程，point free的写法
  const pinProject = (id: number) => (pin: boolean) => mutate({ id, pin });
  return (
    <Table
      columns={[
        {
          title: <Pin checked={true} disabled={true}></Pin>,
          render(value, project) {
            return (
              <Pin
                checked={project.pin}
                onCheckedChange={pinProject(project.id)}
              />
            );
          },
        },
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
