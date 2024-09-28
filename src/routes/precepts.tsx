import { DragDropContext, Droppable, DroppableProvided, DropResult } from "react-beautiful-dnd";
import { DroppableArea } from "../components/ui";
import { useState } from "react";
import ThePrecept from "../components/ThePrecept";

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  minHeight: '100vh',
  padding: '2rem 0',
};

export default function Precepts() {
  const [precepts, setPrecepts] = useState([
    { id: "1", content: "First" },
    { id: "2", content: "Second" },
    { id: "3", content: "Third" },
    { id: "4", content: "Fourth" },
    { id: "5", content: "Fifth" },
  ]);

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    const items = Array.from(precepts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPrecepts(items);
  }

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
                  key={precept.id}
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
