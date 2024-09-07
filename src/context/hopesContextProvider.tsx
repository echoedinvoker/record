import { useState } from "react";
import { HopesContext } from "./hopesContext";
import { Hope } from "../types";
import { buildHopeTree } from "../utils/hopes";

interface HopesContextProviderProps {
  children: React.ReactNode
}


export default function HopesContextProvider({ children }: HopesContextProviderProps) {
  const [hopes, setHopes] = useState<Hope[]>([])
  const hopesNames = hopes.map(hope => hope.name)

  const addHope = (newHope: Hope) => {
    setHopes(prevHopes => [...prevHopes, newHope])
  }

  const hopeTree = buildHopeTree(hopes)

  const value = {
    hopes,
    setHopes,
    addHope,
    hopesNames,
    hopeTree
  }

  return (
    <HopesContext.Provider value={value}>
      {children}
    </HopesContext.Provider>
  )
}
