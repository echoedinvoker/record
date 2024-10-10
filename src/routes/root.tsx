import { Outlet, Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Save } from 'lucide-react';
import { useContext } from "react";
import { TasksContext } from "../context/tasksContext";
import { HopesContext } from "../context/hopesContext";

function Logo() {
  return <h3>Logo</h3>;
}

function RootHeader() {
  const { isPending: isPendingTasks } = useContext(TasksContext);
  const { isPending: isPendingHopes } = useContext(HopesContext);
  const isPending = isPendingTasks || isPendingHopes;
  const location = useLocation();

  return (
    <Header>
      <LogoContainer>
        <Logo />
      </LogoContainer>
      <Pages>
        <PageButton to="/hopes" $isactive={location.pathname === "/hopes"}>Hopes</PageButton>
        <PageButton to="/todos" $isactive={location.pathname === "/todos"}>Todos</PageButton>
        <PageButton to="/precepts" $isactive={location.pathname === "/precepts"}>Precepts</PageButton>
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

const PageButton = styled(Link) <{ $isactive: boolean }>`
  color: white;
  pointer-events: ${props => props.$isactive ? 'none' : 'auto'};
  opacity: ${props => props.$isactive ? 1 : 0.7};
  text-transform: ${props => props.$isactive ? 'uppercase' : 'none'};
  font-weight: ${props => props.$isactive ? 'bold' : 'normal'};
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
