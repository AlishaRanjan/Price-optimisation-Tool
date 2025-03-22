import styled from 'styled-components'

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'disable' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.1rem;
  outline: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: #01E0B5;
          &:hover { background-color: #01E0B5; }
        `
      case 'secondary':
        return `
          background-color: transparent;
          border: 1px solid #374151;
          color: #f8fafc;
          &:hover { background-color: #1f2937; }
        `
      case 'danger':
        return `
          color: #ef4444;
          &:hover { background-color: #1f2937; }
        `
      case 'outline':
        return `
          background-color: transparent;
          border: 1px solid #333;
          color: #f8fafc;
          &:hover { border: 1px solid #01E0B5; }
        `
      case 'disable':
        return `
          background-color: #01E0B5;
          opacity: 0.5;
          cursor: default;
        `
      default:
        return `
          background-color: #01E0B5;
          &:hover { background-color: #01E0B5; }
        `
    }
  }}
`

