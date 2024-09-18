import React, { createContext } from 'react';

interface EditorHopeContextType {
  showEditorHope: boolean;
  setShowEditorHope: React.Dispatch<React.SetStateAction<boolean>>;
  inputName: string;
  setInputName: React.Dispatch<React.SetStateAction<string>>;
  otherHopes: { key: string; name: string }[];
  selectedKey: string;
  setSelectedKey: React.Dispatch<React.SetStateAction<string>>;
  initModal: (showModal?: boolean) => void;
  isValid: boolean;
  updateHope: (e: React.FormEvent<HTMLFormElement>) => void;
  key: string;
  setKey: React.Dispatch<React.SetStateAction<string>>;
}

export const EditorHopeContext = createContext<EditorHopeContextType>({} as EditorHopeContextType);
