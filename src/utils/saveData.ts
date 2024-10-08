import { createColumn, createTask, deleteTask, fetchColumnByKey, fetchTaskByKey, updateColumn, updateTask } from "../services/tasks"
import { Archive, Data, Done, Task, TaskBody } from "../types"

export async function saveData(oldData: Data, data: Data) {
  await saveTasks(data)
  await saveColumns(data)
  await removeNoLinkedTasks({ oldData, newData: data })
}

export async function saveTask({ data, taskKey }: { data: Data, taskKey: string }) {
  const task = data.tasks[taskKey]
  try {
    const fetchedTask = await fetchTaskByKey(taskKey)
    const newTask: TaskBody = {
      key: task.key,
      task: task.task,
      estimatedDuration: task.estimatedDuration,
      timestampSum: task.timestampSum,
      markdownContent: task.markdownContent
    }
    if (isTask(task) && task.timestamp) {
      newTask.timestamp = task.timestamp
    }
    if (isDone(task)) {
      newTask.ts = task.ts
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
      if (isTask(task) && task.timestamp) {
        newTask.timestamp = task.timestamp
      }
      if (isDone(task)) {
        newTask.ts = task.ts
      }
      await createTask(newTask)
    } else {
      throw error
    }
  }
}


export async function saveTasks(data: Data) {
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
      if (isTask(task) && task.timestamp) {
        newTask.timestamp = task.timestamp
      }
      if (isDone(task)) {
        newTask.ts = task.ts
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
        if (isTask(task) && task.timestamp) {
          newTask.timestamp = task.timestamp
        }
        if (isDone(task)) {
          newTask.ts = task.ts
        }
        await createTask(newTask)
      }
    }
  }
}
export async function saveColumns(data: Data) {
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
export async function removeNoLinkedTasks({ oldData, newData }: { oldData: Data, newData: Data }) {
  const keysFromAllColumns = getKeysFromAllColumns(newData)
  const taskKeys = Object.keys(oldData.tasks)
  for (const key of taskKeys) {
    if (!keysFromAllColumns.includes(key)) {
      await removeTaskByKey(key)
    }
  }
}

function getKeysFromAllColumns(data: Data) {
  const columnKeys = Object.keys(data.columns)
  const keys: string[] = []
  for (const key of columnKeys) {
    keys.push(...data.columns[key].taskIds)
  }
  return keys
}
async function removeTaskByKey(key: string) {
  const fetchedTask = await fetchTaskByKey(key)
  await deleteTask(fetchedTask.id!)
}

function isDone(task: Task | Done | Archive): task is Done {
  return 'ts' in task;
}

function isTask(task: Task | Done | Archive): task is Task {
  return 'timestamp' in task;
}
