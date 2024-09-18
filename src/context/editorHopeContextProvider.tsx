import { useState } from "react";
import { EditorHopeContext } from "./editorHopeContext";

interface EditorHopeContextProviderProps {
  children: React.ReactNode
}


export default function EditorHopeContextProvider({ children }: EditorHopeContextProviderProps) {
  const [showEditorHope, setShowEditorHope] = useState(false)
  const [inputName, setInputName] = useState('')
  const otherHopes = [
    { key: '1', name: 'Hope 1' },
    { key: '2', name: 'Hope 2' },
    { key: '3', name: 'Hope 3' },
  ]
  const [selectedKey, setSelectedKey] = useState('1')
  const isValid = inputName.length > 0

  const initModal = (showModal = false) => {
    setInputName('')
    setSelectedKey('1')
    setShowEditorHope(showModal)
  }

  const updateHope = () => {
    console.log({ inputName, selectedKey })
  }


  const value = {
    showEditorHope,
    setShowEditorHope,
    inputName,
    setInputName,
    otherHopes,
    selectedKey,
    setSelectedKey,
    initModal,
    isValid,
    updateHope
  }

  return <EditorHopeContext.Provider value={value}>
    {children}
  </EditorHopeContext.Provider>
}
