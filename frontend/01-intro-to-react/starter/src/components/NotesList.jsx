import "../styles/NotesList.css";

function NotesList({ notes }) {
  return (
    <div className="notes-list">
      <h3>📝 Notes</h3>
      {notes.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        <ul>
          {notes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotesList;