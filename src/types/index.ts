export interface Task {
  id: string
  task: string
  estimatedDuration: number
  timestamp: number | null
  timestampSum: number
  markdownContent: string
}

export interface Column {
  id: string
  title: string
  taskIds: string[]
  ts?: number
}

export interface ColumnOrder {
  id: string[]
}

export interface Data {
  tasks: { [key: string]: Task }
  columns: { [key: string]: Column }
  columnOrder: ColumnOrder
}
