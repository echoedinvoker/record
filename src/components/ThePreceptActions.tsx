import { convertMillisecondsToHMS } from "../utils";
import { FileText, Pause, Play, X } from "lucide-react";
import { TopRightCorner } from "./ui";
import { PreceptsContext } from "../context/preceptsContext";
import { useContext } from "react";
import styled from "styled-components";
import { Precept } from "../services/precepts";

interface ThePreceptActionsProps {
  precept: Precept;
  isActived: boolean;
  accumulatedTimestamp: number;
}

export default function ThePreceptActions({ precept, isActived, accumulatedTimestamp }: ThePreceptActionsProps) {
  const { changePreceptStatus, removePrecept, showModal } = useContext(PreceptsContext)

  return (
    <TopRightCorner>
      <ActionButton onClick={() => showModal(precept)}>
        <FileText size={16} />
      </ActionButton>
      <ActionButton onClick={() => changePreceptStatus(precept.key)}>
        {isActived ? <Pause size={16} /> : <Play size={16} />}
        <TimerDisplay>
          {accumulatedTimestamp ? convertMillisecondsToHMS(accumulatedTimestamp) : 'Start'}
        </TimerDisplay>
      </ActionButton>
      <ActionButton onClick={() => removePrecept(precept.key)}>
        <X size={16} />
      </ActionButton>
    </TopRightCorner>
  )
}

const TimerDisplay = styled.span`
  margin-left: 4px;
  font-size: 0.8em;
`

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
  color: inherit;
  &:hover {
    opacity: 0.7;
  }
`
