import { useContext, useState } from "react";
import { EditorHopeContext } from "./editorHopeContext";
import { HopesContext } from "./hopesContext";
import { Hope } from "../types";
import { useMutation } from "@tanstack/react-query";
import { updateHope as updateHopeService } from "../services/hopes";


interface EditorHopeContextProviderProps {
  children: React.ReactNode
}


export default function EditorHopeContextProvider({ children }: EditorHopeContextProviderProps) {
  const mutateHope = useMutation({
    mutationFn: updateHopeService,
  })

  const [showEditorHope, setShowEditorHope] = useState(false)
  const [inputName, setInputName] = useState('')
  const [key, setKey] = useState('')
  const [selectedKey, setSelectedKey] = useState('')
  const { hopes, setHopes } = useContext(HopesContext)
  const otherHopes = hopes
    .map(hope => ({ key: hope.key, name: hope.name }))
    .filter(hope => hope.key !== key)
  const isValid = inputName.length > 0

  const initModal = (showModal = false) => {
    setInputName('')
    setSelectedKey('')
    setShowEditorHope(showModal)
  }

  const updateHope = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isValid) return

    const updatedHope: Partial<Hope> = {
      name: inputName,
      key,
      parentKey: selectedKey ? selectedKey : null,
    }

    setHopes(prevHopes => {
      return prevHopes.map(hope => {
        if (hope.key === key) {
          const newHope = { ...hope, ...updatedHope }
          const updateHopePayload = {
            key: newHope.key,
            name: newHope.name,
            parent_key: newHope.parentKey ? newHope.parentKey : '',
          }
          mutateHope.mutate(updateHopePayload)
          return newHope
        }
        return hope
      })
    })

    initModal(false)
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
    setKey,
  }

  return <EditorHopeContext.Provider value={value}>
    {children}
  </EditorHopeContext.Provider>
}
