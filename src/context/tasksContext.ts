import { createContext } from 'react';
import { Data, Task } from '../types';
import { DropResult } from 'react-beautiful-dnd';

interface TaskContextType {
  data: Data;
  setData: React.Dispatch<React.SetStateAction<Data>>;
  addTask: (task: string, estimatedDurationHMS: string, markdownText: string, columnKey: string) => void;
  deleteTask: (taskKey: string) => void;
  startTask: (taskKey: string) => void;
  stopTask: (taskKey: string) => void;
  updateTask: (task: Task) => void;
  onDragEnd: (result: DropResult) => void;
  runningTask: Task | null;
  getTasksByColumnKey: (columnKey: string) => Task[];
  getTotalEstimatedDurationOfOneDay: (columnKey: string) => number;
  getTotalElapsedDurationOfOneDay: (columnKey: string) => number;
  moveTaskToOtherColumn: (taskKey: string, destinationColumnKey: string) => void;
}

export const TasksContext = createContext<TaskContextType>({} as TaskContextType);
