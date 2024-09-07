import { useState } from "react";
import { HopesContext } from "./hopesContext";
import { Hope } from "../types";

interface HopesContextProviderProps {
  children: React.ReactNode
}

export default function HopesContextProvider({ children }: HopesContextProviderProps) {
  const [hopes, setHopes] = useState<Hope[]>([])
  const hopesNames = hopes.map(hope => hope.name)

  const addHope = (newHope: Hope) => {
    setHopes(prevHopes => [...prevHopes, newHope])
  }

  const value = {
    hopes,
    setHopes,
    addHope,
    hopesNames
  }

  return (
    <HopesContext.Provider value={value}>
      {children}
    </HopesContext.Provider>
  )
}
