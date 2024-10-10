import { lazy, Suspense, useContext, useEffect, useState } from "react"
import { DayContext } from "../context/dayContext"
import { TasksContext } from "../context/tasksContext"
import styled from "styled-components"
import { convertMillisecondsToHMS } from "../utils"

const Plot = lazy(() => import('react-plotly.js'))

function HeaderChart() {
  const { day } = useContext(DayContext)
  const { getTotalEstimatedDurationOfOneDay } = useContext(TasksContext)
  const [data, setData] = useState<{ x: number[], y1: number[], y2: number[] }>({ x: [], y1: [], y2: [] })

  // Update the chart data every second
  useEffect(() => {
    const updateData = () => {
      const now = Date.now()
      const totalDayDurationTS = getTotalEstimatedDurationOfOneDay("0")
      const totalDoneDurationTS = getTotalEstimatedDurationOfOneDay("done")

      setData(prevData => ({
        x: [...prevData.x, now],
        y1: [...prevData.y1, totalDayDurationTS + totalDoneDurationTS],
        y2: [...prevData.y2, totalDoneDurationTS]
      }))
    }

    updateData()
    const intervalId = setInterval(updateData, 1000)

    return () => clearInterval(intervalId)
  }, [day, getTotalEstimatedDurationOfOneDay])
  return (
    <PlotContainer>
      <Suspense fallback={<div>Loading chart...</div>}>
        <Plot
          data={[
            {
              x: data.x,
              y: data.y1,
              type: 'scatter',
              mode: 'lines',
              hovertemplate: '%{text}<extra></extra>',
              text: data.y1.map(y => convertMillisecondsToHMS(y)),
              line: { color: '#1677ff' },
              fill: 'tozeroy',  // 添加这行
              fillcolor: 'rgba(22, 119, 255, 0.1)'  // 添加这行，使用半透明的黑色
            },
            {
              x: data.x,
              y: data.y2,
              type: 'scatter',
              mode: 'lines',
              hovertemplate: '%{text}<extra></extra>',
              text: data.y2.map(y => convertMillisecondsToHMS(y)),
              line: { color: '#e74c3c' },
              fill: 'tozeroy',  // 添加这行
              fillcolor: 'rgba(231, 76, 60, 0.1)'  // 添加这行，使用半透明的黑色
            }
          ]}
          layout={{
            autosize: true,
            width: 200,
            height: 100,
            margin: { l: 0, r: 0, b: 0, t: 0, pad: 4 },
            showlegend: false,
            xaxis: {
              visible: false,
              showgrid: false,
              zeroline: false
            },
            yaxis: {
              visible: false,
              showgrid: false,
              zeroline: false
            },
            paper_bgcolor: 'rgba(0,0,0,0)',  // 设置画布背景为透明
            plot_bgcolor: 'rgba(0,0,0,0)',   // 设置绘图区域背景为透明
            hovermode: 'closest',  // 设置悬停模式为最近点
            hoverlabel: {
              bgcolor: 'rgba(255,255,255,0.7)',  // 设置悬停标签背景色为半透明白色
              font: { color: '#000' }  // 设置悬停标签文字颜色为黑色
            }
          }}
          useResizeHandler={true}
          style={{ width: "100%", height: "100%" }}
          config={{
            displayModeBar: false  // 禁用模式栏（包含各种工具的栏）
          }}
        />
      </Suspense>
    </PlotContainer>
  );
}

const PlotContainer = styled.div`
  flex: 1;
  border: 2px solid #efefef;
  border-radius: 0.5em;
  width: 100%;
`

export default HeaderChart
