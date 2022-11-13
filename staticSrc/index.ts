import "./reset.css";
import "./index.css";

// Write Javascript code!
const appDiv = document.getElementById("app");
if (appDiv) {
  appDiv.classList.add("layout");
  appDiv.innerHTML = `<h1 class="text-4xl font-serif">JS - static!</h1>`;
}
