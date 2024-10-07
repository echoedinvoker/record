import styled, { css } from "styled-components"
import { Hope, Done as TypeDone } from "../types"
import { ModalContainer, ModalOverlay, TaskNameContainer, TextButton, TopRightCorner } from "./ui"
import Task from "./ui/Task"
import { useContext, useState } from "react"
import { convertHMStoMilliseconds, convertMillisecondsToHMS } from "../utils"
import EditMarkdownModal from "./EditMardownModal"
import { Draggable, DraggableProvided } from "react-beautiful-dnd"
import { X, FileText, Archive } from 'lucide-react'
import { TasksContext } from "../context/tasksContext"
import MyCodeMirrorComponent from "./MyCodeMirrorComponent"
import ReactMarkdown from 'react-markdown';
import { HopesContext } from "../context/hopesContext"
import { useHopes } from "../hooks/hopes/useHopes"

interface Props {
  index: number;
  task: TypeDone;
}

export default function Done({ index, task }: Props) {

  const { updateTask, deleteTask, doneToArchive } = useContext(TasksContext)
  useHopes()

  const [isEditingTaskName, setIsEditingTaskName] = useState(false);
  const [taskName, setTaskName] = useState(task.task);
  const [showModal, setShowModal] = useState(false);
  const [isEditingEstimatedDuration, setIsEditingEstimatedDuration] = useState(false);
  const [estimatedDurationHMS, setEstimatedDurationHMS] = useState(convertMillisecondsToHMS(task.estimatedDuration));
  const [isEditingElapsedDuration, setIsEditingElapsedDuration] = useState(false);
  const [elapsedDurationHMS, setElapsedDurationHMS] = useState(convertMillisecondsToHMS(task.timestampSum));
  const [showSelectHopeModal, setShowSelectHopeModal] = useState(false);
  const [selectedHopeKey, setSelectedHopeKey] = useState('');
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
      doneToArchive(task.key)
    } else {
      setShowSelectHopeModal(true)
    }
  }

  const appendTaskToHope = (hopeKey: string, taskKey: string) => {
    doneToArchive(taskKey)
    if (hopeKey) {
      appendTask(hopeKey, taskKey)
    }
  }

  const handleCancelSelectHope = () => {
    setShowSelectHopeModal(false)
    setSelectedHopeKey('')
  }

  return (
    <>
      <Draggable draggableId={task.key} index={index}>
        {(provided: DraggableProvided, snapshot) => (
          <DraggableTask
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            $isdragging={snapshot.isDragging}
            $isediting={isEditingTaskName}
          >
            <TaskNameContainer onClick={toggleEditTaskName} style={{ width: '100%' }}>
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
            <TopRightCorner>
              <ActionButton onClick={() => setShowModal(true)}>
                <FileText size={16} />
              </ActionButton>
              <ActionButton onClick={handleClickArhiveBtn}>
                <Archive size={16} />
              </ActionButton>
              <EstimatedDuration onClick={toggleEditEstimatedDuration}>
                {isEditingEstimatedDuration ? (
                  <CodeMirrorContainer>
                    <MyCodeMirrorComponent initialValue={estimatedDurationHMS} handleSave={handleEstimatedDurationSave} />
                  </CodeMirrorContainer>
                ) : (
                  convertMillisecondsToHMS(task.estimatedDuration)
                )}
              </EstimatedDuration>
              <ElapsedDuration onClick={toggleEditElapsedDuration}>
                {isEditingElapsedDuration ? (
                  <CodeMirrorContainer>
                    <MyCodeMirrorComponent initialValue={elapsedDurationHMS} handleSave={handleElapsedDurationSave} />
                  </CodeMirrorContainer>
                ) : (
                  task.timestampSum ? convertMillisecondsToHMS(task.timestampSum) : 'none'
                )}
              </ElapsedDuration>
              <EfficiencyDisplay>
                {Math.floor(task.efficiency * 100)}%
              </EfficiencyDisplay>
              <ActionButton onClick={() => deleteTask(task.key)}>
                <X size={16} />
              </ActionButton>
            </TopRightCorner>
          </DraggableTask>
        )}
      </Draggable>
      {showModal && <EditMarkdownModal task={task} setShowModal={setShowModal} />}
      {showSelectHopeModal && <ModalOverlay onClick={handleCancelSelectHope}>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
          <Form>
            <Select
              name="hope"
              id="hope"
              value={selectedHopeKey}
              onChange={(e) => setSelectedHopeKey(e.target.value)}
            >
              {
                ([
                  {
                    name: 'none',
                    key: '',
                    markdownContent: '',
                    parentName: null,
                    taskOrder: []
                  },
                  ...hopes
                ] as Hope[])
                  .map(hope => <option key={hope.key} value={hope.key}>{hope.name}</option>)}
            </Select>
            <ActionsContainer>
              <TextButton $counterSecondary
                onClick={handleCancelSelectHope}
              >Cancel</TextButton>
              <TextButton $counter
                onClick={() => appendTaskToHope(selectedHopeKey, task.key)}
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

const ReactMarkdownContainer = styled.div`
  margin-left: 1.5em;
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
`

const ElapsedDuration = styled.span`
  margin: 0 8px;
  cursor: pointer;
`

const EfficiencyDisplay = styled.span`
  margin: 0 8px;
`

const DraggableTask = styled(Task) <{ $isdragging: boolean; $isediting: boolean }>`
  ${({ $isdragging }) =>
    $isdragging &&
    css`
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    `}
  position: relative;
  ${({ $isediting }) =>
    $isediting &&
    css`
      & > *:not(${TaskNameContainer}) {
        visibility: hidden;
      }
    `}
`
