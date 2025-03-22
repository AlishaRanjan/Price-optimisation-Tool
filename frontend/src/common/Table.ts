import styled from 'styled-components'

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: small;
`

export const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: bold;
  color: #f8fafc;
  background-color: #1b1b1b;
  border-right: 1px solid rgb(58, 58, 58);
  position: sticky; top: 0; 
`

export const TableCell = styled.td`
  padding: 0.75rem;
  border-right: 1px solid rgb(134, 134, 134);
`

export const TableRow = styled.tr`
  color:rgb(37, 37, 37);
  /* Alternate row colors using nth-child */
  &:nth-child(even) {
    background-color: white;
  }

  &:nth-child(odd) {
    background-color: #F2F2F2;
  }
  
  &:hover {
    background-color:rgb(226, 226, 226);
  }
`

