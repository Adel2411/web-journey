import React, { useState } from "react";
import "./App.css";

// Import all example components
import LifecycleDemo from "./components/LifecycleDemo";
import UseStateDemo from "./components/UseStateDemo";
import UseEffectDemo from "./components/UseEffectDemo";
import OtherHooksDemo from "./components/OtherHooksDemo";
import CustomHooksDemo from "./components/CustomHooksDemo";

function App() {
  const [activeSection, setActiveSection] = useState("lifecycle");

  const sections = [
    { 
      id: "lifecycle", 
      name: "Lifecycle & Hooks", 
      icon: "🔄",
      color: "blue",
      component: LifecycleDemo 
    },
    { 
      id: "useState", 
      name: "useState", 
      icon: "📊",
      color: "purple",
      component: UseStateDemo 
    },
    { 
      id: "useEffect", 
      name: "useEffect", 
      icon: "⚡",
      color: "green",
      component: UseEffectDemo 
    },
    { 
      id: "otherHooks", 
      name: "Other Hooks", 
      icon: "🛠️",
      color: "orange",
      component: OtherHooksDemo 
    },
    { 
      id: "customHooks", 
      name: "Custom Hooks", 
      icon: "✨",
      color: "pink",
      component: CustomHooksDemo 
    },
  ];

  const ActiveComponent = sections.find(s => s.id === activeSection)?.component;
  const activeInfo = sections.find(s => s.id === activeSection);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>React Hooks Workshop</h1>
        <p className="app-subtitle">Interactive examples to understand React Hooks</p>
      </header>

      <nav className="app-nav">
        <div className="nav-container">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`nav-button ${activeSection === section.id ? 'active' : ''} ${section.color}`}
            >
              <span className="nav-icon">{section.icon}</span>
              <span className="nav-text">{section.name}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="app-content">
        <div className="content-header">
          <span className={`content-icon ${activeInfo?.color}`}>{activeInfo?.icon}</span>
          <h2>{activeInfo?.name}</h2>
        </div>
        <div className="content-body">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </main>

      <footer className="app-footer">
        <p>React Hooks Workshop · Built with ❤️ by <a href="https://github.com/Adel2411" className="text-blue-500 hover:text-blue-600 font-medium" >Adel HB</a> for better React development</p>
      </footer>
    </div>
  );
}

export default App;
