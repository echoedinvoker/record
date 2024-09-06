import { useEffect, useState } from "react"
import { fetchHopes } from "../services/tasks"
import { Hope, HopeResponse } from "../types"
import styled from "styled-components"
import FormAddHope from "../components/FormAddHope"

export default function Hopes() {
  const [hopes, setHopes] = useState<Hope[]>([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    getHopes()
  }, [])

  async function getHopes() {
    const data = await fetchHopes()
    const hopes = data.map((hopeResponse: HopeResponse) => {
      const hope: Hope = {
        name: hopeResponse.name,
        markdownContent: hopeResponse.markdown_content,
        parentName: hopeResponse.parent_name,
        taskOrder: JSON.parse(hopeResponse.task_order),
      }
      return hope
    })
    setHopes(hopes)
  }

  if (hopes.length === 0) {
    return <Container>
      <Button onClick={() => setShowModal(true)}>
        Start your first hope
      </Button>
      {showModal && <FormAddHope setShowModal={setShowModal} />}
    </Container>
  }

  return <div>Hopes</div>
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
