import { useState } from "react";
import { EditorContext } from "./editorContext";

interface EditorContextProviderProps {
  children: React.ReactNode
}

enum Mode {
  Create = 'create',
  Update = 'update',
  AddChild = 'add-child'
}

export default function EditorContextProvider({ children }: EditorContextProviderProps) {
  const [id, setId] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [taskName, setTaskName] = useState('');
  const [estimatedDurationHMS, setEstimatedDurationHMS] = useState('');
  const [consumeTimeHMS, setConsumeTimeHMS] = useState('');
  const [parentKey, setParentKey] = useState('');
  const [mode, setMode] = useState<Mode>(Mode.Create)


  const value = {
  }

  return <EditorContext.Provider value={value}>
    {children}
  </EditorContext.Provider>
}
