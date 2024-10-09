import React, { useState, useEffect } from "react";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import { Precept, Threshold } from "../services/precepts";

interface Props {
  precept: Precept;
  index: number;
}

export default function ThePrecept({ index, precept }: Props) {
  const [status, setStatus] = useState<'未開始' | '啟用中' | '已停止'>('未開始');
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(precept.baseMultiplier);
  const [accumulatedTime, setAccumulatedTime] = useState<number>(0);

  useEffect(() => {
    updateStatus();
    updateMultiplier();
  }, [precept.startEndTimes, accumulatedTime]);

  const updateStatus = () => {
    const now = Date.now();
    if (precept.startEndTimes.length === 0) {
      setStatus('未開始');
    } else if (precept.startEndTimes.length % 2 === 1) {
      setStatus('啟用中');
    } else {
      setStatus('已停止');
    }
  };

  const updateMultiplier = () => {
    let multiplier = precept.baseMultiplier;
    for (const threshold of precept.thresholds) {
      if (accumulatedTime >= threshold.threshold) {
        multiplier = threshold.multiplier;
      } else {
        break;
      }
    }
    setCurrentMultiplier(multiplier);
  };

  const handleClick = () => {
    const now = Date.now();
    const newStartEndTimes = [...precept.startEndTimes, now];
    // Here you should call a function to update the precept in your state or backend
    console.log("Updated startEndTimes:", newStartEndTimes);
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

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
          <p>累積時間: {formatTime(accumulatedTime)}</p>
          <p>當前倍率: {currentMultiplier}x</p>
          <button onClick={handleClick}>
            {status === '啟用中' ? '停止' : '開始/繼續'}
          </button>
        </div>
      )}
    </Draggable>
  );
}
