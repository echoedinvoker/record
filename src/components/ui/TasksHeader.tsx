import styled from "styled-components"
import { Task } from "../../types"

const TasksHeader = styled.div<{ tasks?: Task[] }>`
  display: flex;
  justify-content: ${props => props.tasks?.length !== 0 ? 'flex-start' : 'center'};
  align-items: center;
  margin: 0 1em;
  gap: 1.5em;
  `
export default TasksHeader
