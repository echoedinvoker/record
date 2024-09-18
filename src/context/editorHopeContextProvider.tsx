import { useContext, useState } from "react";
import { EditorHopeContext } from "./editorHopeContext";
import { HopesContext } from "./hopesContext";

interface EditorHopeContextProviderProps {
  children: React.ReactNode
}


export default function EditorHopeContextProvider({ children }: EditorHopeContextProviderProps) {
  const [showEditorHope, setShowEditorHope] = useState(false)
  const [inputName, setInputName] = useState('')
  const [key, setKey] = useState('')
  const [selectedKey, setSelectedKey] = useState('')
  const { hopes } = useContext(HopesContext)
  const otherHopes = hopes
    .map(hope => ({ key: hope.key, name: hope.name }))
    .filter(hope => hope.key !== key)
  const isValid = inputName.length > 0

  const initModal = (showModal = false) => {
    setInputName('')
    setSelectedKey('')
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
    updateHope,
    key,
    setKey
  }

  return <EditorHopeContext.Provider value={value}>
    {children}
  </EditorHopeContext.Provider>
}
