import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {AuthProvider} from './contexts/AuthContext.js'
import 'react-toastify/dist/ReactToastify.css';
import Header from "./components/Header.js"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Header/>
    <App />
    </AuthProvider>
  </React.StrictMode>
);

