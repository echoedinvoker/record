import FormAddTask from './FormAddTask';
import TheTimer from './TheTimer';
import TheHeader from './TheHeader';
import Tasks from './Tasks';
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { Task } from '../types';
import { CircleButton, ContentWrapper } from './ui';

interface Props {
  tasks: Task[]
  addTask: (task: string, estimatedDurationHMS: string, markdownText: string) => void
  deleteTask: (id: number) => void
  startTask: (id: number) => void
  stopTask: (id: number) => void
  changeTaskName: (id: number, name: string) => void
  updateTaskMardownContent: (id: number, content: string) => void
  changeTaskElapsedDuration: (id: number, elapsedDurationHMS: string) => void
  downloadTasks: () => void
  delayToNextDay: (id: number, numOfDays: number) => void
}

export default function OnGoingTab({ tasks, addTask, deleteTask, startTask, stopTask, changeTaskName, updateTaskMardownContent, changeTaskElapsedDuration, downloadTasks, delayToNextDay }: Props) {
  const isLoadedTasksAtStart = useRef(false)
  const [showModal, setShowModal] = useState(false)
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null)
  const [whichDay, setWhichDay] = useState(0)

  const filteredTasks = tasks
    .filter(task => task.status !== 'done')
    .filter(task => task.delayTS.length === whichDay)

  const maxWhichDay = tasks.reduce((acc, task) => Math.max(acc, task.delayTS.length), 0)
  const hasNextDay = maxWhichDay > whichDay
  const hasPrevDay = whichDay > 0

  useEffect(() => {
    if (isLoadedTasksAtStart.current) return
    for (const task of Array.from(tasks.values())) {
      if (task.timestamp !== null) {
        setActiveTaskId(task.id)
        isLoadedTasksAtStart.current = true
        break
      }
    }
  }, [tasks])

  function handleAddTask(task: string, estimatedDurationHMS: string, markdownText: string) {
    setShowModal(false)
    addTask(task, estimatedDurationHMS, markdownText)
  }

  function handleStartTask(id: number) {
    setActiveTaskId(id)
    startTask(id)
  }

  function handleStopTask(id: number) {
    stopTask(id)
    setActiveTaskId(null)
  }

  return (
    <>
      <FixedButtons>
        <CircleButton $primary onClick={() => setShowModal(true)}>
          <ContentWrapper
            $size="1.5em"
            $weight="bold"
            $offsetY="-2px"
          >&#43;</ContentWrapper>
        </CircleButton>
        <CircleButton $primary onClick={downloadTasks}>
          <ContentWrapper
            $size="1.3em"
            $weight="bold"
            $offsetY="-2px"
          >&#8595;</ContentWrapper>
        </CircleButton>
      </FixedButtons>
      <Container>
        <TheHeader
          tasks={filteredTasks}
          whichDay={whichDay}
          switchToNextDay={() => maxWhichDay > whichDay && setWhichDay(whichDay + 1)}
          switchToPrevDay={() => whichDay > 0 && setWhichDay(whichDay - 1)}
          hasNextDay={hasNextDay}
          hasPrevDay={hasPrevDay}
        />
        <Tasks
          tasks={filteredTasks}
          deleteTask={deleteTask}
          startTask={handleStartTask}
          changeTaskName={changeTaskName}
          updateTaskMardownContent={updateTaskMardownContent}
          delayToNextDay={delayToNextDay}
          changeTaskElapsedDuration={changeTaskElapsedDuration} />
      </Container >
      {showModal && <FormAddTask setShowModal={setShowModal} addTask={handleAddTask} />}
      {activeTaskId !== null && <TheTimer
        task={tasks.find(task => task.id === activeTaskId)!}
        setActiveTaskId={setActiveTaskId}
        stopTask={handleStopTask}
        changeTaskName={changeTaskName}
        updateTaskMardownContent={updateTaskMardownContent}
      />}
    </>

  )
}

const FixedButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: .5em;
  position: fixed;
  top: 40vh;
  right: 1em;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5em;
`
