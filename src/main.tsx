import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { installCspReporter } from "./lib/cspReporter";
import { initErrorMonitoring } from "./lib/errorMonitoring";
import { registerPwa } from "./lib/pwa";

installCspReporter();
void initErrorMonitoring();
registerPwa();

createRoot(document.getElementById("root")!).render(<App />);
