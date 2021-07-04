import styled from "@emotion/styled";
import { Spin } from "antd";
import { Drag, Drop, DropChild } from "components/drag-and-drop";
import { ScreenContainer } from "components/lib";
import { useCallback } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { SearchPanel } from "screens/kanban/search-panel";
import { useDocumentTitle } from "utils";
import { useKanbans, useReorderKanban } from "utils/kanban";
import { useReorderTask, useTasks } from "utils/task";
import { CreateKanban } from "./create-kanban";
import { KanbanColumn } from "./kanban-cloumn";
import { TaskModal } from "./task-modal";
import {
  useKanbanSearchParams,
  useKanbansQueryKey,
  useProjectInUrl,
  useTasksQueryKey,
  useTasksSearchParams,
} from "./util";

export const KanbanScreen = () => {
  useDocumentTitle("看板列表");
  const { data: currentProject } = useProjectInUrl();
  const { data: kanbans, isLoading: kanbanIsLoading } = useKanbans(
    useKanbanSearchParams()
  );
  const { isLoading: taskIsLoading } = useTasks(useTasksSearchParams());
  const isLoading = kanbanIsLoading || taskIsLoading;
  const onDrapEnd = useDragEnd();
  return (
    // onDragEnd 里放的是持久化的工作
    <DragDropContext onDragEnd={onDrapEnd}>
      <ScreenContainer>
        <h1>{currentProject?.name}看板</h1>
        <SearchPanel></SearchPanel>
        {isLoading ? (
          <Spin size={"large"} />
        ) : (
          <KanbanContainer>
            <Drop
              type={"COLUMN"}
              direction={"horizontal"}
              droppableId={"kanban"}
            >
              <DropChild style={{ display: "flex" }}>
                {kanbans?.map((kanban, index) => (
                  // kanban.id是undefined时，控制台会报错，所以给一个默认值 kanbanId
                  <Drag
                    key={kanban.id}
                    draggableId={"kanban" + kanban.id}
                    index={index}
                  >
                    <KanbanColumn
                      kanban={kanban}
                      key={kanban.id || "kanbanId"}
                    ></KanbanColumn>
                  </Drag>
                ))}
              </DropChild>
            </Drop>
            <CreateKanban />
          </KanbanContainer>
        )}
        <TaskModal />
      </ScreenContainer>
    </DragDropContext>
  );
};

export const useDragEnd = () => {
  const { data: kanbans } = useKanbans(useKanbanSearchParams());
  const { data: tasks = [] } = useTasks(useTasksSearchParams());
  const { mutate: reorderKanban } = useReorderKanban(useKanbansQueryKey());
  const { mutate: reorderTask } = useReorderTask(useTasksQueryKey());
  return useCallback(
    ({ destination, source, type }: DropResult) => {
      if (!destination) {
        return;
      }
      // 横向，看板重新排列
      if (type === "COLUMN") {
        const fromId = kanbans?.[source.index].id;
        const toId = kanbans?.[destination.index].id;
        if (!fromId || !toId || fromId === toId) {
          return;
        }
        const type = source.index > destination.index ? "before" : "after";
        reorderKanban({
          fromId,
          referenceId: toId,
          type,
        });
      }
      // 纵向，任务重新排列
      console.log({ destination, source, type });
      // droppableId -> kanban.id   index -> task的index
      if (type === "ROW") {
        // 将string类型转化为number类型
        const fromKanbanId = +source.droppableId;
        const toKanbanId = +destination.droppableId;
        if (fromKanbanId === toKanbanId) {
          return;
        }
        const fromTask = tasks?.filter(
          (task) => task.kanbanId === fromKanbanId
        )[source.index];
        const toTask = tasks?.filter((task) => task.kanbanId === toKanbanId)[
          destination.index
        ];
        if (fromTask?.id === toTask?.id) {
          return;
        }
        reorderTask({
          fromId: fromTask?.id,
          referenceId: toTask?.id,
          fromKanbanId,
          toKanbanId,
          type:
            fromKanbanId === toKanbanId && destination.index > source.index
              ? "after"
              : "before",
        });
      }
    },
    [kanbans, reorderKanban, tasks, reorderTask]
  );
};

// DropChild 就是 KanbanContainer
export const KanbanContainer = styled.div`
  display: flex;
  overflow-x: scroll;
  /* 上面的 h1和 div都是固定高度，KanbanContainer占满盒子 */
  flex-grow: 1;
`;
