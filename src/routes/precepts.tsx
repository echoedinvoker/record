import { DragDropContext, Draggable, DraggableProvided, Droppable, DroppableProvided, DropResult } from "react-beautiful-dnd";
import { DroppableArea } from "../components/ui";
import { useState } from "react";

export default function Precepts() {
  const [precepts, setprecepts] = useState([
    { id: "1", content: "First" },
    { id: "2", content: "Second" },
    { id: "3", content: "Third" },
    { id: "4", content: "Fourth" },
    { id: "5", content: "Fifth" },
  ]);
  function onDragEnd(result: DropResult) {
    console.log(result);
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="precept-droppable-area">
        {(provided: DroppableProvided) => (
          <DroppableArea
            ref={(element) => {
              provided.innerRef(element);
            }}
            {...provided.droppableProps}
          >
            {precepts.map((precent, index) => (
              <Draggable draggableId={precent.id} index={index} key={precent.id}>
                {(provided: DraggableProvided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {precent.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </DroppableArea>
        )}
      </Droppable>
    </DragDropContext>
  );
}
