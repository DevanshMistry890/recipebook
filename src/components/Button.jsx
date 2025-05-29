import React from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';

function Button({ text, onClick, type = 'button', variant = 'primary' }) {
  return (
    <BootstrapButton variant={variant} type={type} onClick={onClick} className="w-100 mt-3">
      {text}
    </BootstrapButton>
  );
}

export default Button;