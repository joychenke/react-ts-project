import styled from "@emotion/styled";
import { ScreenContainer } from "components/lib";
import { SearchPanel } from "screens/kanban/search-panel";
import { useDocumentTitle } from "utils";
import { useKanbans } from "utils/kanban";
import { KanbanColumn } from "./kanban-cloumn";
import { useKanbanSearchParams, useProjectInUrl } from "./util";

export const KanbanScreen = () => {
  useDocumentTitle("看板列表");
  const { data: currentProject } = useProjectInUrl();
  const { data: kanbans } = useKanbans(useKanbanSearchParams());
  return (
    <ScreenContainer>
      <h1>{currentProject?.name}看板</h1>
      <SearchPanel></SearchPanel>
      <KanbanContainer>
        {kanbans?.map((kanban) => (
          <KanbanColumn kanban={kanban} key={kanban.id}></KanbanColumn>
        ))}
      </KanbanContainer>
    </ScreenContainer>
  );
};

const KanbanContainer = styled.div`
  display: flex;
  /* 上面的 h1和 div都是固定高度，KanbanContainer占满盒子 */
  flex-grow: 1;
`;
