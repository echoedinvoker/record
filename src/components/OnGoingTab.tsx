import React, { useRef, useState, forwardRef, useContext } from 'react';
import FormAddTask from './FormAddTask';
import TheHeader from './TheHeader';
import Tasks, { TasksRef } from './Tasks';
import styled from 'styled-components';
import DoneList, { DoneListRef } from './DoneList';
import { TasksContext } from '../context/tasksContext';


interface Props { }

export interface OnGoingTabRef {
  tasksRef: React.RefObject<TasksRef>;
  doneListRef: React.RefObject<TasksRef>;
}

const OnGoingTab = forwardRef<OnGoingTabRef, Props>(({ }, ref) => {
  const [showModal, setShowModal] = useState(false);

  const tasksRef = useRef<TasksRef>(null);
  const doneListRef = useRef<DoneListRef>(null);

  React.useImperativeHandle(ref, () => ({
    tasksRef,
    doneListRef
  }));


  return (
    <>
      <Container>
        <TheHeader />
        <Columns>
          <Tasks ref={tasksRef} setShowModal={setShowModal} />
          <DoneList ref={doneListRef} />
        </Columns>
      </Container>
      {showModal && <FormAddTask setShowModal={setShowModal} />}
    </>
  );
});

export default OnGoingTab;

const Columns = styled.div`
  display: flex;
  gap: 1em;
  flex-wrap: wrap;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5em;
  position: relative;
`;
