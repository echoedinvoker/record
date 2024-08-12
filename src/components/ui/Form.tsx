import styled from "styled-components"

export const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2em;
`

export const FormField = styled.div`
  display: flex;
  gap: .5em;
`

export const Label = styled.label`
  border: 2px solid #242424;
  border-radius: 0.2em;
  letter-spacing: 1px;
  font-weight: bold;
  text-transform: uppercase;
  padding: .5px 5px;
`

export const InputWrapper = styled.div<{ $white?: boolean }>`
  display: flex;
  align-items: flex-end;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: 1px;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: ${(props) => props.$white ? '#fff' : '#242424'};
  }
`

export const Input = styled.input<{ $white?: boolean }>`
  font-size: 1em;
  border: none;
  background-color: transparent;
  color: ${(props) => props.$white ? '#fff' : '#242424'};
  margin-bottom: 0.1em;
  &:focus {
    outline: none;
  }
`
