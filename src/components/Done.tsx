import styled from "styled-components"
import { Done as TypeDone } from "../types"
import { CircleButton, ContentWrapper, EditPenSpan, Input, InputWrapper, Task, TaskContents, TaskName, TaskNameContainer } from "./ui"
import { useState } from "react"
import { convertMillisecondsToHMS } from "../utils"
import EditMarkdownModal from "./EditMardownModal"
import { Draggable, DraggableProvided } from "react-beautiful-dnd"
import { Form, Value } from "./ui/Form"

interface Props {
  index: number
  task: TypeDone
  deleteTask: (taskId: string, columnId: string) => void
  changeTaskName: (taskId: string, name: string) => void
  changeTaskEstimatedDuration: (taskId: string, estimatedDurationHMS: string) => void
  changeTaskElapsedDuration: (taskId: string, elapsedDurationHMS: string) => void
  updateTaskMardownContent: (taskId: string, content: string) => void
}

export default function Done({
  index,
  task,
  deleteTask,
  changeTaskName,
  changeTaskEstimatedDuration,
  changeTaskElapsedDuration,
  updateTaskMardownContent
}: Props) {

  const [isEditingTaskName, setIsEditingTaskName] = useState(false);
  const [taskName, setTaskName] = useState(task.task);
  const [showModal, setShowModal] = useState(false);
  const [isEditingEstimatedDuration, setIsEditingEstimatedDuration] = useState(false);
  const [estimatedDurationHMS, setEstimatedDurationHMS] = useState(convertMillisecondsToHMS(task.estimatedDuration));
  const [isEditingElapsedDuration, setIsEditingElapsedDuration] = useState(false);
  const [elapsedDurationHMS, setElapsedDurationHMS] = useState(convertMillisecondsToHMS(task.timestampSum));

  const handleTaskNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditingTaskName(false);
    changeTaskName(task.id, taskName);
  }
  const handleEstimatedDurationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('estimatedDurationHMS', estimatedDurationHMS)
    setIsEditingEstimatedDuration(false);
    changeTaskEstimatedDuration(task.id, estimatedDurationHMS);
  }
  const handleElapsedDurationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditingElapsedDuration(false);
    changeTaskElapsedDuration(task.id, elapsedDurationHMS)
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
              {
                isEditingTaskName ? (
                  <Form onSubmit={handleTaskNameSubmit}>
                    <InputWrapper $white>
                      <Input $white type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
                    </InputWrapper>
                  </Form>
                ) : (
                  <TaskName>{task.task}</TaskName>
                )
              }
            </TaskNameContainer>
            <TaskContents>
              <TaskActions>
                <CircleButton onClick={() => setShowModal(true)}>
                  <ContentWrapper>
                    &#128196;
                  </ContentWrapper>
                </CircleButton>
                <CircleButton onClick={() => deleteTask(task.id, 'done')}>
                  <ContentWrapper>
                    &#10006;
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
              <PairValueContainer>
                <CircleButton $ghost onClick={() => setIsEditingElapsedDuration((prev) => !prev)}>
                  <ContentWrapper $offsetY="-3px" $size="1.5em" style={{ color: 'white' }}>
                    &#9998;
                  </ContentWrapper>
                </CircleButton>
                {isEditingElapsedDuration ? (
                  <form onSubmit={handleElapsedDurationSubmit}>
                    <InputWrapper $white>
                      <Input $white type="text" value={elapsedDurationHMS} onChange={(e) => setElapsedDurationHMS(e.target.value)} />
                    </InputWrapper>
                  </form>
                ) : (
                  <Value>{convertMillisecondsToHMS(task.timestampSum)}</Value>
                )}
              </PairValueContainer>
              <PairValueContainer>
                <Value>{Math.floor(task.efficiency * 100)}%</Value>
              </PairValueContainer>
            </TaskContents>
          </Task>
        )}
      </Draggable>
      {showModal && <EditMarkdownModal task={task} setShowModal={setShowModal} changeMarkdown={updateTaskMardownContent} />
      }
    </>
  )
}

const PairValueContainer = styled.div`
  display: flex;
  align-items: center;
`


const TaskActions = styled.div`
    display: flex;
    gap: .5em;
  `
