import { useContext } from "react"
import styled from "styled-components"
import { DayContext } from "../context/dayContext"
import { TasksContext } from "../context/tasksContext"
import { convertMillisecondsToHMS } from "../utils"

function HeaderText() {
  const { day } = useContext(DayContext)
  const { getTotalEstimatedDurationOfOneDay } = useContext(TasksContext)
  const totalDayDurationTS = getTotalEstimatedDurationOfOneDay("0")
  const totalDoneDurationTS = getTotalEstimatedDurationOfOneDay("done")

  return (
    <HeaderTextContainer>
      <Title>{day === "0" ? 'Today' : day === "1" ? 'Tomorrow' : `In ${day} days`}</Title>
      <Statics>
        <Static>Total: {convertMillisecondsToHMS(totalDayDurationTS + totalDoneDurationTS)}</Static>
        {day === "0" && <Static>Done: {convertMillisecondsToHMS(totalDoneDurationTS)}</Static>}
      </Statics>
    </HeaderTextContainer>
  )
}

export default HeaderText

const HeaderTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 0.5em;
  `

const Title = styled.h1`
  `

const Statics = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 1em;
  `

const Static = styled.div`
  font-size: 1em;
  `
