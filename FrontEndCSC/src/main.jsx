import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Login from "./components/Login/Login.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <>
      {/*className="flex flex-col items-center text-center p-6 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200 min-h-screen transition-colors" */}

      {/*<Navbar />*/}
      {<App />}
      {/*<App />*/}
    </>
  </StrictMode>
);
