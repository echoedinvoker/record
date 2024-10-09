import { createContext } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { Precept } from '../services/precepts';

interface PreceptContextType {
  precepts: Precept[];
  setPrecepts: React.Dispatch<React.SetStateAction<Precept[]>>;
  addPrecept: (precept: Precept) => void;
  removePrecept: (preceptKey: string) => void;
  togglePrecept: (preceptKey: string) => void;
  updatePrecept: (precept: Precept) => void;
  onDragEnd: (result: DropResult) => void;
  changePreceptStatus: (preceptKey: string) => void;
}

export const PreceptsContext = createContext<PreceptContextType>({} as PreceptContextType);
