# JSX & Components

React uses a powerful syntax called **JSX (JavaScript XML)** to write UI components. This section covers:

 What JSX is and how it differs from JavaScript

 The difference between **Functional and Class Components**

 How components communicate using **Props**

---

## **What is JSX? (JavaScript XML)**

JSX is a syntax extension for JavaScript that allows you to write **HTML-like code** inside JavaScript. React **transforms JSX into regular JavaScript** before rendering it in the browser.

### **Example: JSX vs. JavaScript**

### **~ JSX (React way)**

```jsx

const element = <h1>Hello, React!</h1>;
```

### **JavaScript (Without JSX)**

```jsx
const element = React.createElement('h1', {}, 'Hello, React!');
```

→ **JSX is easier to read** and feels like HTML.

 **It must return a single parent element** (Wrap multiple elements in `<div>` or `<>` fragments).

### **~JSX Rules**

- JSX **must return a single root element**
    
    ```jsx
    return (
      <div>
        <h1>Hello</h1>
        <p>Welcome to React</p>
      </div>
    );
    ```
    
    *( Correct: Wrapped inside `<div>`)*
    
- **Use `{}` to insert JavaScript inside JSX**
    
    ```jsx
    
    const name = "Asma";
    return <h1>Hello, {name}!</h1>;
    ```
    
- **Class attribute becomes `className` (React reserves `class`)**
    
    ```jsx
    
    <h1 className="title">Hello</h1>
    ```
    

---

## **~~Functional vs. Class Components**

React has **two types of components**:

 **Functional Components** (Modern, easier) 

**Class Components** (Older, more complex) (X)

### **~ Functional Components (Recommended)**

Functional components are **simple JavaScript functions** that return JSX.

```jsx

function Greeting() {
  return <h1>Hello, React!</h1>;
}
export default Greeting;
```

 **Why use Functional Components?**

 **Easier to write and read**

 **Better performance** (Uses React Hooks instead of complex state logic)

 **Less code, fewer bugs**

---

### **~Class Components (Older, Not Recommended)**

Class components use ES6 **classes** and `render()` method.

```jsx

import React, { Component } from "react";

class Greeting extends Component {
  render() {
    return <h1>Hello, React!</h1>;
  }
}

export default Greeting;
```

**~ Why avoid Class Components?**

 More complex syntax

 Requires `this` keyword

**React Hooks (useState, useEffect)** replaced class-based logic

---

## **~~ Props (Component Communication)**

Props (**Properties**) allow components to **communicate** by passing data **from parent to child**.

### **Example: Passing Props**

### **Parent Component**

```jsx
function App() {
  return <Greeting name="Asma" />;
}
```

### **Child Component (Receives Props)**

```jsx
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;//ppp
}
```

 Props make components **reusable** and **dynamic**.

 **Props are read-only** (Cannot modify inside the child component).

---