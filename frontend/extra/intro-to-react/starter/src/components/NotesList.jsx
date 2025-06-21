import { useState } from "react";
import "../styles/NotesList.css";
import addSound from "../assets/add-sound.mp3"

function NotesList({ showForm }) {
  const [noteInput, setNoteInput] = useState("");
  const [notes, setNotes] = useState([]);
  const handleAddNote = () => {
    if (noteInput.trim() !== "") {
      const audioS = new Audio(addSound);
      audioS.play();
      setNotes([...notes, noteInput.trim()]);
      setNoteInput("");
    }
  };
  const handleDeleteNote = (indexToDelete) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this note ?");
    if(!confirmDelete) return;
    setNotes(notes.filter((_,index) => index !== indexToDelete));
    setNotes(updatedNotes);
  };

  return (
    <div className="notes-section">
      {showForm && (
        <>
          <h3>What did you focus on?</h3>
          <div className="note-form">
            <input
            type="text"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="Ex: Learning CSS"
            />
            <button onClick={handleAddNote}>Add</button>
          </div>
        </>
      )}
      
      {notes.length > 0 && (
        <div className="notes-list">
          <h4>Your Notes:</h4>
          <ul>
            {notes.map((note, index) => (
              <li key={index}>- {note}{" "}
                <button className="delete-button" onClick={() => handleDeleteNote(index)}>🗑️</button>
              </li>)
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default NotesList;
