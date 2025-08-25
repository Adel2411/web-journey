# 🏆 Productivity Pulse Challenge

**Build your own productivity tracker with sessions, notes, and motivation!**

---

## 📖 Challenge Overview

- **Challenge Name:** Productivity Pulse
- **Track:** `Frontend`
- **Level:** `Beginner`
- **Technologies:** React, HTML, CSS, JavaScript
- **Goal:** Create a React app that tracks 25-minute focus sessions, lets users write short post-session notes, and gives them motivation through a like button.

---

## 🧠 Learning Objectives

By completing this challenge, you'll master:

- ✅ React component structure with JSX
- ✅ useState and useEffect hooks
- ✅ Conditional rendering
- ✅ Passing props between components
- ✅ Handling forms and list rendering

---

## 📁 Project Structure

```
productivity-pulse/
├── starter/                        # Your main project workspace
│   ├── src/                        # Source code lives here
│   │   ├── components/             # React components
│   │   │   ├── Timer.jsx           # Countdown logic + session handling
│   │   │   ├── NotesList.jsx       # Display and manage notes
│   │   │   └── Motivation.jsx      # Like button with counter
│   │   ├── styles/                 # Component-specific styles
│   │   │   ├── Timer.css           # Timer component styles
│   │   │   ├── NotesList.css       # NotesList component styles
│   │   │   └── Motivation.css      # Motivation component styles
│   │   ├── App.jsx                 # Main app component
│   │   ├── App.css                 # App-level styles
│   │   └── main.jsx                # Entry point (ReactDOM.render)
│   ├── .gitignore                  # Ignore node_modules, etc.
│   ├── package.json                # Dependencies & scripts
│   ├── README.md                   # Your custom README for the challenge
│   └── vite.config.js              # (if using Vite)
├── solution/                       # Solution files (don't touch unless unlocked)
│   └── ...                         # Reference implementation
└── README.md                       # Main instructions file (you've been reading this)
```

---

## 🚀 Getting Started

### 🛠 Prerequisites

Make sure you have these installed:

- **Node.js** (v18+) – [Download here](https://nodejs.org/)
- **npm** or **yarn**
- A code editor (we recommend [VS Code](https://code.visualstudio.com/))
- Git for version control

### ⚡ Setup Instructions

```bash
# 1. Navigate to the starter folder
cd productivity-pulse/starter

# 2. Install project dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open your browser to http://localhost:3000
```

> 🔄 If you encounter errors, try deleting `node_modules` and `package-lock.json`, then run `npm install` again.

---

## 🎯 Your Mission

Create a productivity web app with the following features:

### 🧭 App Features

#### 1. **25-Minute Countdown Timer**

- Starts automatically when app loads.
- Resets and increments session count after each session ends.

#### 2. **🎉 Congratulatory Message**

- Display a temporary message like “Great job! You’ve completed 1 session!” after each session.

#### 3. **📝 Post-Session Notes**

- Show a form asking "What did you focus on?" after each session.
- Save submitted notes to a list.
- Display all previous notes.

#### 4. **❤️ Motivation Likes**

- Show a like button.
- Each click increases a motivation counter.

---

## 📋 Requirements Checklist

- 25-minute countdown timer that restarts automatically
- Congratulatory message after each session
- Form to submit a note after each session
- Display a list of submitted notes
- Like button with counter
- Bonus: Ability to delete a note from the list

---

## 🔧 Suggested Components

Break your app into at least 3 components:

- `<Timer />` – Handles countdown and congratulatory logic
- `<NotesList />` – Displays session notes
- `<Motivation />` – Like button and counter

---

## 🎨 Design & UI Guidelines

No strict UI rules — keep it clean and functional. Here are suggestions:

- Use large readable fonts for the timer
- Display motivation and notes below the timer
- Animate or highlight the congratulatory message

---

### 🎯 User Experience Goals

- User lands on the page and sees the timer ticking
- A message appears and the note form is shown after a session
- Notes persist in the session (no need for database)
- User gets visual motivation when clicking like

---

## 🧪 Testing Your Solution

```bash
# Run dev server
npm run dev

# Build for production
npm run build
```

### ✅ Manual Testing Checklist

- Timer works and resets correctly
- Message and note form appear at correct time
- Notes show in a list
- Like button increases the count
- Responsive and functional UI

---

## 📋 Challenge Rules

- ✅ Only modify files inside the `starter/` folder
- ✅ You may install and use additional packages
- ✅ Keep code clean and readable
- ❌ Do not copy the solution from `solution/`

---

## 💡 Helpful Resources

- 📚 [React Docs](https://react.dev/)
- 🎨 [CSS-Tricks](https://css-tricks.com/)
- 🛠️ [MDN Web Docs](https://developer.mozilla.org/)

---

## 🚀 Submission Process

1. ✅ Complete and test your app inside the `starter/` folder
2. 📝 Commit your changes:

   ```bash
   git add .
   git commit -m "Complete Productivity Pulse Challenge"
   ```

3. 🔄 Push to your repository:

   ```bash
   git push origin YOURUSERNAME/frontend-challenge-01 #or whatever branch you created
   ```

4. 📤 Open a Pull Request with the title:  
   **[Frontend] Productivity Pulse – Your Name**

---

## 🌟 Ready to Build?

_Remember: Every expert was once a beginner. Start coding, stay curious, and build something amazing!_ 🚀
