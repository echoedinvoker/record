import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TasksContextProvider from './context/tasksContextProvider.tsx'
import DayContextProvider from './context/dayContextProvider.tsx'
import EditorContextProvider from './context/editorContextProvider.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from "./routes/root.tsx"
import Todos from "./routes/todos.tsx"
import Hopes from "./routes/hopes.tsx"
import HopesContextProvider from './context/hopesContextProvider.tsx'
import ModalHopeContextProvider from './context/modalHopeContextProvider.tsx'
import EditorHopeContextProvider from './context/editorHopeContextProvider.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/todos",
        element: <Todos />,
      },
      {
        path: "/hopes",
        element: <Hopes />,
      },
    ]
  },
]);

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <EditorHopeContextProvider>
      <TasksContextProvider>
        <HopesContextProvider>
          <DayContextProvider>
            <EditorContextProvider>
              <ModalHopeContextProvider>
                <RouterProvider router={router} />
              </ModalHopeContextProvider>
            </EditorContextProvider>
          </DayContextProvider>
        </HopesContextProvider>
      </TasksContextProvider>
    </EditorHopeContextProvider>
  </QueryClientProvider>
)
