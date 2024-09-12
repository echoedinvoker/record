import { useState } from "react";
import { TasksContext } from "./tasksContext";
import { Archive, Column, Data, Done, Task } from "../types";
import { convertHMStoMilliseconds } from "../utils";
import { DropResult } from "react-beautiful-dnd";
import { useMutation } from "@tanstack/react-query";
import { removeNoLinkedTasks, saveColumns, saveTask } from "../utils/saveData";

interface TasksContextProviderProps {
  children: React.ReactNode
}

export default function TasksContextProvider({ children }: TasksContextProviderProps) {
  const [data, setData] = useState<Data>({ tasks: {}, columns: {}, columnOrder: [] });
  const runningTask = findRunningTask()

  const mutateSaveTask = useMutation({ mutationFn: saveTask })
  const mutateSaveColumn = useMutation({ mutationFn: saveColumns })
  const mutateDeleteTask = useMutation({ mutationFn: removeNoLinkedTasks })

  const isPending = mutateSaveTask.isPending || mutateSaveColumn.isPending || mutateDeleteTask.isPending

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
    mutateSaveTask.mutate({ data: newdata, taskKey: newTask.key })
    mutateSaveColumn.mutate(newdata)
    setData(newdata)
  }

  function deleteTask(taskKey: string): boolean {
    const column = getColumnWithTask(taskKey)
    let isDayEmpty = false
    if (!column) return false
    const newColumn = {
      ...column,
      taskIds: column.taskIds.filter((taskId) => taskId !== taskKey)
    }
    const columns = { ...data.columns }
    if (newColumn.taskIds.length === 0 && !["0", "done", "archived"].includes(column.key)) {
      delete columns[column.key]
      isDayEmpty = true
    } else {
      columns[column.key] = newColumn
    }
    const tasks = { ...data.tasks }
    delete tasks[taskKey]
    const newdata = {
      ...data,
      tasks,
      columns
    }

    mutateDeleteTask.mutate({ oldData: data, newData: newdata })
    mutateSaveColumn.mutate(newdata)
    setData(newdata)
    return isDayEmpty
  }

  function startTask(taskKey: string) {
    const task = data.tasks[taskKey] as Task
    if (!task) return
    const newTask = {
      ...task,
      timestamp: Date.now()
    }
    const newData = {
      ...data,
      tasks: {
        ...data.tasks,
        [taskKey]: newTask
      }
    }
    mutateSaveTask.mutate({ data: newData, taskKey })
    setData(newData)
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
    mutateSaveTask.mutate({ data: newData, taskKey })
    mutateSaveColumn.mutate(newData)
    setData(newData)
  }

  function updateTask(task: Task | Done) {
    if (task.timestampSum && task.estimatedDuration) {
      (task as Done).efficiency = task.estimatedDuration / task.timestampSum
    }
    const newData = {
      ...data,
      tasks: {
        ...data.tasks,
        [task.key]: task
      }
    }
    mutateSaveTask.mutate({ data: newData, taskKey: task.key })
    setData(newData)
  }

  function getColumnWithTask(taskKey: string) {
    for (const columnId of Object.keys(data.columns)) {
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
    const newData = {
      ...data!,
      columns: {
        ...data!.columns,
        [result.source.droppableId]: newColumn
      }
    }
    mutateSaveColumn.mutate(newData)
    setData(newData)
  }

  function setDataWhenDifferentColumn(result: DropResult) {
    const [newSourceColumn, newDestinationColumn] = generateNewColumnsWithMutatedTaskIds(result)
    const newTask = getNewTaskWhenDifferentColumnDnd(result)
    const newData = {
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
    }
    mutateSaveTask.mutate({ data: newData, taskKey: newTask.key })
    mutateSaveColumn.mutate(newData)
    setData(newData)
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
    if (newSourceColumn.taskIds.length === 0 && sourceColumn.key !== "0" && sourceColumn.key !== "done") {
      const newColumns = { ...data.columns }
      delete newColumns[sourceColumn.key]
      const newData = {
        ...data,
        columns: {
          ...newColumns,
          [destinationColumnKey]: newDestinationColumn
        }
      }
      mutateSaveColumn.mutate(newData)
      setData(newData)
    } else {
      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [sourceColumn.key]: newSourceColumn,
          [destinationColumnKey]: newDestinationColumn
        }
      }
      mutateSaveColumn.mutate(newData)
      setData(newData)
    }
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
    if (!destinationColumn) {
      return {
        key: destinationColumnKey,
        title: destinationColumnKey,
        taskIds: [taskKey],
        ts: (new Date()).setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000
      }
    }
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
    const newData = {
      ...data,
      tasks: {
        ...data.tasks,
        [taskKey]: newTask
      }
    }
    mutateSaveTask.mutate({ data: newData, taskKey })
    mutateSaveColumn.mutate(newData)
    setData(newData)
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
    doneToArchive,
    isPending
  }


  return <TasksContext.Provider value={value}>
    {children}
  </TasksContext.Provider>
}
