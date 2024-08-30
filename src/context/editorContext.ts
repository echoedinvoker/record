import { createContext } from 'react';

interface EditorContextType {
}

export const EditorContext = createContext<EditorContextType>({} as EditorContextType);
