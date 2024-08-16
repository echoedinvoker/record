import { Task } from "../types"
import Done from "./Done"
import { TaskGroup } from "./ui"

interface Props {
  tasks: Task[]
  deleteTask: (taskId: string, columnId: string) => void
  changeTaskName: (taskId: string, name: string) => void
  updateTaskMardownContent: (taskId: string, content: string) => void
  changeTaskEstimatedDuration: (taskId: string, estimatedDurationHMS: string) => void
  changeTaskElapsedDuration: (taskId: string, elapsedDurationHMS: string) => void
}
export default function DoneList({
  tasks,
  deleteTask,
  changeTaskName,
  updateTaskMardownContent,
  changeTaskEstimatedDuration,
  changeTaskElapsedDuration }: Props) {
  return (
    <TaskGroup>
      {tasks.map((task: Task) => (
        <Done
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          changeTaskName={changeTaskName}
          updateTaskMardownContent={updateTaskMardownContent}
          changeTaskEstimatedDuration={changeTaskEstimatedDuration}
          changeTaskElapsedDuration={changeTaskElapsedDuration} />
      ))}
    </TaskGroup>
  )
}
