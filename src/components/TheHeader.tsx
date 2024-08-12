import styled from "styled-components"
import { convertMillisecondsToHMS } from "../utils"
import { CircleButton, ContentWrapper } from "./ui"
import { Task } from "../types"

interface Props {
  tasks: Map<number, Task>
  setShowModal: (showModal: boolean) => void
}

export default function TheHeader({ tasks, setShowModal }: Props) {
  const totalDurationTS = Array.from(tasks.values()).reduce((acc, task) => acc + task.estimatedDuration, 0)
  const totalElapsedTimeTS = Array.from(tasks.values()).reduce((acc, task) => acc + task.timestampSum, 0)

  return (
    <Container>
      <h1>Daily</h1>
      <Stats>
        <Stat>
          <StatName>Total Duration:</StatName>
          <StatValue>{convertMillisecondsToHMS(totalDurationTS)}</StatValue>
        </Stat>
        <Stat>
          <StatName>Total Elapsed Time:</StatName>
          <StatValue>{convertMillisecondsToHMS(totalElapsedTimeTS)}</StatValue>
        </Stat>
      </Stats>
    </Container>

  )
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1em;
  margin-bottom: 2.5em;
`

const Stats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2em;
`

const Stat = styled.div`
  display: flex;
  gap: 1em;
  `

const StatName = styled.div`
  font-weight: bold;
    `

const StatValue = styled.div`
  font-size: 1em;
    `
