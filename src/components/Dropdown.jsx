import React from 'react';
import { Form } from 'react-bootstrap';

function Dropdown({ label, options, onSelect }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Select onChange={(e) => onSelect(e.target.value)}>
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
}

export default Dropdown;