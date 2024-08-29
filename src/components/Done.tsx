import styled from "styled-components"
import { Done as TypeDone } from "../types"
import { CircleButton, ContentWrapper, EditPenSpan, Input, InputWrapper, Task, TaskContents, TaskName, TaskNameContainer, TopRightCorner } from "./ui"
import { useContext, useState } from "react"
import { convertHMStoMilliseconds, convertMillisecondsToHMS } from "../utils"
import EditMarkdownModal from "./EditMardownModal"
import { Draggable, DraggableProvided } from "react-beautiful-dnd"
import { Form, Value } from "./ui/Form"
import { Archive, X } from "lucide-react"
import { TasksContext } from "../context/tasksContext"

interface Props {
  index: number;
  task: TypeDone;
}

export default function Done({ index, task }: Props) {

  const { updateTask, deleteTask, doneToArchive } = useContext(TasksContext)

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
    const newTask = { ...task, task: taskName }
    updateTask(newTask)
  }
  const handleEstimatedDurationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditingEstimatedDuration(false);
    const newTask = { ...task, estimatedDuration: convertHMStoMilliseconds(estimatedDurationHMS) }
    updateTask(newTask)
  }
  const handleElapsedDurationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditingElapsedDuration(false);
    const newTask = { ...task, timestampSum: convertHMStoMilliseconds(elapsedDurationHMS) }
    updateTask(newTask)
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
                <CircleButton>
                  <ContentWrapper onClick={() => doneToArchive(task.key)}>
                    <Archive size={20} />
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
            <TopRightCorner onClick={() => deleteTask(task.key)}><X /></TopRightCorner>
          </Task>
        )}
      </Draggable>
      {showModal && <EditMarkdownModal task={task} setShowModal={setShowModal} />
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
    align-items: center;
    gap: .5em;
  `
