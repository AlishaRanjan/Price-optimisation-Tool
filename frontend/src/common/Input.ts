import styled from "styled-components";

export const Input = styled.input<{ width?: string }>`
  width: ${props => props.width ? props.width : "auto"};
  padding: 0.5rem 2.5rem;
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.1rem;
  color: #f8fafc;

  &:focus {
    outline: 2px solid #10b981;
    outline-offset: 2px;
  }
`