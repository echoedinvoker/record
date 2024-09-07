import { useContext, useState } from "react"
import styled from "styled-components"
import FormAddHope from "../components/FormAddHope"
import { useHopes } from "../hooks/hopes/useHopes"
import { HopesContext } from "../context/hopesContext"

export default function Hopes() {
  useHopes()
  const [showModal, setShowModal] = useState(false)
  const { hopes, hopeTree } = useContext(HopesContext)

  if (hopes.length === 0) {
    return <Container>
      <Button onClick={() => setShowModal(true)}>
        Start your first hope
      </Button>
      {showModal && <FormAddHope setShowModal={setShowModal} />}
    </Container>
  }

  return (
    <>
      <div>Hopes</div>
      <button onClick={() => console.log(hopeTree)}>show tree</button>
    </>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10em;
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
