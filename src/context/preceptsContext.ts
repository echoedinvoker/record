import { createContext } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { Precept, Threshold } from '../services/precepts';

interface PreceptContextType {
  precepts: Precept[];
  setPrecepts: React.Dispatch<React.SetStateAction<Precept[]>>;
  addPrecept: (precept: Precept) => void;
  removePrecept: (preceptKey: string) => void;
  togglePrecept: (preceptKey: string) => void;
  updatePrecept: (precept: Precept) => void;
  onDragEnd: (result: DropResult) => void;
  changePreceptStatus: (preceptKey: string) => void;
  isModalVisible: boolean;
  showModal: (precept: Precept | null) => void;
  handleCancel: () => void;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  baseMultiplier: number;
  setBaseMultiplier: React.Dispatch<React.SetStateAction<number>>;
  thresholds: Threshold[];
  hopeKey: string;
  setHopeKey: React.Dispatch<React.SetStateAction<string>>;
  handleThresholdChange: (index: number, field: 'thresholdNumber' | 'multiplier' | 'unit', value: number | string) => void;
  handleAddThreshold: () => void;
  handleRemoveThreshold: (index: number) => void;
  modalType: 'add' | 'edit';
  key: string;
}

export const PreceptsContext = createContext<PreceptContextType>({} as PreceptContextType);
