import styled from "styled-components";
import { HopesContext } from "../context/hopesContext";
import { Hope } from "../types";
import { CircleButton, ContentWrapper, FormField, FormFields, Input, InputWrapper, Label, ModalCloseCorner, ModalContainer, ModalOverlay, TextButton } from "./ui";
import { useContext } from 'react';
import { ModalHopeContext } from "../context/modalHopeContext";

interface Props {
  setShowModal: (show: boolean) => void
}

export default function FormAddHope({ setShowModal }: Props) {

  const { addHope, hopesNames } = useContext(HopesContext)
  const { hopeName, parentName, setHopeName, setParentName, initModal } = useContext(ModalHopeContext)
  const isValidationDisabled = hopeName.length === 0 || !!parentName && !hopesNames.includes(parentName)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addNewHopeToContext()
    initModal()
  }

  function addNewHopeToContext() {
    const newHope: Hope = {
      name: hopeName,
      markdownContent: '',
      parentName: parentName || null,
      taskOrder: []
    }
    addHope(newHope)
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
          <FormActions>
            <TextButton
              $counterSecondary
              type="button"
              onClick={() => initModal(false)}
            >
              <ContentWrapper $weight="bold">
                Cancel
              </ContentWrapper>
            </TextButton>
            <TextButton $counter disabled={isValidationDisabled} type="submit">
              <ContentWrapper $weight="bold">
                Add Task
              </ContentWrapper>
            </TextButton>
          </FormActions>
        </form>
      </ModalContainer>
    </ModalOverlay>
  )
}

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1em;
  padding-top: 1em;
  `
