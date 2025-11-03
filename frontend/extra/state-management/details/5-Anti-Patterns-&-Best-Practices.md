
# 5. Anti-Patterns & Best Practices

## Objective

- Learn common mistakes in state management
- Discover best practices for reliable, maintainable code

---

## Anti-Pattern 1: Storing Derived State

Storing derived state is like keeping a calculator result instead of recalculating when inputs change. It leads to stale data.

**Example:**

```jsx
// ❌ Anti-Pattern: Storing filteredTodos separately
const [todos, setTodos] = useState([]);
const [filteredTodos, setFilteredTodos] = useState([]);

// ✅ Best Practice: Derive it!
const filteredTodos = todos.filter((todo) => todo.completed);
```

**Key Takeaway:** Calculate derived state on the fly—it’s cheaper than syncing duplicates.

---

## Anti-Pattern 2: Overusing Global State

Global state is like a loudspeaker: everyone hears it, even if they don’t need to. Overusing it causes unnecessary re-renders.

**Example:**

```jsx
// ❌ Anti-Pattern: Global state for a single component’s UI
const [isDropdownOpen, setIsDropdownOpen] = useGlobalStore();

// ✅ Best Practice: Keep it local
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
```

**Key Takeaway:** Only globalize state if more than two components need it.

---

## Anti-Pattern 3: Ignoring Immutability

Mutating state directly is like editing a document without track changes—you lose history and break React’s reactivity.

**Example:**

```jsx
// ❌ Anti-Pattern: Direct mutation
const [cart, setCart] = useState([]);
const addToCart = (item) => {
   cart.push(item); // Mutates existing state!
   setCart(cart);
};

// ✅ Best Practice: Create a new copy
const addToCart = (item) => {
   setCart([...cart, item]);
};
```

**Key Takeaway:** Treat state like a museum artifact—look, don’t touch. Always create copies.

---

## Best Practices

1. **Derive State:** Calculate filtered lists, totals, or formatted data on the fly
2. **Normalize Nested Data:** Flatten API responses into `{ ids: [], entities: {} }` for easy access (e.g., Redux style)
3. **Use Debugging Tools:** React DevTools shows state changes; Zustand/Redux have time-travel debugging

---

## Key Takeaways

- Avoid storing derived state
- Use global state only when necessary
- Always treat state as immutable
- Follow best practices for maintainable code
