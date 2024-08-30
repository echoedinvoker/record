import styled from "styled-components"
import { Done as TypeDone } from "../types"
import { CircleButton, ContentWrapper, Task, TaskContents, TaskNameContainer, TopRightCorner } from "./ui"
import { useContext, useState } from "react"
import { convertHMStoMilliseconds, convertMillisecondsToHMS } from "../utils"
import EditMarkdownModal from "./EditMardownModal"
import { Draggable, DraggableProvided } from "react-beautiful-dnd"
import { Value } from "./ui/Form"
import { Archive, X } from "lucide-react"
import { TasksContext } from "../context/tasksContext"
import MyCodeMirrorComponent from "./MyCodeMirrorComponent"
import ReactMarkdown from 'react-markdown';

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

  const handleSaveTaskName = (value: string) => {
    setTaskName(value)
    setIsEditingTaskName(false)
    updateTask({ ...task, task: value })
  }

  const toggleEditTaskName = () => {
    setIsEditingTaskName((prev) => {
      if (!prev) {
        setIsEditingEstimatedDuration(false)
        setIsEditingElapsedDuration(false)
      }
      return !prev
    })
  }

  const handleEstimatedDurationSave = (value: string) => {
    setEstimatedDurationHMS(value)
    setIsEditingEstimatedDuration(false)
    const newTask = { ...task, estimatedDuration: convertHMStoMilliseconds(value) }
    updateTask(newTask)
  }

  const toggleEditEstimatedDuration = () => {
    setIsEditingEstimatedDuration((prev) => {
      if (!prev) {
        setIsEditingTaskName(false)
        setIsEditingElapsedDuration(false)
      }
      return !prev
    })
  }

  const handleElapsedDurationSave = (value: string) => {
    setElapsedDurationHMS(value)
    setIsEditingElapsedDuration(false)
    const newTask = { ...task, timestampSum: convertHMStoMilliseconds(value) }
    updateTask(newTask)
  }

  const toggleEditElapsedDuration = () => {
    setIsEditingElapsedDuration((prev) => {
      if (!prev) {
        setIsEditingTaskName(false)
        setIsEditingEstimatedDuration(false)
      }
      return !prev
    })
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
            <TaskNameContainer onDoubleClick={toggleEditTaskName}>
              {isEditingTaskName ? (
                <CodeMirrorContainer>
                  <MyCodeMirrorComponent
                    initialValue={taskName}
                    handleSave={handleSaveTaskName}
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
                <CircleButton>
                  <ContentWrapper onClick={() => doneToArchive(task.key)}>
                    <Archive size={20} />
                  </ContentWrapper>
                </CircleButton>
              </TaskActions>
              <PairValueContainer onDoubleClick={toggleEditEstimatedDuration}>
                {isEditingEstimatedDuration ? (
                  <CodeMirrorContainer>
                    <MyCodeMirrorComponent initialValue={estimatedDurationHMS} handleSave={handleEstimatedDurationSave} />
                  </CodeMirrorContainer>
                ) : (
                  <Value>{convertMillisecondsToHMS(task.estimatedDuration)}</Value>
                )}
              </PairValueContainer>
              <PairValueContainer onDoubleClick={toggleEditElapsedDuration}>
                {isEditingElapsedDuration ? (
                  <CodeMirrorContainer>
                    <MyCodeMirrorComponent initialValue={elapsedDurationHMS} handleSave={handleElapsedDurationSave} />
                  </CodeMirrorContainer>
                ) : (
                  <Value>{task.timestampSum ? convertMillisecondsToHMS(task.timestampSum) : 'none'}</Value>
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
  justify-content: center;
`


const TaskActions = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    gap: .5em;
  `
