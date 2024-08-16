import { useEffect, useState } from 'react'
import { convertHMStoMilliseconds } from './utils';
import { Data } from './types';
import OnGoingTab from './components/OnGoingTab';
import yaml from 'js-yaml'
import { DragDropContext } from 'react-beautiful-dnd';

export default function App() {

  const [data, setData] = useState<Data | null>(null)
  const tasks = data?.tasks || []

  function addTask(
    task: string,
    estimatedDurationHMS: string,
    markdownText: string,
    columnId: string
  ) {
    const newId = crypto.randomUUID()
    const newTask = {
      id: newId,
      task: task,
      status: 'pending',
      estimatedDuration: convertHMStoMilliseconds(estimatedDurationHMS),
      timestamp: null,
      timestampSum: 0,
      markdownContent: markdownText,
    }
    setData({
      ...data!,
      tasks: {
        ...data!.tasks,
        [newId]: newTask
      },
      columns: {
        ...data!.columns,
        [columnId]: {
          ...data!.columns[columnId],
          taskIds: [...data!.columns[columnId].taskIds, newId]
        }
      }
    })
  }
  function deleteTask(taskId: string, columnId: string): void {
    console.log("deleteTask", taskId)
    if (!data || !data.tasks) {
      throw new Error("Data or tasks are undefined");
    }
    const { [taskId]: _, ...rest } = data.tasks
    setData({
      ...data,
      tasks: rest,
      columns: {
        ...data.columns,
        [columnId]: {
          ...data.columns[columnId],
          taskIds: data.columns[columnId].taskIds.filter(id => id !== taskId)
        }
      }
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
    setData({
      ...data!,
      tasks: {
        ...data.tasks,
        [taskId]: {
          ...data.tasks[taskId],
          timestampSum: data.tasks[taskId].timestampSum + (Date.now() - data.tasks[taskId].timestamp!),
          timestamp: null,
        }
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
    setData({
      ...data!,
      tasks: {
        ...data.tasks,
        [taskId]: {
          ...data.tasks[taskId],
          estimatedDuration: convertHMStoMilliseconds(elapsedDurationHMS)
        }
      }
    })
  }
  function changeTaskElapsedDuration(taskId: string, elapsedDurationHMS: string) {
    console.log("changeTaskElapsedDuration", taskId, elapsedDurationHMS)
    if (!data || !data.tasks) {
      throw new Error("Data or tasks are undefined");
    }
    setData({
      ...data!,
      tasks: {
        ...data.tasks,
        [taskId]: {
          ...data.tasks[taskId],
          timestampSum: convertHMStoMilliseconds(elapsedDurationHMS)
        }
      }
    })
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
    const yamlStr = yaml.dump(tasks)
    const blob = new Blob([yamlStr], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.yaml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.yaml')
        const text = await response.text()
        const parsedData = yaml.load(text)
        parsedData && setData(parsedData)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  function onDragEnd(result: any) {
    console.log(result)
  }

  return (
    <ErrorLog>
      <DragDropContext onDragEnd={onDragEnd}>
        <OnGoingTab
          data={data}
          addTask={addTask}
          deleteTask={deleteTask}
          startTask={startTask}
          stopTask={stopTask}
          changeTaskName={changeTaskName}
          updateTaskMardownContent={updateTaskMardownContent}
          changeTaskEstimatedDuration={changeTaskEstimatedDuration}
          changeTaskElapsedDuration={changeTaskElapsedDuration}
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
