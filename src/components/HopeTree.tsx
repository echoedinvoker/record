import Tree, { RenderCustomNodeElementFn } from "react-d3-tree";
import { HopeMapValue } from "../types";
import styled from "styled-components";
import { useContext, useRef } from "react";
import { ModalHopeContext } from "../context/modalHopeContext";
import { BookOpen, CircleMinus, CirclePlus } from "lucide-react";
import { HopesContext } from "../context/hopesContext";

interface HopeTreeProps {
  hope: HopeMapValue;
}

export default function HopeTree({ hope }: HopeTreeProps) {
  const treeRef = useRef<Tree>(null);
  const { initModal } = useContext(ModalHopeContext)
  const { deleteHope, selectedHope, selectHope } = useContext(HopesContext)
  const renderCustomNodeElement: RenderCustomNodeElementFn = ({ nodeDatum, toggleNode }: any) => {
    const handleClickCircle = (e: React.MouseEvent<SVGCircleElement, MouseEvent>) => {
      e.stopPropagation();
      toggleNode();
    }

    const handleAddHope = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      initModal(true, nodeDatum.key);
    }

    const handleDeleteHope = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      deleteHope(nodeDatum.key);
    }


    return (
      <>
        <NodeGroup>
          <NodeCircle r={10} onClick={handleClickCircle} $isSelected={selectedHope === nodeDatum.key} />
          <foreignObject x={-50} y={10} width={100} height={120}>
            <NodeInfoContainer onClick={() => selectHope(nodeDatum.key)}>
              <NodeName>{nodeDatum.name}</NodeName>
              {nodeDatum.attributes && (
                <NodeAttributesContainer>
                  {Object.entries(nodeDatum.attributes).map(([key, value]) => (
                    <NodeAttribute key={key}>{`${key}: ${value}`}</NodeAttribute>
                  ))}
                </NodeAttributesContainer>
              )}
              <NodeButtonGroup>
                <NodeButton onClick={handleAddHope}>
                  <CirclePlus size={16} />
                </NodeButton>
                <NodeButton onClick={handleDeleteHope}>
                  <CircleMinus size={16} />
                </NodeButton>
                <NodeButton>
                  <BookOpen size={16} />
                </NodeButton>
              </NodeButtonGroup>
            </NodeInfoContainer>
          </foreignObject>
        </NodeGroup>

      </>
    );
  };

  return (
    <TreeContainer>
      <Tree
        data={hope}
        renderCustomNodeElement={renderCustomNodeElement}
        translate={{ x: 100, y: 100 }}
        ref={treeRef}
      />
    </TreeContainer>
  );
}

const NodeButtonGroup = styled.div`
  display: flex;
  gap: 0.1em;
  `;

const NodeButton = styled.button`
  padding: 1px;
  flex: 1;
  background-color: #f1f1f1;
  color: #333;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #e1e1e1;
  }
  &:active {
    background-color: #d1d1d1;
  }
  `;

const NodeAttributesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1em;
`;

const NodeAttribute = styled.div`
  font-size: 0.8em;
  color: darkgray;
  `;

const NodeName = styled.h3`
  color: #333;
  font-size: 16px;
  font-weight: 600;
`;

const NodeInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1em;
`;

const NodeGroup = styled.g`
  cursor: pointer;
`;

const NodeCircle = styled.circle<{ $isSelected: boolean }>`
  fill: ${props => props.$isSelected ? "#c0c0c0" : "#fff"};
  stroke: #000;
  stroke-width: 1.5px;
`;

const TreeContainer = styled.div`
  background-color: white;
  border-radius: 1em;
  height: 20em;
  `;

