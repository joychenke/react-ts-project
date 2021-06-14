import { Dropdown, Menu, Modal, Table, TableProps } from "antd";
import dayjs from "dayjs";
import { User } from "../../types/User";
import { Link } from "react-router-dom";
import { Pin } from "components/pin";
import { useDeleteProject, useEditProject } from "utils/project";
import { ButtonNoPadding } from "components/lib";
import { useProjectModal, useProjectsQueryKey } from "./util";
import { List } from "../../types/List";
// 用添加isLoading的方式加loading，这个extends是最重要的
interface TableListProps extends TableProps<List> {
  users: User[];
}
// 将表格替换为antd组件形式
// 剩下的键值都放在props里, 如果用类型别名定义props的类型则如下PropsType：
// type PropsType = Omit<TableListProps, 'users'>
export const TableList = ({ users, ...props }: TableListProps) => {
  // useEditProject是react hook，只能在顶层调用，而mutate是纯函数，不受此规则限制
  const { mutate } = useEditProject(useProjectsQueryKey());
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
        {
          render(value, project) {
            return <More project={project} />;
          },
        },
      ]}
      pagination={false}
      rowKey={(record) => record.id}
      {...props}
    ></Table>
  );
};

const More = ({ project }: { project: List }) => {
  const { startEdit } = useProjectModal();
  const editProject = (id: number) => () => startEdit(id);
  const { mutate: deleteProject } = useDeleteProject(useProjectsQueryKey());
  const confirmDeleteProject = (id: number) => {
    Modal.confirm({
      title: "确定删除这个项目吗？",
      content: "点击确定删除",
      okText: "确定",
      onOk() {
        deleteProject({ id });
      },
    });
  };
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item onClick={editProject(project.id)} key={"edit"}>
            编辑
          </Menu.Item>
          <Menu.Item
            onClick={() => confirmDeleteProject(project.id)}
            key={"delete"}
          >
            删除
          </Menu.Item>
        </Menu>
      }
    >
      <ButtonNoPadding type={"link"}>...</ButtonNoPadding>
    </Dropdown>
  );
};
