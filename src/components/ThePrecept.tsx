import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import { Precept } from "../services/precepts";

interface Props {
  precept: Precept
  index: number;
}

export default function ThePrecept({ index, precept }: Props) {
  return (
    <>
      <Draggable draggableId={precept.key} index={index}>
        {(provided: DraggableProvided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {precept.name}
          </div>
        )}
      </Draggable>
    </>
  );
}
