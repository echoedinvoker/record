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
  const { deleteHope } = useContext(HopesContext)
  const renderCustomNodeElement: RenderCustomNodeElementFn = ({ nodeDatum, toggleNode }) => {

    const handleClickCircle = (e: React.MouseEvent<SVGCircleElement, MouseEvent>) => {
      e.stopPropagation();
      toggleNode();
    }


    return (
      <>
        <NodeGroup>
          <NodeCircle r={10} onClick={handleClickCircle} />
          <foreignObject x={-50} y={10} width={100} height={120}>
            <NodeInfoContainer>
              <NodeName>{nodeDatum.name}</NodeName>
              {nodeDatum.attributes && (
                <NodeAttributesContainer>
                  {Object.entries(nodeDatum.attributes).map(([key, value]) => (
                    <NodeAttribute key={key}>{`${key}: ${value}`}</NodeAttribute>
                  ))}
                </NodeAttributesContainer>
              )}
              <NodeButtonGroup>
                <NodeButton onClick={() => initModal(true, nodeDatum.name)}>
                  <CirclePlus size={16} />
                </NodeButton>
                <NodeButton onClick={() => deleteHope(nodeDatum.name)}>
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

const NodeCircle = styled.circle`
  fill: #fff;
  stroke: #000;
  stroke-width: 1.5px;
`;

const TreeContainer = styled.div`
  background-color: white;
  margin-top: 2em;
  border-radius: 1em;
  height: 20em;
  `;

