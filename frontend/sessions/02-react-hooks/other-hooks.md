# 4️⃣ Other Essential Hooks - Advanced State & Performance

> ⚡️ **These Hooks give you superpowers** for managing complex state, sharing data globally, and optimizing performance in your React apps.

## 📖 What Will We Cover?

| Hook | Purpose | Difficulty | When to Use |
|------|---------|------------|-------------|
| 🎯 **useRef** | Persistent mutable values & DOM access | 🟢 Easy | Direct DOM manipulation, storing values |
| 🔄 **useReducer** | Complex state management | 🟡 Medium | State with multiple sub-values or complex transitions |
| 🌐 **useContext** | Global state sharing | 🟡 Medium | Avoiding prop drilling |
| ⚡ **useCallback** | Memoizing functions | 🔴 Advanced | Performance optimization |
| 🧠 **useMemo** | Memoizing expensive calculations | 🔴 Advanced | Performance optimization |

## 1️⃣ useRef: Persistent and Mutable Values

`useRef` gives you a **mutable reference** that survives across re-renders without triggering re-renders.

### 🔧 Basic Syntax

```jsx
const ref = useRef(initialValue);
// Access with: ref.current
```

### 🎯 Use Cases

| Use Case | Example | Why useRef? |
|----------|---------|-------------|
| **DOM Access** | Focus an input | Direct DOM manipulation needed |
| **Storing Values** | Previous state, timers | Need to persist without re-rendering |
| **Instance Variables** | Like class instance variables | Mutable reference across renders |

### ⚡️ Example 1: DOM Access & Focus Management

```jsx
import React, { useRef } from 'react';

function FocusInput() {
  const inputRef = useRef(null);
  const [count, setCount] = useState(0);

  const focusInput = () => {
    // Direct DOM access
    inputRef.current.focus();
    inputRef.current.style.backgroundColor = 'yellow';
  };

  return (
    <div>
      <input 
        ref={inputRef} 
        placeholder="Click the button to focus me!" 
      />
      <button onClick={focusInput}>
        Focus Input
      </button>
      <p>Renders: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Re-render (useRef won't cause re-render)
      </button>
    </div>
  );
}
```

### ⚡️ Example 2: Storing Previous Values

```jsx
function PreviousValueTracker() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();

  useEffect(() => {
    // Store current value for next render
    prevCountRef.current = count;
  });

  const prevCount = prevCountRef.current;

  return (
    <div>
      <h2>Current: {count}</h2>
      <h2>Previous: {prevCount}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

![useRef Diagram](https://lh5.googleusercontent.com/8HDHXNu36iOcTygBWFh391Ic-hRHZYyBfN9tR3JiJpwgn-5YqJeb90ZA4RZ2AiYIC0iDC4mLvHDk6P6Kay_IJJkcaA3SGpX2PJG9YNuV9vJ8Qlthy1FamIViwSLtafDWwV20IOGy8GHMg15tHbl6J32z5qQvnpJD8YSQfMcS1mgRz4K69_7pRVCqpQ)

## 2️⃣ useReducer: State Management for Complex Logic

When state becomes complex, `useReducer` is your best friend. It's like `useState` but allows you to define **state transitions**.

### 🔧 Basic Syntax

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

### 🧩 The Reducer Pattern

| Part | Purpose | Example |
|------|---------|---------|
| **State** | Current data | `{ count: 0, loading: false }` |
| **Action** | What happened | `{ type: 'increment', payload: 5 }` |
| **Reducer** | How to update state | Function that takes (state, action) → newState |
| **Dispatch** | Trigger state change | `dispatch({ type: 'increment' })` |

### ⚡️ Example 1: Counter with Multiple Actions

```jsx
// Reducer function - pure function that calculates new state
function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    case 'set':
      return { count: action.payload };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  
  return (
    <div>
      <h2>Count: {state.count}</h2>
      <button onClick={() => dispatch({ type: 'decrement' })}>
        -1
      </button>
      <button onClick={() => dispatch({ type: 'increment' })}>
        +1
      </button>
      <button onClick={() => dispatch({ type: 'set', payload: 100 })}>
        Set to 100
      </button>
      <button onClick={() => dispatch({ type: 'reset' })}>
        Reset
      </button>
    </div>
  );
}
```

### ⚡️ Example 2: Form State Management

```jsx
const initialFormState = {
  name: '',
  email: '',
  message: '',
  loading: false,
  error: null,
  submitted: false
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        error: null // Clear error when user types
      };
    case 'SET_LOADING':
      return { ...state, loading: action.loading };
    case 'SET_ERROR':
      return { ...state, error: action.error, loading: false };
    case 'SUBMIT_SUCCESS':
      return { ...state, submitted: true, loading: false };
    case 'RESET':
      return initialFormState;
    default:
      return state;
  }
}

function ContactForm() {
  const [state, dispatch] = useReducer(formReducer, initialFormState);

  const handleSubmit = async () => {
    dispatch({ type: 'SET_LOADING', loading: true });
    
    try {
      await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(state)
      });
      dispatch({ type: 'SUBMIT_SUCCESS' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error.message });
    }
  };

  if (state.submitted) {
    return (
      <div>
        <h2>Thank you!</h2>
        <button onClick={() => dispatch({ type: 'RESET' })}>
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <input
        placeholder="Name"
        value={state.name}
        onChange={(e) => dispatch({ 
          type: 'SET_FIELD', 
          field: 'name', 
          value: e.target.value 
        })}
      />
      <input
        placeholder="Email"
        value={state.email}
        onChange={(e) => dispatch({ 
          type: 'SET_FIELD', 
          field: 'email', 
          value: e.target.value 
        })}
      />
      <textarea
        placeholder="Message"
        value={state.message}
        onChange={(e) => dispatch({ 
          type: 'SET_FIELD', 
          field: 'message', 
          value: e.target.value 
        })}
      />
      
      {state.error && <p style={{color: 'red'}}>{state.error}</p>}
      
      <button type="submit" disabled={state.loading}>
        {state.loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
```

![useReducer Flow](https://miro.medium.com/v2/resize:fit:1400/1*_lF6YmjuUxxYyTdMqMVTDw.png)

## 3️⃣ useContext: Sharing State Without Props

`useContext` allows you to share state across components without **prop drilling**.

### 🔧 Setting Up Context

```jsx
// 1. Create Context
const ThemeContext = createContext();

// 2. Create Provider Component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Use Context in Components
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### ⚡️ Complete Example: Theme System

```jsx
import React, { createContext, useContext, useState } from 'react';

// Create Context
const ThemeContext = createContext();

// Theme Provider
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div style={{
        backgroundColor: theme === 'light' ? 'white' : '#333',
        color: theme === 'light' ? 'black' : 'white',
        minHeight: '100vh',
        padding: '20px'
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// Custom hook for using theme
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Component that uses theme
function Header() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header>
      <h1>My App ({theme} theme)</h1>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} theme
      </button>
    </header>
  );
}

// Another component that uses theme
function Sidebar() {
  const { theme } = useTheme();
  
  return (
    <aside style={{
      border: `2px solid ${theme === 'light' ? '#ccc' : '#666'}`,
      padding: '10px',
      margin: '10px 0'
    }}>
      <p>Sidebar content</p>
      <p>Current theme: {theme}</p>
    </aside>
  );
}

// Main App
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Sidebar />
    </ThemeProvider>
  );
}
```

![useContext Flow](https://dmitripavlutin.com/90649ae4bdf379c482ad24e0dd220bc4/react-context-3.svg)

## 4️⃣ useCallback: Memoizing Functions

`useCallback` returns a **memoized version** of a callback that only changes if dependencies change.

### 🎯 When to Use

| Scenario | Why useCallback | Example |
|----------|-----------------|---------|
| **Expensive functions** | Avoid recreating on every render | Complex calculations |
| **Child components** | Prevent unnecessary re-renders | Passing callbacks to optimized children |
| **useEffect dependencies** | Stable function reference | Functions in dependency arrays |

### ⚡️ Example: Optimizing Child Re-renders

```jsx
import React, { useState, useCallback, memo } from 'react';

// Child component wrapped with memo for optimization
const ExpensiveButton = memo(({ onClick, children }) => {
  console.log('ExpensiveButton rendered');
  
  return (
    <button onClick={onClick} style={{ padding: '10px', margin: '5px' }}>
      {children}
    </button>
  );
});

function CallbackDemo() {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);

  // ❌ Without useCallback - function recreated every render
  const badHandleClick = () => {
    setCount(prev => prev + 1);
  };

  // ✅ With useCallback - function only changes when dependencies change
  const goodHandleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []); // Empty deps = function never changes

  return (
    <div>
      <h2>Count: {count}</h2>
      <h2>Other: {otherState}</h2>
      
      <ExpensiveButton onClick={badHandleClick}>
        Bad Button (always re-renders)
      </ExpensiveButton>
      
      <ExpensiveButton onClick={goodHandleClick}>
        Good Button (doesn't re-render unnecessarily)
      </ExpensiveButton>
      
      <button onClick={() => setOtherState(prev => prev + 1)}>
        Change Other State
      </button>
    </div>
  );
}
```

### ⚡️ Example: Custom Hook with useCallback

```jsx
function useDebounce(callback, delay) {
  const [debounceTimer, setDebounceTimer] = useState(null);

  const debouncedCallback = useCallback((...args) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      callback(...args);
    }, delay);

    setDebounceTimer(newTimer);
  }, [callback, delay, debounceTimer]);

  return debouncedCallback;
}

// Usage
function SearchInput() {
  const [query, setQuery] = useState('');
  
  const performSearch = useCallback((searchTerm) => {
    console.log(`Searching for: ${searchTerm}`);
    // API call here
  }, []);

  const debouncedSearch = useDebounce(performSearch, 500);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleInputChange}
      placeholder="Search..."
    />
  );
}
```

## 5️⃣ useMemo: Memoizing Expensive Calculations

`useMemo` caches the **result** of expensive calculations and only re-computes when dependencies change.

### 🎯 When to Use

| Scenario | Why useMemo | Example |
|----------|-------------|---------|
| **Heavy calculations** | Avoid recalculating on every render | Sorting large arrays |
| **Expensive object creation** | Prevent unnecessary object recreation | Complex derived data |
| **Referential equality** | Stable references for child components | Objects passed as props |

### ⚡️ Example: Expensive Calculation

```jsx
function ExpensiveCalculationDemo() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);

  // Expensive calculation without useMemo
  const expensiveValue = (() => {
    console.log('🔥 Expensive calculation running...');
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.random();
    }
    return result;
  })();

  // ✅ Expensive calculation with useMemo
  const memoizedExpensiveValue = useMemo(() => {
    console.log('🧠 Memoized calculation running...');
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.random();
    }
    return result;
  }, [count]); // Only recalculate when count changes

  return (
    <div>
      <h2>Count: {count}</h2>
      <p>Expensive result: {memoizedExpensiveValue.toFixed(2)}</p>
      
      <button onClick={() => setCount(count + 1)}>
        Change Count (triggers memoized calc)
      </button>
      
      <button onClick={() => setItems([...items, Date.now()])}>
        Add Item (doesn't trigger memoized calc)
      </button>
      
      <p>Items: {items.length}</p>
    </div>
  );
}
```

### ⚡️ Example: Filtering and Sorting

```jsx
function ProductList({ products, searchTerm, sortBy }) {
  // Expensive filtering and sorting with useMemo
  const filteredAndSortedProducts = useMemo(() => {
    console.log('🔍 Filtering and sorting products...');
    
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        default:
          return 0;
      }
    });
  }, [products, searchTerm, sortBy]); // Only recalculate when these change

  return (
    <div>
      <h3>Products ({filteredAndSortedProducts.length})</h3>
      <ul>
        {filteredAndSortedProducts.map(product => (
          <li key={product.id}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

![useMemo Performance](https://deadsimplechat.com/blog/content/images/2024/09/image-9.png)

## 📊 Hook Comparison Summary

| Hook | Purpose | Returns | When to Use |
|------|---------|---------|-------------|
| **useRef** | Mutable reference | `{ current: value }` | DOM access, persistent values |
| **useReducer** | Complex state management | `[state, dispatch]` | Multiple state values, complex logic |
| **useContext** | Global state sharing | Context value | Avoiding prop drilling |
| **useCallback** | Memoize functions | Memoized function | Performance optimization |
| **useMemo** | Memoize values | Memoized value | Expensive calculations |

## ⚠️ Performance Hooks - When NOT to Use

| Hook | Don't Use When | Why |
|------|----------------|-----|
| **useCallback** | Simple functions, no performance issues | Adds unnecessary complexity |
| **useMemo** | Cheap calculations | Memoization overhead > calculation cost |
| **Both** | Premature optimization | Profile first, optimize second |

```jsx
// ❌ Unnecessary optimization
const simpleHandler = useCallback(() => {
  setCount(count + 1);
}, [count]);

// ✅ Just use regular function
const simpleHandler = () => {
  setCount(count + 1);
};
```

## ✅ Best Practices

| ✅ Do | ❌ Don't |
|-------|----------|
| Use useRef for DOM access and persistent values | Use useRef for regular state |
| Use useReducer for complex state logic | Use useReducer for simple boolean flags |
| Use useContext sparingly (performance implications) | Put everything in global context |
| Profile before using performance hooks | Use useCallback/useMemo everywhere |

## 🎯 Key Takeaways

| 💡 Concept | Explanation |
|------------|-------------|
| **useRef** | Persistent, mutable values that don't trigger re-renders |
| **useReducer** | Predictable state updates for complex state logic |
| **useContext** | Global state sharing without prop drilling |
| **useCallback** | Memoize functions to prevent unnecessary re-renders |
| **useMemo** | Memoize expensive calculations for performance |

## 🎯 What's Next?

Now let's learn to create your own custom hooks:

1. **[Next: Creating Custom Hooks →](./custom-hooks.md)** - Build reusable logic with custom hooks

## 📚 Additional Resources

- 📖 [React Docs: Hooks API Reference](https://reactjs.org/docs/hooks-reference.html)
- 📝 [Blog: When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback)
- 🎥 [Video: Advanced React Hooks](https://www.youtube.com/watch?v=xcZXS_VEJS0)
- 🧪 [Interactive Hooks Playground](https://codesandbox.io/s/advanced-hooks-examples)

---

**[← Back: useEffect & Side Effects](./side-effects.md)** | **[Next: Creating Custom Hooks →](./custom-hooks.md)**