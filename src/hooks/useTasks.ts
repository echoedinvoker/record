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
      const getFormattedTasks = () => {
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

      const formattedTasks = getFormattedTasks()

      const getFormattedColumns = () => {
        const columnsMap = {} as { [key: string]: Column }
        const columnsToUpdate: { id: number; taskOrder: string }[] = []
        const columnsToDelete: number[] = []

        columns.forEach((column) => {
          const originalTaskIds = JSON.parse(column.task_order)
          const filteredTaskIds = originalTaskIds.filter((taskId: string) => taskId in formattedTasks)

          if (filteredTaskIds.length === 0 && !['done', '0', 'archived'].includes(column.key)) {
            columnsToDelete.push(column.id)
          } else {
            columnsMap[column.key] = {
              id: column.id,
              key: column.key,
              title: column.key,
              taskIds: filteredTaskIds
            }

            if (filteredTaskIds.length !== originalTaskIds.length) {
              columnsToUpdate.push({ id: column.id, taskOrder: JSON.stringify(filteredTaskIds) })
            }
          }
        })

        return { columnsMap, columnsToUpdate, columnsToDelete }
      }

      const { columnsMap: formattedColumns, columnsToUpdate, columnsToDelete } = getFormattedColumns()

      // 這裡可以添加更新數據庫的邏輯
      if (columnsToUpdate.length > 0 || columnsToDelete.length > 0) {
        // 調用更新數據庫的函數，例如：
        // await updateDatabaseColumns(columnsToUpdate, columnsToDelete)
        console.log('Columns to update:', columnsToUpdate)
        console.log('Columns to delete:', columnsToDelete)
      }

      return { tasks: formattedTasks, columns: formattedColumns, columnOrder } as Data
    }
  })

  useEffect(() => {
    if (!data || Object.keys(currentData.tasks || {}).length !== 0) return
    setData(data)
  }, [isSuccess])

  return { isLoading, error, data }
}
