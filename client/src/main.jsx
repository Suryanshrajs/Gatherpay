import React from "react"
import App from "./App"
import "./index.css"
import ReactDOM from "react-dom/client"
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster
      toastOptions={{
        duration: 3000,
      }}
      position="top-right"
      reverseOrder={false}
    />
  </React.StrictMode>,
)

