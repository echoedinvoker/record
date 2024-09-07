import { useState } from "react";
import { ModalHopeContext } from "./modalHopeContext";

interface ModalHopeContextProviderProps {
  children: React.ReactNode
}

export default function ModalHopeContextProvider({ children }: ModalHopeContextProviderProps) {
  const [showModal, setShowModal] = useState(false)
  const [hopeName, setHopeName] = useState('');
  const [parentName, setParentName] = useState('');


  function initModal(
    show: boolean = false,
    parentName: string = '',
  ) {
    setHopeName('');
    setParentName(parentName)
    setShowModal(show)
  }

  const value = {
    showModal,
    setShowModal,
    hopeName,
    setHopeName,
    parentName,
    setParentName,
    initModal,
  }

  return (
    <ModalHopeContext.Provider value={value}>
      {children}
    </ModalHopeContext.Provider>
  )
}
