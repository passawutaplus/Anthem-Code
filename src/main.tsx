import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { installCspReporter } from "./lib/cspReporter";
import { initErrorMonitoring } from "./lib/errorMonitoring";

installCspReporter();
void initErrorMonitoring();

createRoot(document.getElementById("root")!).render(<App />);
