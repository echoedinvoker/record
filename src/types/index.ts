export interface Task {
  id: number
  task: string
  status: string
  estimatedDuration: number
  timestamp: number | null
  timestampSum: number
  markdownContent: string
  priority: number
  delayTS: number[]
}
