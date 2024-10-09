import { useContext, useEffect, useState } from "react";
import { PreceptsContext } from "../context/preceptsContext";

export function useAccummulatedTimestamp(preceptKey: string) {
  const [accumulatedTimestamp, setAccumulatedTimestamp] = useState(0);
  const { precepts } = useContext(PreceptsContext);
  const precept = precepts.find(precept => precept.key === preceptKey) || { startEndTimes: [] };

  // update accumulatedTimestamp every second
  useEffect(() => {
    setAccumulatedTimestamp(() => calcAccumulatedTimestamp(precept.startEndTimes));
    const interval = setInterval(() => {
      setAccumulatedTimestamp(() => calcAccumulatedTimestamp(precept.startEndTimes));
    }, 1000);
    return () => clearInterval(interval);
  }, [precept.startEndTimes]);

  return accumulatedTimestamp;
}

function calcAccumulatedTimestamp(startEndTimes: number[]): number {
  const fixedIntervalAccumulatedTime = startEndTimes.reduce((acc, curr, index, array) => {
    if ((index + 1) % 2 === 0 && index > 0) {
      return acc + (curr - array[index - 1]);
    }
    return acc;
  }, 0);
  const lastInterval = startEndTimes.length % 2 === 0 ? 0 : Date.now() - startEndTimes[startEndTimes.length - 1];

  return fixedIntervalAccumulatedTime + lastInterval;
}

