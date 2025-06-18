import { useState } from "react";
import Timer from "./components/Timer";
import NotesList from "./components/NotesList";
import Motivation from "./components/Motivation";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
   
  const addNote = (newNote) => {
  if (newNote.trim() !== "") {
    setNotes(notes => notes.concat(newNote));
  }
};


  return (
    <div className="app">
      <Timer addNote={addNote} />
      <NotesList notes={notes} />
      <Motivation />
    </div>
  );
}

export default App;
