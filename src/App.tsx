import { useEffect, useState } from 'react'
import { convertHMStoMilliseconds } from './utils';
import { Task } from './types';
import OnGoingTab from './components/OnGoingTab';
import yaml from 'js-yaml'

export default function App() {

  const [tasks, setTasks] = useState<Map<number, Task>>(new Map())

  const notDoneTasks = new Map(Array.from(tasks.values()).filter(task => task.status !== 'done').map(task => [task.id, task])) // O(n)

  function addTask(task: string, estimatedDurationHMS: string, markdownText: string) {
    const newTask = {
      id: Array.from(tasks.keys()).reduce((max, key) => Math.max(max, key), 0) + 1,
      task: task,
      status: 'pending',
      estimatedDuration: convertHMStoMilliseconds(estimatedDurationHMS),
      timestamp: null,
      timestampSum: 0,
      markdownContent: markdownText,
      priority: Array.from(tasks.values()).reduce((max, task) => Math.max(max, task.priority), 0) + 1
    }
    setTasks(new Map([...tasks, [newTask.id, newTask]]))
  }
  function deleteTask(id: number) {
    setTasks((prevTasks) => {
      const newTasks = new Map(prevTasks)
      newTasks.delete(id)
      return newTasks
    })
  }
  function startTask(id: number) {
    setTasks((prevTasks) => {
      const newTasks = new Map(prevTasks)
      const task = newTasks.get(id)
      if (!task) return prevTasks
      if (task.timestamp !== null) {
        task.timestampSum += Date.now() - task.timestamp
        task.timestamp = null
      }
      task.timestamp = Date.now()
      task.status = 'in progress'
      return newTasks
    })
  }
  function stopTask(id: number) {
    setTasks((prevTasks) => {
      const newTasks = new Map(prevTasks)
      const task = newTasks.get(id)
      if (!task || task.timestamp === null) return prevTasks
      task.timestampSum += Date.now() - task.timestamp
      task.timestamp = null
      task.status = 'done'
      return newTasks
    })
  }
  function changeTaskName(id: number, name: string) {
    setTasks((prevTasks) => {
      const newTasks = new Map(prevTasks)
      const task = newTasks.get(id)
      if (!task) return prevTasks
      task.task = name
      return newTasks
    })
  }
  function updateTaskMardownContent(id: number, content: string) {
    setTasks((prevTasks) => {
      const newTasks = new Map(prevTasks)
      const task = newTasks.get(id)
      if (!task) return prevTasks
      task.markdownContent = content
      return newTasks
    })
  }
  function changeTaskElapsedDuration(id: number, elapsedDurationHMS: string) {
    setTasks((prevTasks) => {
      const newTasks = new Map(prevTasks)
      const task = newTasks.get(id)
      if (!task) return prevTasks
      task.estimatedDuration = convertHMStoMilliseconds(elapsedDurationHMS)
      return newTasks
    })
  }
  function downloadTasks() {
    const yamlStr = yaml.dump(Array.from(tasks.values()))
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
        setTasks(new Map(parsedData.map((task: Task) => [task.id, task])))
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <OnGoingTab tasks={notDoneTasks} addTask={addTask} deleteTask={deleteTask} startTask={startTask} stopTask={stopTask} changeTaskName={changeTaskName} updateTaskMardownContent={updateTaskMardownContent} changeTaskElapsedDuration={changeTaskElapsedDuration} downloadTasks={downloadTasks} />
    </>
  )
}

