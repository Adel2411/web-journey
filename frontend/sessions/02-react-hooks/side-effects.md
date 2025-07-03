# 3️⃣ useEffect & useLayoutEffect - Managing Side Effects

> 🎯 **Goal**: Master useEffect for handling side effects, understand the difference with useLayoutEffect, and learn why effects run twice in development.

## 📖 What is useEffect?

The `useEffect` Hook allows you to **perform side effects** in functional components. It serves the same purpose as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` combined in class components.

### 🔧 Basic Syntax

```jsx
useEffect(() => {
  // Your side effect code here
  
  return () => {
    // Cleanup code (optional)
  };
}, [dependencies]); // Dependency array (optional)
```

![useEffect Anatomy](https://eu-central-1-shared-euc1-02.graphassets.com/AvHQ3RDvFSousA8iwElOKz/resize=width:2048/KpvzF2eVQEGmQC2XZEJB)

## 🌟 What Are Side Effects?

Side effects are operations that affect something outside the scope of the current function:

| Side Effect Type | Examples | When to Use |
|------------------|----------|-------------|
| 🌐 **Data Fetching** | API calls, loading data | `useEffect` with dependency array |
| 📄 **DOM Manipulation** | Updating document title, focus management | `useEffect` or `useLayoutEffect` |
| 🔄 **Subscriptions** | Event listeners, WebSocket connections | `useEffect` with cleanup |
| ⏰ **Timers** | setInterval, setTimeout | `useEffect` with cleanup |
| 📊 **Logging** | Analytics, error tracking | `useEffect` |

## 🔥 useEffect Examples

### 1️⃣ Basic Effect (No Dependencies)

Runs after every render:

```jsx
import React, { useState, useEffect } from 'react';

function DocumentTitleUpdater() {
  const [count, setCount] = useState(0);

  // 🔄 Runs after every render
  useEffect(() => {
    document.title = `Count: ${count}`;
    console.log("Effect ran!");
  });

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### 2️⃣ Effect with Empty Dependencies

Runs only once (like `componentDidMount`):

```jsx
function WelcomeMessage() {
  const [user, setUser] = useState(null);

  // 🟢 Runs only once after initial render
  useEffect(() => {
    console.log("Component mounted!");
    
    // Simulate API call
    setTimeout(() => {
      setUser({ name: "John Doe", id: 1 });
    }, 1000);
  }, []); // Empty dependency array

  return (
    <div>
      {user ? (
        <h2>Welcome, {user.name}!</h2>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
}
```

### 3️⃣ Effect with Specific Dependencies

Runs when specific values change:

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Runs when userId changes
  useEffect(() => {
    console.log(`Fetching user ${userId}`);
    setLoading(true);
    
    // Simulate API call
    fetch(`/api/users/${userId}`)
      .then(response => response.json())
      .then(userData => {
        setUser(userData);
        setLoading(false);
      });
  }, [userId]); // Runs when userId changes

  if (loading) return <div>Loading user...</div>;
  
  return (
    <div>
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
    </div>
  );
}
```

### 4️⃣ Effect with Cleanup

Clean up subscriptions, timers, or event listeners:

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    console.log("Setting up timer");
    
    // Set up the timer
    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);

    // 🧹 Cleanup function
    return () => {
      console.log("Cleaning up timer");
      clearInterval(interval);
    };
  }, []); // Run once on mount

  return (
    <div>
      <h2>Timer: {seconds}s</h2>
    </div>
  );
}
```

## 📊 useEffect Dependency Patterns

| Pattern | Syntax | When It Runs | Use Case |
|---------|--------|--------------|----------|
| **No dependencies** | `useEffect(() => {})` | After every render | DOM updates, logging |
| **Empty array** | `useEffect(() => {}, [])` | Once after mount | Data fetching, setup |
| **With dependencies** | `useEffect(() => {}, [value])` | When dependencies change | Responding to prop/state changes |

## 🎨 Real-World Example: Data Fetcher Component

```jsx
function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=5`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const newPosts = await response.json();
        
        if (page === 1) {
          setPosts(newPosts);
        } else {
          setPosts(prevPosts => [...prevPosts, ...newPosts]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]); // Re-run when page changes

  const loadMore = () => setPage(prevPage => prevPage + 1);

  if (error) {
    return (
      <div>
        <h2>Error: {error}</h2>
        <button onClick={() => setPage(1)}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body.substring(0, 100)}...</p>
          </li>
        ))}
      </ul>
      
      <button onClick={loadMore} disabled={loading}>
        {loading ? 'Loading...' : 'Load More'}
      </button>
    </div>
  );
}
```

## ⚡️ useLayoutEffect: The Synchronous Alternative

`useLayoutEffect` is similar to `useEffect`, but it runs **synchronously** after all DOM mutations but **before** the browser paints.

### 🤔 When to Use useLayoutEffect?

| Scenario | Hook to Use | Why |
|----------|-------------|-----|
| **DOM measurements** | `useLayoutEffect` | Need size/position before paint |
| **Preventing visual flickering** | `useLayoutEffect` | Synchronous DOM updates |
| **Most other cases** | `useEffect` | Non-blocking, better performance |

### 👇 Example: Measuring Element Size

```jsx
function MeasuredBox() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const boxRef = useRef(null);

  // 🎯 useLayoutEffect for DOM measurements
  useLayoutEffect(() => {
    if (boxRef.current) {
      const { width, height } = boxRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);

  return (
    <div>
      <div 
        ref={boxRef}
        style={{ 
          width: '200px', 
          height: '100px', 
          background: 'lightblue',
          padding: '20px'
        }}
      >
        Content box
      </div>
      <p>Dimensions: {dimensions.width}px × {dimensions.height}px</p>
    </div>
  );
}
```

### 📊 useEffect vs useLayoutEffect

| Aspect | useEffect | useLayoutEffect |
|--------|-----------|-----------------|
| **Timing** | After browser paint | Before browser paint |
| **Blocking** | Non-blocking | Blocks paint |
| **Performance** | Better for most cases | Use sparingly |
| **Use Cases** | Data fetching, subscriptions | DOM measurements, preventing flicker |

![useEffect vs useLayoutEffect](https://pbs.twimg.com/media/Fpf8RFZX0AA7CiB?format=jpg&name=4096x4096)

## 🐞 Why Does useEffect Run Twice in Development?

In **React 18** with **Strict Mode**, effects intentionally run twice in development:

### 🎯 The Purpose

| Reason | Explanation |
|--------|-------------|
| 🔍 **Bug Detection** | Exposes side effects that aren't properly cleaned up |
| 🧪 **Future Proofing** | Prepares your code for React's concurrent features |
| 🛡️ **Reliability** | Ensures your effects work correctly when called multiple times |

### 👇 Example: Effect Running Twice

```jsx
function StrictModeDemo() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('🟢 Effect ran');
    
    const timer = setInterval(() => {
      console.log('Timer tick');
    }, 1000);

    return () => {
      console.log('🧹 Cleanup ran');
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// In development with Strict Mode, you'll see:
// 🟢 Effect ran
// 🧹 Cleanup ran
// 🟢 Effect ran
```

### ✅ How to Handle It

```jsx
// ✅ Good - Effect with proper cleanup
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(response => response.json())
    .then(data => setData(data))
    .catch(error => {
      if (!controller.signal.aborted) {
        setError(error);
      }
    });

  return () => {
    controller.abort(); // Cleanup prevents issues
  };
}, []);
```

## 🔧 Common useEffect Patterns

### 1️⃣ Window Event Listeners

```jsx
function WindowSizeTracker() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <h2>Window Size</h2>
      <p>{windowSize.width} × {windowSize.height}</p>
    </div>
  );
}
```

### 2️⃣ Debounced API Calls

```jsx
function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${query}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      
      {loading && <p>Searching...</p>}
      
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 3️⃣ Local Storage Sync

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [key, value]);

  return [value, setValue];
}

// Usage
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </div>
  );
}
```

## ✅ useEffect Best Practices

| ✅ Do | ❌ Don't |
|-------|----------|
| Always include dependencies in the array | Omit dependencies that are used inside the effect |
| Use cleanup functions for subscriptions/timers | Forget to clean up to prevent memory leaks |
| Use multiple useEffect hooks for different concerns | Put unrelated logic in the same effect |
| Handle loading and error states | Ignore potential errors in async operations |

```jsx
// ✅ Good - Separate concerns
useEffect(() => {
  // Handle user data fetching
  fetchUser(userId).then(setUser);
}, [userId]);

useEffect(() => {
  // Handle document title
  document.title = `User: ${user?.name || 'Loading...'}`;
}, [user]);

// ❌ Avoid - Mixed concerns
useEffect(() => {
  fetchUser(userId).then(user => {
    setUser(user);
    document.title = `User: ${user.name}`;
    trackAnalytics('user_viewed', user.id);
  });
}, [userId]);
```

## 🎯 Key Takeaways

| 💡 Concept | Explanation |
|------------|-------------|
| **Side Effects** | Operations that affect things outside the component |
| **Dependency Array** | Controls when effects run |
| **Cleanup** | Prevents memory leaks and unexpected behavior |
| **useLayoutEffect** | Synchronous version for DOM measurements |
| **Strict Mode** | Effects run twice in development for bug detection |

## 🎯 What's Next?

Now let's explore more advanced hooks:

1. **[Next: Other Essential Hooks →](./other-hooks.md)** - Learn useRef, useReducer, useContext, and more

## 📚 Additional Resources

- 📖 [React Docs: Using the Effect Hook](https://reactjs.org/docs/hooks-effect.html)
- 📖 [React Docs: useLayoutEffect](https://reactjs.org/docs/hooks-reference.html#uselayouteffect)
- 📝 [Blog: Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/)
- 🎥 [Video: useEffect Explained](https://www.youtube.com/watch?v=0ZJgIjIuY7U)

---

**[← Back: useState Basics](./use-state-basics.md)** | **[Next: Other Essential Hooks →](./other-hooks.md)**

