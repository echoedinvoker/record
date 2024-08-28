import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TasksContextProvider from './context/tasksContextProvider.tsx'
import DayContextProvider from './context/dayContextProvider.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <TasksContextProvider>
      <DayContextProvider>
        <App />
      </DayContextProvider>
    </TasksContextProvider>
  </QueryClientProvider>
)
