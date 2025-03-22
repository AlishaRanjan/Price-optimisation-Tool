import React from 'react';
import styled from 'styled-components';

interface SelectProps {
  selectedCategory: string;
  categorylist: string[];
  onChangeHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Select = styled.select`
  padding: 0.5rem;
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.1rem;
  color: #f8fafc;
  min-width: 150px;

  &:focus {
    outline: 2px solid #10b981;
    outline-offset: 2px;
  }
`

const CategorySelect: React.FC<SelectProps> = ({ selectedCategory, categorylist, onChangeHandler }) => {
  return (
    <label style={{ color: '#949494' }}>
      <span>Category :</span>
      <Select value={selectedCategory} onChange={onChangeHandler}>
        {categorylist.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </Select>
    </label>
  );
};

export default CategorySelect;




