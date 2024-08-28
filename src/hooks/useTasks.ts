import { useQuery } from "@tanstack/react-query"
import { fetchColumn, fetchColumnOrder, fetchTasks } from "../services/tasks"
import { Column, Data, Task } from "../types"

export function useTasks() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const promiseFetchTasks = fetchTasks()
      const promiseFetchColumn = fetchColumn()
      const promiseFetchColumnOrder = fetchColumnOrder()
      const [tasks, columns, columnOrder] = await Promise.all([promiseFetchTasks, promiseFetchColumn, promiseFetchColumnOrder])
      const formattedTasks = () => {
        const tasksMap = {} as { [key: string]: Task }
        tasks.forEach((task) => {
          tasksMap[task.id.toString()] = {
            id: task.id.toString(),
            task: task.name,
            estimatedDuration: task.estimated_duration,
            timestamp: task.start_timestamp,
            timestampSum: task.consume_timestamp,
            markdownContent: task.markdown_content
          }
        })
        return tasksMap
      }
      const formattedColumns = () => {
        const columnsMap = {} as { [key: string]: Column }
        columns.forEach((column) => {
          columnsMap[column.id === 1 ? 'done' : (column.id - 2).toString()] = {
            id: column.id === 1 ? 'done' : (column.id - 2).toString(),
            title: column.id === 1 ? 'Done' : column.id === 2 ? 'Today' : column.id === 3 ? 'Tomorrow' : 'Upcoming',
            taskIds: JSON.parse(column.task_order).map((taskId: number) => taskId.toString())
          }
        })
        return columnsMap
      }
      const formattedColumnOrder = () => {
        return columnOrder.map((columnId) => columnId === 1 ? 'done' : (columnId - 1).toString())
      }
      return { tasks: formattedTasks(), columns: formattedColumns(), columnOrder: formattedColumnOrder() } as Data
    }
  })

  return { isLoading, error, data }
}
