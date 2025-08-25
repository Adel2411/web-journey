## Vue.js 101 Workshop

---

## 1. Project Setup with Vite

**Why Vite?** Vite gives you a fast, ready-to-go Vue project.

```bash
npm create vite@latest my-vue-app -- --template vue
cd my-vue-app
npm install
npm run dev
```

1. `npm create vite@latest my-vue-app` – starts a new project.
2. `--template vue` – tells Vite to use Vue.
3. `npm install` – downloads needed packages.
4. `npm run dev` – starts a live server at `http://localhost:5173`.

<details>
<summary>Schema: Folder structure</summary>

```
my-vue-app/
├─ index.html       ← Main HTML file
├─ package.json     ← Project info & scripts
├─ src/
│  ├─ main.js       ← App entry point
│  ├─ App.vue       ← Root component
│  └─ components/   ← Your custom components
└─ vite.config.js   ← Vite settings
```

</details>

---

## 2. Understanding the Boilerplate

When you open `src/App.vue`, you see:

```vue
<template>
  <h1>{{ message }}</h1>
</template>

<script setup>
import { ref } from "vue";

const message = ref("Hello, Vue!");
</script>

<style>
/* Your styles here */
</style>
```

- **`<template>`** – where your HTML lives.
- **`<script setup>`** – where your JavaScript logic goes (Vue 3 style).
- **`<style>`** – where you write CSS.

---

## 3. Reactivity & `ref`

Vue tracks reactive data so the page updates automatically.

- **`ref()`** wraps a value to make it reactive.
- Use it for simple types (strings, numbers, booleans).

```js
import { ref } from "vue";
const count = ref(0);
```

Whenever you do `count.value++`, Vue re-renders any part that uses `count`.

---

## 4. Interpolation

Interpolation means showing JavaScript data inside HTML.

```vue
<template>
  <p>You clicked {{ count }} times.</p>
</template>
```

- The double curly braces `{{ … }}` read the value of a reactive variable.

---

## 5. Binding Attributes with `v-bind`

When you want to connect HTML attributes to Vue data, use `v-bind` or its shorthand `:`.

```vue
<template>
  <img :src="imageUrl" alt="My picture" />
</template>
```

This makes the `src` attribute dynamic.

---

## 6. Lists with `v-for`

To render a list, use `v-for`:

```vue
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </ul>
</template>

<script setup>
import { ref } from "vue";

const items = ref([
  { id: 1, text: "Learn Vue" },
  { id: 2, text: "Build something cool" },
]);
</script>
```

- Always add `:key` with a unique ID to help Vue track each element.

---

## 7. Components & Props

Components let you split your UI into small, reusable pieces.

```vue
<!-- ParentComponent.vue -->
<template>
  <Greeting :name="userName" />
</template>

<script setup>
import Greeting from "./Greeting.vue";
const userName = "Alice";
</script>
```

```vue
<!-- Greeting.vue -->
<template>
  <h2>Hello, {{ name }}!</h2>
</template>

<script setup>
import { defineProps } from "vue";
const props = defineProps({
  name: String,
});
</script>
```

- **`defineProps`** declares which props a component accepts.
- Props are read-only inside the child component.

---

## 8. Lifecycle Hooks: `onMounted`

Hooks let you run code at certain times in a component’s life.

```js
import { onMounted } from "vue";

onMounted(() => {
  console.log("Component is now in the page!");
});
```

- `onMounted` runs once when the component is first added to the DOM.

---

## 9. Custom Events

Parent and child components can talk using events.

```vue
<!-- Child.vue -->
<template>
  <button @click="$emit('say-hi', 'Hello from child')">Click me</button>
</template>
```

```vue
<!-- Parent.vue -->
<template>
  <Child @say-hi="handleHi" />
</template>

<script setup>
import Child from "./Child.vue";

function handleHi(message) {
  alert(message);
}
</script>
```

- Child uses `$emit` to send an event.
- Parent listens with `@eventName`.

---

## 10. Next Steps

You now know the basics:

- Creating a project with Vite
- Vue file boilerplate
- Reactivity & `ref`
- Interpolation
- `v-bind`, `v-for`
- Props & components
- Lifecycle hooks (`onMounted`)
- Custom events

Now its time to make a web app and try what we learned
