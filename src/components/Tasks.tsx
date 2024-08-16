import styled from "styled-components"
import { Task } from "../types"
import TheTask from "./TheTask"

interface Props {
  tasks: Task[]
  deleteTask: (taskId: string, columnId: string) => void
  whichDay: number
  startTask: (taskId: string) => void
  changeTaskName: (taskId: string, name: string) => void
  changeTaskElapsedDuration: (taskId: string, elapsedDurationHMS: string) => void
  updateTaskMardownContent: (taskId: string, markdownContent: string) => void
  delayToNextDay: (taskId: string) => void
}

export default function Tasks({ tasks, deleteTask, startTask, changeTaskName, changeTaskElapsedDuration, updateTaskMardownContent, delayToNextDay, whichDay }: Props) {
  return (
    <TaskGroup>
      {Array.from(tasks.values()).map((task: Task) => (
        <TheTask
          key={task.id}
          task={task}
          whichDay={whichDay}
          deleteTask={deleteTask}
          startTask={startTask}
          changeTaskName={changeTaskName}
          changeMarkdown={updateTaskMardownContent}
          delayToNextDay={delayToNextDay}
          changeTaskElapsedDuration={changeTaskElapsedDuration} />
      ))}
    </TaskGroup>
  )
}

const TaskGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1em;
  `
