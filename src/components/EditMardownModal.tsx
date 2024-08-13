import { useState } from "react"
import { CircleButton, ContentWrapper, ModalCloseCorner, ModalContainer, ModalOverlay, TextButton } from "./ui"
import { Task } from "../types"
import ReactMarkdown from 'react-markdown';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { vim } from '@replit/codemirror-vim';
import styled from "styled-components";

interface Props {
  task: Task
  changeMarkdown: (id: number, markdownContent: string) => void
  setShowModal: (show: boolean) => void
}

export default function EditMarkdownModal({ task, changeMarkdown, setShowModal }: Props) {
  const [markdownText, setMarkdownText] = useState(task.markdownContent)
  const [isEditing, setIsEditing] = useState(task.markdownContent ? false : true)
  const handleMarkdownSubmit = () => {
    changeMarkdown(task.id, markdownText)
    setShowModal(false)
  }
  const handleChange = (value: string) => {
    setMarkdownText(value)
  }
  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalSwitchCorner>
          <Buttons $size=".3em">
            <TextButton type='button' $counter={isEditing} $counterSecondary={!isEditing} disabled={isEditing} onClick={() => setIsEditing(prev => !prev)}>
              <ContentWrapper $weight='semibold' $size=".8em">edit</ContentWrapper>
            </TextButton>
            <TextButton type='button' $counter={!isEditing} $counterSecondary={isEditing} disabled={!isEditing} onClick={() => setIsEditing(prev => !prev)}>
              <ContentWrapper $weight='semibold' $size=".8em">View</ContentWrapper>
            </TextButton>
          </Buttons>
        </ModalSwitchCorner>
        <ModalCloseCorner>
          <CircleButton $ghost onClick={() => setShowModal(false)}>
            <ContentWrapper $size="1.5em">
              &#10006;
            </ContentWrapper>
          </CircleButton>
        </ModalCloseCorner>
        {isEditing ? (
          <MainContainer>
            <CodeMirror
              value={markdownText}
              extensions={[markdown(), vim()]}
              onChange={handleChange}
            ></CodeMirror>
            <Footer>
              <Buttons>
                <TextButton
                  $counterSecondary
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  <ContentWrapper $weight="bold">
                    Cancel
                  </ContentWrapper>
                </TextButton>
                <TextButton
                  $counter
                  type="button"
                  onClick={handleMarkdownSubmit}
                >
                  <ContentWrapper $weight="bold">
                    Save
                  </ContentWrapper>
                </TextButton>
              </Buttons>
            </Footer>
          </MainContainer>
        ) : (
          <MainContainer>
            <ReactMarkdown>{markdownText}</ReactMarkdown>
          </MainContainer>
        )
        }
      </ModalContainer>
    </ModalOverlay>
  )
}

const MainContainer = styled.div`
  padding: 2em 0 0 0;
  `

const ModalSwitchCorner = styled.div`
  position: absolute;
  top: .5em;
  left: .5em;
`

const Footer = styled.div`
display: flex;
justify-content: flex-end;
gap: .5em;
margin-top: 3.5em;
`

const Buttons = styled.div<{ $size?: string }>`
display: flex;
gap: ${(props) => props.$size || '.5em' };
  `
