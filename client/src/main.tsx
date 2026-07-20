import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Dev-only handle for driving state from the console / automated tests
if (import.meta.env.DEV) {
  import('./lib/store').then(({ useStore }) => {
    (window as any).__store = useStore;
  });
}

createRoot(document.getElementById("root")!).render(<App />);
