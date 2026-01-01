import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext'; // <--- Import AuthProvider

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider> {/* <--- WRAP EVERYTHING HERE */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
);