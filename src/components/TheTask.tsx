import styled from "styled-components";
import { Task as TypeTask } from "../types";
import { CircleButton, ContentWrapper, EditPenSpan, Input, InputWrapper, Task, TaskName, TasksHeader, TextButton } from "./ui";
import { convertMillisecondsToHMS } from "../utils";
import { useState } from "react";
import EditMarkdownModal from "./EditMardownModal";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import { ArrowBigRight } from 'lucide-react';
import TaskNameContainer from "./ui/TaskNameContainer";

interface Props {
  task: TypeTask,
  deleteTask: (taskId: string, columnId: string) => void
  whichDay: number
  startTask: (taskId: string) => void
  changeTaskName: (taskId: string, name: string) => void
  changeTaskEstimatedDuration: (taskId: string, estimatedDurationHMS: string) => void
  changeMarkdown: (taskId: string, markdown: string) => void
  delayToNextDay: (taskId: string) => void
  index: number
}

export default function TheTask({ index, task, deleteTask, startTask, changeTaskName, changeTaskEstimatedDuration, changeMarkdown, delayToNextDay, whichDay }: Props) {
  const [isEditingTaskName, setIsEditingTaskName] = useState(false);
  const [taskName, setTaskName] = useState(task.task);
  const [isEditingEstimatedDuration, setIsEditingEstimatedDuration] = useState(false);
  const [estimatedDurationHMS, setEstimatedDurationHMS] = useState(convertMillisecondsToHMS(task.estimatedDuration));
  const [showModal, setShowModal] = useState(false);


  const handleTaskNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditingTaskName(false);
    changeTaskName(task.id, taskName);
  }

  const handleEstimatedDurationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditingEstimatedDuration(false);
    changeTaskEstimatedDuration(task.id, estimatedDurationHMS);
  }

  const handleDelay = () => {
    delayToNextDay(task.id);
  }

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided: DraggableProvided) => (
          <Task
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <TasksHeader>
              <TaskNameContainer>
                {isEditingTaskName ? (
                  <form onSubmit={handleTaskNameSubmit}>
                    <InputWrapper $white>
                      <Input $white type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
                      <EditPenSpan
                        onClick={() => setIsEditingTaskName((prev) => !prev)}
                      >  &#9998;</EditPenSpan>
                    </InputWrapper>
                  </form>
                ) : (
                  <TaskName>{task.task}<EditPenSpan
                    onClick={() => setIsEditingTaskName((prev) => !prev)}
                  >  &#9998;</EditPenSpan></TaskName>
                )}
              </TaskNameContainer>
              <TaskActions>
                <CircleButton onClick={() => setShowModal(true)}>
                  <ContentWrapper>
                    &#128196;
                  </ContentWrapper>
                </CircleButton>
                <CircleButton onClick={handleDelay}>
                  <ContentWrapper $offsetY="-1px">
                    <ArrowBigRight size={28} />
                  </ContentWrapper>
                </CircleButton>
                <CircleButton onClick={() => deleteTask(task.id, whichDay.toString())}>
                  <ContentWrapper>
                    &#10006;
                  </ContentWrapper>
                </CircleButton>
                <CircleButton onClick={() => deleteTask(task.id, whichDay.toString())}>
                  <ContentWrapper>
                    &#10006;
                  </ContentWrapper>
                </CircleButton>
              </TaskActions>
            </TasksHeader>
            <Pairs>
              <Pair>
                <Key>Estimated Duration:</Key>
                <PairValueContainer>
                  <CircleButton $ghost onClick={() => setIsEditingEstimatedDuration((prev) => !prev)}>
                    <ContentWrapper $offsetY="-3px" $size="1.5em" style={{ color: 'white' }}>
                      &#9998;
                    </ContentWrapper>
                  </CircleButton>
                  {isEditingEstimatedDuration ? (
                    <form onSubmit={handleEstimatedDurationSubmit}>
                      <InputWrapper $white>
                        <Input $white type="text" value={estimatedDurationHMS} onChange={(e) => setEstimatedDurationHMS(e.target.value)} />
                      </InputWrapper>
                    </form>
                  ) : (
                    <Value>{convertMillisecondsToHMS(task.estimatedDuration)}</Value>
                  )}
                </PairValueContainer>
              </Pair>
              <TaskTimer>
                <TextButton
                  $paddingMultiplier={1.3}
                  onClick={() => startTask(task.id)}>
                  <ContentWrapper $size="2em" $weight="bold" $offsetY="-2px">
                    {task.timestampSum === 0 ? 'Start' : convertMillisecondsToHMS(task.timestampSum + (task.timestamp ? Date.now() - task.timestamp : 0))}
                  </ContentWrapper>
                </TextButton>
              </TaskTimer>
            </Pairs>
          </Task >
        )}
      </Draggable>
      {showModal && <EditMarkdownModal task={task} setShowModal={setShowModal} changeMarkdown={changeMarkdown} />
      }
    </>
  )
}


const PairValueContainer = styled.div`
  display: flex;
  align-items: center;
`

const TaskActions = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: .5em;
  `

const Pairs = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
gap: 1.5em;
`

const Pair = styled.div`
display: flex;
flex-direction: column;
justify-content: flex-start;
margin: 0.5em 0;
`

const TaskTimer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`

const Key = styled.div`
font-weight: bold;
font-size: 1.2em;
`
const Value = styled.div`
font-size: 1.2em;
`
