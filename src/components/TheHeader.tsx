import styled from "styled-components"
import { CircleButton, ContentWrapper } from "./ui"
import { useContext } from "react"
import { DayContext } from "../context/dayContext"
import HeaderChart from "./HeaderChart"
import HeaderText from "./HeaderText"

export default function TheHeader() {
  const { day, hasPrevDay, hasNextDay, toPrevDay, toNextDay } = useContext(DayContext)

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
      <HeaderText />
      {day === "0" && <HeaderChart />}
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
  align-items: center;
  gap: 1em;
  margin-bottom: 2.5em;
`

