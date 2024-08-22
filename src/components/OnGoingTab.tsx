import React, { useEffect, useRef, useState, forwardRef } from 'react';
import FormAddTask from './FormAddTask';
import TheTimer from './TheTimer';
import TheHeader from './TheHeader';
import Tasks, { TasksRef } from './Tasks';
import styled from 'styled-components';
import { Data, Done } from '../types';
import DoneList, { DoneListRef } from './DoneList';

interface Props {
  data: (Data | null);
  addTask: (task: string, estimatedDurationHMS: string, markdownText: string, columnId: string) => void;
  deleteTask: (taskId: string, columnId: string) => void;
  startTask: (taskId: string) => void;
  stopTask: (taskId: string) => void;
  changeTaskName: (taskId: string, name: string) => void;
  updateTaskMardownContent: (taskId: string, content: string) => void;
  changeTaskElapsedDuration: (taskId: string, elapsedDurationHMS: string) => void;
  changeTaskEstimatedDuration: (taskId: string, estimatedDurationHMS: string) => void;
  downloadTasks: () => void;
  delayToNextDay: (taskId: string) => void;
}

export interface OnGoingTabRef {
  tasksRef: React.RefObject<TasksRef>;
  doneListRef: React.RefObject<TasksRef>;
}

const OnGoingTab = forwardRef<OnGoingTabRef, Props>(({
  data,
  addTask,
  deleteTask,
  startTask,
  stopTask,
  changeTaskName,
  updateTaskMardownContent,
  changeTaskElapsedDuration,
  changeTaskEstimatedDuration,
  delayToNextDay
}, ref) => {
  const isLoadedTasksAtStart = useRef(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [whichDay, setWhichDay] = useState(0);

  const tasksRef = useRef<TasksRef>(null);
  const doneListRef = useRef<DoneListRef>(null);

  React.useImperativeHandle(ref, () => ({
    tasksRef,
    doneListRef
  }));

  useEffect(() => {
    if (!data) return;
    if (isLoadedTasksAtStart.current) return;
    isLoadedTasksAtStart.current = true;
    for (const taskId of data.columns["0"].taskIds) {
      const task = data.tasks[taskId];
      if (task.timestamp) {
        setActiveTaskId(task.id);
        break;
      }
    }
  }, [data]);

  if (!data) return null;

  const filteredDayTasks = data.columns[whichDay].taskIds.map(taskId => data.tasks[taskId]);
  const filteredDoneTasks = data.columns["done"].taskIds.map(taskId => data.tasks[taskId]);
  const filteredDayAndDoneTasks = [...filteredDayTasks, ...filteredDoneTasks];

  const maxWhichDay = getMaxWhichDay();
  const hasNextDay = maxWhichDay > whichDay;
  const hasPrevDay = whichDay > 0;

  function getMaxWhichDay() {
    let max = 0;
    while ((max + 1).toString() in data!.columns) {
      max++;
    }
    return max;
  }

  function handleAddTask(task: string, estimatedDurationHMS: string, markdownText: string) {
    setShowModal(false);
    addTask(task, estimatedDurationHMS, markdownText, whichDay.toString());
  }

  function handleStartTask(taskId: string) {
    setActiveTaskId(taskId);
    startTask(taskId);
  }

  function handleStopTask(taskId: string) {
    stopTask(taskId);
    setActiveTaskId(null);
  }

  return (
    <>
      <Container>
        <TheHeader
          tasks={filteredDayAndDoneTasks}
          whichDay={whichDay}
          switchToNextDay={() => maxWhichDay > whichDay && setWhichDay(whichDay + 1)}
          switchToPrevDay={() => whichDay > 0 && setWhichDay(whichDay - 1)}
          hasNextDay={hasNextDay}
          hasPrevDay={hasPrevDay}
        />
        <Columns>
          <Tasks
            ref={tasksRef}
            tasks={filteredDayTasks}
            whichDay={whichDay}
            deleteTask={deleteTask}
            startTask={handleStartTask}
            changeTaskName={changeTaskName}
            updateTaskMardownContent={updateTaskMardownContent}
            delayToNextDay={delayToNextDay}
            setShowModal={setShowModal}
            changeTaskEstimatedDuration={changeTaskEstimatedDuration}
          />
          <DoneList
            ref={doneListRef}
            tasks={data.columns["done"].taskIds.map(taskId => data.tasks[taskId]) as Done[]}
            deleteTask={deleteTask}
            changeTaskName={changeTaskName}
            updateTaskMardownContent={updateTaskMardownContent}
            changeTaskEstimatedDuration={changeTaskEstimatedDuration}
            changeTaskElapsedDuration={changeTaskElapsedDuration}
          />
        </Columns>
      </Container>
      {showModal && <FormAddTask setShowModal={setShowModal} addTask={handleAddTask} />}
      {activeTaskId !== null && (
        <TheTimer
          task={data.tasks[activeTaskId]}
          setActiveTaskId={setActiveTaskId}
          stopTask={handleStopTask}
          changeTaskName={changeTaskName}
          updateTaskMardownContent={updateTaskMardownContent}
        />
      )}
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
`;
