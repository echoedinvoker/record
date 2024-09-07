import styled from "styled-components";
import { Task as TypeTask } from "../types";
import { CircleButton, ContentWrapper, Task, TaskContents, TextButton, TopRightCorner } from "./ui";
import { convertHMStoMilliseconds, convertMillisecondsToHMS } from "../utils";
import { useContext, useState } from "react";
import EditMarkdownModal from "./EditMardownModal";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import { ArrowBigLeft, ArrowBigRight, X } from 'lucide-react';
import TaskNameContainer from "./ui/TaskNameContainer";
import { Value } from "./ui/Form";
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

  const { updateTask, moveTaskToOtherColumn, startTask, deleteTask } = useContext(TasksContext)
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
        {(provided: DraggableProvided) => (
          <Task
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
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
            <TaskContents>
              <TaskActions>
                <CircleButton onClick={() => setShowModal(true)}>
                  <ContentWrapper>
                    &#128196;
                  </ContentWrapper>
                </CircleButton>
                {parseInt(day) > 0 &&
                  <CircleButton onClick={handleAdvance}>
                    <ContentWrapper $offsetY="-1px">
                      <ArrowBigLeft size={24} />
                    </ContentWrapper>
                  </CircleButton>}
                <CircleButton onClick={handleDelay}>
                  <ContentWrapper $offsetY="-1px">
                    <ArrowBigRight size={24} />
                  </ContentWrapper>
                </CircleButton>
              </TaskActions>
              <PairValueContainer onClick={toggleEditEstimatedDuration}>
                {isEditingEstimatedDuration ? (
                  <CodeMirrorContainer>
                    <MyCodeMirrorComponent initialValue={estimatedDurationHMS} handleSave={handleEstimatedDurationSave} />
                  </CodeMirrorContainer>
                ) : (
                  <Value>{convertMillisecondsToHMS(task.estimatedDuration)}</Value>
                )}
              </PairValueContainer>
              <TaskTimer>
                <TextButton
                  onClick={() => startTask(task.key)}>
                  <ContentWrapper $size="1.5em" $weight="bold" $offsetY="-2px">
                    {!task.timestampSum ? 'Start' : convertMillisecondsToHMS(task.timestampSum + (task.timestamp ? Date.now() - task.timestamp : 0))}
                  </ContentWrapper>
                </TextButton>
              </TaskTimer>
            </TaskContents>
            <TopRightCorner onClick={handleDeteteTask}><X /></TopRightCorner>
          </Task >
        )}
      </Draggable>
      {showModal && <EditMarkdownModal task={task} setShowModal={setShowModal} />
      }
    </>
  )
}

const CodeMirrorContainer = styled.div`
  color: black;
  width: 70%;
  height: 100%;
  margin-top: 1.5em;
`

const ReactMarkdownContainer = styled.div`
  margin-left: 1.5em;
`


const PairValueContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`

const TaskActions = styled.div`
    flex: 1;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    gap: .5em;
  `

const TaskTimer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`
