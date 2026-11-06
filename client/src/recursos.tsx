import { createRoot } from "react-dom/client";
import Directory from "./pages/Directory";
import "./index.css";
import "./sections.css";
import "./perf.css";
import "./directory.css";

createRoot(document.getElementById("root")!).render(<Directory />);
