import { useContext } from "react";
import { HopesContext } from "../context/hopesContext";
import styled from "styled-components"
import { Precept } from "../services/precepts";

interface ThePreceptContentsProps {
  precept: Precept;
  currentThreshold: any;
}

export default function ThePreceptContents({ precept, currentThreshold }: ThePreceptContentsProps) {
  const { hopes } = useContext(HopesContext)
  const connectedHope = hopes.find(hope => hope.key === precept.hopeKey);

  return (
    <Contents>
      <Title>{precept.name}</Title>
      <Properties>
        <Property>Cur. Threshold: {`${`${currentThreshold.thresholdNumber} ${currentThreshold.unit}`}`}</Property>
        <Property>Cur. Multiplier: {currentThreshold.multiplier}</Property>
      </Properties>
      <Properties>
        <Property>To Hope:</Property>
        <Property>{connectedHope?.name}</Property>
      </Properties>
    </Contents>
  )
}

const Contents = styled.div`
  width: 100%;
  margin-top: 1.2em;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1em;
  `

const Properties = styled.div`
  flex: 2.5;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  `

const Title = styled.h3`
  flex: 1;
  font-size: 1.5em;
  font-weight: bold;
`

const Property = styled.p`
font - size: 1em;
`
