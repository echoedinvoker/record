import { useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import { Precept } from "../services/precepts";
import { PreceptsContext } from "./preceptsContext";

interface PreceptsContextProviderProps {
  children: React.ReactNode
}

export default function PreceptsContextProvider({ children }: PreceptsContextProviderProps) {
  const [precepts, setPrecepts] = useState<Precept[]>([])

  function addPrecept(precept: Omit<Precept, 'key' | 'startEndTimes'>) {
    const newPrecept: Precept = {
      key: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: precept.name,
      startEndTimes: [],
      baseMultiplier: precept.baseMultiplier,
      thresholds: precept.thresholds,
      hopeKey: precept.hopeKey,
    }

    setPrecepts(prevPrecepts => [...prevPrecepts, newPrecept])
  }

  function removePrecept(preceptKey: string) {
    setPrecepts(prevPrecepts => prevPrecepts.filter(precept => precept.key !== preceptKey))
  }

  function togglePrecept(preceptKey: string) {
    setPrecepts(prevPrecepts => prevPrecepts.map(precept => {
      if (precept.key === preceptKey) {
        return { ...precept, startEndTimes: [...precept.startEndTimes, Date.now()] }
      }
      return precept
    }))
  }

  function updatePrecept(precept: Precept) {
    setPrecepts(prevPrecepts => prevPrecepts.map(p => p.key === precept.key ? precept : p))
  }

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    const items = Array.from(precepts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPrecepts(items);
  }


  const value = {
    precepts,
    setPrecepts,
    addPrecept,
    removePrecept,
    togglePrecept,
    updatePrecept,
    onDragEnd,
  }


  return <PreceptsContext.Provider value={value}>
    {children}
  </PreceptsContext.Provider>
}
