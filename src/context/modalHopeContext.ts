import { createContext } from 'react';

interface ModalHopeContextType {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  hopeName: string
  setHopeName: React.Dispatch<React.SetStateAction<string>>
  parentName: string
  setParentName: React.Dispatch<React.SetStateAction<string>>
  initModal: (show?: boolean, parentName?: string) => void
}

export const ModalHopeContext = createContext<ModalHopeContextType>({} as ModalHopeContextType)
