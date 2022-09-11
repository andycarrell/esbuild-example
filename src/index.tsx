import { createRoot } from "react-dom/client";

import { App } from "./App";

const APP_ID = "app";
const container = document.getElementById(APP_ID);

if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error(
    `Couldn't find element with the id: ${APP_ID}, so couldn't render the app!`
  );
}
