import { createContext } from 'react';
import { Hope, HopeMapValue } from '../types';

interface HopeContextType {
  hopes: Hope[];
  setHopes: React.Dispatch<React.SetStateAction<Hope[]>>;
  addHope: (hope: Hope) => void;
  hopesNames: string[];
  hopeTree: HopeMapValue[]
  deleteHope: (name: string) => void;
  selectedHope: string;
  selectHope: (name: string) => void;
}

export const HopesContext = createContext<HopeContextType>({} as HopeContextType);
