import { createContext } from 'react';

interface ModalHopeContextType {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  hopeName: string
  setHopeName: React.Dispatch<React.SetStateAction<string>>
  parentKey: string
  setParentKey: React.Dispatch<React.SetStateAction<string>>
  initModal: (show?: boolean, parentName?: string) => void
}

export const ModalHopeContext = createContext<ModalHopeContextType>({} as ModalHopeContextType)
