import { useEffect, useRef, useState } from 'react'
import { convertHMStoMilliseconds } from './utils';
import { Data, Done } from './types';
import OnGoingTab, { OnGoingTabRef } from './components/OnGoingTab';
import { DragDropContext } from 'react-beautiful-dnd';
import { useTasks } from './hooks/useTasks';
import { useAddTask } from './hooks/useAddTask';
import { useDeleteTask } from './hooks/useDeleteTask';
import { useDropOnColumn } from './hooks/useDropOnColumn';

export default function App() {

  const [data, setData] = useState<Data | null>(null)
  const onGoingTabRef = useRef<OnGoingTabRef>(null);

  const { isLoading, error, data: fetchedData } = useTasks()
  const { mutate: addTaskMutate } = useAddTask()
  const { mutate: removeTaskMutate } = useDeleteTask()
  const { mutate: dropOnColumn } = useDropOnColumn()

  useEffect(() => {
    if (fetchedData) {
      setData(fetchedData)
    }
  }, [fetchedData])


  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }


  function addTask(
    task: string,
    estimatedDurationHMS: string,
    markdownText: string,
    columnId: string
  ) {
    addTaskMutate({
      task,
      estimatedDuration: convertHMStoMilliseconds(estimatedDurationHMS),
      markdownContent: markdownText,
      timestamp: null,
      timestampSum: 0,
      columnId: parseInt(columnId) + 2
    }, {
      onSuccess: () => {
        console.log("onSuccess")
        setTimeout(() => {
          onGoingTabRef.current?.tasksRef.current?.scrollToBottom();
        }, 0);
      }
    })
  }

  function deleteTask(taskId: string, columnId: string): void {
    removeTaskMutate({
      taskId: parseInt(taskId),
      columnId: parseInt(columnId) + 2
    })
  }
  function startTask(taskId: string) {
    if (!data || !data.tasks) {
      throw new Error("Data or tasks are undefined");
    }
    setData({
      ...data!,
      tasks: {
        ...data.tasks,
        [taskId]: {
          ...data.tasks[taskId],
          timestamp: Date.now(),
        }
      },
    })
  }
  function stopTask(taskId: string) {
    if (!data || !data.tasks) {
      throw new Error("Data or tasks are undefined");
    }
    const timestampSum = data.tasks[taskId].timestampSum + (Date.now() - data.tasks[taskId].timestamp!)
    const efficiency = data.tasks[taskId].estimatedDuration / timestampSum
    setData({
      ...data!,
      tasks: {
        ...data.tasks,
        [taskId]: {
          ...data.tasks[taskId],
          timestampSum: data.tasks[taskId].timestampSum + (Date.now() - data.tasks[taskId].timestamp!),
          timestamp: null,
          ts: Date.now(),
          efficiency
        } as Done
      },
      columns: {
        ...data.columns,
        "0": {
          ...data.columns["0"],
          taskIds: data.columns["0"].taskIds.filter(id => id !== taskId)
        },
        "done": {
          ...data.columns["done"],
          taskIds: [...data.columns["done"].taskIds, taskId]
        }
      }
    })
    setTimeout(() => {
      onGoingTabRef.current?.doneListRef.current?.scrollToBottom();
    }, 0);
  }

  function changeTaskName(taskId: string, name: string) {
    if (!data || !data.tasks) {
      throw new Error("Data or tasks are undefined");
    }
    setData({
      ...data!,
      tasks: {
        ...data.tasks,
        [taskId]: {
          ...data.tasks[taskId],
          task: name
        }
      }
    })
  }
  function updateTaskMardownContent(taskId: string, content: string) {
    if (!data || !data.tasks) {
      throw new Error("Data or tasks are undefined");
    }
    setData({
      ...data!,
      tasks: {
        ...data.tasks,
        [taskId]: {
          ...data.tasks[taskId],
          markdownContent: content
        }
      }
    })
  }
  function changeTaskEstimatedDuration(taskId: string, elapsedDurationHMS: string) {
    if (!data || !data.tasks) {
      throw new Error("Data or tasks are undefined");
    }
    const newTask = {
      ...data.tasks[taskId],
      estimatedDuration: convertHMStoMilliseconds(elapsedDurationHMS)
    }
    if ((data.tasks[taskId] as Done).efficiency) {
      (newTask as Done).efficiency = data.tasks[taskId].timestampSum / convertHMStoMilliseconds(elapsedDurationHMS)
    }
    setData({
      ...data!,
      tasks: {
        ...data.tasks,
        [taskId]: newTask
      }
    })
  }
  function changeTaskElapsedDuration(taskId: string, elapsedDurationHMS: string) {
    if (!data || !data.tasks) {
      throw new Error("Data or tasks are undefined");
    }
    const newTask = {
      ...data.tasks[taskId],
      timestampSum: convertHMStoMilliseconds(elapsedDurationHMS)
    }
    if ((data.tasks[taskId] as Done).efficiency) {
      (newTask as Done).efficiency = data.tasks[taskId].estimatedDuration / convertHMStoMilliseconds(elapsedDurationHMS)
    }
    setData({
      ...data!,
      tasks: {
        ...data.tasks,
        [taskId]: newTask
      }
    })
  }

  function advanceTask(taskId: string) {
    if (!data) {
      throw new Error("Data is undefined");
    }
    const columnId = getColumnIdByTaskId(taskId)
    const newColumnId = (parseInt(columnId) - 1).toString()
    const getNewColumn = () => {
      if (data.columns[newColumnId]) {
        return {
          ...data.columns[newColumnId],
          taskIds: [...data.columns[newColumnId].taskIds, taskId]
        }
      } else {
        const ts = new Date()
        ts.setDate(ts.getDate() + parseInt(newColumnId))
        ts.setHours(0, 0, 0, 0)
        return {
          id: newColumnId,
          title: new Date().toDateString(),
          ts: ts.getTime(),
          taskIds: [taskId]
        }
      }
    }

    const newData = {
      ...data,
      columns: {
        ...data.columns,
        [columnId]: {
          ...data.columns[columnId],
          taskIds: data.columns[columnId].taskIds.filter(id => id !== taskId)
        },
        [newColumnId]: getNewColumn()
      }
    }

    setData(newData)
  }

  function delayToNextDay(taskId: string) {
    if (!data) {
      throw new Error("Data is undefined");
    }
    const columnId = getColumnIdByTaskId(taskId)
    const newColumnId = (parseInt(columnId) + 1).toString()
    const getNewColumn = () => {
      if (data.columns[newColumnId]) {
        return {
          ...data.columns[newColumnId],
          taskIds: [...data.columns[newColumnId].taskIds, taskId]
        }
      } else {
        const ts = new Date()
        ts.setDate(ts.getDate() + parseInt(newColumnId))
        ts.setHours(0, 0, 0, 0)
        return {
          id: newColumnId,
          title: new Date().toDateString(),
          ts: ts.getTime(),
          taskIds: [taskId]
        }
      }
    }

    const newData = {
      ...data,
      columns: {
        ...data.columns,
        [columnId]: {
          ...data.columns[columnId],
          taskIds: data.columns[columnId].taskIds.filter(id => id !== taskId)
        },
        [newColumnId]: getNewColumn()
      }
    }

    setData(newData)
  }

  function getColumnIdByTaskId(taskId: string): string {
    if (!data) {
      throw new Error("Data is undefined");
    }
    const taskIdToColumnIdMap = createTaskIdToColumnIdMap(data)
    return taskIdToColumnIdMap.get(taskId) || ""
  }

  function createTaskIdToColumnIdMap(data: Data): Map<string, string> {
    return Object.entries(data.columns).reduce((acc, [columnId, column]) => {
      column.taskIds.forEach(taskId => {
        acc.set(taskId, columnId);
      });
      return acc;
    }, new Map<string, string>());
  }


  function downloadTasks() {
    console.log(data)
    // const yamlStr = yaml.dump(tasks)
    // const blob = new Blob([yamlStr], { type: 'text/yaml' });
    // const url = URL.createObjectURL(blob);
    // const link = document.createElement('a');
    // link.href = url;
    // link.download = 'data.yaml';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // URL.revokeObjectURL(url);
  };

  function onDragEnd(result: any) {
    dropOnColumn(result)
  }

  return (
    <ErrorLog>
      <DragDropContext onDragEnd={onDragEnd}>
        <OnGoingTab
          ref={onGoingTabRef}
          data={data}
          addTask={addTask}
          deleteTask={deleteTask}
          startTask={startTask}
          stopTask={stopTask}
          changeTaskName={changeTaskName}
          updateTaskMardownContent={updateTaskMardownContent}
          changeTaskEstimatedDuration={changeTaskEstimatedDuration}
          changeTaskElapsedDuration={changeTaskElapsedDuration}
          advanceTask={advanceTask}
          delayToNextDay={delayToNextDay}
          downloadTasks={downloadTasks} />
      </DragDropContext>
    </ErrorLog>
  )
}

const ErrorLog = ({ children }: { children: React.ReactNode }) => {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (args[0].includes('Support for defaultProps will be removed')) {
      return;
    }
    originalConsoleError.apply(console, args);
  };

  return children;
};
