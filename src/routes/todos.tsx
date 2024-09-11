import { useContext, useRef } from 'react'
import OnGoingTab, { OnGoingTabRef } from '../components/OnGoingTab';
import { DragDropContext } from 'react-beautiful-dnd';
import { useTasks } from '../hooks/useTasks';
import { TasksContext } from '../context/tasksContext';
import EditorTask from '../components/EditorTask';
import { EditorContext } from '../context/editorContext';

export default function Todos() {

  const onGoingTabRef = useRef<OnGoingTabRef>(null);

  const { onDragEnd } = useContext(TasksContext)
  const { isEditing } = useContext(EditorContext)
  const { isLoading, error } = useTasks()

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <ErrorLog>
      <DragDropContext onDragEnd={onDragEnd}>
        <OnGoingTab ref={onGoingTabRef} />
      </DragDropContext>
      {isEditing && <EditorTask />}
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
