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

  const { addHope, hopesKeys } = useContext(HopesContext)
  const { hopeName, parentKey, setParentKey, setHopeName, initModal } = useContext(ModalHopeContext)
  const isValidationDisabled = hopeName.length === 0 || !!parentKey && !hopesKeys.includes(parentKey)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addNewHopeToContext()
    initModal()
  }

  function addNewHopeToContext() {
    const newHope: Hope = {
      name: hopeName,
      key: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      markdownContent: '',
      parentKey: parentKey || null,
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
                  <Input type="text" id="parent" name="parent" value={parentKey} onChange={(e) => setParentKey(e.target.value)} />
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
                Add Hope
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
