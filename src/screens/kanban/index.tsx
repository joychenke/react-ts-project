import styled from "@emotion/styled";
import { Spin } from "antd";
import { ScreenContainer } from "components/lib";
import { SearchPanel } from "screens/kanban/search-panel";
import { useDocumentTitle } from "utils";
import { useKanbans } from "utils/kanban";
import { useTasks } from "utils/task";
import { CreateKanban } from "./create-kanban";
import { KanbanColumn } from "./kanban-cloumn";
import { TaskModal } from "./task-modal";
import {
  useKanbanSearchParams,
  useProjectInUrl,
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
  return (
    <ScreenContainer>
      <h1>{currentProject?.name}看板</h1>
      <SearchPanel></SearchPanel>
      {isLoading ? (
        <Spin size={"large"} />
      ) : (
        <KanbanContainer>
          {kanbans?.map((kanban) => (
            // kanban.id是undefined时，控制台会报错，所以给一个默认值 kanbanId
            <KanbanColumn
              kanban={kanban}
              key={kanban.id || "kanbanId"}
            ></KanbanColumn>
          ))}
          <CreateKanban />
        </KanbanContainer>
      )}
      <TaskModal />
    </ScreenContainer>
  );
};

export const KanbanContainer = styled.div`
  display: flex;
  overflow-x: scroll;
  /* 上面的 h1和 div都是固定高度，KanbanContainer占满盒子 */
  flex-grow: 1;
`;
