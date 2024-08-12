import styled from "styled-components"

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10vh;
  
  @supports not (backdrop-filter: blur(5px)) {
    background-color: rgba(0, 0, 0, 0.7);
  }
`

export const ModalContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.87);
  color: #242424;
  padding: 2.5em;
  border-radius: 0.5em;
  max-width: 45em;
  max-height: 70vh;
  width: 100%;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.5);
  position: relative;
  overflow-y: auto;
`

export const ModalCloseCorner = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.3em;
  `
