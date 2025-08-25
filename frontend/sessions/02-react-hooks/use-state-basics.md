# 2️⃣ useState Basics & The Closure Gotcha

> 🎯 **Goal**: Master the useState Hook and avoid common pitfalls with state updates and closures.

## 📖 What is useState?

The `useState` Hook allows you to add **state** to functional components. Before Hooks, only class components could have state!

### 🔧 Basic Syntax

```jsx
const [state, setState] = useState(initialValue);
```

| Part | Description | Example |
|------|-------------|---------|
| `state` | Current state value | `count` |
| `setState` | Function to update state | `setCount` |
| `initialValue` | Starting value | `0`, `""`, `[]`, `{}` |

![useState Anatomy](https://miro.medium.com/v2/resize:fit:624/0*dEqTT6bW8ysNKbim.png)

## 🌟 Basic useState Example

Let's build a simple counter to understand the fundamentals:

```jsx
import React, { useState } from 'react';

function Counter() {
  // 👇 Declare state variable with initial value of 0
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

export default Counter;
```

### 📊 How It Works

| Step | What Happens |
|------|--------------|
| 1️⃣ | Component renders with initial state (`count = 0`) |
| 2️⃣ | User clicks "Increment" button |
| 3️⃣ | `setCount(count + 1)` is called |
| 4️⃣ | React re-renders component with new state (`count = 1`) |
| 5️⃣ | UI updates to show new count |

## 🔥 useState with Different Data Types

useState can handle any data type:

### 📝 String State

```jsx
function NameInput() {
  const [name, setName] = useState("");

  return (
    <div>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Hello, {name}!</p>
    </div>
  );
}
```

### ✅ Boolean State

```jsx
function ToggleSwitch() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOn(!isOn)}>
        {isOn ? "Turn OFF" : "Turn ON"}
      </button>
      <p>The switch is {isOn ? "ON" : "OFF"}</p>
    </div>
  );
}
```

### 📋 Array State

```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, inputValue]); // Spread operator to add new item
      setInputValue("");
    }
  };

  return (
    <div>
      <input 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a todo"
      />
      <button onClick={addTodo}>Add</button>
      
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 🏗️ Object State

```jsx
function UserProfile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    age: 0
  });

  const updateUser = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,      // Keep existing properties
      [field]: value    // Update specific field
    }));
  };

  return (
    <div>
      <input 
        placeholder="Name"
        onChange={(e) => updateUser('name', e.target.value)}
      />
      <input 
        placeholder="Email"
        onChange={(e) => updateUser('email', e.target.value)}
      />
      <input 
        type="number"
        placeholder="Age"
        onChange={(e) => updateUser('age', parseInt(e.target.value))}
      />
      
      <div>
        <h3>User Info:</h3>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Age: {user.age}</p>
      </div>
    </div>
  );
}
```

## ⚠️ The setState Closure Gotcha

This is where many beginners get confused! Let's start with a surprise quiz:

### 🤔 **Pop Quiz Time!**

Look at this code and predict what will happen when the button is clicked:

```jsx
function MysterCounter() {
  const [count, setCount] = useState(0);

  const incrementTwice = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={incrementTwice}>Click me!</button>
    </div>
  );
}
```

**Question**: If `count` starts at 0, what will be the final value after clicking the button?

- A) 4
- B) 3
- C) 2
- D) 1

<details>
<summary>🎉 Click to reveal the answer!</summary>

**Answer: D) 1** 

Surprised? Most beginners expect it to be 4, but it's actually 1! Let's understand why...

</details>

### 🐛 The Problem: Stale Closures

```jsx
function ProblematicCounter() {
  const [count, setCount] = useState(0);

  const incrementTwice = () => {
    // ❌ This doesn't work as expected!
    setCount(count + 1); // count is 0, so this sets it to 1
    setCount(count + 1); // count is still 0, so this also sets it to 1
    setCount(count + 1); // count is still 0, so this also sets it to 1
    setCount(count + 1); // count is still 0, so this also sets it to 1
    // Final result: count becomes 1, not 4!
  };

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={incrementTwice}>
        Increment Four Times (Broken)
      </button>
    </div>
  );
}
```

### 🤔 Why This Happens

| Concept | Explanation |
|---------|-------------|
| **Closure** | The function "captures" the current value of `count` |
| **Stale State** | All `setCount` calls use the old `count` value |
| **Batching** | React batches state updates in event handlers |

### ✅ The Solution: Functional Updates

Use a function that receives the previous state:

```jsx
function FixedCounter() {
  const [count, setCount] = useState(0);

  const incrementFourTimes = () => {
    // ✅ This works correctly!
    setCount(prevCount => prevCount + 1); // Gets latest count
    setCount(prevCount => prevCount + 1); // Gets latest count
    setCount(prevCount => prevCount + 1); // Gets latest count
    setCount(prevCount => prevCount + 1); // Gets latest count
    // Final result: count becomes 4!
  };

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={incrementFourTimes}>
        Increment Four Times (Fixed)
      </button>
    </div>
  );
}
```

### 📊 Comparison Table

| Method | Code | Result | Why |
|--------|------|--------|-----|
| **❌ Stale Closure** | `setCount(count + 1)` | Unreliable | Uses captured value |
| **✅ Functional Update** | `setCount(prev => prev + 1)` | Always correct | Uses latest state |

## 🔬 Advanced useState Patterns

### 🎯 Lazy Initial State

For expensive computations, use a function for initial state:

```jsx
function ExpensiveComponent() {
  // ❌ This runs on every render
  const [data, setData] = useState(expensiveCalculation());
  
  // ✅ This runs only once
  const [data, setData] = useState(() => expensiveCalculation());
  
  return <div>{data}</div>;
}

function expensiveCalculation() {
  console.log("Expensive calculation running...");
  return Array.from({ length: 1000 }, (_, i) => i * 2);
}
```

### 🔄 State Reset Pattern

```jsx
function ResettableCounter({ resetTrigger }) {
  const [count, setCount] = useState(0);
  
  // Reset count when resetTrigger changes
  useEffect(() => {
    setCount(0);
  }, [resetTrigger]);
  
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

## ✅ useState Best Practices

| ✅ Do | ❌ Don't |
|-------|----------|
| Use functional updates when state depends on previous value | Use direct state updates for dependent calculations |
| Keep state as simple as possible | Store derived data in state |
| Use separate state variables for unrelated data | Put everything in one object unnecessarily |
| Initialize state with the correct data type | Change state type during component lifecycle |

```jsx
// ✅ Good - Separate concerns
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [isLoading, setIsLoading] = useState(false);

// ❌ Avoid - Everything in one object when not related
const [state, setState] = useState({
  name: '',
  email: '', 
  isLoading: false,
  randomCounter: 0
});
```

## 🎯 Key Takeaways

| 💡 Concept | Explanation |
|------------|-------------|
| **State Declaration** | `const [state, setState] = useState(initialValue)` |
| **State Updates** | Always use `setState`, never mutate state directly |
| **Functional Updates** | Use `setState(prev => newValue)` when depending on previous state |
| **Re-renders** | State changes trigger component re-renders |
| **Closure Gotcha** | Avoid stale closures with functional updates |

## 🎯 What's Next?

Now that you've mastered useState, let's learn about side effects:

1. **[Next: useEffect & Side Effects →](./side-effects.md)** - Handle lifecycle events and side effects

## 📚 Additional Resources

- 📖 [React Docs: Using the State Hook](https://reactjs.org/docs/hooks-state.html)
- 📝 [Blog: A Complete Guide to useState](https://overreacted.io/a-complete-guide-to-usestate/)
- 🎥 [Video: useState Explained](https://www.youtube.com/watch?v=O6P86uwfdR0)
- 🧪 [Interactive useState Playground](https://codesandbox.io/s/usestate-examples)

---

**[← Back: Component Lifecycle](./component-life-cycle.md)** | **[Next: useEffect & Side Effects →](./side-effects.md)**

