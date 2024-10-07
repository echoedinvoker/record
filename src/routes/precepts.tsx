import { DragDropContext, Droppable, DroppableProvided } from "react-beautiful-dnd";
import { DroppableArea } from "../components/ui";
import { useContext, useState } from "react";
import ThePrecept from "../components/ThePrecept";
import { PreceptsContext } from "../context/preceptsContext";
import AddPreceptModal from "../components/AddPreceptModal";
import { Button } from "antd";
import { Threshold } from "../services/precepts";
import { getUUID } from "../utils/uuid";

const containerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'flex-start',
  alignItems: 'center',
  minHeight: '100vh',
  padding: '2rem 0',
};

export default function Precepts() {
  const { precepts, onDragEnd, addPrecept } = useContext(PreceptsContext);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddPrecept = (name: string, baseMultiplier: number, thresholds: Threshold[], hopeKey: string) => {
    const precept = {
      name,
      baseMultiplier,
      thresholds,
      hopeKey,
      key: getUUID(),
      startEndTimes: [],
    };

    addPrecept(precept)
  };

  return (
    <div style={containerStyle}>
      <Button type="primary" onClick={showModal} style={{ marginBottom: '1rem' }}>
        新增 Precept
      </Button>
      <AddPreceptModal
        isVisible={isModalVisible}
        onClose={handleCancel}
        onAdd={handleAddPrecept}
      />
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
