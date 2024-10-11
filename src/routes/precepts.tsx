import { DragDropContext, Droppable, DroppableProvided } from "react-beautiful-dnd";
import { DroppableArea } from "../components/ui";
import { useContext, useState } from "react";
import ThePrecept from "../components/ThePrecept";
import { PreceptsContext } from "../context/preceptsContext";
import { Button } from "antd";
import { Threshold } from "../services/precepts";
import { getUUID } from "../utils/uuid";
import styled from "styled-components";
import AddPreceptModal from "../components/AddPreceptModal";

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
    <>
      <PreceptRootContainer>
        <Button type="primary" onClick={showModal} style={{ marginBottom: '1rem' }}>Add Precept</Button>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="precept-droppable-area">
            {(provided: DroppableProvided) => (
              <DroppableArea
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {precepts.map((precept, index) => (
                  <ThePrecept index={index} key={precept.key} precept={precept} />))}
                {provided.placeholder}
              </DroppableArea>
            )}
          </Droppable>
        </DragDropContext>
      </PreceptRootContainer>
      <AddPreceptModal isVisible={isModalVisible} onClose={handleCancel} onAdd={handleAddPrecept} />
    </>
  );
}

const PreceptRootContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 1em;
    border-radius: 0.5em;
    background-color: rgba(255, 255, 255, 0.5);
    width: 30em;
    margin: 0 auto;
    margin-top: 1em;
  `;

