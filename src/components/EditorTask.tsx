import React from "react";
import { CircleButton, ContentWrapper, FormField, FormFields, Input, InputWrapper, Label, ModalCloseCorner, ModalContainer, ModalOverlay, TextButton } from "./ui";
import styled from 'styled-components';
import { useContext, useState } from 'react';
import { EditorContext, Mode } from '../context/editorContext';
import MyCodeMirrorComponent from './MyCodeMirrorComponent';
import ReactMarkdown from 'react-markdown';

interface FieldData {
  label: string
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
}

function CloseModelX({ onClick }: { onClick: () => void }) {
  return (
    <ModalCloseCorner>
      <CircleButton $ghost onClick={onClick}>
        <ContentWrapper $size="1.5em">
          &#10006;
        </ContentWrapper>
      </CircleButton>
    </ModalCloseCorner>
  )
}

function EditorContent({ title, fieldsData }: { title: string, fieldsData: (FieldData<string> | FieldData<number>)[] }) {
  return (
    <EditorContentContainer>
      <EditorContentHeader>
        <EditorTitle>{title}</EditorTitle>
      </EditorContentHeader>
      <EditorFields fieldsData={fieldsData} />
    </EditorContentContainer>
  )
}

const EditorTitle = styled.h2`
  font-size: 1.5em;
  font-weight: bold;
  text-transform: uppercase;
  margin: 0;
  `

const EditorContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`

const EditorContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`


function EditorFields({ fieldsData }: { fieldsData: FieldData[] }) {
  return (
    <EditorFieldsContainer>
      {fieldsData.map((fieldData) => <EditorField key={fieldData.label} fieldData={fieldData} />)}
    </EditorFieldsContainer>
  )
}

function EditorField({ fieldData }: { fieldData: FieldData }) {
  const { label, value, setValue } = fieldData
  const [isEditing, setIsEditing] = useState(false)

  function toggleEditing() {
    setIsEditing(prev => !prev)
  }

  const handleSave = (newValue: string) => {
    setValue(newValue)
    setIsEditing(false)
  }


  return (
    <FieldContainer onDoubleClick={toggleEditing}>
      <Label>{label}</Label>
      {isEditing ? (
        <MyCodeMirrorComponentContainer>
          <MyCodeMirrorComponent initialValue={String(value)} handleSave={handleSave} />
        </MyCodeMirrorComponentContainer>
      ) : (
        <ReactMarkdownContainer>
          <ReactMarkdown>{value}</ReactMarkdown>
        </ReactMarkdownContainer>
      )}
    </FieldContainer>
  )
}

const ReactMarkdownContainer = styled.div`
  margin: 0 1em 0;
  `

const MyCodeMirrorComponentContainer = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  `

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const EditorFieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export default function EditorTask() {
  const { isEditing, setIsEditing, closeEditor, addTaskEditor, mode, taskName, setTaskName, estimatedDurationHMS, setEstimatedDurationHMS, markdownText, setMarkdownText } = useContext(EditorContext)
  const title = mode === Mode.Update ? 'Edit Task' : 'Add Task'
  const fieldsData = [
    { label: 'Task Name', value: taskName, setValue: setTaskName },
    { label: 'Estimated Duration', value: estimatedDurationHMS, setValue: setEstimatedDurationHMS },
    { label: 'Description', value: markdownText, setValue: setMarkdownText }
  ]

  if (!isEditing) return null


  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseModelX onClick={closeEditor} />
        <EditorContent title={title} fieldsData={fieldsData} />
        <ActionsContainer>
          <TextButton
            $counterSecondary
            onClick={() => setIsEditing(false)}>Cancel</TextButton>
          <TextButton
            $counter
            onClick={addTaskEditor}>Add Task</TextButton>
        </ActionsContainer>
      </ModalContainer>
    </ModalOverlay >
  )
}

const ActionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 1em;
`

