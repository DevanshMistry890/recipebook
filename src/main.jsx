import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import './assets/css/bootstrap.css';
import { EdgeLLMProvider } from './context/EdgeLLMContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <EdgeLLMProvider>
        <App />
      </EdgeLLMProvider>
    </Router>
  </React.StrictMode>,
);