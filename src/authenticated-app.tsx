import styled from "@emotion/styled";
import { useAuth } from "context/auth-context";
import { ProjectList } from "screens/project-list";

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
      <Header>
        <HeaderLeft>
          <h3>logo</h3>
          <h2>项目</h2>
          <h2>用户</h2>
        </HeaderLeft>
        <HeaderRight>
          <button onClick={logout}>登出</button>
        </HeaderRight>
      </Header>
      <Nav>nav..</Nav>
      <Main>
        <ProjectList />
      </Main>
      <Aside>aside..</Aside>
      <Footer>footer..</Footer>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr 15rem;
  grid-template-columns: 20rem 1fr 20rem;
  grid-template-areas:
    "header header header"
    "nav main aside"
    "footer footer footer";
  height: 100vh;
  grid-gap: 10rem;
`;
const Header = styled.header`
  grid-area: header;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;
const HeaderRight = styled.div``;
const Main = styled.main`
  grid-area: main;
`;
const Nav = styled.nav`
  grid-area: nav;
`;
const Aside = styled.aside`
  grid-area: aside;
`;
const Footer = styled.footer`
  grid-area: footer;
`;
