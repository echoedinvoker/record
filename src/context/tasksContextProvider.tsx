import { useState } from "react";
import { TasksContext } from "./tasksContext";
import { Archive, Column, Data, Done, Task } from "../types";
import { convertHMStoMilliseconds } from "../utils";
import { DropResult } from "react-beautiful-dnd";

interface TasksContextProviderProps {
  children: React.ReactNode
}

export default function TasksContextProvider({ children }: TasksContextProviderProps) {
  const [data, setData] = useState<Data>({ tasks: {}, columns: {}, columnOrder: [] });
  const runningTask = findRunningTask()

  function addTask(
    task: string,
    estimatedDurationHMS: string,
    markdownText: string,
    columnKey: string
  ) {
    const newTask: Task = {
      key: Math.random().toString(36).substring(7),
      task,
      estimatedDuration: convertHMStoMilliseconds(estimatedDurationHMS),
      markdownContent: markdownText,
      timestamp: null,
      timestampSum: 0,
    }

    const newColumn = {
      ...data!.columns[columnKey],
      taskIds: [...data!.columns[columnKey].taskIds, newTask.key]
    }

    const newdata = {
      ...data!,
      tasks: {
        ...data!.tasks,
        [newTask.key]: newTask
      },
      columns: {
        ...data!.columns,
        [columnKey]: newColumn
      }
    }
    setData(newdata)
  }

  function deleteTask(taskKey: string) {
    const column = getColumnWithTask(taskKey)
    if (!column) return
    const newColumn = {
      ...column,
      taskIds: column.taskIds.filter((taskId) => taskId !== taskKey)
    }
    const tasks = { ...data.tasks }
    delete tasks[taskKey]
    const newdata = {
      ...data,
      tasks,
      columns: {
        ...data.columns,
        [column.key]: newColumn
      }
    }

    setData(newdata)
  }

  function startTask(taskKey: string) {
    setData((prev) => {
      const task = prev.tasks[taskKey]
      if (!task) return prev
      const newTask = {
        ...task,
        timestamp: Date.now()
      }
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskKey]: newTask
        }
      }
    })
  }

  function stopTask(taskKey: string) {
    const task = data.tasks[taskKey] as Task
    if (!task || !task.timestamp) return
    const timestampSum = task.timestampSum + (Date.now() - task.timestamp)
    const newTask = {
      ...task,
      timestamp: null,
      timestampSum,
      ts: Date.now(),
      efficiency: task.estimatedDuration / timestampSum
    } as Done
    const sourceColumn = getColumnWithTask(taskKey)
    const newSourceColumn = removeTaskFromSourceColumn(taskKey, sourceColumn!.key)
    const newDoneColumn = addTaskToDestinationColumn(taskKey, "done")
    const newData = {
      ...data,
      tasks: {
        ...data.tasks,
        [taskKey]: newTask
      },
      columns: {
        ...data.columns,
        [sourceColumn!.key]: newSourceColumn!,
        done: newDoneColumn!
      }
    }
    setData(newData)
  }

  function updateTask(task: Task | Done) {
    if (task.timestampSum && task.estimatedDuration) {
      (task as Done).efficiency = task.estimatedDuration / task.timestampSum
    }
    setData((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [task.key]: task
      }
    }))
  }

  function getColumnWithTask(taskKey: string) {
    for (const columnId of data.columnOrder) {
      const column = data.columns[columnId]
      if (column.taskIds.includes(taskKey)) {
        return column
      }
    }
    return null
  }

  function onDragEnd(result: DropResult) {
    if (!result.destination || (result.destination.droppableId === result.source.droppableId && result.destination.index === result.source.index)) {
      return;
    }
    if (result.destination.droppableId === result.source.droppableId) {
      setDataWhenSameColumn(result)
    } else {
      setDataWhenDifferentColumn(result)
    }
  }

  function setDataWhenSameColumn(result: DropResult) {
    const column = data.columns[result.source.droppableId]
    if (!column) return
    const taskIds = Array.from(column.taskIds)
    taskIds.splice(result.source.index, 1)
    taskIds.splice(result.destination!.index, 0, result.draggableId)
    const newColumn = {
      ...column,
      taskIds
    }
    setData({
      ...data!,
      columns: {
        ...data!.columns,
        [result.source.droppableId]: newColumn
      }
    })
  }

  function setDataWhenDifferentColumn(result: DropResult) {
    const [newSourceColumn, newDestinationColumn] = generateNewColumnsWithMutatedTaskIds(result)
    const newTask = getNewTaskWhenDifferentColumnDnd(result)
    setData({
      ...data!,
      tasks: {
        ...data!.tasks,
        [newTask.key]: newTask
      },
      columns: {
        ...data!.columns,
        [result.source.droppableId]: newSourceColumn,
        [result.destination!.droppableId]: newDestinationColumn
      }
    })
  }

  function getNewTaskWhenDifferentColumnDnd(result: DropResult) {
    const task = data.tasks[result.draggableId]
    const destColumn = data.columns[result.destination!.droppableId]
    if (destColumn.key !== "done") {
      const newTask = {
        key: task.key,
        task: task.task,
        estimatedDuration: task.estimatedDuration,
        timestamp: null,
        timestampSum: task.timestampSum,
        markdownContent: task.markdownContent,
      } as Task
      return newTask
    }
    return {
      ...task,
      ts: Date.now(),
      efficiency: task.estimatedDuration / task.timestampSum
    } as Done
  }

  function generateNewColumnsWithMutatedTaskIds(result: DropResult): [Column, Column] {
    const sourceColumn = data.columns[result.source.droppableId]
    const destinationColumn = data.columns[result.destination!.droppableId]
    const sourceTaskIds = Array.from(sourceColumn.taskIds)
    sourceTaskIds.splice(result.source.index, 1)
    const destinationTaskIds = Array.from(destinationColumn.taskIds)
    destinationTaskIds.splice(result.destination!.index, 0, result.draggableId)
    const newSourceColumn = {
      ...sourceColumn,
      taskIds: sourceTaskIds
    }
    const newDestinationColumn = {
      ...destinationColumn,
      taskIds: destinationTaskIds
    }
    return [newSourceColumn, newDestinationColumn]
  }

  function findRunningTask(): Task | null {
    let columnKey = "0"
    while (columnKey in data.columns) {
      const column = data.columns[columnKey]
      for (const taskKey of column.taskIds) {
        const task = data.tasks[taskKey] as Task
        if (task.timestamp) return task
      }
      columnKey = (parseInt(columnKey) + 1).toString()
    }

    return null;
  }

  function getTotalEstimatedDurationOfOneDay(columnKey: string) {
    const tasks = getTasksByColumnKey(columnKey)
    return tasks.reduce((acc, task) => acc + task.estimatedDuration, 0)
  }

  function getTotalElapsedDurationOfOneDay(columnKey: string) {
    const tasks = getTasksByColumnKey(columnKey)
    return tasks.reduce((acc, task) => acc + task.timestampSum, 0)
  }

  function getTasksByColumnKey(columnKey: string) {
    const column = data.columns[columnKey]
    if (!column) return []
    return column.taskIds.map((taskKey) => data.tasks[taskKey])
  }

  function moveTaskToOtherColumn(taskKey: string, destinationColumnKey: string) {
    const sourceColumn = getColumnWithTask(taskKey)
    if (!sourceColumn) return
    const newSourceColumn = removeTaskFromSourceColumn(taskKey, sourceColumn.key)
    const newDestinationColumn = addTaskToDestinationColumn(taskKey, destinationColumnKey)
    if (!newSourceColumn || !newDestinationColumn) return
    setData(prev => ({
      ...prev,
      columns: {
        ...prev.columns,
        [sourceColumn.key]: newSourceColumn,
        [destinationColumnKey]: newDestinationColumn
      }
    }))
  }

  function removeTaskFromSourceColumn(taskKey: string, sourceColumnKey: string): Column | undefined {
    const sourceColumn = data.columns[sourceColumnKey]
    if (!sourceColumn) return
    return {
      ...sourceColumn,
      taskIds: sourceColumn.taskIds.filter((taskId) => taskId !== taskKey)
    }
  }

  function addTaskToDestinationColumn(taskKey: string, destinationColumnKey: string): Column | undefined {
    const destinationColumn = data.columns[destinationColumnKey]
    if (!destinationColumn) return
    return {
      ...destinationColumn,
      taskIds: [...destinationColumn.taskIds, taskKey]
    }
  }

  function doneToArchive(taskKey: string): void {
    moveTaskToOtherColumn(taskKey, "archived")
    convertDoneToArchive(taskKey)
  }

  function convertDoneToArchive(taskKey: string): void {
    const task = data.tasks[taskKey] as Done
    const newTask: Archive = {
      key: task.key,
      task: task.task,
      estimatedDuration: task.estimatedDuration,
      timestampSum: task.timestampSum,
      markdownContent: task.markdownContent,
      ts: task.ts,
      efficiency: task.efficiency,
    }
    setData(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskKey]: newTask
      }
    }))
  }

  const value = {
    data,
    setData,
    addTask,
    deleteTask,
    startTask,
    stopTask,
    updateTask,
    onDragEnd,
    runningTask,
    getTasksByColumnKey,
    getTotalEstimatedDurationOfOneDay,
    getTotalElapsedDurationOfOneDay,
    moveTaskToOtherColumn,
    doneToArchive
  }


  return <TasksContext.Provider value={value}>
    {children}
  </TasksContext.Provider>
}
