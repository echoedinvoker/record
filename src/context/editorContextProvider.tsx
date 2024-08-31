import { useContext, useState } from "react";
import { EditorContext, Mode } from "./editorContext";
import { TasksContext } from "./tasksContext";
import { DayContext } from "./dayContext";

interface EditorContextProviderProps {
  children: React.ReactNode
}


export default function EditorContextProvider({ children }: EditorContextProviderProps) {
  const [id, setId] = useState(0)
  const [isEditing, setIsEditing] = useState(true)
  const [taskName, setTaskName] = useState('');
  const [estimatedDurationHMS, setEstimatedDurationHMS] = useState('');
  const [consumeTimeHMS, setConsumeTimeHMS] = useState('');
  const [markdownText, setMarkdownText] = useState('');
  const [parentKey, setParentKey] = useState('');
  const [mode, setMode] = useState<Mode>(Mode.Create)

  const { addTask } = useContext(TasksContext)
  const { day } = useContext(DayContext)

  const setValues = (parentKey: string = '') => {
    setId(0)
    setTaskName('')
    setEstimatedDurationHMS('')
    setConsumeTimeHMS('')
    setMarkdownText('')
    setParentKey(parentKey)
    setMode(parentKey ? Mode.AddChild : Mode.Create)
  }

  const closeEditor = () => {
    setIsEditing(false)
    setValues()
  }

  const addTaskEditor = () => {
    addTask(taskName, estimatedDurationHMS, markdownText, day)
    closeEditor()
  }

  const startCreateTask = () => {
    setValues()
    setIsEditing(true)
  }



  const value = {
    id, setId,
    isEditing, setIsEditing,
    taskName, setTaskName,
    estimatedDurationHMS, setEstimatedDurationHMS,
    consumeTimeHMS, setConsumeTimeHMS,
    markdownText, setMarkdownText,
    parentKey, setParentKey,
    mode, setMode,
    setValues,
    closeEditor,
    addTaskEditor,
    startCreateTask
  }

  return <EditorContext.Provider value={value}>
    {children}
  </EditorContext.Provider>
}
