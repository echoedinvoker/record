import { useContext, useRef, useState } from "react";
import Tree, { RenderCustomNodeElementFn } from "react-d3-tree";
import { HopeMapValue } from "../types";
import styled from "styled-components";
import { ModalHopeContext } from "../context/modalHopeContext";
import { BookOpen, CircleMinus, CirclePlus } from "lucide-react";
import { HopesContext } from "../context/hopesContext";
import { EditorHopeContext } from "../context/editorHopeContext";
import { convertMillisecondsToHMS, getHMSNumbersFromMilliseconds } from "../utils";

interface HopeTreeProps {
  hope: HopeMapValue;
}

export default function HopeTree({ hope }: HopeTreeProps) {
  const treeRef = useRef<Tree>(null);
  const { initModal } = useContext(ModalHopeContext)
  const { deleteHope, selectedHope, selectHope } = useContext(HopesContext)
  const {
    setKey,
    setInputName,
    setSelectedKey,
    setShowEditorHope } = useContext(EditorHopeContext)

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const renderCustomNodeElement: RenderCustomNodeElementFn = ({ nodeDatum, toggleNode }: any) => {
    const handleMouseEnter = () => setHoveredNode(nodeDatum.key);
    const handleMouseLeave = () => setHoveredNode(null);

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

    const handleShowModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      setInputName(nodeDatum.name)
      setKey(nodeDatum.key)
      setSelectedKey(nodeDatum.parentKey ?? "")
      setShowEditorHope(true)
    }

    const toggleSelectHope = (hopeKey: string) => {
      if (selectedHope === hopeKey) {
        selectHope("");
      } else {
        selectHope(hopeKey);
      }
    }

    const estimatedDuration = nodeDatum.attributes?.estimatedDurationSum || 0;
    const { hours } = getHMSNumbersFromMilliseconds(estimatedDuration);
    const radius = Math.max(10, Math.min(30, 10 + hours));

    return (
      <>
        <NodeGroup>
          <g
            onClick={handleClickCircle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <NodeCircle
              r={radius}
              $isSelected={selectedHope === nodeDatum.key}
            />
            <NodeCircleText
              x="0"
              y="0"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={`${radius * 0.8}px`}
            >
              {hours}
            </NodeCircleText>
          </g>
          <foreignObject
            x={-60}
            y={radius + 10}
            width={130}
            height={150}
          >
            <NodeInfoContainer
              $isSelected={hoveredNode === nodeDatum.key}
              onClick={() => toggleSelectHope(nodeDatum.key)}
            >
              <NodeName>{nodeDatum.name}</NodeName>
              {nodeDatum.attributes && hoveredNode === nodeDatum.key && (
                <NodeAttributesContainer>
                  {Object.entries(nodeDatum.attributes)
                    .filter(([_, value]) => !!value)
                    .map(([key, value]) => (
                      <NodeAttribute key={key}>{`${key === 'taskNumber' ? key :
                        key === 'estimatedDurationSum' ? 'estimate' :
                          key === 'timestampSum' ? 'actual' : key
                        }: ${key === 'taskNumber' ? value :
                          key === 'estimatedDurationSum' ? convertMillisecondsToHMS(value as number) :
                            key === 'timestampSum' ? convertMillisecondsToHMS(value as number) : value
                        }`}</NodeAttribute>
                    ))}
                </NodeAttributesContainer>
              )}
              {!(hoveredNode === nodeDatum.key) && (
                <NodeButtonGroup>
                  <NodeButton onClick={handleAddHope}>
                    <CirclePlus size={16} />
                  </NodeButton>
                  <NodeButton onClick={handleDeleteHope}>
                    <CircleMinus size={16} />
                  </NodeButton>
                  <NodeButton onClick={handleShowModal}>
                    <BookOpen size={16} />
                  </NodeButton>
                </NodeButtonGroup>
              )}
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
        translate={{ x: 80, y: 80 }}
        ref={treeRef}
        separation={{ siblings: 1, nonSiblings: 1.5 }}
        nodeSize={{ x: 150, y: 150 }}
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
  z-index: 1;
`;

const NodeAttribute = styled.div`
  font-size: 0.8em;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const NodeName = styled.h3`
  color: #333;
  font-size: 16px;
  font-weight: 600;
`;

const NodeInfoContainer = styled.div<{ $isSelected?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1em;
  max-height: 140px;
  overflow-y: auto;
  background-color: ${props => props.$isSelected ? "white" : "transparent"};
  border-radius: ${props => props.$isSelected ? "0.5em" : "0"};
  border: ${props => props.$isSelected ? "1px solid #000" : "0"};
  padding: ${props => props.$isSelected ? "1px 5px 10px 5px" : "0"};
`;

const NodeGroup = styled.g`
  cursor: pointer;
`;

const NodeCircle = styled.circle<{ $isSelected: boolean }>`
  fill: ${props => props.$isSelected ? "#c0c0c0" : "#fff"};
  stroke: #000;
  stroke-width: 1.5px;
`;

const NodeCircleText = styled.text`
  pointer-events: none;
  user-select: none;
  font-weight: bold;
`;

const TreeContainer = styled.div`
  flex: 1;
  background-color: white;
  border-radius: 1em;
  position: relative;
  overflow: hidden;
  height: 100%;
`;
