import { Droppable, DroppableProvided } from "react-beautiful-dnd"
import { Done as TypeDone } from "../types"
import Done from "./Done"
import { TaskGroup, TasksHeader } from "./ui"
import { convertMillisecondsToHMS } from "../utils"

interface Props {
  tasks: TypeDone[]
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

  const totalEstimatedDuration = convertMillisecondsToHMS(tasks
    .reduce((acc, task) => {
      return acc + task.estimatedDuration
    }, 0))

  return (
    <>
      <Droppable droppableId="done">
        {(provided: DroppableProvided) => (
          <TaskGroup
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <TasksHeader>
              <h2>Done{tasks?.length !== 0 && ` : ${totalEstimatedDuration}`}</h2>
            </TasksHeader>
            {tasks.map((task: TypeDone, index: number) => (
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
