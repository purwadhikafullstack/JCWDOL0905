import React, { useEffect, useState } from 'react';
import Select from 'react-select';

export default function ProductSelector({ inventories, selectedCategory, onProductSelect, value }) {
    const customStyles = {
        control: (provided, state) => ({
          ...provided,
          border: state.isFocused ? '2px solid green' : '1px solid #e2e8f0',
          boxShadow: 'none',
          '&:hover': {
            border: '2px solid green',
          },
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          color: '#4a5568',
        }),
        input: (provided, state) => ({
          ...provided,
        backgroundColor: state.isFocused ? 'lightgreen' : 'inherit',
        }),
        menu: (provided) => ({
          ...provided,
          maxHeight: '180px', 
        }),
        menuList: (provided) => ({
            ...provided,
            maxHeight: '180px', 
          }),
        option: (provided, state) => ({
          ...provided,
          height: '30px', 
          backgroundColor: state.isSelected ? '#0E9F6E' : 'white',
          color: state.isSelected ? 'white' : 'black',
          '&:hover': {
            backgroundColor: state.isSelected ? '#0E9F6E' : '#e2e8f0',
          },
        }),
        placeholder: (provided) => ({
            ...provided,
            fontSize: '13px',
            fontStyle: 'italic', 
            color: '#9CA3AF'
            
          }),
      };

      useEffect(() => {
        onProductSelect(null)
      }, [selectedCategory]);

      function formatIDR(price) {
        if (price !== null) {
          let idr = Math.floor(price).toLocaleString("id-ID");
          return `Rp ${idr}`;
        }
      }

  return (
    <div>
      <label className="block text-md font-medium leading-6 text-gray-900">
        Select Product
      </label>
      <div className="my-2">
        <Select
          styles={customStyles}
          options={inventories.map((inventory) => ({
            value: inventory.id,
            label: `${inventory.Product.product_name} (${formatIDR(inventory.Product.product_price)})`,
            price: inventory.Product.product_price
          }))} menuPlacement="auto"
          id="inventory" placeholder="Select product (required)"
          required value={value}
          onChange={(selectedOption) => onProductSelect(selectedOption)}
        />
      </div>
    </div>
  );
}
