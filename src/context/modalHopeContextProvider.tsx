import { useState } from "react";
import { ModalHopeContext } from "./modalHopeContext";

interface ModalHopeContextProviderProps {
  children: React.ReactNode
}

export default function ModalHopeContextProvider({ children }: ModalHopeContextProviderProps) {
  const [showModal, setShowModal] = useState(false)
  const [hopeName, setHopeName] = useState('');
  const [parentKey, setParentKey] = useState('')


  function initModal(
    show: boolean = false,
    parentKey: string = '',
  ) {
    setHopeName('');
    setParentKey(parentKey)
    setShowModal(show)
  }

  const value = {
    showModal,
    setShowModal,
    hopeName,
    setHopeName,
    initModal,
    parentKey,
    setParentKey
  }

  return (
    <ModalHopeContext.Provider value={value}>
      {children}
    </ModalHopeContext.Provider>
  )
}
