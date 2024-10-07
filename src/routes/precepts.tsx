import { DragDropContext, Droppable, DroppableProvided } from "react-beautiful-dnd";
import { DroppableArea } from "../components/ui";
import { useContext } from "react";
import ThePrecept from "../components/ThePrecept";
import { PreceptsContext } from "../context/preceptsContext";

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  minHeight: '100vh',
  padding: '2rem 0',
};

export default function Precepts() {
  const { precepts, onDragEnd } = useContext(PreceptsContext);

  return (
    <div style={containerStyle}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="precept-droppable-area">
          {(provided: DroppableProvided) => (
            <DroppableArea
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {precepts.map((precept, index) => (
                <ThePrecept
                  index={index}
                  key={precept.key}
                  precept={precept}
                />
              ))}
              {provided.placeholder}
            </DroppableArea>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
