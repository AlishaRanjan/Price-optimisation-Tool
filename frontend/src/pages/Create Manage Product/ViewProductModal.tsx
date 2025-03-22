import React from 'react';
import { X } from 'lucide-react';
import styled from 'styled-components';
import { AddNewProductModalProps } from '../../ducks/types';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  z-index: 10;
  background: #1b1b1b;
  color: #e7e7e7;
  padding: 20px;
  width: 400px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
`;

const Header = styled.div`
  display: flex;
  color: #10b981;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

const Title = styled.div`
  font-size: 18px;
  margin: 0;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
`;

const Input = styled.input`
  width: calc(100% - 16px);
  padding: 8px;
  background: #444;
  border: none;
  color: #d6d6d6;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  width: calc(100% - 16px);
  padding: 8px;
  background: #444;
  border: none;
  color: #fff;
  border-radius: 4px;
  height: 60px;
  resize: none;
`;

const CostInputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

/**
 * ViewProductModal Component
 * 
 * Description:
 * The ViewProductModal component displays a modal that allows users to view the details of a product. 
 * It presents various product information such as product name, category, cost price, selling price, 
 * description, available stock, and units sold. The modal can be closed by clicking the close icon (X) 
 * in the header, which triggers the onCloseHandler callback passed as a prop.
 */

const ViewProductModal: React.FC<AddNewProductModalProps> = ({ onCloseHandler, product }) => {
  return (
    <ModalOverlay>
      <ModalContainer>
        <Header>
          <Title> View Product</Title>
          <X style={{ cursor: "pointer" }} onClick={onCloseHandler} />
        </Header>
        <InputGroup>
          <Label>Product Name:</Label>
          <Input name="name" value={product?.name || ''} />
        </InputGroup>
        <InputGroup>
          <Label>Product Category:</Label>
          <Input name="category_name" value={product?.category_name || ''} />
        </InputGroup>
        <CostInputWrapper>
          <InputGroup>
            <Label>Cost Price:</Label>
            <Input name="cost_price" value={product?.cost_price || ''} />
          </InputGroup>
          <InputGroup>
            <Label>Selling Price:</Label>
            <Input name="selling_price" value={product?.selling_price || ''} />
          </InputGroup>
        </CostInputWrapper>
        <InputGroup>
          <Label>Description:</Label>
          <TextArea name="description" value={product?.description || ''} />
        </InputGroup>
        <CostInputWrapper>
          <InputGroup>
            <Label>Available Stock:</Label>
            <Input name="stock_available" value={product?.stock_available || ''} />
          </InputGroup>
          <InputGroup>
            <Label>Units Sold:</Label>
            <Input name="units_sold" value={product?.units_sold || ''} />
          </InputGroup>
        </CostInputWrapper>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ViewProductModal;
