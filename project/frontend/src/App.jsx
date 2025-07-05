
// import React from "react";
// import NoteList from "./components/notes/NoteList";
// import Header from "./components/layout/Header";

// const App = () => {
//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Header />
//       <NoteList />
//     </div>
//   );
// };

// export default App;
// src/App.jsx
import React from 'react';
import Header from './components/layout/Header';
import NoteList from './components/notes/NoteList';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8">
        <NoteList />
      </main>
    </div>
  );
}

export default App;