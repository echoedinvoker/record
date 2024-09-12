import { Outlet, Link } from "react-router-dom";
import styled from "styled-components";
import { Save } from 'lucide-react';
import { useContext } from "react";
import { TasksContext } from "../context/tasksContext";

function Logo() {
  return <h3>Logo</h3>;
}

function RootHeader() {
  const { isPending } = useContext(TasksContext);

  return (
    <Header>
      <LogoContainer>
        <Logo />
      </LogoContainer>
      <Pages>
        <PageButton to="/hopes">Hopes</PageButton>
        <PageButton to="/todos">Todos</PageButton>
      </Pages>
      <ActionGroup>
        <ActionButton disabled={isPending}>
          <Save size={20} />
        </ActionButton>
      </ActionGroup>
    </Header>
  );
}

const LogoContainer = styled.div`
  flex: 1;
  `;

const Pages = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 1rem;
  `;

const PageButton = styled(Link)`
  color: white;
  `;

const ActionGroup = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  `;

const ActionButton = styled.button`
  background-color: transparent;
  `;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .3rem 1rem;
  background-color: black;
  `;

export default function Root() {
  return (
    <RootContainer>
      <RootHeader />
      <Main>
        <Outlet />
      </Main>
    </RootContainer>
  );
}

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  `;

const Main = styled.main`
  flex: 1;
  `;
