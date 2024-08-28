import styled from "styled-components";
import { Task as TypeTask } from "../types";
import { CircleButton, ContentWrapper, EditPenSpan, Input, InputWrapper, Task, TaskContents, TaskName, TextButton, TopRightCorner } from "./ui";
import { convertMillisecondsToHMS } from "../utils";
import { useState } from "react";
import EditMarkdownModal from "./EditMardownModal";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import { ArrowBigLeft, ArrowBigRight, X } from 'lucide-react';
import TaskNameContainer from "./ui/TaskNameContainer";
import { Form, Value } from "./ui/Form";

interface Props {
  task: TypeTask,
  deleteTask: (taskId: string, columnId: string) => void
  whichDay: number
  startTask: (taskId: string) => void
  changeTaskName: (taskId: string, name: string) => void
  changeTaskEstimatedDuration: (taskId: string, estimatedDurationHMS: string) => void
  changeMarkdown: (taskId: string, markdown: string) => void
  advanceTask: (taskId: string) => void
  delayToNextDay: (taskId: string) => void
  index: number
}

export default function TheTask({ index, task, deleteTask, startTask, changeTaskName, changeTaskEstimatedDuration, changeMarkdown, advanceTask, delayToNextDay, whichDay }: Props) {
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

  // 處理提前任務
  const handleAdvance = () => {
    advanceTask(task.id);
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
            <TaskNameContainer>
              <EditPenSpan
                onClick={() => setIsEditingTaskName((prev) => !prev)}
              >&#9998;</EditPenSpan>
              {isEditingTaskName ? (
                <Form onSubmit={handleTaskNameSubmit}>
                  <InputWrapper $white>
                    <Input $white type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
                  </InputWrapper>
                </Form>
              ) : (
                <TaskName>{task.task}</TaskName>
              )}
            </TaskNameContainer>
            <TaskContents>
              <TaskActions>
                <CircleButton onClick={() => setShowModal(true)}>
                  <ContentWrapper>
                    &#128196;
                  </ContentWrapper>
                </CircleButton>
                {whichDay > 0 &&
                  <CircleButton onClick={handleAdvance}>
                    <ContentWrapper $offsetY="-1px">
                      <ArrowBigLeft size={28} />
                    </ContentWrapper>
                  </CircleButton>}
                <CircleButton onClick={handleDelay}>
                  <ContentWrapper $offsetY="-1px">
                    <ArrowBigRight size={28} />
                  </ContentWrapper>
                </CircleButton>
              </TaskActions>
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
              <TaskTimer>
                <TextButton
                  onClick={() => startTask(task.id)}>
                  <ContentWrapper $size="1.5em" $weight="bold" $offsetY="-2px">
                    {!task.timestampSum ? 'Start' : convertMillisecondsToHMS(task.timestampSum + (task.timestamp ? Date.now() - task.timestamp : 0))}
                  </ContentWrapper>
                </TextButton>
              </TaskTimer>
            </TaskContents>
            <TopRightCorner onClick={() => deleteTask(task.id, whichDay.toString())}><X /></TopRightCorner>
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
    align-items: center;
    gap: .5em;
  `

const TaskTimer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`
