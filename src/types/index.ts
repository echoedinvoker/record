export interface Task {
  id: string
  task: string
  estimatedDuration: number
  timestamp: number | null
  timestampSum: number
  markdownContent: string
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
