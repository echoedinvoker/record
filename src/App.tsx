import { useContext, useEffect, useRef, useState } from 'react'
import OnGoingTab, { OnGoingTabRef } from './components/OnGoingTab';
import { DragDropContext } from 'react-beautiful-dnd';
import { useTasks } from './hooks/useTasks';
import { TasksContext } from './context/tasksContext';

export default function App() {

  const onGoingTabRef = useRef<OnGoingTabRef>(null);

  const { data, onDragEnd, setData } = useContext(TasksContext)
  const { isLoading, error, data: fetchedData } = useTasks()
  const [isFirst, setIsFirst] = useState(true)

  useEffect(() => {
    if (isFirst && fetchedData) {
      setIsFirst(false)
      setData(fetchedData)
    }
  }, [fetchedData])

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <ErrorLog>
      <button onClick={() => console.log(data)}>TEST</button>
      <DragDropContext onDragEnd={onDragEnd}>
        <OnGoingTab ref={onGoingTabRef} />
      </DragDropContext>
    </ErrorLog>
  )
}

const ErrorLog = ({ children }: { children: React.ReactNode }) => {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (args[0].includes('Support for defaultProps will be removed')) {
      return;
    }
    originalConsoleError.apply(console, args);
  };

  return children;
};
