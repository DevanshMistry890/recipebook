import React from 'react';
import { Form } from 'react-bootstrap';

function InputField({ label, placeholder, type = 'text', value, onChange }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </Form.Group>
  );
}

export default InputField;