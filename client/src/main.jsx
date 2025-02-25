import './index.css'
import React from "react"; 
import ReactDOM from "react-dom/client";
import LogIn from './pages/LogIn.jsx';
import App from './App.jsx';
import { BrowserRouter } from "react-router-dom"; 
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>   
  </React.StrictMode>,
)
