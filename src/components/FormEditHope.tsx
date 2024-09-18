import styled from "styled-components";
import { CircleButton, ContentWrapper, FormField, FormFields, Input, InputWrapper, Label, ModalCloseCorner, ModalContainer, ModalOverlay, TextButton } from "./ui";
import { useContext } from "react";
import { EditorHopeContext } from "../context/editorHopeContext";

interface Props { }

export default function FormEditHope({ }: Props) {
  const {
    updateHope,
    isValid,
    inputName,
    setInputName,
    initModal,
    otherHopes,
    selectedKey,
    setSelectedKey,
    setShowEditorHope } = useContext(EditorHopeContext)

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalCloseCorner>
          <CircleButton $ghost onClick={() => setShowEditorHope(false)}>
            <ContentWrapper $size="1.5em">
              &#10006;
            </ContentWrapper>
          </CircleButton>
        </ModalCloseCorner>
        <form onSubmit={updateHope}>
          <h2>Edit Hope</h2>
          <FormFields style={{ margin: '3em 0 2em 0' }}>
            <FormField>
              <Label htmlFor="task">Hope</Label>
              <InputWrapper>
                <Input type="text" id="hope" name="hope" value={inputName} onChange={(e) => setInputName(e.target.value)} />
              </InputWrapper>
            </FormField>
            <FormField>
              <Label htmlFor="parent">Parent</Label>
              <Select
                id="parent"
                name="parent"
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
              >
                <option value="">No Parent</option>
                {otherHopes.map((hope) => (
                  <option key={hope.key} value={hope.key}>
                    {hope.name}
                  </option>
                ))}
              </Select>
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
            <TextButton $counter disabled={!isValid} type="submit">
              <ContentWrapper $weight="bold">
                Save
              </ContentWrapper>
            </TextButton>
          </FormActions>
        </form>
      </ModalContainer>
    </ModalOverlay>
  )
}

const Select = styled.select`
  width: 100%;
  height: 100%;
  padding: 0.5em;
  border: none;
  background-color: #f1f1f1;
  font-size: 1em;
  color: black;
  border: 1px solid #ccc;
  border-radius: 4px;
  `
const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1em;
  padding-top: 1em;
  `
