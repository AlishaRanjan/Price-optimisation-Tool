import React from 'react';
import styled from 'styled-components';

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 35px;
  height: 18px;
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: gray;
  transition: 0.4s;
  border-radius: 34px;
  &::before {
    content: "";
    position: absolute;
    height: 15px;
    width: 15px;
    border-radius: 50%;
    left: 3px;
    bottom: 2px;
    background-color: white;
    transition: 0.4s;
  }
`;

const Input = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + ${Slider} {
    background-color: #01E0B5;
  }

  &:checked + ${Slider}::before {
    transform: translateX(14px);
  }
`;


const ToggleSwitchComponent = React.forwardRef<HTMLInputElement>((_, ref) => (
  <ToggleSwitch>
    <Input type="checkbox" ref={ref} />
    <Slider />
  </ToggleSwitch>
));
export default ToggleSwitchComponent;
