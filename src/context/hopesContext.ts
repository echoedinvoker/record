import { createContext } from 'react';
import { Hope } from '../types';

interface HopeContextType {
  hopes: Hope[];
  setHopes: React.Dispatch<React.SetStateAction<Hope[]>>;
  addHope: (hope: Hope) => void;
  hopesNames: string[];
}

export const HopesContext = createContext<HopeContextType>({} as HopeContextType);
