import { Droppable, DroppableProvided } from "react-beautiful-dnd"
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
    <>
      <Droppable droppableId="done">
        {(provided: DroppableProvided) => (
          <TaskGroup
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <h2>Done</h2>
            {tasks.map((task: Task, index: number) => (
              <Done
                index={index}
                key={task.id}
                task={task}
                deleteTask={deleteTask}
                changeTaskName={changeTaskName}
                updateTaskMardownContent={updateTaskMardownContent}
                changeTaskEstimatedDuration={changeTaskEstimatedDuration}
                changeTaskElapsedDuration={changeTaskElapsedDuration} />
            ))}
            {provided.placeholder}
          </TaskGroup>
        )}
      </Droppable>
    </>
  )
}
