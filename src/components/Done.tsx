import styled from "styled-components"
import { Hope, Done as TypeDone } from "../types"
import { CircleButton, ContentWrapper, ModalContainer, ModalOverlay, Task, TaskContents, TaskNameContainer, TextButton, TopRightCorner } from "./ui"
import { useContext, useState } from "react"
import { convertHMStoMilliseconds, convertMillisecondsToHMS } from "../utils"
import EditMarkdownModal from "./EditMardownModal"
import { Draggable, DraggableProvided } from "react-beautiful-dnd"
import { Value } from "./ui/Form"
import { Archive, X } from "lucide-react"
import { TasksContext } from "../context/tasksContext"
import MyCodeMirrorComponent from "./MyCodeMirrorComponent"
import ReactMarkdown from 'react-markdown';
import { HopesContext } from "../context/hopesContext"

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
  const [showSelectHopeModal, setShowSelectHopeModal] = useState(false);
  const [selectedHopeName, setSelectedHopeName] = useState('none')
  const { hopes, appendTask } = useContext(HopesContext)

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

  const handleClickArhiveBtn = () => {
    if (hopes.length === 0) {
      appendTaskToHope(selectedHopeName, task.key)
    } else {
      setShowSelectHopeModal(true)
    }
  }

  const appendTaskToHope = (hopeName: string, taskKey: string) => {
    doneToArchive(taskKey)
    if (hopeName !== 'none') {
      appendTask(hopeName, taskKey)
    }
  }

  const handleCancelSelectHope = () => {
    setShowSelectHopeModal(false)
    setSelectedHopeName('none')
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
                  <ContentWrapper onClick={handleClickArhiveBtn}>
                    <Archive size={20} />
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
              <PairValueContainer onClick={toggleEditElapsedDuration}>
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
      {showModal && <EditMarkdownModal task={task} setShowModal={setShowModal} />}
      {showSelectHopeModal && <ModalOverlay onClick={handleCancelSelectHope}>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
          <Form>
            <Select
              name="hope"
              id="hope"
              value={selectedHopeName}
              onChange={(e) => setSelectedHopeName(e.target.value)}
            >
              {
                ([
                  {
                    name: 'none',
                    markdownContent: '',
                    parentName: null,
                    taskOrder: []
                  },
                  ...hopes
                ] as Hope[])
                  .map(hope => <option key={hope.name} value={hope.name}>{hope.name}</option>)}
            </Select>
            <ActionsContainer>
              <TextButton $counterSecondary
                onClick={handleCancelSelectHope}
              >Cancel</TextButton>
              <TextButton $counter
                onClick={() => appendTaskToHope(selectedHopeName, task.key)}
              >Archive</TextButton>
            </ActionsContainer>
          </Form>
        </ModalContainer>
      </ModalOverlay>}
    </>
  )
}

const ActionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 1em;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
  `

const Select = styled.select`
  width: 100%;
  height: 100%;
  padding: 1em;
  border: none;
  background-color: #f1f1f1;
  font-size: 1em;
  color: black;
  border-radius: 5px;
  `

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
