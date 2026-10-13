import { useEffect } from "react";
import {
  clickLink,
  doUserTriggeredAutomaticCommandSequence,
  startTerminal,
} from "../assets/js/main.js";

export default function App() {
  useEffect(() => {
    startTerminal();
  }, []);

  return (
    <>
      <nav className="navigation-bar">
        <h1>Denis Li</h1>
        <ul className="menu-right">
          <li>
            <button
              type="button"
              id="aboutme-link"
              className="menu-link"
              aria-controls="aboutme"
              aria-expanded="false"
              onClick={() => clickLink("aboutme-link", "~/aboutme.html")}
            >
              About Me
            </button>
            <button
              type="button"
              className="close-button"
              aria-label="Close About Me"
              onClick={() => clickLink("aboutme-link", "~/aboutme.html")}
            >
              ×
            </button>
          </li>
          <li>
            <button
              type="button"
              id="projects-link"
              className="menu-link"
              aria-controls="projects"
              aria-expanded="false"
              onClick={() => clickLink("projects-link", "~/projects.html")}
            >
              Projects
            </button>
            <button
              type="button"
              className="close-button"
              aria-label="Close Projects"
              onClick={() => clickLink("projects-link", "~/projects.html")}
            >
              ×
            </button>
          </li>
          <li>
            <button
              type="button"
              id="contact-link"
              className="menu-link"
              onClick={() => doUserTriggeredAutomaticCommandSequence("contact")}
            >
              Contact
            </button>
          </li>
        </ul>
      </nav>

      <div id="stop-intro" style={{ display: "none" }}>
        <img src="/assets/res/warning_symbol.png" height="50" alt="" />
        <span>Let me finish typing!</span>
      </div>

      <div className="grid">
        <div id="terminal" />
      </div>
    </>
  );
}
