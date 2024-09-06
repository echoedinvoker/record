import ReactMarkdown from 'react-markdown';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { vim } from '@replit/codemirror-vim';
import { CircleButton, ContentWrapper, FormField, FormFields, Input, InputWrapper, Label, ModalCloseCorner, ModalContainer, ModalOverlay, TextButton } from "./ui";
import { useContext, useState } from 'react';
import styled from 'styled-components';
import { TasksContext } from '../context/tasksContext';
import { DayContext } from '../context/dayContext';

interface Props {
  setShowModal: (show: boolean) => void
}

export default function FormAddHope({ setShowModal }: Props) {
  const [hopeName, setHopeName] = useState('');
  const [parentName, setParentName] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // addHope(hopeName, parentName)
    setHopeName('');
    setParentName('');
    setShowModal(false)
  }

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
          <h1>Add Hope</h1>
          <FormFields style={{ margin: '3em 0 2em 0' }}>
            <FormField>
              <Label htmlFor="task">Hope</Label>
              <InputWrapper>
                <Input type="text" id="hope" name="hope" value={hopeName} onChange={(e) => setHopeName(e.target.value)} />
              </InputWrapper>
            </FormField>
            <FormField>
              <FormField>
                <Label htmlFor="parent">Parent</Label>
                <InputWrapper>
                  <Input type="text" id="parent" name="parent" value={parentName} onChange={(e) => setParentName(e.target.value)} />
                </InputWrapper>
              </FormField>
            </FormField>
          </FormFields>
        </form>
      </ModalContainer>
    </ModalOverlay>
  )
}
