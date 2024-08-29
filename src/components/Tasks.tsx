import { forwardRef, useContext, useImperativeHandle, useRef } from "react";
import { Task } from "../types";
import TheTask from "./TheTask";
import { CircleButton, ContentWrapper, DroppableArea, TaskGroup, TasksHeader } from "./ui";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import { convertMillisecondsToHMS } from "../utils";
import { DayContext } from "../context/dayContext";
import { TasksContext } from "../context/tasksContext";

interface Props {
  setShowModal: (show: boolean) => void;
}

export interface TasksRef {
  scrollToBottom: () => void;
  scrollToTop: () => void;
}

const Tasks = forwardRef<TasksRef, Props>(({ setShowModal }, ref) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { day } = useContext(DayContext)
  const { getTasksByColumnKey, getTotalEstimatedDurationOfOneDay } = useContext(TasksContext)
  const tasksOfOneDay = getTasksByColumnKey(day) as Task[]
  const totalEstimatedDurationOfOneDay = getTotalEstimatedDurationOfOneDay(day)

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

  return (
    <>
      <TaskGroup>
        <TasksHeader>
          <h2>To Do{tasksOfOneDay.length !== 0 && ` : ${convertMillisecondsToHMS(totalEstimatedDurationOfOneDay)}`}</h2>
          <CircleButton $ghost onClick={() => setShowModal(true)}>
            <ContentWrapper
              $size="2.5em"
              $weight="bold"
              $offsetX=".5em"
              $offsetY="-2px"
              $color="rgba(255, 255, 255, 0.87)"
            >&#43;</ContentWrapper>
          </CircleButton>
        </TasksHeader>
        <Droppable droppableId={day}>
          {(provided: DroppableProvided) => (
            <DroppableArea
              ref={(element) => {
                scrollRef.current = element;
                provided.innerRef(element);
              }}
              {...provided.droppableProps}
            >
              {tasksOfOneDay.map((task: Task, index: number) => (
                <TheTask
                  index={index}
                  key={task.key}
                  task={task}
                />
              ))}
              {provided.placeholder}
            </DroppableArea>
          )}
        </Droppable>
      </TaskGroup>
    </>
  );
});

export default Tasks;
