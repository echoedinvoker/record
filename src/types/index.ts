export interface Task {
  id?: number
  key: string
  task: string
  estimatedDuration: number
  timestamp: number | null
  timestampSum: number
  markdownContent: string
}

export interface TaskBody {
  key: string
  task: string
  estimatedDuration: number
  timestamp?: number
  timestampSum: number
  markdownContent: string
}

export interface TaskRequest {
  key: string
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
  id?: number
  key: string
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
  key: string
  name: string
  status: string
  estimated_duration: number
  start_timestamp: number | null
  consume_timestamp: number
  markdown_content: string
}

export interface ColumnRequest {
  key: string
  task_order: string
}

export interface ColumnResponse {
  id?: number
  key: string
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
