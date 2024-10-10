import { useContext } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Precept } from "../services/precepts";
import { PreceptsContext } from "../context/preceptsContext";
import { useAccummulatedTimestamp } from "../hooks/useAccummulatedTimestamp";
import { convertMillisecondsToHMS } from "../utils";
import styled, { css } from "styled-components";
import { FileText, Pause, Play, X } from "lucide-react";
import { TopRightCorner } from "./ui";
import { HopesContext } from "../context/hopesContext";

interface ThePreceptProps {
  precept: Precept;
  index: number;
}

export default function ThePrecept({ index, precept }: ThePreceptProps) {
  const status = precept.startEndTimes.length % 2 === 0 ? 'Stopped' : 'Active';
  const isActived = status === 'Active';
  const accumulatedTimestamp = useAccummulatedTimestamp(precept.key);
  const currentThreshold = getCurrentThreshold(precept, accumulatedTimestamp);
  const { changePreceptStatus } = useContext(PreceptsContext)
  const { hopes } = useContext(HopesContext)
  const connectedHope = hopes.find(hope => hope.key === precept.hopeKey);

  function getCurrentThreshold(precept: Precept, accumulatedTimestamp: number) {
    if (precept.thresholds.length === 0) {
      return {
        thresholdNumber: 'infinity',
        unit: '',
        multiplier: precept.baseMultiplier,
      }
    }
    const thresholdsPlugTimestamp = precept.thresholds.map(threshold => {
      const thresholdTime = threshold.thresholdNumber * (
        threshold.unit === 'minutes' ? 60000 :
          threshold.unit === 'hours' ? 3600000 :
            threshold.unit === 'days' ? 86400000 :
              threshold.unit === 'weeks' ? 604800000 :
                threshold.unit === 'months' ? 2628000000 : 0
      );
      return {
        ...threshold,
        thresholdTime,
      }
    });
    const index = thresholdsPlugTimestamp.findIndex(threshold => accumulatedTimestamp < threshold.thresholdTime);
    if (index === 0) {
      return {
        thresholdNumber: precept.thresholds[0].thresholdNumber,
        unit: precept.thresholds[0].unit,
        multiplier: precept.baseMultiplier,
      }
    }
    if (index === -1) {
      return {
        thresholdNumber: 'infinity',
        unit: '',
        multiplier: precept.thresholds[precept.thresholds.length - 1].multiplier,
      }
    }
    return {
      thresholdNumber: thresholdsPlugTimestamp[index].thresholdNumber,
      unit: thresholdsPlugTimestamp[index].unit,
      multiplier: thresholdsPlugTimestamp[index - 1].multiplier,
    }
  }

  return (
    <Draggable draggableId={precept.key} index={index}>
      {(provided, snapshot) => (
        <DraggablePrecept
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="precept-container"
          $isdragging={snapshot.isDragging}
        >
          <TopRightCorner>
            <ActionButton>
              <FileText size={16} />
            </ActionButton>
            <ActionButton onClick={() => changePreceptStatus(precept.key)}>
              {isActived ? <Pause size={16} /> : <Play size={16} />}
              <TimerDisplay>
                {accumulatedTimestamp ? convertMillisecondsToHMS(accumulatedTimestamp) : 'Start'}
              </TimerDisplay>
            </ActionButton>
            <ActionButton>
              <X size={16} />
            </ActionButton>
          </TopRightCorner>
          <Contents>
            <Title>{precept.name}</Title>
            <Properties>
              <Property>Cur. Threshold: {`${`${currentThreshold.thresholdNumber} ${currentThreshold.unit}`}`}</Property>
              <Property>Cur. Multiplier: {currentThreshold.multiplier}</Property>
            </Properties>
            <Properties>
              <Property>To Hope:</Property>
              <Property>{connectedHope?.name}</Property>
            </Properties>
          </Contents>
        </DraggablePrecept>
      )}
    </Draggable>
  );
}

const Properties = styled.div`
  flex: 2.5;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  `

const PreceptContainer = styled.div`
width: 100%;
display: flex;
flex-direction: column;
position: relative;
align-items: center;
justify-content: space-between;
padding: 1em 1.5em;
border: 2px solid rgba(255, 255, 255, 0.6);
border-radius: 0.5em;
background-color: #242424;
`
const DraggablePrecept = styled(PreceptContainer) <{ $isdragging: boolean; }>`
${({ $isdragging }) =>
    $isdragging &&
    css`
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  `}
position: relative;
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

const Contents = styled.div`
  width: 100%;
  margin-top: 1.2em;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1em;
  `

const TimerDisplay = styled.span`
  margin-left: 4px;
  font-size: 0.8em;
`

const Title = styled.h3`
  flex: 1;
  font-size: 1.5em;
  font-weight: bold;
`

const Property = styled.p`
font - size: 1em;
`


