import styled from "styled-components";
import { Task as TypeTask } from "../types";
import { CircleButton, ContentWrapper, Input, InputWrapper, Task, TextButton } from "./ui";
import { convertMillisecondsToHMS } from "../utils";
import { useState } from "react";
import EditMarkdownModal from "./EditMardownModal";

interface Props {
  task: TypeTask,
  deleteTask: (taskId: string, columnId: string) => void
  whichDay: number
  startTask: (taskId: string) => void
  changeTaskName: (taskId: string, name: string) => void
  changeTaskEstimatedDuration: (taskId: string, estimatedDurationHMS: string) => void
  changeMarkdown: (taskId: string, markdown: string) => void
  delayToNextDay: (taskId: string) => void
}

export default function TheTask({ task, deleteTask, startTask, changeTaskName, changeTaskEstimatedDuration, changeMarkdown, delayToNextDay, whichDay }: Props) {
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
      <Task key={task.id}>
        <TaskHeader>
          <TaskNameContainer>
            <CircleButton $ghost onClick={() => setIsEditingTaskName((prev) => !prev)}>
              <ContentWrapper $offsetY="-3px" $size="1.5em" style={{ color: 'white' }}>
                &#9998;
              </ContentWrapper>
            </CircleButton>
            {isEditingTaskName ? (
              <form onSubmit={handleTaskNameSubmit}>
                <InputWrapper $white>
                  <Input $white type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
                </InputWrapper>
              </form>
            ) : (
              <TaskName>{task.task}</TaskName>
            )}
          </TaskNameContainer>
          <TaskActions>
            <CircleButton onClick={() => setShowModal(true)}>
              <ContentWrapper>
                &#128196;
              </ContentWrapper>
            </CircleButton>
            <CircleButton onClick={handleDelay}>
              <ContentWrapper $size="1.5em" $offsetY="-2px">
                &#9202;
              </ContentWrapper>
            </CircleButton>
            <CircleButton onClick={() => deleteTask(task.id, whichDay.toString())}>
              <ContentWrapper>
                &#10006;
              </ContentWrapper>
            </CircleButton>
          </TaskActions>
        </TaskHeader>
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
      {showModal && <EditMarkdownModal task={task} setShowModal={setShowModal} changeMarkdown={changeMarkdown} />
      }
    </>
  )
}

const PairValueContainer = styled.div`
  display: flex;
  align-items: center;
`

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2.5em;
  `

const TaskNameContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1em;
`


const TaskName = styled.h2`
    letter-spacing: 0.1em;
    font-size: 1.5em;
    margin: 0;
  `

const TaskActions = styled.div`
    display: flex;
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
