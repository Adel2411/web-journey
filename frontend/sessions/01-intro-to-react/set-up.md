# Setting Up the Environment

Before we start coding with React, we need to **set up the development environment**. This includes installing necessary tools and creating a new React project.

---

### **~~ Step 1: Installing Node.js and npm**

### **~Why do we need Node.js?**

→React requires **Node.js** to run JavaScript outside the browser.

→ It comes with **npm (Node Package Manager)**, which helps install dependencies like React libraries.

[node js](https://www.notion.so/node-js-1e2eae282e108008aab5d18556bfff85?pvs=21)

---

### **~~Step 2: Creating a New React Project**

There are multiple ways to create a React app. 

| Method | Best For | Pros | Cons |
| --- | --- | --- | --- |
| **Vite** (Recommended) | New projects | Faster, lightweight, modern | None |
| **Create React App (CRA)** | Simple projects | Easy setup, beginner-friendly | Slower, heavier |
| **Parcel** | Custom setups | Minimal configuration, flexible | Requires setup |
| **CDN** | Quick demos | No installation needed | No project structure |

---

### **~Using Vite (Best for New Projects, Fastest Setup) 🚀**

1. In terminal run:
    
    ```bash
    
    npm create vite@latest my-react-app --template react
    ```
    

1. Go into your project folder:
    
    ```bash
    cd my-react-app
    ```
    
2. Install dependencies:
    
    ```bash
    npm install
    ```
    
3. Start the development server:
    
    ```bash
    npm run dev
    ```
    
    →This will open the project in your browser (usually at `http://localhost:5173`).
    

---

### **~ Using Create React App (CRA) (Easier, but Slower) 📦**

1. Open your terminal and run:
    
    ```bash
    npx create-react-app my-app
    ```
    
2. Go into your project folder:
    
    ```bash
    cd my-app
    ```
    
3. Start the development server:
    
    ```bash
    npm start
    ```
    
    This will open the project in your browser (usually at `http://localhost:3000`).
    

---

### **~Using Parcel (Minimal Configuration) 🏗️**

1. Create a folder and go inside it:
    
    ```bash
    mkdir my-parcel-app && cd my-parcel-app
    ```
    
2. Initialize npm:
    
    ```bash
    npm init -y
    ```
    
3. Install Parcel and React:
    
    ```bash
    npm install react react-dom parcel
    ```
    
4. Create `index.html`, `index.js`, and `App.js`, then run:
    
    ```bash
    npm run start
    ```
    
    *(Requires some manual setup for `package.json`.)*
    

---

### **~Using React via CDN (For Quick Demos, No Installation) 🌐**

If you just want to **test React without installing anything**, use this method.

1. Create an **HTML file** (`index.html`) and copy this:
    
    ```html
    
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>React with CDN</title>
    </head>
    <body>
        <div id="root"></div>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script>
            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(React.createElement('h1', {}, 'Hello, React!'));
        </script>
    </body>
    </html>
    
    ```
    
2. Open it in your **browser**, and you’ll see `"Hello, React!"`.

**Great for quick tests**, but not ideal for real projects!

---

### **~~Step 3: Understanding the Project Structure**

Once you create a React project, you'll see a folder structure like this:

```
perl
CopyEdit
my-react-app
│── node_modules/      # Installed dependencies (you don't touch this)
│── public/            # Static files (like images, favicon)
│── src/               # Main code (components, styles, logic)
│   ├── App.jsx        # Main component (entry point)
│   ├── index.jsx      # Renders App.jsx into the DOM
│   ├── assets/        # Images, icons, etc.
│   ├── components/    # Reusable UI components
│── .gitignore         # Files ignored by Git
│── package.json       # Project details and dependencies
│── vite.config.js     # Configuration (for Vite projects)
│── README.md          # Project description

```

### **Important Files Explained**

- **`src/App.jsx`** → The main component where we build the UI.
- **`src/index.jsx`** → The entry point that renders the app inside `public/index.html`.
- **`package.json`** → Contains project settings and dependencies.