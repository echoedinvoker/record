import ReactMarkdown from 'react-markdown';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { vim } from '@replit/codemirror-vim';
import { CircleButton, ContentWrapper, FormField, FormFields, Input, InputWrapper, Label, ModalCloseCorner, ModalContainer, ModalOverlay, TextButton } from "./ui";
import { useState } from 'react';
import styled from 'styled-components';

interface Props {
  setShowModal: (show: boolean) => void
  addTask: (task: string, estimatedDurationHMS: string, markdownText: string) => void
}

export default function FormAddTask({ setShowModal, addTask }: Props) {
  const [taskName, setTaskName] = useState('');
  const [estimatedDurationHMS, setEstimatedDurationHMS] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const [markdownText, setMarkdownText] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTask(taskName, estimatedDurationHMS, markdownText);
    setMarkdownText('');
  }

  const handleChange = (value: string) => {
    setMarkdownText(value);
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalCloseCorner>
          <CircleButton $ghost onClick={() => setShowModal(false)}>
            <ContentWrapper $size="1.5em">
              &#10006;
            </ContentWrapper>
          </CircleButton>
        </ModalCloseCorner>
        <form onSubmit={handleSubmit}>
          <h1>Add Task</h1>
          <FormFields style={{ margin: '3em 0 2em 0' }}>
            <FormField>
              <Label htmlFor="task">Task</Label>
              <InputWrapper>
                <Input type="text" id="task" name="task" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
              </InputWrapper>
            </FormField>
            <FormField>
              <Label htmlFor="estimatedDuration">Estimated Duration</Label>
              <InputWrapper>
                <Input type="text" id="estimatedDuration" name="estimatedDuration" value={estimatedDurationHMS} onChange={(e) => setEstimatedDurationHMS(e.target.value)} />
              </InputWrapper>
            </FormField>
            <FormFieldColumn>
              <Header>
                <Label htmlFor="markdownContent">Markdown Content</Label>
                <Buttons $row>
                  <TextButton type='button' $counter={isEditing} $counterSecondary={!isEditing} disabled={isEditing} onClick={() => setIsEditing(prev => !prev)}>
                    <ContentWrapper $weight='semibold' $size=".8em">edit</ContentWrapper>
                  </TextButton>
                  <TextButton type='button' $counter={!isEditing} $counterSecondary={isEditing} disabled={!isEditing} onClick={() => setIsEditing(prev => !prev)}>
                    <ContentWrapper $weight='semibold' $size=".8em">View</ContentWrapper>
                  </TextButton>
                </Buttons>
              </Header>
              {isEditing ? (
                <CodeMirror
                  value={markdownText}
                  extensions={[markdown(), vim()]}
                  onChange={handleChange}
                ></CodeMirror>
              ) : (
                <ReactMarkdown>{markdownText}</ReactMarkdown>
              )
              }
            </FormFieldColumn>
          </FormFields>
          <FormActions>
            <TextButton
              $counterSecondary
              type="button"
              onClick={() => setShowModal(false)}
            >
              <ContentWrapper $weight="bold">
                Cancel
              </ContentWrapper>
            </TextButton>
            <TextButton $counter>
              <ContentWrapper $weight="bold">
                Add Task
              </ContentWrapper>
            </TextButton>
          </FormActions>
        </form>
      </ModalContainer>
    </ModalOverlay >
  )
}

const FormFieldColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: .5em;
  `

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1em;
  padding-top: 1em;
  `

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2em;
`

const Buttons = styled.div<{ $row?: boolean }>`
  display: flex;
  flex-direction: ${(props) => props.$row ? 'row' : 'column'};
  gap: .2em;
`
