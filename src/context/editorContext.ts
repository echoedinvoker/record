import { createContext } from 'react';

export enum Mode {
  Create = 'create',
  Update = 'update',
  AddChild = 'add-child'
}

interface EditorContextType {
  id: number;
  setId: React.Dispatch<React.SetStateAction<number>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  taskName: string;
  setTaskName: React.Dispatch<React.SetStateAction<string>>;
  estimatedDurationHMS: string;
  setEstimatedDurationHMS: React.Dispatch<React.SetStateAction<string>>;
  consumeTimeHMS: string;
  setConsumeTimeHMS: React.Dispatch<React.SetStateAction<string>>;
  markdownText: string;
  setMarkdownText: React.Dispatch<React.SetStateAction<string>>;
  parentKey: string;
  setParentKey: React.Dispatch<React.SetStateAction<string>>;
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  setValues: (parentKey: string) => void;
  closeEditor: () => void;
  addTaskEditor: () => void;
  startCreateTask: () => void;
}

export const EditorContext = createContext<EditorContextType>({} as EditorContextType);
