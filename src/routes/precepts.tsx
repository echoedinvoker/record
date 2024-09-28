import { DragDropContext, Draggable, DraggableProvided, Droppable, DroppableProvided, DropResult } from "react-beautiful-dnd";
import { DroppableArea } from "../components/ui";
import { useState } from "react";

const initialPrecepts = [
  { id: "1", content: "First" },
  { id: "2", content: "Second" },
  { id: "3", content: "Third" },
  { id: "4", content: "Fourth" },
  { id: "5", content: "Fifth" },
];

export default function Precepts() {
  const [precepts, setPrecepts] = useState(initialPrecepts);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(precepts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPrecepts(items);
  };

  const renderDraggable = (precept: { id: string; content: string }, index: number) => (
    <Draggable draggableId={precept.id} index={index} key={precept.id}>
      {(provided: DraggableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {precept.content}
        </div>
      )}
    </Draggable>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="precept-droppable-area">
        {(provided: DroppableProvided = {}) => (
          <DroppableArea
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {precepts.map(renderDraggable)}
            {provided.placeholder}
          </DroppableArea>
        )}
      </Droppable>
    </DragDropContext>
  );
}
