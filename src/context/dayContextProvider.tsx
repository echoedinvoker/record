import { useContext, useState } from "react"
import { DayContext } from "./dayContext"
import { TasksContext } from "./tasksContext"

interface DayContextProviderProps {
  children: React.ReactNode
}


function getStartTimestampOfDay(day: number) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  now.setDate(now.getDate() + day)
  return now.getTime()
}

export default function DayContextProvider({ children }: DayContextProviderProps) {
  const [day, setDay] = useState("0")
  const ts = getStartTimestampOfDay(parseInt(day))
  const { data } = useContext(TasksContext)
  const dayList = Object.keys(data.columns).filter((columnKey) => ["done", "archived"].includes(columnKey) === false)
  const hasNextDay = checkIfHasNextDay()
  const hasPrevDay = checkIfHasPrevDay()
  function checkIfHasNextDay() {
    for (let i = 0; i < dayList.length; i++) {
      if (dayList[i] > day) return true
    }
    return false
  }
  function checkIfHasPrevDay() {
    for (let i = 0; i < dayList.length; i++) {
      if (dayList[i] < day) return true
    }
    return false
  }
  function toNextDay() {
    setDay(prev => parseInt(prev) + 1 + "")
  }
  function toPrevDay() {
    setDay(prev => {
      const intDay = parseInt(prev) - 1
      if (intDay < 0) return "0"
      return intDay + ""
    })
  }
  const value = {
    day,
    setDay,
    ts,
    hasNextDay,
    hasPrevDay,
    toNextDay,
    toPrevDay
  }

  return <DayContext.Provider value={value}>
    {children}
  </DayContext.Provider>
}
