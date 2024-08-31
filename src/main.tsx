import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TasksContextProvider from './context/tasksContextProvider.tsx'
import DayContextProvider from './context/dayContextProvider.tsx'
import EditorContextProvider from './context/editorContextProvider.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <TasksContextProvider>
      <DayContextProvider>
        <EditorContextProvider>
          <App />
        </EditorContextProvider>
      </DayContextProvider>
    </TasksContextProvider>
  </QueryClientProvider>
)
