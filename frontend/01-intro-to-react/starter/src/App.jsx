import { useState } from "react";
import Timer from "./components/Timer";
import NotesList from "./components/NotesList";
import Motivation from "./components/Motivation";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  // add a note 
  const addNote = (newNote) => {
  if (newNote.trim() !== "") {
    setNotes(notes => notes.concat(newNote));
  }
  };
  // remove a note
  const deleteNote = (indexToDelete) => {
  setNotes((notes) => {
    const notesAfterDelete = notes.filter((note, index) => {
      return index !== indexToDelete;
    });

    return notesAfterDelete;
  });
  };


  return (
    <div className="app">
      <Timer addNote={addNote} />
      <NotesList notes={notes}  deleteNote={deleteNote} />
      <Motivation />
    </div>
  );
}

export default App;
