import React, { useState, useEffect } from "react";

// Custom Hook: useCounter
function useCounter(initialValue = 0, { min, max } = {}) {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    setCount(prev => {
      const newCount = prev + 1;
      return max !== undefined ? Math.min(newCount, max) : newCount;
    });
  };

  const decrement = () => {
    setCount(prev => {
      const newCount = prev - 1;
      return min !== undefined ? Math.max(newCount, min) : newCount;
    });
  };

  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}

// Custom Hook: useToggle
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = () => setValue(prev => !prev);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  
  return [value, { toggle, setTrue, setFalse }];
}

// Custom Hook: useLocalStorage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
}

// Custom Hook: useFetch
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (url) fetchData();
  }, [url]);

  return { data, loading, error };
}

function CustomHooksDemo() {
  // Using custom hooks
  const counter1 = useCounter(0, { min: 0, max: 10 });
  const counter2 = useCounter(5);
  
  const [isVisible, visibilityControls] = useToggle(false);
  const [username, setUsername] = useLocalStorage('demo-username', '');
  const [theme, setTheme] = useLocalStorage('demo-theme', 'light');
  
  const { data: post, loading, error } = useFetch(
    'https://jsonplaceholder.typicode.com/posts/1'
  );

  return (
    <div className="demo-container">
      <p className="demo-description">
        Custom hooks let you extract component logic into reusable functions, making your code cleaner and more maintainable.
      </p>

      {/* useCounter Demo */}
      <div className="demo-card">
        <h3><span>🔢</span> useCounter Hook</h3>
        <div className="demo-card-content">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Counter with Limits (0-10)</h4>
              <div className="text-center">
                <div className="counter-display">{counter1.count}</div>
                <div className="button-group">
                  <button
                    onClick={counter1.decrement}
                    className="demo-button red"
                  >
                    -
                  </button>
                  <button
                    onClick={counter1.increment}
                    className="demo-button green"
                  >
                    +
                  </button>
                  <button
                    onClick={counter1.reset}
                    className="demo-button"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Unlimited Counter</h4>
              <div className="text-center">
                <div className="counter-display">{counter2.count}</div>
                <div className="button-group">
                  <button
                    onClick={counter2.decrement}
                    className="demo-button red"
                  >
                    -
                  </button>
                  <button
                    onClick={counter2.increment}
                    className="demo-button green"
                  >
                    +
                  </button>
                  <button
                    onClick={counter2.reset}
                    className="demo-button"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* useToggle Demo */}
      <div className="demo-card">
        <h3><span>🔄</span> useToggle Hook</h3>
        <div className="demo-card-content">
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="mr-3">Visibility:</span>
              <button
                onClick={visibilityControls.toggle}
                className={`demo-button ${isVisible ? 'green' : ''}`}
              >
                {isVisible ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={visibilityControls.setTrue}
                className="demo-button green ml-2"
              >
                Show
              </button>
              <button
                onClick={visibilityControls.setFalse}
                className="demo-button red ml-2"
              >
                Hide
              </button>
            </div>
            
            {isVisible && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-green-700 font-medium">
                  🎉 This content is now visible!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* useLocalStorage Demo */}
      <div className="demo-card">
        <h3><span>💾</span> useLocalStorage Hook</h3>
        <div className="demo-card-content">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username (persisted):</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="demo-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Theme:</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="demo-input"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="blue">Blue</option>
              </select>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg ">
            <h4 className="font-semibold mb-2">Current Values:</h4>
            <p className="mb-2"><strong>Username:</strong> {username || 'Not set'}</p>
            <p className="mb-2"><strong>Theme:</strong> {theme}</p>
            <p className="demo-hint">
              <span>💡</span>
              These values persist across page refreshes!
            </p>
          </div>
        </div>
      </div>

      {/* useFetch Demo */}
      <div className="demo-card">
        <h3><span>🌐</span> useFetch Hook</h3>
        <div className="demo-card-content">
          {loading && <p className="mb-3">Loading post...</p>}
          {error && <p className="text-red-600 mb-3">Error: {error}</p>}
          {post && (
            <div className="bg-gray-50 p-4 rounded-lg ">
              <h4 className="font-semibold mb-2">{post.title}</h4>
              <p className="mb-3">{post.body}</p>
              <p className="demo-hint">
                <span>💡</span>
                Fetched automatically when component mounted
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Code Examples */}
      <div className="demo-card">
        <h3><span>📝</span> Custom Hook Examples</h3>
        <div className="patterns-grid">
          <div className="pattern-item">
            <h4>useCounter</h4>
            <code className="code-block">
              const {'{count, increment, decrement}'} = useCounter(0, {'{min: 0, max: 10}'});
            </code>
          </div>
          
          <div className="pattern-item">
            <h4>useToggle</h4>
            <code className="code-block">
              const [isOpen, {'{toggle, setTrue}'}] = useToggle(false);
            </code>
          </div>
          
          <div className="pattern-item">
            <h4>useLocalStorage</h4>
            <code className="code-block">
              const [value, setValue] = useLocalStorage('key', 'default');
            </code>
          </div>
          
          <div className="pattern-item">
            <h4>useFetch</h4>
            <code className="code-block">
              const {'{data, loading, error}'} = useFetch('/api/data');
            </code>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="demo-card">
        <h3><span>🌟</span> Custom Hook Benefits</h3>
        <div className="practices-grid">
          <div className="practice-column good">
            <h4>Why Use Custom Hooks?</h4>
            <ul>
              <li>✅ <strong>Reusability:</strong> Share logic between components</li>
              <li>✅ <strong>Cleaner Code:</strong> Extract complex logic from components</li>
              <li>✅ <strong>Testability:</strong> Test hooks independently from UI</li>
              <li>✅ <strong>Abstraction:</strong> Hide implementation details</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomHooksDemo;
