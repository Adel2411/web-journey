# Questions & Answers

### **🔹 Q&A Session (Answering Beginner Questions)**

Before moving forward, let’s clarify any doubts! Here are some common beginner questions:

❓ **What is the difference between state and props?**

✅ **State**: Stores component-specific data that can change (e.g., user input).

✅ **Props**: Used to pass data **from a parent to a child component** (readonly).

❓ **Why do we use hooks instead of class components?**

✅ Hooks (like `useState`, `useEffect`) **make code simpler and reusable**.

✅ No need to use `this` or lifecycle methods (e.g., `componentDidMount`).

❓ **What happens if we don’t provide a dependency array in `useEffect`?**

✅ The effect will **run after every render**, which can cause performance issues.

❓ **Can we fetch data without `useEffect`?**

✅ You can, but **it will refetch on every render**, leading to infinite loops.

This section is structured from **very beginner questions** to more **advanced** ones.

---

## **🔹 Level 1: Very Beginner Questions (Total Newbies)**

### ❓ **What is React?**

✅ React is a **JavaScript library** for building **interactive** user interfaces.

✅ It helps create **single-page applications (SPA)** that update **without refreshing**.

---

### ❓ **Do I need to learn JavaScript before React?**

✅ **Yes!** You should know:

- **Variables** (`let`, `const`)
- **Functions** (`function myFunc() {}` & arrow functions `()=>{}`)
- **ES6+ features** (`map`, `filter`, destructuring)

---

### ❓ **What is the difference between HTML & JSX?**

✅ JSX looks like HTML but has **JavaScript power**.

✅ In JSX:

- Use `{}` for JavaScript inside HTML
- Use `className` instead of `class`

```jsx
jsx
CopyEdit
const name = "Asma";
const element = <h1>Hello, {name}!</h1>;  // This works in JSX!

```

---

### ❓ **Why do we use `return()` inside React components?**

✅ Every React component must return **a UI (HTML structure)**.

✅ Example:

```jsx
jsx
CopyEdit
function MyComponent() {
  return <h1>Hello World</h1>;  // Must return something!
}

```

---

## **🔹 Level 2: Beginner Questions (First Projects in React)**

### ❓ **What is the difference between a functional and class component?**

✅ Functional components:

- **Simple & modern**
- Use **hooks** like `useState`

```jsx
jsx
CopyEdit
function Welcome() {
  return <h1>Hello!</h1>;
}

```

✅ Class components:

- **Older method**, use `this.state`

```jsx
jsx
CopyEdit
class Welcome extends React.Component {
  render() {
    return <h1>Hello!</h1>;
  }
}

```

**💡 Use functional components in 2025!**

---

### ❓ **What is `useState` and why do we need it?**

✅ `useState` allows **React components to remember values** (like a variable).

✅ Example: A **counter app** that remembers clicks.

```jsx
jsx
CopyEdit
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

```

**🛠 Without `useState`, React components wouldn't remember values!**

---

### ❓ **Why do we use props?**

✅ Props **pass data from a parent component to a child component**.

```jsx
jsx
CopyEdit
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

function App() {
  return <Greeting name="Asma" />;  // Pass "Asma" as a prop
}

```

✅ Output: **Hello, Asma!**

---

## **🔹 Level 3: Intermediate (More Experience in React)**

### ❓ **Why do we use `useEffect`?**

✅ `useEffect` lets us **run code after rendering** (e.g., fetching data).

```jsx
jsx
CopyEdit
import { useState, useEffect } from "react";

function DataFetcher() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return <div>{data.length} users loaded.</div>;
}

```

✅ Runs **once** because of the `[]` dependency array.

---

### ❓ **Why do we use React Router?**

✅ React Router lets us create **multi-page** apps without refreshing the page.

```jsx
jsx
CopyEdit
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

```

✅ **Now, clicking "About" doesn’t reload the page!**

---

### ❓ **What is Context API and why use it?**

✅ Context API lets us **avoid props drilling** (passing props through multiple levels).

```jsx
jsx
CopyEdit
import { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Child />
    </ThemeContext.Provider>
  );
}

function Child() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <div style={{ background: theme === "light" ? "#fff" : "#333" }}>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle Theme
      </button>
    </div>
  );
}

```

✅ **Now, we can access `theme` anywhere in the app without passing props manually!**

---

## **🔹 Level 4: Advanced Questions (For Experienced React Devs)**

### ❓ **What is the difference between Context API and Redux?**

✅ **Context API**: Simple, built into React, best for small projects.

✅ **Redux**: More powerful, useful for **complex state management** (e.g., e-commerce).

---

### ❓ **How to optimize React performance?**

✅ Use **React.memo()** to prevent unnecessary renders.

✅ Use **useCallback()** to memoize functions.

✅ Lazy-load components using `React.lazy()` and `Suspense`.

Example of **React.memo()**:

```jsx
jsx
CopyEdit
const MemoizedComponent = React.memo(({ name }) => {
  console.log("Rendered!");
  return <h1>Hello, {name}!</h1>;
});

```

✅ **Now, it re-renders only when `name` changes!**

---

### ❓ **What is server-side rendering (SSR) vs. client-side rendering (CSR)?**

✅ **CSR**: React loads everything **in the browser** (default behavior).

✅ **SSR**: The server generates HTML **before** sending it to the user (**Next.js** is great for this).

---

### ❓ **How does hydration work in Next.js?**

✅ **Hydration** is when the browser receives **pre-rendered HTML** from the server, then React **attaches interactivity**.

```tsx
tsx
CopyEdit
export default function Home() {
  return <h1>Hello, Next.js!</h1>;
}

```

✅ **Next.js loads fast because of SSR + Hydration!**