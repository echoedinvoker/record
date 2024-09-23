import { createContext } from 'react';
import { Hope, HopeMapValue } from '../types';

interface HopeContextType {
  hopes: Hope[];
  setHopes: React.Dispatch<React.SetStateAction<Hope[]>>;
  addHope: (hope: Hope) => void;
  hopesKeys: string[];
  hopeTree: HopeMapValue[]
  deleteHope: (name: string) => void;
  selectedHope: string;
  selectHope: (name: string) => void;
  appendTask: (hopeName: string, taskKey: string) => void;
  isPending: boolean;
  updateMarkdownContent: (value: string) => void;
  initialValue: string;
}

export const HopesContext = createContext<HopeContextType>({} as HopeContextType);
