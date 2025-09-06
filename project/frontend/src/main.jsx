
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './App.css';  // or whatever your CSS file is named
import { AuthProvider } from "./contexts/AuthContext";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   </React.StrictMode>
// );
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);