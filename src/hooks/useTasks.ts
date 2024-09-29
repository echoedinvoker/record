import { useQuery } from "@tanstack/react-query"
import { fetchColumn, fetchColumnOrder, fetchTasks } from "../services/tasks"
import { Column, Data, Done, Task } from "../types"
import { useContext, useEffect } from "react"
import { TasksContext } from "../context/tasksContext"

export function useTasks() {
  const { data: currentData, setData } = useContext(TasksContext)
  const { isLoading, error, data, isSuccess } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const promiseFetchTasks = fetchTasks()
      const promiseFetchColumn = fetchColumn()
      const promiseFetchColumnOrder = fetchColumnOrder()
      const [tasks, columns, columnOrder] = await Promise.all([promiseFetchTasks, promiseFetchColumn, promiseFetchColumnOrder])
      const formattedTasks = () => {
        const tasksMap = {} as { [key: string]: Task | Done }
        tasks.forEach((task) => {
          tasksMap[task.key] = {
            id: task.id,
            key: task.key,
            task: task.name,
            estimatedDuration: task.estimated_duration,
            timestamp: task.start_timestamp,
            timestampSum: task.consume_timestamp,
            markdownContent: task.markdown_content
          }
          if (tasksMap[task.key].timestampSum) {
            (tasksMap[task.key] as Done).efficiency = tasksMap[task.key].estimatedDuration / (tasksMap[task.key] as Done).timestampSum
          }
        })
        return tasksMap
      }
      const formattedTasks = () => {
        const tasksMap = {} as { [key: string]: Task | Done }
        tasks.forEach((task) => {
          tasksMap[task.key] = {
            id: task.id,
            key: task.key,
            task: task.name,
            estimatedDuration: task.estimated_duration,
            timestamp: task.start_timestamp,
            timestampSum: task.consume_timestamp,
            markdownContent: task.markdown_content
          }
          if (tasksMap[task.key].timestampSum) {
            (tasksMap[task.key] as Done).efficiency = tasksMap[task.key].estimatedDuration / (tasksMap[task.key] as Done).timestampSum
          }
        })
        return tasksMap
      }

      const formattedTasks = formattedTasks()

      const formattedColumns = () => {
        const columnsMap = {} as { [key: string]: Column }
        columns.forEach((column) => {
          const taskIds = JSON.parse(column.task_order)
          columnsMap[column.key] = {
            id: column.id,
            key: column.key,
            title: column.key,
            taskIds: taskIds.filter((taskId: string) => taskId in formattedTasks)
          }
        })
        return columnsMap
      }
      return { tasks: formattedTasks, columns: formattedColumns(), columnOrder } as Data
    }
  })

  useEffect(() => {
    if (!data || Object.keys(currentData.tasks || {}).length !== 0) return
    setData(data)
  }, [isSuccess])

  return { isLoading, error, data }
}
