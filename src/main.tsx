import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { installCspReporter } from "./lib/cspReporter";

installCspReporter();

createRoot(document.getElementById("root")!).render(<App />);
