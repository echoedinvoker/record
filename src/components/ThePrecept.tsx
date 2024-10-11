import { Draggable } from "react-beautiful-dnd";
import { Precept } from "../services/precepts";
import { useAccummulatedTimestamp } from "../hooks/useAccummulatedTimestamp";
import styled, { css } from "styled-components";
import ThePreceptActions from "./ThePreceptActions";
import ThePreceptContents from "./ThePreceptContents";

interface ThePreceptProps {
  precept: Precept;
  index: number;
}

export default function ThePrecept({ index, precept }: ThePreceptProps) {
  const status = precept.startEndTimes.length % 2 === 0 ? 'Stopped' : 'Active';
  const isActived = status === 'Active';
  const accumulatedTimestamp = useAccummulatedTimestamp(precept.key);
  const currentThreshold = getCurrentThreshold(precept, accumulatedTimestamp);

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
          <ThePreceptActions precept={precept} isActived={isActived} accumulatedTimestamp={accumulatedTimestamp} />
          <ThePreceptContents precept={precept} currentThreshold={currentThreshold} />
        </DraggablePrecept>
      )}
    </Draggable>
  );
}


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



