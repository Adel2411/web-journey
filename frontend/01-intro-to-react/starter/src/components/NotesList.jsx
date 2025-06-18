import "../styles/NotesList.css";

function NotesList({ notes, deleteNote }) {
  return (
    <div className="notes-list">
      <h3>📝 Notes</h3>
      {notes.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        <ul>
          {notes.map((note, index) => (
            <li key={index}>
              <span className="note-text">{note}</span>
              <button className="note-delete-btn" onClick={() => deleteNote(index)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotesList;
