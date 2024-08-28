import { useContext, useEffect, useRef, useState } from "react";
import { Task } from "../types";
import { convertMillisecondsToHMS } from "../utils";
import { CircleButton, ContentWrapper, Input, InputWrapper, ModalCloseCorner, ModalContainer, ModalOverlay, TextButton } from "./ui";
import ReactMarkdown from 'react-markdown';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { vim } from '@replit/codemirror-vim';
import styled from "styled-components";
import { TasksContext } from "../context/tasksContext";


interface Props {
  task: Task
}

export default function TheTimer({ task }: Props) {
  const isFirstRender = useRef(true)
  const interval = useRef<NodeJS.Timeout | null>(null)
  const [time, setTime] = useState(task.timestampSum)
  const [isEditing, setIsEditing] = useState(false);
  const [markdownText, setMarkdownText] = useState(task.markdownContent);
  const [isMarkdownTextDirty, setIsMarkdownTextDirty] = useState(false)
  const [isEditingTaskName, setIsEditingTaskName] = useState(false);
  const [taskName, setTaskName] = useState(task.task);

  const { updateTask, stopTask } = useContext(TasksContext)

  useEffect(() => {
    interval.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1000)
    }, 1000)
    return () => { interval.current && clearInterval(interval.current) }
  }, [])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    isEditing && setIsMarkdownTextDirty(true)
  }, [markdownText])

  const handleChange = (value: string) => {
    setMarkdownText(value);
  };
  const handleHeaderSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditingTaskName(false);
    const newTask = { ...task, task: taskName }
    updateTask(newTask)

  }
  const handleSaveMarkdown = () => {
    if (isMarkdownTextDirty) {
      const newTask = { ...task, markdownContent: markdownText }
      updateTask(newTask)
      setIsMarkdownTextDirty(false);
    }
  }

  const handleStopTask = () => {
    stopTask(task.key)
  }

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalCloseCorner>
          <CircleButton $ghost onClick={handleStopTask}>
            <ContentWrapper $size="1.5em">
              &#10006;
            </ContentWrapper>
          </CircleButton>
        </ModalCloseCorner>
        <Header>
          <CircleButton $ghost onClick={() => setIsEditingTaskName((prev) => !prev)}>
            <ContentWrapper $offsetY="-3px" $size="1.5em">
              &#9998;
            </ContentWrapper>
          </CircleButton>
          {isEditingTaskName ? (
            <form onSubmit={handleHeaderSubmit}>
              <InputWrapper>
                <Input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
              </InputWrapper>
            </form>
          ) : (
            <Title>{task.task}</Title>
          )}
        </Header>
        <TimerContainer>
          <Timer>{convertMillisecondsToHMS(time)}</Timer>
          <TextButton $counter onClick={handleStopTask}>
            <ContentWrapper $size="1.5em" $weight="bold">Done</ContentWrapper>
          </TextButton>
        </TimerContainer>
        <EditorContainer>
          {isEditing ? (
            <CodeMirror
              value={markdownText}
              extensions={[markdown(), vim()]}
              onChange={handleChange}
            />) : (
            <ReactMarkdown>{markdownText}</ReactMarkdown>
          )}
          <EditorTimerFooter>
            <DescButtons>
              {(isMarkdownTextDirty && isEditing) ? (
                <TextButton type='button' $counter onClick={handleSaveMarkdown}>
                  <ContentWrapper $weight='semibold' $size=".8em">Save</ContentWrapper>
                </TextButton>
              ) : (
                <TextButton type='button' $counter={isEditing} $counterSecondary={!isEditing} disabled={isEditing} onClick={() => setIsEditing(prev => !prev)}>
                  <ContentWrapper $weight='semibold' $size=".8em">edit</ContentWrapper>
                </TextButton>
              )}
              <TextButton type='button' $counter={!isEditing} $counterSecondary={isEditing} disabled={!isEditing} onClick={() => setIsEditing(prev => !prev)}>
                <ContentWrapper $weight='semibold' $size=".8em">View</ContentWrapper>
              </TextButton>
            </DescButtons>
          </EditorTimerFooter>
        </EditorContainer>
      </ModalContainer>
    </ModalOverlay>
  )
}

const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1em;
  `

const Title = styled.h2``

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
const EditorTimerFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`
const DescButtons = styled.div`
  display: flex;
  gap: .5em;
  `

