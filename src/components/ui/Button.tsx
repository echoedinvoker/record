import styled from "styled-components"

const BaseButton = styled.button<{
  $primary?: boolean,
  $ghost?: boolean,
  $counter?: boolean,
  $counterSecondary?: boolean
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: ${(props) => (props.$primary || props.$ghost || props.$counter) ?
    'none' : props.$counterSecondary ? '2px solid #242424' :
      '2px solid rgba(255, 255, 255, 0.87)'};
  border-radius: 50%;
  background-color: ${(props) => props.$primary ? 'rgba(255, 255, 255, 0.87)' :
    props.$counter ? '#242424' : 'transparent'};
  color: ${(props) => (props.$primary || props.$ghost) ? '#242424' :
    props.$counter ? 'rgba(255, 255, 255, 0.87)' :
      props.$counterSecondary ? '#242424' :
        'rgba(255, 255, 255, 0.87)'};
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.$primary ? 'rgba(255, 255, 255, 1)' : props.$counter ? '#000' : props.$ghost ? 'transparent' : '#f0f0f0'};
    color: ${(props) => (props.$primary || props.$ghost) ? '#000' : props.$counter ? '#fff' :
    props.$counterSecondary ? '#000' :
      '#242424'};
    border-color: ${(props) => (props.$primary || props.$ghost || props.$counter) ? 'none' :
    props.$counterSecondary ? '#000' :
      'rgba(255, 255, 255, 0.87)'};
  }
  &:active {
    background-color: ${(props) => props.$primary ? 'rgba(255, 255, 255, 0.87)' :
    props.$counter ? '#000' : props.$ghost ? 'transparent' : '#e0e0e0'};
    borderColor: ${(props) => (props.$primary || props.$ghost || props.$counter) ? 'none' : 'rgba(255, 255, 255, 0.87)'};
  }
  &:disabled {
    background-color: #f0f0f0;
    color: #a0a0a0;
    border-color: #f0f0f0;
    cursor: not-allowed;
      }
  `
export const CircleButton = styled(BaseButton)`
  height: 2.5em;
  width: 2.5em;
  `

export const TextButton = styled(BaseButton) <{ $paddingMultiplier?: number }>`
  padding: ${(props) => props.$paddingMultiplier ? props.$paddingMultiplier * 0.5 : 0.5}em ${(props) => props.$paddingMultiplier ? props.$paddingMultiplier * 1 : 1}em;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 0.5em;
`

export const ContentWrapper = styled.span<{ $size?: string, $weight?: string, $offsetX?: string, $offsetY?: string, $color?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${(props) => props.$size || '1em'};
  font-weight: ${(props) => props.$weight || 'normal'};
  margin-left: ${(props) => props.$offsetX || '0'};
  margin-top: ${(props) => props.$offsetY || '0'};
  ${props => props.$color && `color: ${props.$color};`}
`
