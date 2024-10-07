import { DragDropContext, Droppable, DroppableProvided } from "react-beautiful-dnd";
import { DroppableArea } from "../components/ui";
import { useContext } from "react";
import ThePrecept from "../components/ThePrecept";
import { PreceptsContext } from "../context/preceptsContext";

const containerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'flex-start',
  alignItems: 'center',
  minHeight: '100vh',
  padding: '2rem 0',
};

const buttonStyle = {
  marginBottom: '1rem',
  padding: '0.5rem 1rem',
  fontSize: '1rem',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default function Precepts() {
  const { precepts, onDragEnd, addPrecept } = useContext(PreceptsContext);

  const handleAddPrecept = () => {
    addPrecept({
      name: "New Precept",
      baseMultiplier: 1,
      thresholds: [],
      hopeKey: "",
    });
  };

  return (
    <div style={containerStyle}>
      <button style={buttonStyle} onClick={handleAddPrecept}>
        新增 Precept
      </button>
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
