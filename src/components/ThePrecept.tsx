import { Draggable, DraggableProvided } from "react-beautiful-dnd";

interface Props {
  precept: { id: string; content: string };
  index: number;
}

export default function ThePrecept({ index, precept }: Props) {
  return (
    <>
      <Draggable draggableId={precept.id} index={index}>
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
    </>
  );
}
