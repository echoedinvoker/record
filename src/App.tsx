import { useEffect, useState } from 'react'
import { convertHMStoMilliseconds } from './utils';
import { Task } from './types';
import OnGoingTab from './components/OnGoingTab';
import yaml from 'js-yaml'

export default function App() {

  const [tasks, setTasks] = useState<Task[]>([])

  const notDoneTasks = tasks.filter(task => task.status !== 'done')

  function addTask(task: string, estimatedDurationHMS: string, markdownText: string) {
    const newTask = {
      id: tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1,
      task: task,
      status: 'pending',
      estimatedDuration: convertHMStoMilliseconds(estimatedDurationHMS),
      timestamp: null,
      timestampSum: 0,
      markdownContent: markdownText,
      priority: tasks.reduce((max, task) => Math.max(max, task.priority), 0) + 1
    }
    setTasks([...tasks, newTask])
  }
  function deleteTask(id: number): void {
    setTasks((prevTasks) => prevTasks.filter(task => task.id !== id))
  }
  function startTask(id: number) {
    setTasks((prevTasks) => prevTasks.map(task => task.id === id ? { ...task, timestamp: Date.now(), status: 'in progress' } : task))
  }
  function stopTask(id: number) {
    setTasks((prevTasks) => prevTasks.map(task => task.id === id ? { ...task, timestampSum: task.timestampSum + (Date.now() - task.timestamp!), timestamp: null, status: 'done' } : task))
  }
  function changeTaskName(id: number, name: string) {
    setTasks((prevTasks) => prevTasks.map(task => task.id === id ? { ...task, task: name } : task))
  }
  function updateTaskMardownContent(id: number, content: string) {
    setTasks((prevTasks) => prevTasks.map(task => task.id === id ? { ...task, markdownContent: content } : task))
  }
  function changeTaskElapsedDuration(id: number, elapsedDurationHMS: string) {
    setTasks((prevTasks) => prevTasks.map(task => task.id === id ? { ...task, estimatedDuration: convertHMStoMilliseconds(elapsedDurationHMS) } : task))
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
    if (tasks.some(task => task.status === 'in progress')) downloadTasks()
  }, [tasks])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.yaml')
        const text = await response.text()
        const parsedData = yaml.load(text)
        parsedData && setTasks(parsedData)
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

