
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import './index.css';
import { SpaOrderProvider } from './contexts/SpaOrderContext';
import { Toaster } from './components/ui/toaster';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SpaOrderProvider>
      <App />
      <Toaster />
    </SpaOrderProvider>
  </React.StrictMode>,
);
