import styled from "styled-components"
import { CircleButton, ContentWrapper } from "./ui"
import { useContext, useEffect, useState, lazy, Suspense } from "react"
import { DayContext } from "../context/dayContext"
import { TasksContext } from "../context/tasksContext"

const Plot = lazy(() => import('react-plotly.js'))

interface Props { }

export default function TheHeader({ }: Props) {
  const { day, hasPrevDay, hasNextDay, toPrevDay, toNextDay } = useContext(DayContext)
  const { getTotalEstimatedDurationOfOneDay } = useContext(TasksContext)
  const [data, setData] = useState<{ x: number[], y1: number[], y2: number[] }>({ x: [], y1: [], y2: [] })

  useEffect(() => {
    const updateData = () => {
      const now = Date.now()
      const totalDayDurationTS = getTotalEstimatedDurationOfOneDay(day)
      const totalDoneDurationTS = getTotalEstimatedDurationOfOneDay("done")

      setData(prevData => ({
        x: [...prevData.x, now],
        y1: [...prevData.y1, totalDayDurationTS],
        y2: [...prevData.y2, totalDoneDurationTS]
      }))
    }

    updateData()
    const intervalId = setInterval(updateData, 1000)

    return () => clearInterval(intervalId)
  }, [day, getTotalEstimatedDurationOfOneDay])

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
      <PlotContainer>
        <Suspense fallback={<div>Loading chart...</div>}>
          <Plot
            data={[
              {
                x: data.x,
                y: data.y1,
                type: 'scatter',
                mode: 'lines',
                name: 'Estimated Duration'
              },
              {
                x: data.x,
                y: data.y2,
                type: 'scatter',
                mode: 'lines',
                name: 'Done Duration'
              }
            ]}
            layout={{
              title: 'Task Duration Over Time',
              xaxis: { title: 'Time' },
              yaxis: { title: 'Duration (ms)' },
              autosize: true,
              height: 300,
              margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 }
            }}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
          />
        </Suspense>
      </PlotContainer>
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
  flex-direction: column;
  align-items: center;
  gap: 1em;
  margin-bottom: 2.5em;
`

const PlotContainer = styled.div`
  width: 100%;
  height: 300px;
`
