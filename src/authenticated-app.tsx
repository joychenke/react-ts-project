import styled from "@emotion/styled";
import { Row } from "components/lib";
import { useAuth } from "context/auth-context";
import { ProjectList } from "screens/project-list";
import { ReactComponent as SoftwareLogo } from "assets/software-logo.svg";

/**
 * grid和flx应用的场景
 * 1，是一维布局还是二维布局
 * 一维的意思是，仅仅是一个方向(横或纵), 二维的意思是，两个方向都有(横和纵)。一般来说，一维布局用flex，二维布局用grid
 *  2，是从内容出发，还是从布局出发
 * 从内容出发：先有一组内容（数量不固定），内容均匀分布在容器中，由内容自己大小决定容器的大小
 * 从布局出发：先规划网格（数量一般比较固定）,然后把元素往里填充
 * 从内容出发用flex，从布局出发用grid
 */

export const AuthenticatedApp = () => {
  const { logout } = useAuth();
  return (
    <Container>
      <Header between={true}>
        <HeaderLeft gap={1}>
          <SoftwareLogo width={"18rem"} color={"rgb(38, 132, 255)"} />
          <h2>项目</h2>
          <h2>用户</h2>
        </HeaderLeft>
        <HeaderRight>
          <button onClick={logout}>登出</button>
        </HeaderRight>
      </Header>
      <Main>
        <ProjectList />
      </Main>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
`;

// 有两种方式，一种通过Header传参between，一种通过将样式写在Header的定义中
const Header = styled(Row)`
  /* justify-content: space-between; */
  padding: 1.5rem;
`;
const HeaderLeft = styled(Row)``;
const HeaderRight = styled.div``;
const Main = styled.main``;
