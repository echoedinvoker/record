import styled, { css } from "styled-components";
import { Task as TypeTask } from "../types";
import { TopRightCorner } from "./ui";
import Task from "./ui/Task";
import { convertHMStoMilliseconds, convertMillisecondsToHMS } from "../utils";
import { useContext, useState, useEffect } from "react";
import EditMarkdownModal from "./EditMardownModal";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import { ArrowBigLeft, ArrowBigRight, X, FileText, Play, Pause } from 'lucide-react';
import TaskNameContainer from "./ui/TaskNameContainer";
import { TasksContext } from "../context/tasksContext";
import { DayContext } from "../context/dayContext";
import ReactMarkdown from 'react-markdown';
import MyCodeMirrorComponent from "./MyCodeMirrorComponent";

interface Props {
  task: TypeTask,
  index: number
}

export default function TheTask({ index, task }: Props) {
  const [isEditingTaskName, setIsEditingTaskName] = useState(false);
  const [taskName, setTaskName] = useState(task.task);
  const [isEditingEstimatedDuration, setIsEditingEstimatedDuration] = useState(false);
  const [estimatedDurationHMS, setEstimatedDurationHMS] = useState(convertMillisecondsToHMS(task.estimatedDuration));
  const [showModal, setShowModal] = useState(false);

  const { updateTask, moveTaskToOtherColumn, startTask, pauseTask, deleteTask } = useContext(TasksContext)
  const { day, setDay } = useContext(DayContext)

  const handleAdvance = () => {
    const prevDay = (Number(day) - 1).toString();
    if (Number(prevDay) < 0) return;
    moveTaskToOtherColumn(task.key, prevDay);
    setDay(prevDay)
  }

  const handleDelay = () => {
    const nextDay = (Number(day) + 1).toString();
    moveTaskToOtherColumn(task.key, nextDay);
    setDay(nextDay)
  }

  const handleSave = (value: string) => {
    setTaskName(value)
    setIsEditingTaskName(false)
    updateTask({ ...task, task: value })
  }

  const handleEstimatedDurationSave = (value: string) => {
    setEstimatedDurationHMS(value)
    setIsEditingEstimatedDuration(false)
    const newTask = { ...task, estimatedDuration: convertHMStoMilliseconds(value) }
    updateTask(newTask)
  }

  const toggleEditTaskName = () => {
    setIsEditingTaskName((prev) => !prev)
  }

  const toggleEditEstimatedDuration = () => {
    setIsEditingEstimatedDuration((prev) => !prev)
  }

  const handleDeteteTask = () => {
    const isDayEmpty = deleteTask(task.key)
    if (isDayEmpty) {
      setDay("0")
    }
  }

  return (
    <>
      <Draggable draggableId={task.key} index={index}>
        {(provided: DraggableProvided, snapshot) => (
          <DraggableTask
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            isDragging={snapshot.isDragging}
            isEditing={isEditingTaskName}
          >
            <TaskNameContainer onClick={toggleEditTaskName}>
              {isEditingTaskName ? (
                <CodeMirrorContainer>
                  <MyCodeMirrorComponent
                    initialValue={taskName}
                    handleSave={handleSave}
                  />
                </CodeMirrorContainer>
              ) : (
                <ReactMarkdownContainer>
                  <ReactMarkdown>{taskName}</ReactMarkdown>
                </ReactMarkdownContainer>
              )}
            </TaskNameContainer>
            <TopRightCorner>
              <ActionButton onClick={() => setShowModal(true)}>
                <FileText size={16} />
              </ActionButton>
              {parseInt(day) > 0 && (
                <ActionButton onClick={handleAdvance}>
                  <ArrowBigLeft size={16} />
                </ActionButton>
              )}
              <ActionButton onClick={handleDelay}>
                <ArrowBigRight size={16} />
              </ActionButton>
              <EstimatedDuration>
                {isEditingEstimatedDuration ? (
                  <CodeMirrorContainer>
                    <MyCodeMirrorComponent initialValue={estimatedDurationHMS} handleSave={handleEstimatedDurationSave} />
                  </CodeMirrorContainer>
                ) : (
                  <span onClick={toggleEditEstimatedDuration} style={{ paddingRight: '8px' }}>
                    {convertMillisecondsToHMS(task.estimatedDuration)}
                  </span>
                )}
              </EstimatedDuration>
              <ActionButton onClick={() => task.timestamp ? pauseTask(task.key) : startTask(task.key)}>
                {task.timestamp ? <Pause size={16} /> : <Play size={16} />}
                <TimerDisplay>
                  {task.timestamp ?
                    <RunningTimer task={task} /> :
                    (!task.timestampSum ? 'Start' : convertMillisecondsToHMS(task.timestampSum))
                  }
                </TimerDisplay>
              </ActionButton>
              <ActionButton onClick={handleDeteteTask}>
                <X size={16} />
              </ActionButton>
            </TopRightCorner>
          </DraggableTask>
        )}
      </Draggable>
      {showModal && <EditMarkdownModal task={task} setShowModal={setShowModal} />
      }
    </>
  )
}

const CodeMirrorContainer = styled.div`
  color: black;
  width: 100%;
  height: 100%;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background-color: inherit;
  border-radius: inherit;
  box-sizing: border-box;
`

interface RunningTimerProps {
  task: TypeTask
}

function RunningTimer({ task }: RunningTimerProps) {
  const [elapsedTime, setElapsedTime] = useState(task.timestampSum + (Date.now() - task.timestamp!));

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(task.timestampSum + (Date.now() - task.timestamp!));
    }, 1000);

    return () => clearInterval(interval);
  }, [task]);

  return <>{convertMillisecondsToHMS(elapsedTime)}</>;
}

const ReactMarkdownContainer = styled.div`
  margin-left: 1.5em;
  width: 100%;
`

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
  color: inherit;
  &:hover {
    opacity: 0.7;
  }
`

const EstimatedDuration = styled.span`
  margin: 0 8px;
  cursor: pointer;
  display: flex;
  align-items: center;

  ${CodeMirrorContainer} {
    width: 80px;
    min-height: 30px;
  }
`

const TimerDisplay = styled.span`
  margin-left: 4px;
  font-size: 0.8em;
`

const DraggableTask = styled(Task) <{ isDragging: boolean; isEditing: boolean }>`
  ${({ isDragging }) =>
    isDragging &&
    css`
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    `}
  position: relative;
  ${({ isEditing }) =>
    isEditing &&
    css`
      & > *:not(${TaskNameContainer}) {
        visibility: hidden;
      }
    `}
`
