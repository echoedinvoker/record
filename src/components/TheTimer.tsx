import { useContext, useEffect, useRef, useState } from "react";
import { Task } from "../types";
import { convertMillisecondsToHMS } from "../utils";
import { CircleButton, ContentWrapper, ModalCloseCorner, ModalContainer, ModalOverlay, TextButton } from "./ui";
import ReactMarkdown from 'react-markdown';
import styled from "styled-components";
import { TasksContext } from "../context/tasksContext";
import MyCodeMirrorComponent from "./MyCodeMirrorComponent";


interface Props {
  task: Task
}

export default function TheTimer({ task }: Props) {
  const interval = useRef<NodeJS.Timeout | null>(null)
  const [time, setTime] = useState(task.timestampSum)
  const [isEditing, setIsEditing] = useState(false);
  const [markdownText, setMarkdownText] = useState(task.markdownContent);
  const [isEditingTaskName, setIsEditingTaskName] = useState(false);
  const [taskName, setTaskName] = useState(task.task);

  const { updateTask, stopTask } = useContext(TasksContext)

  useEffect(() => {
    interval.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1000)
    }, 1000)
    return () => { interval.current && clearInterval(interval.current) }
  }, [])


  const handleSaveTaskName = (value: string) => {
    setTaskName(value)
    setIsEditingTaskName(false)
    const newTask = { ...task, task: value }
    updateTask(newTask)
  }

  const toggleEditTaskName = () => {
    setIsEditingTaskName((prev) => {
      if (!prev) {
        setIsEditing(false)
      }
      return !prev
    })
  }

  const handleSaveMarkdownContent = (value: string) => {
    setMarkdownText(value)
    setIsEditing(false)
    const newTask = { ...task, markdownContent: value }
    updateTask(newTask)
  }

  const toggleEditMarkdownContent = () => {
    setIsEditing((prev) => {
      if (!prev) {
        setIsEditingTaskName(false)
      }
      return !prev
    })
  }

  const handleCancleCounter = () => {
    clearInterval(interval.current!)
    const newTask = {
      ...task,
      timestamp: null,
      timestampSum: Date.now() - task.timestamp! + task.timestampSum
    }
    updateTask(newTask)
  }

  const handleStopTask = () => {
    stopTask(task.key)
  }

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalCloseCorner>
          <CircleButton $ghost onClick={handleCancleCounter}>
            <ContentWrapper $size="1.5em">
              &#10006;
            </ContentWrapper>
          </CircleButton>
        </ModalCloseCorner>
        <Header onClick={toggleEditTaskName}>
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
        </Header>
        <TimerContainer>
          <Timer>{convertMillisecondsToHMS(time)}</Timer>
          <TextButton $counter onClick={handleStopTask}>
            <ContentWrapper $size="1.5em" $weight="bold">Done</ContentWrapper>
          </TextButton>
        </TimerContainer>
        <EditorContainer onClick={toggleEditMarkdownContent}>
          {isEditing ? (
            <CodeMirrorContainer>
              <MyCodeMirrorComponent
                initialValue={markdownText}
                handleSave={handleSaveMarkdownContent}
              />
            </CodeMirrorContainer>
          ) : (
            <ReactMarkdownContainer>
              <ReactMarkdown>{markdownText}</ReactMarkdown>
            </ReactMarkdownContainer>
          )}
        </EditorContainer>
      </ModalContainer>
    </ModalOverlay>
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

const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1em;
  `

const TimerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
`

const Timer = styled.h1`
font-weight: bold;
font-size: 4em;
margin: 0;
`
const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 4em;
  gap: 1em;
`
