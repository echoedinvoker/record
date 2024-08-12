import styled from "styled-components"
import { Task } from "../types"
import TheTask from "./TheTask"

interface Props {
  tasks: Task[]
  deleteTask: (id: number) => void
  startTask: (id: number) => void
  changeTaskName: (id: number, name: string) => void
  changeTaskElapsedDuration: (id: number, elapsedDurationHMS: string) => void
}

export default function Tasks({ tasks, deleteTask, startTask, changeTaskName, changeTaskElapsedDuration }: Props) {
  return (
    <TaskGroup>
      {Array.from(tasks.values()).map((task: Task) => (
        <TheTask key={task.id} task={task} deleteTask={deleteTask} startTask={startTask} changeTaskName={changeTaskName} changeTaskElapsedDuration={changeTaskElapsedDuration} />
      ))}
    </TaskGroup>
  )
}

const TaskGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1em;
  `
