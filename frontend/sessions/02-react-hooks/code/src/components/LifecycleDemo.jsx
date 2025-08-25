import React, { useState, useEffect } from "react";

function LifecycleDemo() {
  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `${timestamp}: ${message}`]);
  };

  useEffect(() => {
    addLog("🟢 Component mounted (like componentDidMount)");
    document.title = `Hook Demo - Count: ${count}`;

    return () => {
      addLog("🔴 Component will unmount (cleanup)");
      document.title = "React App";
    };
  }, [count]);

  useEffect(() => {
    addLog(`🔄 Count updated to ${count} (like componentDidUpdate)`);
    document.title = `Hook Demo - Count: ${count}`;
  }, [count]);

  return (
    <div className="demo-container">
      <p className="demo-description">
        See how useEffect replaces class component lifecycle methods with a simpler
        API.
      </p>

      {/* Interactive Counter */}
      <div className="demo-card">
        <h3>
          <span>🎯</span> Interactive Counter
        </h3>
        <div className="demo-card-content">
          <div className="counter-display">{count}</div>
          <div className="button-group">
            <button
              className="demo-button"
              onClick={() => setCount(count + 1)}
            >
              Increment
            </button>
            <button
              className="demo-button red"
              onClick={() => setCount(count - 1)}
            >
              Decrement
            </button>
            <button
              className="demo-button purple"
              onClick={() => setCount(0)}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Lifecycle Logs */}
      <div className="demo-card">
        <h3>
          <span>📋</span> Lifecycle Events Log
        </h3>
        <div className="demo-card-content">
          <div className="log-header">
            <button
              className="demo-button"
              onClick={() => setLogs([])}
            >
              Clear Logs
            </button>
          </div>
          <div className="logs-container">
            {logs.length === 0 ? (
              <p className="no-logs">
                No events yet... Try interacting with the counter!
              </p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="log-entry">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Key Concepts */}
      <div className="demo-card">
        <h3>
          <span>🔑</span> Key Concepts
        </h3>
        <div className="concept-grid">
          <div className="concept-item">
            <div className="concept-icon">🟢</div>
            <div className="concept-title">componentDidMount</div>
            <code className="concept-code">{'useEffect(() => {}, [])'}</code>
          </div>

          <div className="concept-item">
            <div className="concept-icon">🔄</div>
            <div className="concept-title">componentDidUpdate</div>
            <code className="concept-code">{'useEffect(() => {})'}</code>
          </div>

          <div className="concept-item">
            <div className="concept-icon">🔴</div>
            <div className="concept-title">componentWillUnmount</div>
            <code className="concept-code">{'return () => {}'}</code>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LifecycleDemo;
