import { useContext, useState } from "react"
import styled from "styled-components"
import FormAddHope from "../components/FormAddHope"
import { useHopes } from "../hooks/hopes/useHopes"
import { HopesContext } from "../context/hopesContext"
import HopeTree from "../components/HopeTree"
import { ModalHopeContext } from "../context/modalHopeContext"
import MyCodeMirrorComponent from "../components/MyCodeMirrorComponent"
import ReactMarkdown from 'react-markdown';

export default function Hopes() {
  const [isEditing, setIsEditing] = useState(false)
  useHopes()
  const { hopes, setHopes, hopeTree, selectedHope } = useContext(HopesContext)
  const { showModal, setShowModal } = useContext(ModalHopeContext)
  const getSelectedHopeContent = () => {
    if (!selectedHope) return ''
    const hope = hopes.find((hope) => hope.name === selectedHope)
    if (!hope) return ''
    return hope.markdownContent
  }
  const initialValue = getSelectedHopeContent()

  const handleSave = (value: string) => {
    const newHopes = hopes.map((hope) => {
      if (hope.name === selectedHope) {
        return { ...hope, markdownContent: value }
      }
      return hope
    })
    setHopes(newHopes)
    setIsEditing(false)
  }

  const toggleEdit = () => {
    setIsEditing((prev) => !prev)
  }


  if (hopes.length === 0) {
    return <Container>
      <ButtonContainer>
        <Button onClick={() => setShowModal(true)}>
          Start your first hope
        </Button>
      </ButtonContainer>
      {showModal && <FormAddHope setShowModal={setShowModal} />}
    </Container>
  }

  return (
    <>
      <Container>
        <TreeContainer>
          {hopeTree.map((hope) => (
            <HopeTree
              hope={hope} key={hope.name} />
          ))}
        </TreeContainer>
        {selectedHope && <HopeContaniner onClick={toggleEdit}>
          {isEditing ?
            <MyCodeMirrorComponent
              initialValue={initialValue}
              handleSave={handleSave}
            /> : <ReactMarkdown>
              {hopes.find((hope) => hope.name === selectedHope)?.markdownContent}
            </ReactMarkdown>
          }
        </HopeContaniner>}
      </Container>
      {showModal && <FormAddHope setShowModal={setShowModal} />}
    </>
  )
}

const TreeContainer = styled.div`
  flex: 1.2;
`

const HopeContaniner = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1em;
`

const Container = styled.div`
  display: flex;
  margin: 0 auto;
  padding: 1em;
  max-width: 80em;
  gap: 2em;
  `

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2em;
  `

const Button = styled.button`
  padding: 10px 20px;
  background-color: #f1f1f1;
  color: #333;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #e1e1e1;
  }
  &:active {
    background-color: #d1d1d1;
  }
  `
