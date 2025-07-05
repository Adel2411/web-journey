import React from "react";
import Header from "./components/layout/Header";
import NoteList from "./components/notes/NoteList";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main>
        <NoteList />
      </main>
    </div>
  );
}

export default App;

