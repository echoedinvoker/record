import { createColumn, createTask, fetchColumnByKey, fetchTaskByKey, updateColumn, updateTask } from "../services/tasks"
import { Data, TaskBody } from "../types"

export async function saveData(data: Data) {
  const taskKeys = Object.keys(data.tasks)
  for (const key of taskKeys) {
    const task = data.tasks[key]
    try {
      const fetchedTask = await fetchTaskByKey(key)
      const newTask: TaskBody = {
        key: task.key,
        task: task.task,
        estimatedDuration: task.estimatedDuration,
        timestampSum: task.timestampSum,
        markdownContent: task.markdownContent
      }
      if (task.timestamp) {
        newTask.timestamp = task.timestamp
      }
      await updateTask(fetchedTask.id, newTask)

    } catch (error) {
      if ((error as any).status === 404) {
        const newTask: TaskBody = {
          key: task.key,
          task: task.task,
          estimatedDuration: task.estimatedDuration,
          timestampSum: task.timestampSum,
          markdownContent: task.markdownContent
        }
        if (task.timestamp) {
          newTask.timestamp = task.timestamp
        }
        await createTask(newTask)
      }
    }
  }
  const columnKeys = Object.keys(data.columns)
  for (const key of columnKeys) {
    const column = data.columns[key]
    try {
      const fetchedColumn = await fetchColumnByKey(key)
      await updateColumn(fetchedColumn.id!, {
        key: column.key,
        task_order: JSON.stringify(column.taskIds)
      })
    } catch (error) {
      if ((error as any).status === 404) {
        await createColumn({
          key: column.key,
          task_order: JSON.stringify(column.taskIds)
        })
      }
    }
  }
}
