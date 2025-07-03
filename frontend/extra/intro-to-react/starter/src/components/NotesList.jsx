import "../styles/NotesList.css";
import { useState } from "react";


function NotesList({ showNotesForm, setShowNotesForm }) {

  const [notesArr, setNotesArr] = useState([])
  const [noteText, setNoteText] = useState("")

  const clearNote = () => {
    setNoteText("")
  }

  const submitNote = () => {
    if (noteText.trim()){

      setNoteText("")
      setNotesArr([...notesArr, noteText])
      setShowNotesForm(false);
    }
  }

  return (
    <>
      { showNotesForm &&
        <div className="note-form">
          <h1>What did you focus on this session ?</h1>

          <div className="note-text-input">
            <input type="text" placeholder="Write your note here..." value={noteText}   onChange={(e) => setNoteText(e.target.value)} />
          </div>

          <div className="note-from-btn">
            <button className="clear-btn" onClick={clearNote}>Clear</button>
            <button className="submit-btn" onClick={submitNote}>Submit</button>
          </div>
        </div>
      }

      <div className="notes-list">
        <h1>Notes List</h1>
        <ul>
          {notesArr.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      </div>
    </>
  
  )
}

export default NotesList;
