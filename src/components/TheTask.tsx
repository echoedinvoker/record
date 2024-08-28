import styled from "styled-components";
import { Task as TypeTask } from "../types";
import { CircleButton, ContentWrapper, EditPenSpan, Input, InputWrapper, Task, TaskContents, TaskName, TextButton, TopRightCorner } from "./ui";
import { convertHMStoMilliseconds, convertMillisecondsToHMS } from "../utils";
import { useContext, useState } from "react";
import EditMarkdownModal from "./EditMardownModal";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import { ArrowBigLeft, ArrowBigRight, X } from 'lucide-react';
import TaskNameContainer from "./ui/TaskNameContainer";
import { Form, Value } from "./ui/Form";
import { TasksContext } from "../context/tasksContext";
import { DayContext } from "../context/dayContext";

interface Props {
  task: TypeTask,
  index: number
}

export default function TheTask({ index, task }: Props) {
  const [isEditingTaskName, setIsEditingTaskName] = useState(false);
  const [taskName, setTaskName] = useState(task.task);
  const [isEditingEstimatedDuration, setIsEditingEstimatedDuration] = useState(false);
  const [estimatedDurationHMS, setEstimatedDurationHMS] = useState(convertMillisecondsToHMS(task.estimatedDuration));
  const [showModal, setShowModal] = useState(false);

  const { updateTask, moveTaskToOtherColumn, startTask, deleteTask } = useContext(TasksContext)
  const { day } = useContext(DayContext)


  const handleTaskNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditingTaskName(false);
    const newTask = { ...task, task: taskName }
    updateTask(newTask)
  }

  const handleEstimatedDurationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditingEstimatedDuration(false);
    const newTask = { ...task, estimatedDuration: convertHMStoMilliseconds(estimatedDurationHMS) }
    updateTask(newTask)
  }

  const handleAdvance = () => {
    const intPrevDay = parseInt(day) - 1;
    if (intPrevDay < 0) return;
    moveTaskToOtherColumn(task.key, intPrevDay.toString());
  }

  const handleDelay = () => {
    const intNextDay = parseInt(day) + 1;
    moveTaskToOtherColumn(task.key, intNextDay.toString());
  }

  return (
    <>
      <Draggable draggableId={task.key} index={index}>
        {(provided: DraggableProvided) => (
          <Task
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <TaskNameContainer>
              <EditPenSpan
                onClick={() => setIsEditingTaskName((prev) => !prev)}
              >&#9998;</EditPenSpan>
              {isEditingTaskName ? (
                <Form onSubmit={handleTaskNameSubmit}>
                  <InputWrapper $white>
                    <Input $white type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
                  </InputWrapper>
                </Form>
              ) : (
                <TaskName>{task.task}</TaskName>
              )}
            </TaskNameContainer>
            <TaskContents>
              <TaskActions>
                <CircleButton onClick={() => setShowModal(true)}>
                  <ContentWrapper>
                    &#128196;
                  </ContentWrapper>
                </CircleButton>
                {parseInt(day) > 0 &&
                  <CircleButton onClick={handleAdvance}>
                    <ContentWrapper $offsetY="-1px">
                      <ArrowBigLeft size={28} />
                    </ContentWrapper>
                  </CircleButton>}
                <CircleButton onClick={handleDelay}>
                  <ContentWrapper $offsetY="-1px">
                    <ArrowBigRight size={28} />
                  </ContentWrapper>
                </CircleButton>
              </TaskActions>
              <PairValueContainer>
                <CircleButton $ghost onClick={() => setIsEditingEstimatedDuration((prev) => !prev)}>
                  <ContentWrapper $offsetY="-3px" $size="1.5em" style={{ color: 'white' }}>
                    &#9998;
                  </ContentWrapper>
                </CircleButton>
                {isEditingEstimatedDuration ? (
                  <form onSubmit={handleEstimatedDurationSubmit}>
                    <InputWrapper $white>
                      <Input $white type="text" value={estimatedDurationHMS} onChange={(e) => setEstimatedDurationHMS(e.target.value)} />
                    </InputWrapper>
                  </form>
                ) : (
                  <Value>{convertMillisecondsToHMS(task.estimatedDuration)}</Value>
                )}
              </PairValueContainer>
              <TaskTimer>
                <TextButton
                  onClick={() => startTask(task.key)}>
                  <ContentWrapper $size="1.5em" $weight="bold" $offsetY="-2px">
                    {!task.timestampSum ? 'Start' : convertMillisecondsToHMS(task.timestampSum + (task.timestamp ? Date.now() - task.timestamp : 0))}
                  </ContentWrapper>
                </TextButton>
              </TaskTimer>
            </TaskContents>
            <TopRightCorner onClick={() => deleteTask(task.key)}><X /></TopRightCorner>
          </Task >
        )}
      </Draggable>
      {showModal && <EditMarkdownModal task={task} setShowModal={setShowModal} />
      }
    </>
  )
}


const PairValueContainer = styled.div`
  display: flex;
  align-items: center;
`

const TaskActions = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    gap: .5em;
  `

const TaskTimer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`
