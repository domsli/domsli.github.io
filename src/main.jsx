import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter";
import "@fontsource-variable/newsreader";
import App from "./App.jsx";
import "../assets/css/style.css";
import "../assets/css/projects.css";
import "../assets/css/aboutme.css";

createRoot(document.getElementById("root")).render(<App />);
