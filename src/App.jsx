import { useState } from "react";
import aboutMeHtml from "./content/aboutme.html?raw";
import projectsHtml from "./content/projects.html?raw";

const tabs = [
  { id: "aboutme", label: "About Me", html: aboutMeHtml },
  { id: "projects", label: "Projects", html: projectsHtml },
  { id: "contact", label: "Contact" },
];

export default function App() {
  const [tab, setTab] = useState("aboutme");
  const page = tabs.find((item) => item.id === tab);

  return (
    <>
      <nav className="navigation-bar">
        <h1>Denis Li</h1>
        <ul className="menu-right" role="tablist">
          {tabs.map((item) => (
            <li key={item.id} role="presentation">
              <button
                type="button"
                id={`${item.id}-tab`}
                className={tab === item.id ? "menu-link selected-link" : "menu-link"}
                role="tab"
                aria-selected={tab === item.id}
                aria-controls={item.id}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {page.html ? (
        <div
          id={page.id}
          className="page"
          role="tabpanel"
          aria-labelledby={`${page.id}-tab`}
          dangerouslySetInnerHTML={{ __html: page.html }}
        />
      ) : (
        <section id="contact" className="page" role="tabpanel" aria-labelledby="contact-tab">
          <h1>Contact</h1>
          <p>You can reach me via:</p>
          <ul>
            <li><a href="mailto:denisli268@gmail.com">email</a></li>
            <li><a href="https://github.com/domsli" target="_blank" rel="noreferrer">github</a></li>
            <li><a href="https://www.linkedin.com/in/denis-li-16723721" target="_blank" rel="noreferrer">LinkedIn</a></li>
          </ul>
        </section>
      )}
    </>
  );
}
