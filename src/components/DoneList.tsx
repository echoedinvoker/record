import { Droppable, DroppableProvided } from "react-beautiful-dnd"
import { Done as TypeDone } from "../types"
import Done from "./Done"
import { DroppableArea, TaskGroup, TasksHeader } from "./ui"
import { convertMillisecondsToHMS } from "../utils"
import { forwardRef, useImperativeHandle, useRef } from "react"

interface Props {
  tasks: TypeDone[]
  deleteTask: (taskId: string, columnId: string) => void
  changeTaskName: (taskId: string, name: string) => void
  updateTaskMardownContent: (taskId: string, content: string) => void
  changeTaskEstimatedDuration: (taskId: string, estimatedDurationHMS: string) => void
  changeTaskElapsedDuration: (taskId: string, elapsedDurationHMS: string) => void
}

export interface DoneListRef {
  scrollToBottom: () => void;
  scrollToTop: () => void;
}

const DoneList = forwardRef<DoneListRef, Props>(({
  tasks,
  deleteTask,
  changeTaskName,
  updateTaskMardownContent,
  changeTaskEstimatedDuration,
  changeTaskElapsedDuration
}, ref) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    scrollToBottom: () => {
      console.log('scrollToBottom() called!'); // 'scroll
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    },
    scrollToTop: () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    }
  }));

  const totalEstimatedDuration = convertMillisecondsToHMS(tasks
    .reduce((acc, task) => {
      return acc + task.estimatedDuration
    }, 0))



  return (
    <>
      <TaskGroup >
        <TasksHeader>
          <h2>Done{tasks?.length !== 0 && ` : ${totalEstimatedDuration}`}</h2>
        </TasksHeader>
        <Droppable droppableId="done">
          {(provided: DroppableProvided) => (
            <DroppableArea
              ref={(element) => {
                scrollRef.current = element;
                provided.innerRef(element);
              }}
              {...provided.droppableProps}
            >
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
            </DroppableArea>
          )}
        </Droppable >
      </TaskGroup>
    </>
  )
})

export default DoneList
