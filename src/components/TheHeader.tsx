import styled from "styled-components"
import { convertMillisecondsToHMS } from "../utils"
import { CircleButton, ContentWrapper } from "./ui"
import { useContext } from "react"
import { DayContext } from "../context/dayContext"
import { TasksContext } from "../context/tasksContext"

interface Props { }

export default function TheHeader({ }: Props) {
  const { day, hasPrevDay, hasNextDay, toPrevDay, toNextDay } = useContext(DayContext)
  const { getTotalEstimatedDurationOfOneDay } = useContext(TasksContext)
  const totalDayDurationTS = getTotalEstimatedDurationOfOneDay(day)
  const totalDoneDurationTS = getTotalEstimatedDurationOfOneDay("done")
  const totalDurationTS = totalDayDurationTS + totalDoneDurationTS

  return (
    <Container>
      {hasPrevDay && (
        <CircleButton $counter onClick={toPrevDay}>
          <ContentWrapper
            $size="2em"
            $offsetY="-4px"
          >&laquo;</ContentWrapper>
        </CircleButton>
      )}
      <h1>{day === "0" ? 'Today' : day === "1" ? 'Tomorrow' : `In ${day} days`}</h1>
      <Stats>
        <Stat>
          <StatName>Total Duration:</StatName>
          <StatValue>{convertMillisecondsToHMS(totalDurationTS)}</StatValue>
        </Stat>
        <Stat>
          <StatName>Completeness:</StatName>
          <StatValue>{totalDoneDurationTS > 0 ? `${(totalDoneDurationTS / totalDurationTS * 100).toFixed()}%` : ''}</StatValue>
        </Stat>
      </Stats>
      {hasNextDay && (
        <CircleButton $counter onClick={toNextDay}>
          <ContentWrapper
            $size="2em"
            $offsetY="-4px"
          >&raquo;</ContentWrapper>
        </CircleButton>
      )}
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
