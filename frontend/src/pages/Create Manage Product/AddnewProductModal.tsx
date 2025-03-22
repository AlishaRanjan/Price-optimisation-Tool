import React, { useState } from 'react';
import { X } from 'lucide-react';
import styled from 'styled-components';
import { Button } from '../../common/Button';
import { postProductData, updateProduct } from '../../ducks/api';
import { AddNewProductModalProps, Product } from '../../ducks/types';

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

const Title = styled.h2`
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
  background: #333;
  border: none;
  color: #d6d6d6;
  border-radius: 4px;
  margin-right: 10px;

  &:focus {
    outline: 2px solid #10b981;
    outline-offset: 2px;
  }

  &:last-child {
    margin-right: 0;
  }
`;

const TextArea = styled.textarea`
  width: calc(100% - 16px);
  padding: 8px;
  background: #333;
  border: 1px solid #444;
  color: #fff;
  border-radius: 4px;
  height: 60px;
  resize: none;
  &:focus {
    outline: 2px solid #10b981;
    outline-offset: 2px;
  }
`;

const CostInputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  padding-top: 15px;
  border-top: 1px solid #333;
  gap: 0.5rem;
`;

/**
 * AddNewProductModal Component
 * 
 * Description:
 * `AddNewProductModal` is a modal component used to either add a new product or edit an existing product.
 * It includes form fields to input product details such as name, category, cost price, selling price, description, available stock, and units sold.
 * It validates the form and sends the data to the backend using `postProductData` or `updateProduct` depending on whether the product is being added or updated.
 */

const AddNewProductModal: React.FC<AddNewProductModalProps> = ({ onCloseHandler, product_id, product, isEditMode = false }) => {

  const [formData, setFormData] = useState<Product>(
    product || {
      name: '',
      category_name: '',
      cost_price: '',
      selling_price: '',
      description: '',
      stock_available: '',
      units_sold: '',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const { name, category_name, cost_price, selling_price, description, stock_available, units_sold } = formData;

    if (!name || !category_name || !cost_price || !selling_price || !description || !stock_available || !units_sold) {
      alert('Please fill all fields.');
      return;
    }

    try {
      await postProductData(formData);
      onCloseHandler();
    } catch (error) {
      alert('Unable to add new product');
    }
  };

  const handleUpdate = async () => {
    const { name, category_name, cost_price, selling_price, description, stock_available, units_sold } = formData;

    if (!name || !category_name || !cost_price || !selling_price || !description || !stock_available || !units_sold) {
      alert('Please fill all fields.');
      return;
    }

    let updatedFields: Partial<Product> = {};

    if (product?.name !== formData.name) updatedFields.name = formData.name;
    if (product?.category_name !== formData.category_name) updatedFields.category_name = formData.category_name;
    if (product?.cost_price !== formData.cost_price) updatedFields.cost_price = formData.cost_price;
    if (product?.selling_price !== formData.selling_price) updatedFields.selling_price = formData.selling_price;
    if (product?.description !== formData.description) updatedFields.description = formData.description;
    if (product?.stock_available !== formData.stock_available) updatedFields.stock_available = formData.stock_available;
    if (product?.units_sold !== formData.units_sold) updatedFields.units_sold = formData.units_sold;

    if (Object.keys(updatedFields).length === 0) {
      alert('No changes were made.');
      return;
    }

    try {
      await updateProduct(product_id, updatedFields);
      onCloseHandler();
    } catch (error) {
      alert('Unable to update the product');
    }
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <Header>
          <Title>{isEditMode ? 'Edit Product' : 'Add New Product'}</Title>
          <X style={{ cursor: "pointer" }} onClick={onCloseHandler} />
        </Header>
        <InputGroup>
          <Label>Product Name:</Label>
          <Input name="name" value={formData.name} onChange={handleChange} placeholder="Enter Product Name" />
        </InputGroup>
        <InputGroup>
          <Label>Product Category:</Label>
          <Input name="category_name" value={formData.category_name} onChange={handleChange} placeholder="Enter Product Category" />
        </InputGroup>
        <CostInputWrapper>
          <InputGroup>
            <Label>Cost Price:</Label>
            <Input name="cost_price" value={formData.cost_price} onChange={handleChange} placeholder="XX.XX.XX" />
          </InputGroup>
          <InputGroup>
            <Label>Selling Price:</Label>
            <Input name="selling_price" value={formData.selling_price} onChange={handleChange} placeholder="XX.XX.XX" />
          </InputGroup>
        </CostInputWrapper>
        <InputGroup>
          <Label>Description:</Label>
          <TextArea name="description" value={formData.description} onChange={handleChange} placeholder="Enter Description"></TextArea>
        </InputGroup>
        <CostInputWrapper>
          <InputGroup>
            <Label>Available Stock:</Label>
            <Input name="stock_available" value={formData.stock_available} onChange={handleChange} placeholder="XX.XX.XX" />
          </InputGroup>
          <InputGroup>
            <Label>Units Sold:</Label>
            <Input name="units_sold" value={formData.units_sold} onChange={handleChange} placeholder="XX.XX.XX" />
          </InputGroup>
        </CostInputWrapper>
        <ButtonContainer>
          <Button variant={'outline'} onClick={onCloseHandler}>Cancel</Button>
          <Button onClick={isEditMode ? handleUpdate : handleSubmit}>{isEditMode ? 'Save' : 'Add'}</Button>
        </ButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default React.memo(AddNewProductModal);
