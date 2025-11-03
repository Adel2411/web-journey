
# 3. State Management Solutions

## Objective

- Learn different strategies for managing state in React
- See practical code examples and key takeaways

---

## Strategy 1: Lift State Up

Lifting state up means moving shared state to the **closest common ancestor** of components that need it. It’s the simplest way to share state without libraries.

**Before Lifting:**

```jsx
// ChildA and ChildB both need `count`
function Parent() {
  return (
    <>
      <ChildA />
      <ChildB />
    </>
  );
}
```

**After Lifting:**

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <ChildA count={count} setCount={setCount} />
      <ChildB count={count} />
    </>
  );
}
```

**Key Takeaway:** Lift state only as high as needed—don’t pollute the root component unnecessarily.

---

## Strategy 2: Context API

Context API is React’s built-in way to share global state without prop drilling. Use it for rarely updated data like user auth.

**Create a User Context:**

```jsx
const UserContext = createContext();
function App() {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Navbar />
      <Profile />
    </UserContext.Provider>
  );
}
```

**Consume Context:**

```jsx
function Navbar() {
  const { user } = useContext(UserContext);
  return <div>Welcome, {user?.name}</div>;
}
```

**Limitation:** Context re-renders **all consumers** on update. Avoid it for high-frequency changes (e.g., a live chat feed).

---

## Strategy 3: State Machines

State machines enforce **finite states** (e.g., ‘idle’, ‘loading’, ‘error’) to make state transitions predictable.

**Example:**

```jsx
const [state, setState] = useState('idle');

const fetchData = async () => {
  setState('loading');
  try {
    await fetch(...);
    setState('success');
  } catch {
    setState('error');
  }
};
```

State machines prevent impossible UI states, like showing a ‘Submit’ button while loading.

---

## Strategy 4: Separation of Concerns

Separate state logic from UI components using custom hooks or stores. This makes code testable, reusable, and easier to debug.

**Custom Hook Example:**

```jsx
function useCart() {
  const [cart, setCart] = useState([]);
  const addToCart = (item) => setCart([...cart, item]);
  return { cart, addToCart };
}

function ProductPage() {
  const { cart, addToCart } = useCart();
  // ...
}
```

**Store Pattern:** Stores (like Zustand/Redux) centralize state and logic outside components.

---

## Key Takeaways

- Lift state up for simple sharing
- Use Context for global, rarely updated state
- State machines make transitions predictable
- Separate logic for maintainable code
