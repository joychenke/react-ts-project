import styled from "@emotion/styled";
import { useAuth } from "context/auth-context";
import { ProjectList } from "screens/project-list";

export const AuthenticatedApp = () => {
  const { logout } = useAuth();
  return (
    <Container>
      <Header>
        <button onClick={logout}>登出</button>
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
`;
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
