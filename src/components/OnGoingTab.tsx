import React, { useRef, useState, forwardRef, useContext } from 'react';
import FormAddTask from './FormAddTask';
import TheTimer from './TheTimer';
import TheHeader from './TheHeader';
import Tasks, { TasksRef } from './Tasks';
import styled from 'styled-components';
import DoneList, { DoneListRef } from './DoneList';
import { TasksContext } from '../context/tasksContext';
import { ContentWrapper } from './ui';
import { Save } from 'lucide-react';
import { saveData } from '../utils/saveData';

interface Props { }

export interface OnGoingTabRef {
  tasksRef: React.RefObject<TasksRef>;
  doneListRef: React.RefObject<TasksRef>;
}

const OnGoingTab = forwardRef<OnGoingTabRef, Props>(({ }, ref) => {
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const tasksRef = useRef<TasksRef>(null);
  const doneListRef = useRef<DoneListRef>(null);

  React.useImperativeHandle(ref, () => ({
    tasksRef,
    doneListRef
  }));

  const { data } = useContext(TasksContext);
  async function handleSave() {
    setIsSaving(true);
    await saveData(data);
    setIsSaving(false);
  }



  const { runningTask } = useContext(TasksContext);

  return (
    <>
      <Container>
        <TheHeader />
        <Columns>
          <Tasks ref={tasksRef} setShowModal={setShowModal} />
          <DoneList ref={doneListRef} />
        </Columns>
        <AbsoluteRightTop $isSaving={isSaving}>
          <ContentWrapper $offsetY="-1px">
            <Save onClick={handleSave}
              size={28} />
          </ContentWrapper>
        </AbsoluteRightTop>
      </Container>
      {showModal && <FormAddTask setShowModal={setShowModal} />}
      {runningTask && <TheTimer task={runningTask} />}
    </>
  );
});

export default OnGoingTab;

const AbsoluteRightTop = styled.div<{ $isSaving?: boolean }>`
  position: absolute;
  color: ${(props) => props.$isSaving ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.87)'};
  top: 0;
  right: 0;
  padding: 1em;
  `;

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
