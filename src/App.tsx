import { useEffect, useState } from 'react'
import { convertHMStoMilliseconds } from './utils';
import { Data, Done, Task } from './types';
import OnGoingTab from './components/OnGoingTab';
import yaml from 'js-yaml'
import { DragDropContext } from 'react-beautiful-dnd';

export default function App() {

  const [data, setData] = useState<Data | null>(null)

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
  }
  useEffect(() => {
    console.log(data)
  }, [data])

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


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.yaml')
        const text = await response.text()
        const parsedData = yaml.load(text) as Data
        parsedData && setData(parsedData)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  function onDragEnd(result: any) {
    const { destination, source, draggableId } = result
    if (!destination) {
      return
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const column = data!.columns[source.droppableId]
    const newTaskIds = Array.from(column.taskIds)
    newTaskIds.splice(source.index, 1)

    if (destination.droppableId === source.droppableId) {
      dropToTheSameColumn(newTaskIds, source, destination, draggableId, column)
    } else {
      dropToDifferentColumn(newTaskIds, source, destination, draggableId, column)
    }
  }

  function dropToTheSameColumn(newTaskIds: string[], source: any, destination: any, draggableId: string, column: any) {
    newTaskIds.splice(destination.index, 0, draggableId)
    const newColumn = {
      ...column,
      taskIds: newTaskIds
    }
    const newData = {
      ...data!,
      columns: {
        ...data!.columns,
        [source.droppableId]: newColumn
      }
    }
    setData(newData)
  }
  function dropToDifferentColumn(newTaskIds: string[], source: any, destination: any, draggableId: string, column: any) {
    const newColumn = data!.columns[destination.droppableId]
    const newColumnId = newColumn.id
    const newDestinationTaskIds = Array.from(newColumn.taskIds)
    newDestinationTaskIds.splice(destination.index, 0, draggableId)
    const newColumns = {
      ...data!.columns,
      [source.droppableId]: {
        ...column,
        taskIds: newTaskIds
      },
      [destination.droppableId]: {
        ...newColumn,
        taskIds: newDestinationTaskIds
      }
    }

    let newTask = null
    if (newColumnId === "done") {
      newTask = {
        ...data!.tasks[draggableId],
        ts: Date.now(),
        efficiency: data!.tasks[draggableId].estimatedDuration / data!.tasks[draggableId].timestampSum
      } as Done
    } else {
      const { ts, efficiency, ...rest } = data!.tasks[draggableId] as Done
      newTask = rest as Task
    }

    setData({
      ...data!,
      tasks: {
        ...data!.tasks,
        [draggableId]: newTask
      },
      columns: newColumns
    })
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
