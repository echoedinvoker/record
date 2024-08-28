export interface Task {
  id: string
  task: string
  estimatedDuration: number
  timestamp: number | null
  timestampSum: number
  markdownContent: string
}

export interface TaskBody {
  task: string
  estimatedDuration: number
  timestamp: number | null
  timestampSum: number
  markdownContent: string
  columnId: number
}

export interface TaskRequest {
  name: string
  estimated_duration: number
  start_timestamp?: number | null
  consume_timestamp: number
  markdown_content: string
}

export interface Done extends Task {
  ts: number
  efficiency: number
}

export interface Column {
  id: string
  title: string
  taskIds: string[]
  ts?: number
}

export interface Data {
  tasks: { [key: string]: Task | Done }
  columns: { [key: string]: Column }
  columnOrder: string[]
}

export interface TaskResponse {
  id: number
  name: string
  status: string
  estimated_duration: number
  start_timestamp: number | null
  consume_timestamp: number
  markdown_content: string
}

export interface ColumnRequest {
  task_order: number[]
}

export interface ColumnResponse {
  id: number
  task_order: string
}

export interface OnDragEndResultType {
  draggableId: string;
  mode: string;
  reason: string;
  type: string;
  source: {
    index: number;
    droppableId: string;
  };
  destination: {
    index: number;
    droppableId: string;
  };
}
