import { createContext } from 'react';
import { Archive, Data, Done, Task } from '../types';
import { DropResult } from 'react-beautiful-dnd';

interface TaskContextType {
  data: Data;
  setData: React.Dispatch<React.SetStateAction<Data>>;
  addTask: (task: string, estimatedDurationHMS: string, markdownText: string, columnKey: string) => void;
  deleteTask: (taskKey: string) => boolean;
  startTask: (taskKey: string) => void;
  stopTask: (taskKey: string) => void;
  updateTask: (task: Task) => void;
  onDragEnd: (result: DropResult) => void;
  runningTask: Task | null;
  getTasksByColumnKey: (columnKey: string) => (Task | Done | Archive)[];
  getTotalEstimatedDurationOfOneDay: (columnKey: string) => number;
  getTotalElapsedDurationOfOneDay: (columnKey: string) => number;
  moveTaskToOtherColumn: (taskKey: string, destinationColumnKey: string) => void;
  doneToArchive: (taskKey: string) => void;
}

export const TasksContext = createContext<TaskContextType>({} as TaskContextType);
