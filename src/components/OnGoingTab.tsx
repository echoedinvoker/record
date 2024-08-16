import FormAddTask from './FormAddTask';
import TheTimer from './TheTimer';
import TheHeader from './TheHeader';
import Tasks from './Tasks';
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { Data, Task } from '../types';
import { CircleButton, ContentWrapper } from './ui';

interface Props {
  data: (Data | null)
  addTask: (
    task: string,
    estimatedDurationHMS: string,
    markdownText: string,
    columnId: string
  ) => void
  deleteTask: (taskId: string, columnId: string) => void
  startTask: (taskId: string) => void
  stopTask: (taskId: string) => void
  changeTaskName: (taskId: string, name: string) => void
  updateTaskMardownContent: (taskId: string, content: string) => void
  changeTaskElapsedDuration: (taskId: string, elapsedDurationHMS: string) => void
  downloadTasks: () => void
  delayToNextDay: (taskId: string) => void
}

export default function OnGoingTab({ data, addTask, deleteTask, startTask, stopTask, changeTaskName, updateTaskMardownContent, changeTaskElapsedDuration, downloadTasks, delayToNextDay }: Props) {
  const isLoadedTasksAtStart = useRef(false)
  const [showModal, setShowModal] = useState(false)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [whichDay, setWhichDay] = useState(0)

  useEffect(() => {
    if (!data) return
    if (isLoadedTasksAtStart.current) return
    isLoadedTasksAtStart.current = true
    for (const taskId of data!.columns["0"].taskIds) {
      const task = data!.tasks[taskId]
      if (task.timestamp) {
        setActiveTaskId(task.id)
        break
      }
    }
  }, [data])

  if (!data) return null

  const filteredTasks = data.columns[whichDay].taskIds.map(taskId => data.tasks[taskId])

  const maxWhichDay = getMaxWhichDay()
  const hasNextDay = maxWhichDay > whichDay
  const hasPrevDay = whichDay > 0

  function getMaxWhichDay() {
    let max = 0
    while (true) {
      if ((max + 1).toString() in data!.columns) {
        max++
      } else {
        break
      }
    }
    return max
  }


  function handleAddTask(task: string, estimatedDurationHMS: string, markdownText: string) {
    setShowModal(false)
    addTask(task, estimatedDurationHMS, markdownText, whichDay.toString())
  }

  function handleStartTask(taskId: string) {
    setActiveTaskId(taskId)
    startTask(taskId)
  }

  function handleStopTask(taskId: string) {
    stopTask(taskId)
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
          whichDay={whichDay}
          deleteTask={deleteTask}
          startTask={handleStartTask}
          changeTaskName={changeTaskName}
          updateTaskMardownContent={updateTaskMardownContent}
          delayToNextDay={delayToNextDay}
          changeTaskElapsedDuration={changeTaskElapsedDuration} />
      </Container >
      {showModal && <FormAddTask setShowModal={setShowModal} addTask={handleAddTask} />}
      {activeTaskId !== null && <TheTimer
        task={data.tasks[activeTaskId]}
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
