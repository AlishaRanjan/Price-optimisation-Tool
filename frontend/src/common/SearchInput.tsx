import React from 'react';
import { Search } from 'lucide-react';
import { Input } from './Input';
import styled from 'styled-components';

interface SearchInputProps {
  value: string;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
`

const SearchInput: React.FC<SearchInputProps> = ({ value, onChangeHandler }) => {
  return (
    <SearchWrapper>
      <Search
        style={{
          position: 'absolute',
          left: '0.5rem',
          top: '0.5rem',
          width: '1rem',
          height: '1rem',
          color: '#6b7280',
        }}
      />
      <Input placeholder="Search" value={value} onChange={onChangeHandler} />
    </SearchWrapper>
  );
};

export default SearchInput;
