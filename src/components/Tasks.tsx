import { Task } from "../types"
import TheTask from "./TheTask"
import { TaskGroup } from "./ui"
import { Droppable, DroppableProvided } from "react-beautiful-dnd"

interface Props {
  tasks: Task[]
  deleteTask: (taskId: string, columnId: string) => void
  whichDay: number
  startTask: (taskId: string) => void
  changeTaskName: (taskId: string, name: string) => void
  changeTaskEstimatedDuration: (taskId: string, estimatedDurationHMS: string) => void
  updateTaskMardownContent: (taskId: string, markdownContent: string) => void
  delayToNextDay: (taskId: string) => void
}

export default function Tasks({ tasks, deleteTask, startTask, changeTaskName, changeTaskEstimatedDuration, updateTaskMardownContent, delayToNextDay, whichDay }: Props) {
  return (
    <>
      <Droppable droppableId={String(whichDay)}>
        {(provided: DroppableProvided) => (
          <TaskGroup
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <h2>To Do</h2>
            {tasks.map((task: Task, index: number) => (
              <TheTask
                index={index}
                key={task.id}
                task={task}
                whichDay={whichDay}
                deleteTask={deleteTask}
                startTask={startTask}
                changeTaskName={changeTaskName}
                changeMarkdown={updateTaskMardownContent}
                delayToNextDay={delayToNextDay}
                changeTaskEstimatedDuration={changeTaskEstimatedDuration}
              />
            ))}
            {provided.placeholder}
          </TaskGroup>
        )}
      </Droppable>
    </>
  )
}
