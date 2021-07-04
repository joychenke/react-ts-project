import { Kanban } from "types/kanban";
import { useTasks } from "utils/task";
import { useTaskTypes } from "utils/task-type";
import {
  useKanbansQueryKey,
  useTasksModal,
  useTasksSearchParams,
} from "./util";
import taskIcon from "assets/task.svg";
import bugIcon from "assets/bug.svg";
import styled from "@emotion/styled";
import { Button, Card, Dropdown, Menu, Modal } from "antd";
import { CreateTask } from "./create-task";
import { Task } from "types/task";
import { Mark } from "components/mark";
import { useDeleteKanban } from "utils/kanban";
import { Row } from "components/lib";
import React from "react";
import { Drag, Drop, DropChild } from "components/drag-and-drop";

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;
  if (!name) {
    return null;
  }
  return <img src={name === "task" ? taskIcon : bugIcon} alt="img" />;
};

// 也可以不在TaskCard定义的外面包 React.forwardRef，而是在TaskCard调用的地方，TaskCard标签外面再套一层div，因为div标签可以有转发
const TaskCard = React.forwardRef<HTMLDivElement, { task: Task }>(
  ({ task, ...props }, ref) => {
    // 当task.id是undefined，控制台会报错，所以给一个默认值taskId
    // 点击card时，编辑task
    const { startEdit } = useTasksModal();
    const { name: keyword } = useTasksSearchParams();
    return (
      <div ref={ref} {...props}>
        <Card
          onClick={() => startEdit(task.id)}
          style={{ marginBottom: "0.5rem", cursor: "pointer" }}
          key={task.id || "taskId"}
        >
          <p>
            <Mark keyword={keyword} name={task.name}></Mark>
          </p>
          <TaskTypeIcon id={task.typeId} />
        </Card>
      </div>
    );
  }
);

// Drag在定义的地方，用 React.cloneElement 给它的children元素加了ref属性，做转发； 因此要在这个地方加上forwardRef反复
// KanbanColumn 是 Drag 的子元素，React.cloneElement克隆子元素时，给新元素传除ref以外的其他属性，都放在  { kanban, ...props } 里
export const KanbanColumn = React.forwardRef<
  HTMLDivElement,
  { kanban: Kanban }
>(({ kanban, ...props }, ref) => {
  const { data: allTasks } = useTasks(useTasksSearchParams());
  const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id);
  return (
    <Container ref={ref} {...props}>
      <Row between={true}>
        <h3>{kanban.name}</h3>
        <More kanban={kanban} key={kanban.id}></More>
      </Row>
      <TaskContainer>
        <Drop
          type={"ROW"}
          direction={"vertical"}
          droppableId={String(kanban.id)}
        >
          <DropChild>
            {tasks?.map((task, taskIndex) => (
              <Drag
                key={task.id}
                draggableId={"task" + task.id}
                index={taskIndex}
              >
                <TaskCard task={task} key={task.id}></TaskCard>
              </Drag>
            ))}
          </DropChild>
        </Drop>
        <CreateTask kanbanId={kanban.id} />
      </TaskContainer>
    </Container>
  );
});

const More = ({ kanban }: { kanban: Kanban }) => {
  const { mutateAsync } = useDeleteKanban(useKanbansQueryKey());
  const startEdit = () => {
    Modal.confirm({
      okText: "确定",
      cancelText: "取消",
      title: "确定删除看板吗？",
      onOk() {
        return mutateAsync({ id: kanban.id });
      },
    });
  };
  const overlay = (
    <Menu>
      <Menu.Item>
        <Button type="link" onClick={startEdit}>
          删除
        </Button>
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={overlay}>
      <Button type={"link"}>...</Button>
    </Dropdown>
  );
};

export const Container = styled.div`
  min-width: 27rem;
  border-radius: 6px;
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 1.5rem;
`;
const TaskContainer = styled.div`
  overflow: scroll;
  flex: 1;
  /* 超出 TaskContainer不要滚动*/
  ::-webkit-scrollbar {
    display: none;
  }
`;
