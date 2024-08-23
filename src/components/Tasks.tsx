import { forwardRef, useImperativeHandle, useRef } from "react";
import { Task } from "../types";
import TheTask from "./TheTask";
import { CircleButton, ContentWrapper, DroppableArea, TaskGroup, TasksHeader } from "./ui";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import { convertMillisecondsToHMS } from "../utils";

interface Props {
  tasks: Task[];
  deleteTask: (taskId: string, columnId: string) => void;
  whichDay: number;
  startTask: (taskId: string) => void;
  changeTaskName: (taskId: string, name: string) => void;
  changeTaskEstimatedDuration: (taskId: string, estimatedDurationHMS: string) => void;
  updateTaskMardownContent: (taskId: string, markdownContent: string) => void;
  advanceTask: (taskId: string) => void;
  delayToNextDay: (taskId: string) => void;
  setShowModal: (show: boolean) => void;
}

export interface TasksRef {
  scrollToBottom: () => void;
  scrollToTop: () => void;
}

const Tasks = forwardRef<TasksRef, Props>(({
  tasks,
  deleteTask,
  startTask,
  changeTaskName,
  changeTaskEstimatedDuration,
  updateTaskMardownContent,
  advanceTask,
  delayToNextDay,
  whichDay,
  setShowModal
}, ref) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

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
    .reduce((acc, task) => acc + task.estimatedDuration, 0));

  return (
    <>
      <TaskGroup>
        <TasksHeader>
          <h2>To Do{tasks?.length !== 0 && ` : ${totalEstimatedDuration}`}</h2>
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
        <Droppable droppableId={String(whichDay)}>
          {(provided: DroppableProvided) => (
            <DroppableArea
              ref={(element) => {
                scrollRef.current = element;
                provided.innerRef(element);
              }}
              {...provided.droppableProps}
            >
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
                  advanceTask={advanceTask}
                  delayToNextDay={delayToNextDay}
                  changeTaskEstimatedDuration={changeTaskEstimatedDuration}
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
