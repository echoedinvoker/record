import { useContext } from "react";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import { Precept } from "../services/precepts";
import { PreceptsContext } from "../context/preceptsContext";
import { useAccummulatedTimestamp } from "../hooks/useAccummulatedTimestamp";
import { convertMillisecondsToHMS } from "../utils";

interface ThePreceptProps {
  precept: Precept;
  index: number;
}

export default function ThePrecept({ index, precept }: ThePreceptProps) {
  const status = precept.startEndTimes.length % 2 === 0 ? 'Stopped' : 'Active';
  const accumulatedTimestamp = useAccummulatedTimestamp(precept.key);
  const currentThreshold = getCurrentThreshold(precept, accumulatedTimestamp);
  const { changePreceptStatus } = useContext(PreceptsContext)

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
      {(provided: DraggableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="precept-container"
        >
          <h3>{precept.name}</h3>
          <p>狀態: {status}</p>
          <p>累積時間: {convertMillisecondsToHMS(accumulatedTimestamp)}</p>
          <p>當前門檻: {`${`${currentThreshold.thresholdNumber} ${currentThreshold.unit}`}`}</p>
          <p>當前倍率: {currentThreshold.multiplier}</p>
          <button onClick={() => changePreceptStatus(precept.key)}>Change Status</button>
        </div>
      )}
    </Draggable>
  );
}
