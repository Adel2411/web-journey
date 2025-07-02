import React, { useState, useRef, useReducer, useCallback, useMemo, createContext, useContext } from "react";

// Theme Context for useContext demo
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Counter reducer for useReducer demo
function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state;
  }
}

function OtherHooksDemo() {
  // useRef demo
  const inputRef = useRef(null);
  const [renderCount, setRenderCount] = useState(0);
  const renderCountRef = useRef(0);

  // useReducer demo
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  // Performance hooks demo
  const [items, setItems] = useState([1, 2, 3, 4, 5]);
  const [multiplier, setMultiplier] = useState(1);

  // useMemo - expensive calculation
  const expensiveValue = useMemo(() => {
    console.log('🧠 Calculating expensive value...');
    return items.reduce((sum, item) => sum + item * multiplier, 0);
  }, [items, multiplier]);

  // useCallback - memoized function
  const addItem = useCallback(() => {
    setItems(prev => [...prev, prev.length + 1]);
  }, []);

  // Update render count
  renderCountRef.current += 1;

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <ThemeProvider>
      <ThemedContent
        inputRef={inputRef}
        focusInput={focusInput}
        renderCount={renderCount}
        setRenderCount={setRenderCount}
        renderCountRef={renderCountRef}
        state={state}
        dispatch={dispatch}
        items={items}
        multiplier={multiplier}
        setMultiplier={setMultiplier}
        expensiveValue={expensiveValue}
        addItem={addItem}
      />
    </ThemeProvider>
  );
}

function ThemedContent({ 
  inputRef, 
  focusInput, 
  renderCount, 
  setRenderCount, 
  renderCountRef, 
  state, 
  dispatch, 
  items, 
  multiplier, 
  setMultiplier, 
  expensiveValue, 
  addItem 
}) {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <div className="demo-container">
      <p className="demo-description">
        Explore advanced hooks for managing complex state, DOM access, context, and optimizing performance.
      </p>

      {/* useRef Demo */}
      <div className="demo-card">
        <h3><span>🎯</span> useRef - DOM Access & Persistent Values</h3>
        <div className="demo-card-content">
          <div className="flex space-x-2 mb-4">
            <input
              ref={inputRef}
              type="text"
              placeholder="Click the button to focus me!"
              className="demo-input"
            />
            <button
              onClick={focusInput}
              className="demo-button"
            >
              Focus Input
            </button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-2"><strong>React Renders:</strong> {renderCount}</p>
            <p className="mb-2"><strong>Ref Counter:</strong> {renderCountRef.current}</p>
            <p className="text-sm text-gray-600 mb-2">
              Notice: ref value persists without causing re-renders
            </p>
            <button
              onClick={() => setRenderCount(renderCount + 1)}
              className="demo-button"
            >
              Force Re-render
            </button>
          </div>
        </div>
      </div>

      {/* useReducer Demo */}
      <div className="demo-card">
        <h3><span>🔄</span> useReducer - Complex State Management</h3>
        <div className="demo-card-content">
          <div className="text-center mb-4">
            <div className="counter-display">{state.count}</div>
            <div className="button-group">
              <button
                onClick={() => dispatch({ type: 'decrement' })}
                className="demo-button red"
              >
                -1
              </button>
              <button
                onClick={() => dispatch({ type: 'increment' })}
                className="demo-button green"
              >
                +1
              </button>
              <button
                onClick={() => dispatch({ type: 'reset' })}
                className="demo-button purple"
              >
                Reset
              </button>
            </div>
          </div>
          
          <div className="demo-note">
            <p>Uses reducer pattern: action → reducer → new state</p>
          </div>
        </div>
      </div>

      {/* useContext Demo */}
      <div className="demo-card">
        <h3><span>🌐</span> useContext - Global State Sharing</h3>
        <div className={`demo-card-content ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-800 text-white'}`}>
          <div className="text-center space-y-4">
            <p>Current theme: <strong>{theme}</strong></p>
            <div className="button-group">
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className={theme === 'light' ? 'demo-button' : 'demo-button orange'}
              >
                Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
              </button>
            </div>
            <p className="demo-hint">
              <span>💡</span>
              This theme is shared via Context - no prop drilling!
            </p>
          </div>
        </div>
      </div>

      {/* Performance Hooks Demo */}
      <div className="demo-card">
        <h3><span>⚡</span> useMemo & useCallback - Performance</h3>
        <div className="demo-card-content">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">useMemo Example</h4>
              <p className="mb-2">Items: {items.join(', ')}</p>
              <p className="mb-2">Multiplier: {multiplier}</p>
              <p className="font-bold mb-4">
                Result of expensive calculation: {expensiveValue}
              </p>
              <div className="button-group">
                <button
                  onClick={addItem}
                  className="demo-button"
                >
                  Add Item
                </button>
                <button
                  onClick={() => setMultiplier(multiplier + 1)}
                  className="demo-button green"
                >
                  Increase Multiplier
                </button>
              </div>
              <p className="demo-hint mt-3">
                <span>💡</span>
                Check console - calculation only runs when dependencies change
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hook Summary */}
      <div className="demo-card">
        <h3><span>🔑</span> Hook Summary</h3>
        <div className="patterns-grid">
          <div className="pattern-item">
            <h4>useRef</h4>
            <p>Persistent values, DOM access</p>
          </div>
          <div className="pattern-item">
            <h4>useReducer</h4>
            <p>Complex state management</p>
          </div>
          <div className="pattern-item">
            <h4>useContext</h4>
            <p>Global state sharing</p>
          </div>
          <div className="pattern-item">
            <h4>useMemo/useCallback</h4>
            <p>Performance optimization</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtherHooksDemo;
