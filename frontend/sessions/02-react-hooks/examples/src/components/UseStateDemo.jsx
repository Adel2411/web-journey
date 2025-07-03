import React, { useState } from "react";

function UseStateDemo() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const incrementTwiceWrong = () => {
    setCount(count + 1); // ❌ Uses stale closure
    setCount(count + 1); // ❌ Uses stale closure
  };

  const incrementTwiceRight = () => {
    setCount(prev => prev + 1); // ✅ Uses functional update
    setCount(prev => prev + 1); // ✅ Uses functional update
  };

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, { id: Date.now(), text: inputValue }]);
      setInputValue("");
    }
  };

  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="demo-container">
      <p className="demo-description">
        Learn useState patterns and avoid common pitfalls like the closure issue.
      </p>
      
      {/* Basic Counter */}
      <div className="demo-card">
        <h3><span>🔢</span> Basic Counter</h3>
        <div className="demo-card-content">
          <div className="counter-display">{count}</div>
          <div className="button-group">
            <button 
              className="demo-button"
              onClick={() => setCount(count + 1)}
            >
              +1
            </button>
            <button 
              className="demo-button red"
              onClick={() => setCount(count - 1)}
            >
              -1
            </button>
          </div>
        </div>
      </div>

      {/* Closure Gotcha Demo */}
      <div className="demo-card">
        <h3><span>🐛</span> The Closure Gotcha</h3>
        <div className="demo-card-content">
          <p className="demo-note">Current count: {count}</p>
          <div className="button-group">
            <button 
              className="demo-button red"
              onClick={incrementTwiceWrong}
            >
              ❌ +2 (Broken)
            </button>
            <button 
              className="demo-button green"
              onClick={incrementTwiceRight}
            >
              ✅ +2 (Fixed)
            </button>
          </div>
          <p className="demo-hint">
            <span>💡</span> Try both buttons - see the difference!
          </p>
        </div>
      </div>

      {/* String State */}
      <div className="demo-card">
        <h3><span>📝</span> String State</h3>
        <div className="demo-card-content">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="demo-input"
          />
          {name && (
            <div className="name-display">
              Hello, <strong>{name}</strong>! 👋
            </div>
          )}
        </div>
      </div>

      {/* Array State - Todo List */}
      <div className="demo-card">
        <h3><span>📋</span> Array State - Todo List</h3>
        <div className="demo-card-content">
          <div className="todo-input-group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add a todo"
              className="demo-input"
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            />
            <button 
              className="demo-button"
              onClick={addTodo}
            >
              Add
            </button>
          </div>
          
          <div className="todos-container">
            {todos.length === 0 ? (
              <p className="no-todos">No todos yet. Add one above!</p>
            ) : (
              <ul className="todo-list">
                {todos.map((todo) => (
                  <li key={todo.id} className="todo-item">
                    <span>{todo.text}</span>
                    <button
                      onClick={() => removeTodo(todo.id)}
                      className="todo-remove"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="demo-card">
        <h3><span>🔑</span> useState Best Practices</h3>
        <div className="practices-grid">
          <div className="practice-column good">
            <h4>✅ Do This</h4>
            <ul>
              <li>Use functional updates when state depends on previous value</li>
              <li>Keep state simple and focused</li>
            </ul>
          </div>
          
          <div className="practice-column bad">
            <h4>❌ Avoid This</h4>
            <ul>
              <li>Don't mutate state directly</li>
              <li>Avoid depending on current state in updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UseStateDemo;
