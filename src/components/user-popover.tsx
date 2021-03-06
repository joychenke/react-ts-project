import styled from "@emotion/styled";
import { Divider, List, Popover, Typography } from "antd";
import { useUser } from "utils/user";

export const UserPopover = () => {
  // useProject在调用时，没有传queryKey
  const { data: users, refetch } = useUser();
  const content = (
    <ContentContainer>
      <Typography.Text type={"secondary"}>组员列表</Typography.Text>
      <List>
        {users?.map((user) => (
          <List.Item key={user.id}>
            <List.Item.Meta title={user.name}></List.Item.Meta>
          </List.Item>
        ))}
      </List>
      <Divider></Divider>
    </ContentContainer>
  );
  return (
    <Popover
      onVisibleChange={() => refetch()}
      placement={"bottom"}
      content={content}
    >
      <span>组员</span>
    </Popover>
  );
};

const ContentContainer = styled.div`
  min-width: 30rem;
`;
