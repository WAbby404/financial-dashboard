import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/Main.css';
// import App from './App';
import Dashboard from './components/Dashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);