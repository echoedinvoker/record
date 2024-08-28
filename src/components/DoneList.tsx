import { Droppable, DroppableProvided } from "react-beautiful-dnd"
import { Done as TypeDone } from "../types"
import { DroppableArea, TaskGroup, TasksHeader } from "./ui"
import { convertMillisecondsToHMS } from "../utils"
import { forwardRef, useContext, useImperativeHandle, useRef } from "react"
import { TasksContext } from "../context/tasksContext"
import Done from "./Done"


interface Props { }

export interface DoneListRef {
  scrollToBottom: () => void;
  scrollToTop: () => void;
}

const DoneList = forwardRef<DoneListRef, Props>(({ }, ref) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(ref, () => ({
    scrollToBottom: () => {
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

  const { getTasksByColumnKey, getTotalEstimatedDurationOfOneDay, getTotalElapsedDurationOfOneDay } = useContext(TasksContext)
  const totalEstimatedDuration = getTotalEstimatedDurationOfOneDay("done")
  const totalElapsedDuration = getTotalElapsedDurationOfOneDay("done")
  const totalEfficiency = totalEstimatedDuration / totalElapsedDuration * 100
  const tasks = getTasksByColumnKey("done") as TypeDone[]

  return (
    <>
      <TaskGroup >
        <TasksHeader>
          <h2>Done
            {
              tasks?.length !== 0 &&
              ` : ${convertMillisecondsToHMS(totalEstimatedDuration)}`}
            {
              totalElapsedDuration !== 0 &&
              ` | ${convertMillisecondsToHMS(totalElapsedDuration)} | ${totalEfficiency.toFixed(2)}%`}</h2>
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
                  key={task.key}
                  task={task}
                />
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
