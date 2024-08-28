import { createContext } from "react";

interface DayContextType {
  day: string;
  setDay: React.Dispatch<React.SetStateAction<string>>;
  ts: number;
  hasNextDay: boolean;
  hasPrevDay: boolean;
  toNextDay: () => void;
  toPrevDay: () => void;
}

export const DayContext = createContext<DayContextType>(
  {} as DayContextType
)
